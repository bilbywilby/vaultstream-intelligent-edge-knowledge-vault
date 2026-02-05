export interface VaultStats {
  documentCount: number;
  indexSize: number;
  lastCommit: string;
  health: 'healthy' | 'degraded' | 'offline';
}
export interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata: Record<string, any>;
  timestamp: string;
}
export interface PKFCommit {
  hash: string;
  parent_hash: string;
  message: string;
  timestamp: string;
  is_active: number;
}
export const api = {
  async getStats(): Promise<VaultStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },
  async search(query: string, top_k = 5): Promise<SearchResult[]> {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&top_k=${top_k}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },
  async ingest(data: { message: string; documents: string[] }): Promise<{ commit_hash: string; count: number }> {
    const res = await fetch('/api/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Ingestion failed');
    return res.json();
  },
  async getAdminStatus(): Promise<any> {
    const res = await fetch('/api/admin/status');
    if (!res.ok) throw new Error('Status fetch failed');
    return res.json();
  },
  async getCommits(): Promise<PKFCommit[]> {
    const res = await fetch('/api/admin/commits');
    if (!res.ok) throw new Error('Commits fetch failed');
    return res.json();
  },
  async deleteCommit(hash: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/commit/${hash}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    return res.json();
  },
  async compact(): Promise<{ success: boolean }> {
    const res = await fetch('/api/admin/compact', { method: 'POST' });
    if (!res.ok) throw new Error('Compaction failed');
    return res.json();
  },
  async maintenance(action: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/${action}`, { method: 'POST' });
    if (!res.ok) throw new Error('Maintenance action failed');
    return res.json();
  }
};