import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, X, Info, Zap, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
export default function Ingest() {
  const [text, setText] = useState('');
  const [commitMessage, setCommitMessage] = useState('Manual Ingest');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
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
      // Batch limit 20
      const batch = documents.slice(0, 20);
      const res = await api.ingest({ message: commitMessage, documents: batch });
      toast.success('Snapshot committed to vault', {
        description: `Hash: ${res.commit_hash.slice(0, 8)} | ${res.count} items`,
        icon: <Zap className="w-4 h-4 text-indigo-600" />
      });
      setText('');
      setFiles([]);
    } catch (err) {
      toast.error('Ingestion failed.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 flex-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Ingest Knowledge</h1>
          <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-xl shadow-sm max-w-md">
            <MessageSquare className="w-5 h-5 text-slate-400 ml-2" />
            <Input 
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message (e.g. Q3 Audit Docs)"
              className="border-none shadow-none focus-visible:ring-0 bg-transparent font-medium"
            />
          </div>
        </div>
        <Button
          onClick={handleIngest}
          disabled={loading}
          size="lg"
          className="bg-primary hover:bg-indigo-700 shadow-lg px-8 h-14 text-lg font-bold"
        >
          {loading ? 'Processing Batch...' : 'Commit Snapshot'}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Direct Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Textarea
              placeholder="Enter text context..."
              className="min-h-[300px] bg-slate-50 border-slate-200 focus:bg-white transition-all text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" /> Multi-file Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div {...getRootProps()} className={cn(
              "h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-indigo-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
            )}>
              <input {...getInputProps()} />
              <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
              <p className="font-bold text-slate-700">Drop files or click</p>
              <p className="text-xs text-slate-500">.txt, .md, .csv (Max 20/batch)</p>
            </div>
            <div className="max-h-[150px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-lg">
                  <span className="text-xs font-bold truncate max-w-[150px]">{file.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => setFiles(f => f.filter((_, i) => i !== idx))} className="h-6 w-6">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}