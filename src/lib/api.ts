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
export const api = {
  async getStats(): Promise<VaultStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },
  async search(query: string): Promise<SearchResult[]> {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },
  async ingest(data: { text?: string; files?: File[] }): Promise<{ success: boolean }> {
    // In Phase 1 we simulate multipart or JSON
    const res = await fetch('/api/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Ingestion failed');
    return res.json();
  }
};