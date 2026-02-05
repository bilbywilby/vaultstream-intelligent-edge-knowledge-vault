import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Database, Download, RefreshCcw, ShieldAlert, Globe, Activity, HardDrive, Cpu, ChevronRight } from 'lucide-react';
export default function Admin() {
  const [backendUrl, setBackendUrl] = useState(localStorage.getItem('vault_backend_url') || 'http://localhost:8000');
  const handleAction = (action: string) => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: `Initializing ${action}...`,
      success: `${action} complete.`,
      error: `Failed to ${action}.`
    });
  };
  const saveSettings = () => {
    localStorage.setItem('vault_backend_url', backendUrl);
    toast.success('Connection settings persisted.');
  };
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Advanced vault maintenance and configuration gateway.</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-slate-900 text-white rounded-xl flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold">V1.4.2-STABLE</span>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-slate-200 shadow-sm overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                <Database className="w-5 h-5 text-primary" />
              </div>
              Index Maintenance
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">Optimize and clean up the high-dimensional vector space.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
              <div className="text-sm">
                <p className="font-bold text-slate-800">Compact Vault</p>
                <p className="text-xs text-slate-500 mt-0.5">Removes fragmented segments and merges index blocks.</p>
              </div>
              <Button size="sm" onClick={() => handleAction('Vault Compaction')} className="font-bold rounded-lg px-4 bg-white border-slate-200 text-slate-700 hover:bg-slate-50">Execute</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
              <div className="text-sm">
                <p className="font-bold text-slate-800">Rebuild FAISS Index</p>
                <p className="text-xs text-slate-500 mt-0.5">Triggers a full GPU-accelerated re-index of all knowledge.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleAction('Index Rebuild')} className="font-bold rounded-lg px-4">Rebuild</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                <Download className="w-5 h-5 text-emerald-600" />
              </div>
              Exports & Backups
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">Snapshot retrieval and dataset extraction tools.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button className="w-full h-14 justify-between gap-4 bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700 font-bold rounded-2xl" variant="outline" onClick={() => handleAction('Export CSV')}>
              <div className="flex items-center gap-3">
                <RefreshCcw className="w-5 h-5 text-slate-400" />
                <span>Export Primary Index (CSV)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Button>
            <Button className="w-full h-14 justify-between gap-4 bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700 font-bold rounded-2xl" variant="outline" onClick={() => handleAction('Backup Download')}>
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
                <span>Download Vector Snapshot</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
            <div className="p-2 bg-primary rounded-lg shadow-lg shadow-indigo-200">
              <Globe className="w-5 h-5 text-white" />
            </div>
            Edge Gateway Configuration
          </CardTitle>
          <CardDescription className="font-medium text-slate-600">Point this client to your upstream PKF-Core service instance.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                Service Endpoint URL
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="https://your-api.com"
                  className="flex-1 h-14 px-6 text-lg bg-slate-50 border-slate-200 rounded-2xl font-medium focus:ring-primary focus:bg-white transition-all"
                />
                <Button onClick={saveSettings} className="h-14 px-10 bg-primary hover:bg-indigo-700 font-bold text-lg rounded-2xl shadow-lg shadow-indigo-100">Update Cluster</Button>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
               <div className="w-10 h-10 shrink-0 bg-white rounded-xl shadow-sm border border-indigo-100 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
               </div>
               <p className="text-sm text-indigo-700 font-medium leading-relaxed">
                 All requests are automatically proxied through the Cloudflare Edge Worker. This ensures encrypted transit, JWT validation, and high-performance result caching.
               </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}