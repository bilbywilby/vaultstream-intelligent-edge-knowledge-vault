/**
 * VaultStream Cloudflare Edge Worker - PKF Engine implementation
 */
interface PKFCommit {
  hash: string;
  parent_hash: string;
  message: string;
  timestamp: string;
  is_active: number;
}
interface PKFBlob {
  id: number;
  content: string;
  commit_hash: string;
}
class PKFCore {
  private commits: PKFCommit[] = [];
  private blobs: PKFBlob[] = [];
  private vectors: Map<number, Float32Array> = new Map();
  private dim = 384;
  private blobCounter = 0;
  constructor() {
    this._initialize_infrastructure();
  }
  private _initialize_infrastructure() {
    this.commits = [];
    this.blobs = [];
    this.vectors.clear();
    this.blobCounter = 0;
  }
  private async _generate_commit_hash(content: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(content + Date.now().toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  }
  private mockEmbed(text: string): Float32Array {
    const vec = new Float32Array(this.dim);
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    let sumSq = 0;
    for (let i = 0; i < this.dim; i++) {
      const val = Math.sin(hash + i * 0.1);
      vec[i] = val;
      sumSq += val * val;
    }
    const norm = Math.sqrt(sumSq);
    for (let i = 0; i < this.dim; i++) {
      vec[i] /= norm;
    }
    return vec;
  }
  public get_status() {
    const latest = this._get_latest_hash();
    return {
      index_exists: this.vectors.size > 0,
      index_count: this.vectors.size,
      db_count: this.blobs.length,
      max_blob_id: this.blobCounter,
      needs_reindex: this.vectors.size !== this.blobs.length,
      last_commit: latest,
      commit_count: this.commits.length
    };
  }
  private _get_latest_hash(): string {
    const active = this.commits.filter(c => c.is_active === 1);
    return active.length > 0 ? active[active.length - 1].hash : "0000000000000000";
  }
  public async save_snapshot(message: string, documents: string[]) {
    const parent_hash = this._get_latest_hash();
    const commit_hash = await this._generate_commit_hash(message + documents.join(''));
    const newCommit: PKFCommit = {
      hash: commit_hash,
      parent_hash,
      message,
      timestamp: new Date().toISOString(),
      is_active: 1
    };
    this.commits.push(newCommit);
    for (const doc of documents) {
      if (doc.length * 2 > 500000) continue; // Limit 500KB
      const id = ++this.blobCounter;
      this.blobs.push({ id, content: doc, commit_hash });
      this.vectors.set(id, this.mockEmbed(doc));
    }
    return { commit_hash, count: documents.length };
  }
  public search(query: string, top_k = 5) {
    const qVec = this.mockEmbed(query);
    const scores: { id: number; score: number }[] = [];
    for (const [id, vVec] of this.vectors) {
      let dot = 0;
      for (let i = 0; i < this.dim; i++) {
        dot += qVec[i] * vVec[i];
      }
      scores.push({ id, score: dot });
    }
    scores.sort((a, b) => b.score - a.score);
    const top = scores.slice(0, top_k);
    return top.map(s => {
      const blob = this.blobs.find(b => b.id === s.id);
      const commit = this.commits.find(c => c.hash === blob?.commit_hash);
      return {
        id: s.id.toString(),
        text: blob?.content || "",
        score: s.score,
        metadata: { 
          commit_hash: blob?.commit_hash, 
          message: commit?.message,
          source: 'PKF Internal'
        },
        timestamp: commit?.timestamp || new Date().toISOString()
      };
    });
  }
  public delete_commit(hash: string) {
    const idx = this.commits.findIndex(c => c.hash === hash);
    if (idx !== -1) {
      this.commits[idx].is_active = 0;
      // Filter out blobs/vectors
      this.blobs = this.blobs.filter(b => b.commit_hash !== hash);
      // Actual deletion of vectors belonging to these blobs
      const idsToDelete = this.blobs.filter(b => b.commit_hash === hash).map(b => b.id);
      idsToDelete.forEach(id => this.vectors.delete(id));
      return true;
    }
    return false;
  }
  public compact_vault() {
    const activeHashes = new Set(this.commits.filter(c => c.is_active === 1).map(c => c.hash));
    this.blobs = this.blobs.filter(b => activeHashes.has(b.commit_hash));
    const activeIds = new Set(this.blobs.map(b => b.id));
    for (const id of this.vectors.keys()) {
      if (!activeIds.has(id)) this.vectors.delete(id);
    }
    return { success: true };
  }
  public get_commits() {
    return this.commits;
  }
}
const pkf = new PKFCore();
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const jsonHeaders = { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: jsonHeaders });
    if (url.pathname.startsWith('/api/')) {
      const endpoint = url.pathname.replace('/api/', '');
      try {
        if (endpoint === 'stats') {
          const status = pkf.get_status();
          return new Response(JSON.stringify({
            documentCount: status.db_count,
            indexSize: status.index_count * 384 * 4,
            lastCommit: status.last_commit,
            health: status.index_count > 0 ? 'healthy' : 'offline'
          }), { headers: jsonHeaders });
        }
        if (endpoint === 'search') {
          const query = url.searchParams.get('q') || '';
          const topK = parseInt(url.searchParams.get('top_k') || '5');
          const results = pkf.search(query, topK);
          return new Response(JSON.stringify(results), { headers: jsonHeaders });
        }
        if (endpoint === 'ingest' && request.method === 'POST') {
          const body = await request.json() as { message: string, documents: string[] };
          const result = await pkf.save_snapshot(body.message || "User Ingest", body.documents || []);
          return new Response(JSON.stringify(result), { headers: jsonHeaders });
        }
        if (endpoint === 'admin/status') {
          return new Response(JSON.stringify(pkf.get_status()), { headers: jsonHeaders });
        }
        if (endpoint === 'admin/commits') {
          return new Response(JSON.stringify(pkf.get_commits()), { headers: jsonHeaders });
        }
        if (endpoint === 'admin/compact' && request.method === 'POST') {
          return new Response(JSON.stringify(pkf.compact_vault()), { headers: jsonHeaders });
        }
        if (endpoint.startsWith('admin/commit/') && request.method === 'DELETE') {
          const hash = endpoint.split('/').pop() || '';
          const success = pkf.delete_commit(hash);
          return new Response(JSON.stringify({ success }), { headers: jsonHeaders });
        }
        return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: jsonHeaders });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: jsonHeaders });
      }
    }
    return new Response('VaultStream PKF Engine Active', { status: 200 });
  }
}