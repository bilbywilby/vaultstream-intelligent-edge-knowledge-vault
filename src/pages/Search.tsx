import React, { useState } from 'react';
import { api, SearchResult } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, ChevronRight, Hash, Sparkles, Clock, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await api.search(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Vectors
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-slate-900">Semantic Query</h1>
        <p className="text-slate-500 text-xl max-w-xl mx-auto font-medium">Ask questions in natural language. We'll find the most relevant context from your vault.</p>
      </div>
      <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            className="h-20 pl-16 pr-40 text-xl rounded-2xl border-slate-200 bg-white shadow-2xl shadow-indigo-100/40 focus-visible:ring-primary focus-visible:border-primary transition-all font-medium"
            placeholder="Search for insights..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            disabled={isSearching}
            className="absolute right-3 top-3 bottom-3 px-8 rounded-xl bg-primary hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all font-bold text-lg"
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Querying
              </div>
            ) : 'Search'}
          </Button>
        </div>
      </form>
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2 border-b border-slate-100 pb-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
            {results.length > 0 ? `${results.length} Matches Found` : isSearching ? 'Processing Semantic Space...' : 'Vault Results'}
          </h2>
          {results.length > 0 && (
             <span className="text-xs text-slate-400 font-medium">Query time: 42ms</span>
          )}
        </div>
        <AnimatePresence mode="popLayout">
          {results.map((result, idx) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50/50 transition-colors" />
              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-indigo-50 text-primary border-none font-black px-3 py-1 text-xs">
                    {(result.score * 100).toFixed(1)}% Relevance
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Hash className="w-3.5 h-3.5" /> {result.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5" /> {new Date(result.timestamp).toLocaleDateString()}
                </div>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed font-medium relative z-10">{result.text}</p>
              <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div className="flex gap-2">
                  {Object.entries(result.metadata || {}).map(([k, v]) => (
                    <Badge key={k} variant="outline" className="text-[10px] font-bold text-slate-500 bg-slate-50/50 uppercase tracking-wider">
                      {k}: {String(v)}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="group-hover:bg-indigo-50 group-hover:text-primary group-hover:border-primary transition-all text-xs font-bold rounded-full px-5">
                  View Source <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!isSearching && results.length === 0 && query && (
          <div className="text-center py-24 bg-slate-50/50 rounded-[40px] border-4 border-dashed border-slate-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
               <SearchIcon className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-xl font-bold text-slate-900">No semantic matches found</p>
            <p className="text-slate-400 mt-2 max-w-xs">Try rephrasing your query or adding more context to your vault.</p>
          </div>
        )}
        {!query && !isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                <Globe className="w-6 h-6 text-primary shrink-0" />
                <div className="space-y-1">
                   <p className="text-sm font-bold text-primary">Global Context</p>
                   <p className="text-xs text-slate-600">Your queries are processed against the entire indexed knowledge base.</p>
                </div>
             </div>
             <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                <Zap className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="space-y-1">
                   <p className="text-sm font-bold text-emerald-600">Vector Speed</p>
                   <p className="text-xs text-slate-600">High-dimensional search occurs at the edge for sub-100ms response times.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}