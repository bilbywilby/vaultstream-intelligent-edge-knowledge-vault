import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, X, Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
export default function Ingest() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    toast.success(`${acceptedFiles.length} file(s) staged for ingestion.`);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt'], 'text/csv': ['.csv'] }
  });
  const handleIngest = async () => {
    if (!text && files.length === 0) {
      toast.error('Please provide some content to ingest.');
      return;
    }
    setLoading(true);
    try {
      await api.ingest({ text, files });
      toast.success('Successfully added to vault index.', {
        description: 'New vectors are being computed at the edge.',
        icon: <Zap className="w-4 h-4 text-indigo-600" />
      });
      setText('');
      setFiles([]);
    } catch (err) {
      toast.error('Ingestion failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Ingest Knowledge</h1>
          <p className="text-slate-500 mt-2 text-lg">Power your semantic search by adding new source material.</p>
        </div>
        <Button
          onClick={handleIngest}
          disabled={loading}
          size="lg"
          className="bg-primary hover:bg-indigo-700 shadow-lg shadow-indigo-100 px-8 h-14 text-lg font-bold transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
              Processing...
            </>
          ) : (
            'Run Ingestion'
          )}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flex flex-col border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Direct Text Input
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-6">
            <Textarea
              placeholder="Paste or type content here for instant embedding..."
              className="flex-1 min-h-[350px] resize-none bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary text-base transition-colors"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-4">
               <div className="flex items-center gap-1.5 text-slate-400">
                  <Info className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">Approximate Tokens: {Math.ceil(text.length / 4)}</span>
               </div>
               <Button variant="ghost" size="sm" onClick={() => setText('')} className="text-slate-400 hover:text-red-500 text-xs">Clear</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              Batch File Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <div
              {...getRootProps()}
              className={cn(
                "h-[250px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group",
                isDragActive ? "border-primary bg-indigo-50" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-slate-100 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <p className="text-base font-bold text-slate-700">Drop files to ingest</p>
              <p className="text-sm text-slate-500 mt-1">Support for .txt, .csv, .md</p>
            </div>
            <div className="mt-8 space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Staged Files ({files.length})</h3>
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                       <FileText className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate max-w-[180px]">{file.name}</p>
                      <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setFiles(f => f.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {files.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-400">No files staged yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}