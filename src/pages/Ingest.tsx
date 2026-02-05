import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UploadCloud, FileText, X, Info, Zap, MessageSquare, Trash2, ExternalLink } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
export default function Ingest() {
  const [text, setText] = useState('');
  const [commitMessage, setCommitMessage] = useState('Manual Ingest');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    toast.success(`${acceptedFiles.length} file(s) staged.`);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt'], 'text/csv': ['.csv'], 'text/markdown': ['.md'] }
  });
  const handleIngest = async () => {
    if (!text && files.length === 0) {
      toast.error('No content provided.');
      return;
    }
    setLoading(true);
    try {
      const documents: string[] = [];
      if (text.trim()) documents.push(text.trim());
      for (const file of files) {
        const content = await file.text();
        if (content.length > 500000) {
          toast.warning(`Skipping ${file.name}: exceeds 500KB`);
          continue;
        }
        documents.push(content);
      }
      const res = await api.ingest({ message: commitMessage, documents: documents.slice(0, 20) });
      toast.success('Snapshot committed to vault', {
        description: `Hash: ${res.commit_hash.slice(0, 8)} | ${res.count} items`,
        icon: <Zap className="w-4 h-4 text-indigo-600" />,
        action: {
          label: 'View in Admin',
          onClick: () => navigate('/admin')
        }
      });
      setText('');
      setFiles([]);
      setCommitMessage('Manual Ingest');
    } catch (err) {
      toast.error('Ingestion failed.');
    } finally {
      setLoading(false);
    }
  };
  const totalChars = text.length + files.reduce((acc, f) => acc + f.size, 0);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10 animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-10">
          <div className="space-y-4 flex-1">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Ingest Knowledge</h1>
            <p className="text-slate-500 text-lg font-medium">Expand your semantic vault with new snapshots.</p>
            <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-2xl shadow-sm max-w-lg mt-6 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <MessageSquare className="w-5 h-5 text-slate-400 ml-3" />
              <Input 
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Commit identifier..."
                className="border-none shadow-none focus-visible:ring-0 bg-transparent font-bold text-slate-700"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-5 h-5 text-slate-300 mr-2 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] p-3">
                  A commit message helps track the provenance of data within the vault.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-end gap-6 px-4">
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Vector Weight</p>
                   <p className="text-sm font-bold text-slate-700">{Math.ceil(totalChars / 1000)} Units</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Size</p>
                   <p className="text-sm font-bold text-slate-700">{formatBytes(totalChars)}</p>
                </div>
             </div>
             <Button 
              onClick={handleIngest} 
              disabled={loading}
              size="lg"
              className="bg-primary hover:bg-indigo-700 shadow-2xl shadow-indigo-200 px-10 h-16 text-xl font-bold rounded-2xl transition-all"
            >
              {loading ? 'Processing...' : 'Commit Snapshot'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card className="border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <CardHeader className="bg-slate-50/80 border-b p-6">
              <CardTitle className="text-lg font-black flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                Direct Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <Textarea
                placeholder="Paste document text or raw context here..."
                className="min-h-[400px] bg-slate-50 border-slate-200 focus:bg-white transition-all text-lg rounded-2xl resize-none p-6"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>{text.length} characters</span>
                <span>Max 500kb per blob</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <CardHeader className="bg-slate-50/80 border-b p-6">
              <CardTitle className="text-lg font-black flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <UploadCloud className="w-5 h-5 text-primary" />
                </div>
                Multi-file Batch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div {...getRootProps()} className={cn(
                "h-64 border-4 border-dashed rounded-[32px] flex flex-col items-center justify-center cursor-pointer transition-all",
                isDragActive ? "border-primary bg-indigo-50 scale-[0.98]" : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
              )}>
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4">
                  <UploadCloud className="w-10 h-10 text-slate-300" />
                </div>
                <p className="font-black text-slate-800 text-lg">Drop files or click</p>
                <p className="text-sm text-slate-500 font-medium">TXT, MD, CSV (Max 20 documents)</p>
              </div>
              {files.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Staged Documents ({files.length})</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFiles([])}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-[10px] uppercase tracking-widest gap-2"
                    >
                      <Trash2 className="w-3 h-3" /> Clear All
                    </Button>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-100 transition-all">
                        <div className="flex items-center gap-3 truncate">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-bold text-slate-700 truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{formatBytes(file.size)}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setFiles(f => f.filter((_, i) => i !== idx))} className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}