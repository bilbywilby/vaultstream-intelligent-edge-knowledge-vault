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
/**
 * API client for interacting with the VaultStream edge worker.
 * Phase 1 uses local /api/ routes handled by the Worker's mock adapter.
 */
export const api = {
  /**
   * Fetch current vault metrics
   */
  async getStats(): Promise<VaultStats> {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (error) {
      console.error('API Error [getStats]:', error);
      throw error;
    }
  },
  /**
   * Perform a semantic search query
   */
  async search(query: string): Promise<SearchResult[]> {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    } catch (error) {
      console.error('API Error [search]:', error);
      throw error;
    }
  },
  /**
   * Ingest text or files into the vault
   */
  async ingest(data: { text?: string; files?: File[] }): Promise<{ success: boolean }> {
    try {
      // In Phase 1, we simulate ingestion metadata sending
      const res = await fetch('/api/ingest', {
        method: 'POST',
        body: JSON.stringify({
          text: data.text,
          fileCount: data.files?.length || 0,
          fileNames: data.files?.map(f => f.name) || []
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Ingestion failed');
      return await res.json();
    } catch (error) {
      console.error('API Error [ingest]:', error);
      throw error;
    }
  },
  /**
   * Triggers vault maintenance actions
   */
  async maintenance(action: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/admin/${action}`, { method: 'POST' });
      if (!res.ok) throw new Error('Maintenance action failed');
      return await res.json();
    } catch (error) {
      console.error('API Error [maintenance]:', error);
      throw error;
    }
  }
};