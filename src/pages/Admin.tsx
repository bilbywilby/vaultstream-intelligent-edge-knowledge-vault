import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Database, RefreshCcw, Cpu, Trash2, History, ShieldCheck, AlertTriangle } from 'lucide-react';
import { api, PKFCommit } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
export default function Admin() {
  const [status, setStatus] = useState<any>(null);
  const [commits, setCommits] = useState<PKFCommit[]>([]);
  const [loading, setLoading] = useState(true);
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
      success: () => { loadData(); return 'Optimization complete'; },
      error: 'Failed to compact'
    });
  };
  const handleDelete = async (hash: string) => {
    if (!confirm('Are you sure? This will remove all associated vectors.')) return;
    try {
      await api.deleteCommit(hash);
      toast.success('Commit removed');
      loadData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };
  if (loading) return <div className="p-12 text-center animate-pulse">Initializing PKF Console...</div>;
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage edge snapshots and system health.</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="px-4 py-1.5 border-slate-200 bg-white">
             <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-2" />
             V2.1.0-PKF
           </Badge>
           <Button variant="outline" size="sm" onClick={loadData} className="rounded-full">
             <RefreshCcw className="w-4 h-4" />
           </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard title="Vectors Indexed" value={status?.index_count || 0} icon={Cpu} sub="Live Search Index" />
        <StatusCard title="Database Blobs" value={status?.db_count || 0} icon={Database} sub="Raw Content Store" />
        <StatusCard 
          title="Engine Health" 
          value={status?.needs_reindex ? 'SYNC REQ' : 'OPTIMIZED'} 
          icon={AlertTriangle} 
          color={status?.needs_reindex ? 'text-amber-500' : 'text-emerald-500'}
          sub={status?.needs_reindex ? 'Partial fragments detected' : 'Fully consistent'}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="w-5 h-5 text-primary" /> Snapshot History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase tracking-wider">
                      <th className="text-left p-4">Hash</th>
                      <th className="text-left p-4">Message</th>
                      <th className="text-left p-4">Created</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commits.map((c) => (
                      <tr key={c.hash} className={cn("border-b hover:bg-slate-50/50 transition-colors", c.is_active === 0 && "opacity-40")}>
                        <td className="p-4 font-mono text-xs text-primary">{c.hash.slice(0, 8)}</td>
                        <td className="p-4 font-semibold text-slate-700">{c.message}</td>
                        <td className="p-4 text-slate-500">{formatDate(c.timestamp)}</td>
                        <td className="p-4 text-right">
                          {c.is_active === 1 && (
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(c.hash)} className="hover:text-red-500 rounded-full h-8 w-8">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {commits.length === 0 && <div className="p-12 text-center text-slate-400">No snapshots recorded yet.</div>}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-slate-200 self-start">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg">Maintenance</CardTitle>
            <CardDescription>Optimize internal indices.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Button onClick={handleCompact} className="w-full justify-start gap-3 bg-white border-slate-200 text-slate-700 hover:bg-slate-50" variant="outline">
              <RefreshCcw className="w-4 h-4 text-indigo-500" />
              Compact & Defrag
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 opacity-50 cursor-not-allowed">
              <Database className="w-4 h-4 text-slate-400" />
              Download Snapshot (v2)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function StatusCard({ title, value, icon: Icon, sub, color }: any) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="p-2 bg-slate-50 rounded-lg">
            <Icon className="w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className={cn("text-3xl font-black tracking-tight", color || "text-slate-900")}>{value}</div>
        <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-tight">{sub}</p>
      </CardContent>
    </Card>
  );
}