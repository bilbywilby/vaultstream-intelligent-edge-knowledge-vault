/**
 * VaultStream Cloudflare Edge Worker
 * Handles API Routing, Authentication (Mock), and Gateway functionality.
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    // API Route Handling
    if (url.pathname.startsWith('/api/')) {
      const endpoint = url.pathname.replace('/api/', '');
      // Simulate network latency
      await new Promise(r => setTimeout(r, 600));
      const jsonHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };
      // MOCK STATS
      if (endpoint === 'stats') {
        return new Response(JSON.stringify({
          documentCount: 14250,
          indexSize: 512 * 1024 * 1024, // 512 MB
          lastCommit: new Date().toISOString(),
          health: 'healthy'
        }), { headers: jsonHeaders });
      }
      // MOCK SEARCH
      if (endpoint === 'search') {
        const query = url.searchParams.get('q') || '';
        const mockResults = [
          {
            id: crypto.randomUUID(),
            text: `High-relevance context for "${query}": Analysis indicates that Q3 market trends were heavily influenced by the rise in localized computing power at the network edge. This led to a 14% increase in processing efficiency across all surveyed nodes.`,
            score: 0.965,
            metadata: { source: 'market_analysis_v2.txt', page: 42, section: 'Network Trends' },
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
          },
          {
            id: crypto.randomUUID(),
            text: `Relevant insight: The PKF-Core implementation successfully reduced vector retrieval latency by offloading primary FAISS indexing to distributed workers, as noted in the recent operational audit.`,
            score: 0.842,
            metadata: { source: 'ops_audit_report.csv', category: 'Infrastructure' },
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
          },
          {
            id: crypto.randomUUID(),
            text: `Secondary Match: Preliminary data from the user study suggests that semantic search interfaces outperform keyword-based search by a factor of 2.5x when querying complex domain knowledge.`,
            score: 0.719,
            metadata: { source: 'ux_study.pdf', author: 'Research Team' },
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
          }
        ];
        return new Response(JSON.stringify(mockResults), { headers: jsonHeaders });
      }
      // MOCK INGEST
      if (endpoint === 'ingest' && request.method === 'POST') {
        try {
          const body = await request.json();
          console.log('Ingestion Triggered:', body);
          return new Response(JSON.stringify({
            success: true,
            jobId: crypto.randomUUID(),
            processedTokens: 4500
          }), { headers: jsonHeaders });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: jsonHeaders });
        }
      }
      // MOCK ADMIN
      if (endpoint.startsWith('admin/')) {
        return new Response(JSON.stringify({ success: true }), { headers: jsonHeaders });
      }
      return new Response(JSON.stringify({ error: 'Endpoint Not Found' }), { status: 404, headers: jsonHeaders });
    }
    // Default static response for root
    return new Response('VaultStream Worker active. API reachable at /api/*', { status: 200 });
  }
}