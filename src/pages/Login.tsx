import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('vault-2024');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.login({ username, password });
      toast.success('Access Granted', { description: 'Authenticated with Edge Node' });
      navigate('/');
    } catch (err) {
      toast.error('Access Denied', { description: 'Invalid credentials provided.' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">VaultStream</h1>
          <p className="text-slate-400 font-medium mt-2">Secure Knowledge Edge Gateway</p>
        </div>
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-800/50 pb-6">
            <CardTitle className="text-xl text-white">System Access</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Identity</label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl focus:ring-primary"
                  placeholder="Username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
                <Input 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? 'Validating...' : 'Authorize Session'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
            <div className="flex items-start gap-3 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-indigo-200">Demo Environment</p>
                <p className="text-[11px] text-indigo-300/70 leading-relaxed">
                  Authentication is handled by the edge middleware. Use default admin credentials for testing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
           <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">AES-256</span>
           </div>
           <div className="w-1 h-1 bg-slate-700 rounded-full" />
           <div className="flex items-center gap-2 text-white">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">PKF V2.1</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}