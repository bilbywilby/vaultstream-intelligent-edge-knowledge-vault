import React, { useEffect, useState } from 'react';
import { api, VaultStats } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Database, HardDrive, Activity, Clock } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
const mockChartData = [
  { name: 'Mon', count: 120 },
  { name: 'Tue', count: 150 },
  { name: 'Wed', count: 80 },
  { name: 'Thu', count: 210 },
  { name: 'Fri', count: 170 },
  { name: 'Sat', count: 40 },
  { name: 'Sun', count: 55 },
];
export default function Dashboard() {
  const [stats, setStats] = useState<VaultStats | null>(null);
  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);
  if (!stats) return <div className="h-full flex items-center justify-center">Loading status...</div>;
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Overview</h1>
        <p className="text-slate-500 mt-1 text-lg">Real-time metrics for your PKF knowledge vault.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Documents" value={stats.documentCount.toLocaleString()} icon={Database} trend="+12% from last week" />
        <StatCard title="Index Size" value={formatBytes(stats.indexSize)} icon={HardDrive} trend="Optimized" />
        <StatCard title="Health Status" value={stats.health.toUpperCase()} icon={Activity} statusColor="text-emerald-500" />
        <StatCard title="Last Commit" value={new Date(stats.lastCommit).toLocaleTimeString()} icon={Clock} />
      </div>
      <Card className="p-6">
        <CardHeader className="px-0">
          <CardTitle>Ingestion Velocity</CardTitle>
        </CardHeader>
        <CardContent className="px-0 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
function StatCard({ title, value, icon: Icon, trend, statusColor }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", statusColor)}>{value}</div>
        {trend && <p className="text-xs text-emerald-600 mt-1 font-medium">{trend}</p>}
      </CardContent>
    </Card>
  );
}