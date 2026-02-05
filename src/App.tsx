import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Ingest from './pages/Ingest';
import Admin from './pages/Admin';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ingest" element={<Ingest />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}