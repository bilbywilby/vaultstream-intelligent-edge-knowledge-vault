import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Database, RefreshCcw, Cpu, Trash2, History, ShieldCheck, AlertTriangle, Download, Copy, ScrollText, Zap } from 'lucide-react';
import { api, PKFCommit } from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
export default function Admin() {
  const [status, setStatus] = useState<any>(null);
  const [commits, setCommits] = useState<PKFCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const loadData = async () => {
    try {
      const [s, c] = await Promise.all([api.getAdminStatus(), api.getCommits()]);
      setStatus(s);
      setCommits(c.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleCompact = async () => {
    toast.promise(api.compact(), {
      loading: 'Compacting vault...',
      success: (res) => {
        loadData();
        return `Optimization complete. Pruned ${res.pruned} orphaned items.`;
      },
      error: 'Failed to compact'
    });
  };
  const handleExport = async () => {
    setExporting(true);
    try {
      await api.exportVault();
      toast.success('Export Success', { description: 'Vault snapshot downloaded.' });
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };
  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Hash Copied');
  };
  const handleDelete = async (hash: string) => {
    if (!confirm('Are you sure? This will remove all associated vectors from the live index.')) return;
    try {
      await api.deleteCommit(hash);
      toast.success('Commit removed');
      loadData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };
  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
       <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing PKF Console...</p>
       </div>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-12 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-10">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Admin Console</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Manage edge knowledge snapshots and optimize engine performance.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white border border-slate-200 rounded-2xl px-5 py-2 flex items-center gap-3 shadow-sm">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <div className="text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Kernel Version</p>
                  <p className="text-xs font-bold text-slate-700">2.1.0-PKF</p>
               </div>
             </div>
             <Button variant="outline" size="icon" onClick={loadData} className="rounded-2xl h-11 w-11 shadow-sm border-slate-200">
               <RefreshCcw className="w-4 h-4 text-slate-500" />
             </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatusCard 
            title="Vectors Indexed" 
            value={status?.index_count || 0} 
            icon={Cpu} 
            sub="Live Semantic Index"
            healthy={status?.index_count > 0}
          />
          <StatusCard 
            title="Raw Blobs" 
            value={status?.db_count || 0} 
            icon={Database} 
            sub="Content Store"
            healthy={status?.db_count > 0}
          />
          <StatusCard 
            title="System Consistency" 
            value={status?.needs_reindex ? 'SYNC REQ' : 'OPTIMIZED'} 
            icon={AlertTriangle} 
            color={status?.needs_reindex ? 'text-amber-500' : 'text-emerald-500'}
            sub={status?.needs_reindex ? 'Fragments detected' : 'Engine consistent'}
            healthy={!status?.needs_reindex}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <CardHeader className="bg-slate-50/80 border-b p-8">
                <CardTitle className="flex items-center gap-3 text-xl font-black">
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <History className="w-5 h-5 text-primary" />
                  </div>
                  Snapshot History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50/50 border-b text-slate-400 font-black uppercase tracking-widest text-[10px]">
                        <th className="text-left px-8 py-5">Hash</th>
                        <th className="text-left px-8 py-5">Context Message</th>
                        <th className="text-left px-8 py-5">Commit Date</th>
                        <th className="text-right px-8 py-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commits.map((c) => (
                        <tr key={c.hash} className={cn("border-b hover:bg-slate-50/50 transition-colors group", c.is_active === 0 && "opacity-30")}>
                          <td className="px-8 py-5 font-mono text-xs">
                             <div className="flex items-center gap-2">
                               <span className="text-primary font-bold">{c.hash.slice(0, 8)}</span>
                               <button 
                                onClick={() => copyHash(c.hash)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-indigo-50 rounded text-primary"
                               >
                                 <Copy className="w-3 h-3" />
                               </button>
                             </div>
                          </td>
                          <td className="px-8 py-5 font-bold text-slate-700">{c.message}</td>
                          <td className="px-8 py-5 text-slate-500 font-medium">{formatDate(c.timestamp)}</td>
                          <td className="px-8 py-5 text-right">
                            {c.is_active === 1 && (
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(c.hash)} className="hover:text-red-500 hover:bg-red-50 rounded-full h-9 w-9">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {commits.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <History className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold">No snapshots recorded yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
               <CardHeader className="bg-slate-50/80 border-b p-8">
                 <CardTitle className="flex items-center gap-3 text-xl font-black">
                   <div className="p-2 bg-emerald-50 rounded-xl">
                     <ScrollText className="w-5 h-5 text-emerald-600" />
                   </div>
                   Edge Engine Logs
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-3 font-mono text-[11px]">
                  <div className="flex gap-4 text-emerald-600 font-bold">
                    <span>[OK]</span>
                    <span>2024-11-20 14:22:10</span>
                    <span>ENGINE_INIT: Version 2.1.0-PKF successful</span>
                  </div>
                  <div className="flex gap-4 text-slate-400">
                    <span>[INFO]</span>
                    <span>2024-11-20 14:25:05</span>
                    <span>MEMORY: 124.5MB Allocated for FAISS Index</span>
                  </div>
                  <div className="flex gap-4 text-slate-400">
                    <span>[INFO]</span>
                    <span>2024-11-20 15:01:44</span>
                    <span>INGEST: Snapshot commit successful (ID: 0xa42)</span>
                  </div>
               </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="border-slate-200 rounded-[32px] overflow-hidden shadow-sm bg-white">
              <CardHeader className="bg-slate-50/80 border-b p-8">
                <CardTitle className="text-xl font-black">Maintenance</CardTitle>
                <CardDescription className="font-medium">Optimize and manage the vault index.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <Button 
                  onClick={handleCompact} 
                  className="w-full h-14 justify-start gap-4 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-all rounded-2xl"
                  variant="outline"
                >
                  <RefreshCcw className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-bold">Compact & Defrag</p>
                    <p className="text-[10px] text-slate-400 font-medium">Rebuild index for max performance</p>
                  </div>
                </Button>
                <Button 
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full h-14 justify-start gap-4 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-200 transition-all rounded-2xl"
                  variant="outline"
                >
                  <Download className="w-5 h-5 text-emerald-500" />
                  <div className="text-left">
                    <p className="text-sm font-bold">{exporting ? 'Preparing...' : 'Export Vault'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Download JSON snapshot (Portability)</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
            <div className="p-8 bg-indigo-600 rounded-[32px] shadow-xl shadow-indigo-200 relative overflow-hidden group">
               <Zap className="absolute top-[-20px] right-[-20px] w-48 h-48 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
               <div className="relative z-10 space-y-4">
                  <h4 className="text-white text-xl font-black">Vault Status</h4>
                  <p className="text-indigo-100/70 text-sm font-medium leading-relaxed">
                    Your edge vault is currently running at peak performance with zero detected latency bottlenecks.
                  </p>
                  <div className="pt-2">
                    <Badge className="bg-white/20 text-white border-none px-4 py-1 font-black">ACTIVE SYNC</Badge>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function StatusCard({ title, value, icon: Icon, sub, color, healthy }: any) {
  return (
    <Card className={cn(
      "border-slate-200 bg-white rounded-[32px] shadow-sm relative overflow-hidden transition-all duration-500",
      healthy && "border-indigo-100 shadow-indigo-50/50"
    )}>
      <CardContent className="pt-8 pb-8 px-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
          <div className={cn("p-3 rounded-2xl transition-colors", healthy ? "bg-indigo-50" : "bg-slate-50")}>
            <Icon className={cn("w-5 h-5", healthy ? "text-primary" : "text-slate-400")} />
          </div>
        </div>
        <div className={cn("text-4xl font-black tracking-tighter", color || "text-slate-900")}>{value}</div>
        <p className="text-[11px] font-bold text-slate-400 mt-3 uppercase tracking-widest">{sub}</p>
      </CardContent>
    </Card>
  );
}