export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    // API Route Handling
    if (url.pathname.startsWith('/api/')) {
      const endpoint = url.pathname.replace('/api/', '');
      // Mock Responses
      if (endpoint === 'stats') {
        return new Response(JSON.stringify({
          documentCount: 12450,
          indexSize: 42 * 1024 * 1024,
          lastCommit: new Date().toISOString(),
          health: 'healthy'
        }), { headers: { 'Content-Type': 'application/json' } });
      }
      if (endpoint === 'search') {
        const query = url.searchParams.get('q') || '';
        return new Response(JSON.stringify([
          {
            id: crypto.randomUUID(),
            text: `Relevant insight related to "${query}": The Q4 revenue figures exceeded expectations primarily due to the expansion into European markets and strategic cost-cutting measures in logistics.`,
            score: 0.94,
            metadata: { source: 'report_2023.txt', page: 12 },
            timestamp: new Date().toISOString()
          },
          {
            id: crypto.randomUUID(),
            text: `Contextual match: Operational efficiency improved by 18% following the implementation of the new knowledge management system at the edge.`,
            score: 0.82,
            metadata: { source: 'ops_audit.csv' },
            timestamp: new Date().toISOString()
          }
        ]), { headers: { 'Content-Type': 'application/json' } });
      }
      if (endpoint === 'ingest' && request.method === 'POST') {
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
      }
      return new Response('API Endpoint Not Found', { status: 404 });
    }
    // Default to a simple response for assets (Vite handles this in dev)
    return new Response('Not Found', { status: 404 });
  }
}