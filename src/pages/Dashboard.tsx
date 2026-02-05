import React, { useEffect, useState } from 'react';
import { api, VaultStats } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Database, HardDrive, Activity, Clock, TrendingUp } from 'lucide-react';
import { formatBytes, cn } from '@/lib/utils';
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
    api.getStats()
      .then(setStats)
      .catch(err => console.error('Dashboard Stats Error:', err));
  }, []);
  if (!stats) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
        </div>
        <div className="h-80 bg-slate-200 rounded-xl" />
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">System Overview</h1>
          <p className="text-slate-500 mt-2 text-lg">Real-time performance metrics for your semantic edge vault.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
           <TrendingUp className="w-4 h-4 text-emerald-600" />
           <span className="text-sm font-bold text-emerald-700">Cluster Optimal</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Documents" 
          value={stats.documentCount.toLocaleString()} 
          icon={Database} 
          trend="+12.5% this month" 
          trendUp={true} 
        />
        <StatCard 
          title="Index Size" 
          value={formatBytes(stats.indexSize)} 
          icon={HardDrive} 
          trend="Optimized Space" 
        />
        <StatCard 
          title="Health Status" 
          value={stats.health.toUpperCase()} 
          icon={Activity} 
          statusColor="text-emerald-500" 
        />
        <StatCard 
          title="Last Commit" 
          value={new Date(stats.lastCommit).toLocaleTimeString()} 
          icon={Clock} 
          trend="Synced at edge" 
        />
      </div>
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800">Ingestion Velocity</CardTitle>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-xs font-medium text-slate-500">New Embeddings</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 px-4 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40}>
                 {mockChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === mockChartData.length - 1 ? '#4338ca' : '#4f46e5'} />
                 ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  statusColor?: string;
}
function StatCard({ title, value, icon: Icon, trend, trendUp, statusColor }: StatCardProps) {
  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-extrabold tracking-tight", statusColor || "text-slate-900")}>{value}</div>
        {trend && (
          <p className={cn("text-xs mt-2 font-bold", trendUp ? "text-emerald-600" : "text-slate-500")}>
            {trendUp && "↑ "}{trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}