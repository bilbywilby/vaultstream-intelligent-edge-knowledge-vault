import React, { useEffect, useState, useCallback } from 'react';
import { api, VaultStats } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Database, HardDrive, Activity, Clock, TrendingUp, RefreshCcw } from 'lucide-react';
import { formatBytes, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
const mockChartData = [
  { name: 'Mon', count: 120 }, { name: 'Tue', count: 150 }, { name: 'Wed', count: 80 },
  { name: 'Thu', count: 210 }, { name: 'Fri', count: 170 }, { name: 'Sat', count: 40 }, { name: 'Sun', count: 55 },
];
export default function Dashboard() {
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await api.getStats();
      setStats(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Dashboard Stats Error:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);
  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        <div className="h-12 bg-slate-200 rounded-xl w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">System Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">PKF Engine performance at the network edge.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-Refresh Active</p>
              <p className="text-xs text-slate-500 font-medium">Last: {lastRefreshed.toLocaleTimeString()}</p>
           </div>
           <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchStats} 
            disabled={refreshing}
            className={cn("rounded-full border-slate-200 shadow-sm", refreshing && "animate-spin")}
           >
             <RefreshCcw className="w-4 h-4" />
           </Button>
           <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">Healthy</span>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Blobs" value={stats.documentCount.toLocaleString()} icon={Database} trend="+4.2% today" trendUp={true} />
        <StatCard title="Index Vol" value={formatBytes(stats.indexSize)} icon={HardDrive} trend="Cosine Dot-Prod" />
        <StatCard title="Engine State" value={stats.health.toUpperCase()} icon={Activity} statusColor={stats.health === 'healthy' ? "text-emerald-500" : "text-amber-500"} />
        <StatCard title="Latest Commit" value={stats.lastCommit.slice(0, 8)} icon={Clock} trend="Hash SHA-256" />
      </div>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-white">
          <CardTitle className="text-xl font-black text-slate-800">Knowledge Growth</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 px-4 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={45}>
                 {mockChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === mockChartData.length - 1 ? '#4f46e5' : '#e2e8f0'} />
                 ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
function StatCard({ title, value, icon: Icon, trend, trendUp, statusColor }: any) {
  return (
    <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</span>
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-black tracking-tighter", statusColor || "text-slate-900")}>{value}</div>
        {trend && <p className={cn("text-[10px] mt-2 font-bold uppercase", trendUp ? "text-emerald-500" : "text-slate-400")}>{trend}</p>}
      </CardContent>
    </Card>
  );
}