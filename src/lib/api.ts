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
const getHeaders = () => {
  const token = localStorage.getItem('vault_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};
export const api = {
  isAuthenticated(): boolean {
    return !!localStorage.getItem('vault_token');
  },
  async login(credentials: any): Promise<any> {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Authentication failed');
    const data = await res.json();
    localStorage.setItem('vault_token', data.token);
    localStorage.setItem('vault_user', JSON.stringify(data.user));
    return data;
  },
  logout() {
    localStorage.removeItem('vault_token');
    localStorage.removeItem('vault_user');
    window.location.href = '/login';
  },
  async getStats(): Promise<VaultStats> {
    const res = await fetch('/api/stats', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },
  async search(query: string, top_k = 5): Promise<SearchResult[]> {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&top_k=${top_k}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },
  async ingest(data: { message: string; documents: string[] }): Promise<{ commit_hash: string; count: number }> {
    const res = await fetch('/api/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Ingestion failed');
    return res.json();
  },
  async getAdminStatus(): Promise<any> {
    const res = await fetch('/api/admin/status', { headers: getHeaders() });
    if (!res.ok) throw new Error('Status fetch failed');
    return res.json();
  },
  async getCommits(): Promise<PKFCommit[]> {
    const res = await fetch('/api/admin/commits', { headers: getHeaders() });
    if (!res.ok) throw new Error('Commits fetch failed');
    return res.json();
  },
  async deleteCommit(hash: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/commit/${hash}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error('Delete failed');
    return res.json();
  },
  async compact(): Promise<{ success: boolean; pruned: number }> {
    const res = await fetch('/api/admin/compact', { method: 'POST', headers: getHeaders() });
    if (!res.ok) throw new Error('Compaction failed');
    return res.json();
  },
  async exportVault() {
    const res = await fetch('/api/admin/export', { headers: getHeaders() });
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-snapshot-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};