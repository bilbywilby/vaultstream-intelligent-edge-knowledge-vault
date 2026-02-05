import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Search, Upload, Settings, Menu, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Ingest', href: '/ingest', icon: Upload },
  { name: 'Admin', href: '/admin', icon: Settings },
];
export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-slate-200 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">VaultStream</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-indigo-50 text-primary"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Edge Status</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-slate-700 font-bold">Secure Node</span>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 md:hidden">
          <div className="flex items-center justify-between px-4 h-16">
             <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">VaultStream</span>
             </div>
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full">
                   <Menu className="w-6 h-6" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-64 p-0">
                  <div className="p-6 font-bold text-xl border-b bg-slate-50 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" /> VaultStream
                  </div>
                  <nav className="p-4 space-y-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive ? "bg-indigo-50 text-primary" : "text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </NavLink>
                    ))}
                  </nav>
               </SheetContent>
             </Sheet>
          </div>
        </header>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}