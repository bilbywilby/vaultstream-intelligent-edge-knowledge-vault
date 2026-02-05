import React, { useState } from 'react';
import { api, SearchResult } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, ChevronRight, Hash } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Semantic Query</h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">Ask your vault questions in natural language. We'll find the most relevant context for you.</p>
      </div>
      <form onSubmit={handleSearch} className="relative group">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <Input 
          className="h-16 pl-12 pr-32 text-lg rounded-2xl border-slate-200 shadow-lg shadow-slate-200/50 focus-visible:ring-indigo-500 transition-all"
          placeholder="What are the key points of the revenue report?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          type="submit" 
          disabled={isSearching}
          className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          {isSearching ? '...' : 'Search'}
        </Button>
      </form>
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
            {results.length > 0 ? `${results.length} results found` : isSearching ? 'Searching...' : 'Search Results'}
          </h2>
        </div>
        <AnimatePresence mode="popLayout">
          {results.map((result, idx) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none font-bold">
                    {(result.score * 100).toFixed(1)}% Match
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> {result.id.slice(0, 8)}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{new Date(result.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{result.text}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  {Object.entries(result.metadata || {}).map(([k, v]) => (
                    <Badge key={k} variant="outline" className="text-[10px] text-slate-500">{k}: {String(v)}</Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 p-0 h-auto font-medium text-xs">
                  View Context <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!isSearching && results.length === 0 && query && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No matches found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}