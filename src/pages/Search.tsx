import React, { useState } from 'react';
import { api, SearchResult } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, ChevronRight, Hash, Sparkles, Clock, Globe, Copy, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    const start = performance.now();
    try {
      const data = await api.search(query);
      setResults(data);
      setSearchTime(Math.round(performance.now() - start));
    } catch (err) {
      toast.error('Search failed', { description: 'Could not connect to Edge Node.' });
    } finally {
      setIsSearching(false);
    }
  };
  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('ID Copied', { description: `Blob hash: ${id}` });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-12 animate-fade-in">
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Vectors
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900">Semantic Query</h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">Interact with your vault using natural language to extract high-context insights.</p>
        </div>
        <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              className="h-24 pl-16 pr-44 text-2xl rounded-[32px] border-slate-200 bg-white shadow-2xl shadow-indigo-100/40 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all font-medium"
              placeholder="Search for insights..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              disabled={isSearching}
              className="absolute right-4 top-4 bottom-4 px-10 rounded-2xl bg-primary hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all font-bold text-xl"
            >
              {isSearching ? '...' : 'Search'}
            </Button>
          </div>
        </form>
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between px-2 border-b border-slate-100 pb-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
              {results.length > 0 ? `${results.length} Matches Found` : isSearching ? 'Processing Vector Space...' : 'Vault Results'}
            </h2>
            {searchTime && results.length > 0 && (
               <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider text-slate-400 py-1 px-3">
                 Query time: {searchTime}ms
               </Badge>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {results.map((result, idx) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black px-3 py-1 text-xs">
                        {(result.score * 100).toFixed(1)}% Match
                      </Badge>
                      <button 
                        onClick={() => copyId(result.id)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md"
                      >
                        <Hash className="w-3 h-3" /> ID: {result.id.slice(0, 8)} <Copy className="w-2.5 h-2.5 ml-1" />
                      </button>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <Clock className="w-3 h-3" /> {new Date(result.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-slate-700 text-xl leading-relaxed font-medium line-clamp-4">{result.text}</p>
                  <div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                      {Object.entries(result.metadata || {}).map(([k, v]) => (
                        <Badge key={k} variant="secondary" className="text-[10px] font-bold text-slate-500 bg-slate-100/50 uppercase tracking-wider px-3">
                          {k}: {String(v)}
                        </Badge>
                      ))}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-full px-6 font-bold text-xs gap-2 hover:bg-indigo-50 hover:text-primary hover:border-primary transition-all">
                          <Eye className="w-3.5 h-3.5" /> Full Context
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl rounded-[32px] p-8">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl">
                              <SearchIcon className="w-5 h-5 text-primary" />
                            </div>
                            Source Document Context
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 max-h-[60vh] overflow-y-auto custom-scrollbar">
                           <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{result.text}</p>
                        </div>
                        <div className="flex justify-between items-center mt-6">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                             Hash: {result.id}
                           </div>
                           <Button onClick={() => copyId(result.id)} size="sm" variant="ghost" className="text-xs font-bold gap-2">
                             <Copy className="w-3 h-3" /> Copy Content
                           </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {!isSearching && results.length === 0 && query && (
            <div className="text-center py-24 bg-slate-50/50 rounded-[48px] border-4 border-dashed border-slate-100 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                 <SearchIcon className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-2xl font-bold text-slate-900">No semantic matches found</p>
              <p className="text-slate-500 mt-2 max-w-xs font-medium">The query didn't trigger any significant vector activations in the current vault.</p>
            </div>
          )}
          {!query && !isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
               <div className="p-8 bg-white rounded-[32px] border border-slate-200 shadow-sm space-y-4 group hover:border-indigo-200 transition-colors">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-slate-900">Universal Search</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Search across all snapshots and historical commits simultaneously at the edge.</p>
               </div>
               <div className="p-8 bg-white rounded-[32px] border border-slate-200 shadow-sm space-y-4 group hover:border-emerald-200 transition-colors">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Vector Embeddings</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Proprietary encoding transforms text into high-dimensional space for conceptual retrieval.</p>
               </div>
               <div className="p-8 bg-white rounded-[32px] border border-slate-200 shadow-sm space-y-4 group hover:border-indigo-200 transition-colors">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-slate-900">Millisecond Latency</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Direct Workers integration ensures search results are returned faster than a blink.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}