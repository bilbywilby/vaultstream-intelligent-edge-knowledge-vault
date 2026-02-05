import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Ingest from './pages/Ingest';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { TooltipProvider } from '@/components/ui/tooltip';
import { api } from '@/lib/api';
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = api.isAuthenticated();
  if (!auth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/ingest" element={<Ingest />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="bottom-right"
          richColors
          expand={true}
          theme="light"
          toastOptions={{
            style: {
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </TooltipProvider>
    </BrowserRouter>
  );
}