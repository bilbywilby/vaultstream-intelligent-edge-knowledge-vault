import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Search, Upload, Settings, Menu, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
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
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
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
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Edge Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-slate-700 font-medium">Connected</span>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 md:hidden">
          <div className="flex items-center justify-between px-4 h-16">
             <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-indigo-600" />
                <span className="font-bold text-lg">VaultStream</span>
             </div>
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon">
                   <Menu className="w-6 h-6" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-64 p-0">
                  <div className="p-6 font-bold text-xl border-b">VaultStream</div>
                  <nav className="p-4 space-y-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}