import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Upload, Settings, Menu, Zap, ShieldCheck, LogOut, User, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { api } from '@/lib/api';
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Ingest', href: '/ingest', icon: Upload },
  { name: 'Admin', href: '/admin', icon: Settings },
];
export function AppShell() {
  const navigate = useNavigate();
  const [isSyncing] = useState(false);
  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };
  const user = JSON.parse(localStorage.getItem('vault_user') || '{"name": "Admin", "role": "admin"}');
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 bg-white border-r border-slate-200 z-20">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-[14px] flex items-center justify-center shadow-lg shadow-indigo-100">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">VaultStream</span>
          </div>
          <BadgePulse active={!isSyncing} />
        </div>
        <nav className="flex-1 px-6 space-y-2 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 relative group",
                  isActive
                    ? "bg-indigo-50 text-primary"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />}
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-slate-400")} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100 space-y-4">
          <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 overflow-hidden">
                 <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-primary font-black">
                   <User className="w-6 h-6" />
                 </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10">
             <div className="flex items-center gap-3 mb-3">
               <Activity className="w-4 h-4 text-primary" />
               <p className="text-[10px] font-black text-primary uppercase tracking-widest">Edge Health</p>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-1.5 flex-1 bg-primary/10 rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-[98%] rounded-full" />
               </div>
               <span className="text-[10px] font-black text-primary">98%</span>
             </div>
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 md:hidden">
          <div className="flex items-center justify-between px-6 h-20">
             <div className="flex items-center gap-3">
                <Zap className="w-7 h-7 text-primary" />
                <span className="font-black text-xl tracking-tighter">VaultStream</span>
             </div>
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-2xl w-12 h-12">
                   <Menu className="w-6 h-6 text-slate-600" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-72 p-0 rounded-r-[32px] border-none">
                  <div className="p-8 font-black text-2xl border-b bg-slate-50/50 flex items-center gap-3 tracking-tighter">
                    <Zap className="w-6 h-6 text-primary" /> VaultStream
                  </div>
                  <nav className="p-6 space-y-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => cn(
                          "flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all",
                          isActive ? "bg-indigo-50 text-primary shadow-sm" : "text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </NavLink>
                    ))}
                  </nav>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Button 
                      variant="outline" 
                      className="w-full h-14 rounded-2xl font-bold gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 border-slate-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5" /> Sign Out
                    </Button>
                  </div>
               </SheetContent>
             </Sheet>
          </div>
        </header>
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
function BadgePulse({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
      <div className={cn(
        "w-2 h-2 rounded-full",
        active ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
      )} />
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{active ? 'Live' : 'Sync'}</span>
    </div>
  );
}