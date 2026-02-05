import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Database, Download, RefreshCcw, ShieldAlert, Globe } from 'lucide-react';
export default function Admin() {
  const handleAction = (action: string) => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: `Executing ${action}...`,
      success: `${action} completed successfully.`,
      error: `Failed to ${action}.`
    });
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
        <p className="text-slate-500 mt-1">Manage vault maintenance and connection settings.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              Index Maintenance
            </CardTitle>
            <CardDescription>Optimize and clean up the semantic vector space.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="text-sm">
                <p className="font-medium text-slate-700">Compact Vault</p>
                <p className="text-xs text-slate-500">Removes unused segments and merges blocks.</p>
              </div>
              <Button size="sm" onClick={() => handleAction('Vault Compaction')}>Execute</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="text-sm">
                <p className="font-medium text-slate-700">Rebuild FAISS Index</p>
                <p className="text-xs text-slate-500">Triggers a full re-index of all documents.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleAction('Index Rebuild')}>Rebuild</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              Exports & Backups
            </CardTitle>
            <CardDescription>Download raw data and index snapshots.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start gap-2" variant="outline" onClick={() => handleAction('Export CSV')}>
              <RefreshCcw className="w-4 h-4" /> Export full index as CSV
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" onClick={() => handleAction('Backup Download')}>
              <ShieldAlert className="w-4 h-4" /> Download FAISS snapshot
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            Backend Connection
          </CardTitle>
          <CardDescription>Configure the upstream PKF-Core service endpoint.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Service URL</label>
            <div className="flex gap-2">
              <Input defaultValue="http://localhost:8000" className="bg-slate-50" />
              <Button onClick={() => toast.success('Connection settings updated.')}>Update</Button>
            </div>
            <p className="text-xs text-slate-400">Requests are proxied through the Cloudflare Edge Worker for security.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}