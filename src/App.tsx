import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Ingest from './pages/Ingest';
import Admin from './pages/Admin';
import { TooltipProvider } from '@/components/ui/tooltip';
export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/ingest" element={<Ingest />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
        <Toaster
          position="bottom-right"
          richColors
          expand={true}
          theme="light"
          toastOptions={{
            style: {
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              fontSize: '14px',
              fontWeight: 500,
            },
          }}
        />
      </TooltipProvider>
    </BrowserRouter>
  );
}