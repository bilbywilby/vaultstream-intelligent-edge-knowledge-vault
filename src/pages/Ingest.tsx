import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
export default function Ingest() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleIngest = async () => {
    if (!text && files.length === 0) {
      toast.error('Please provide some content to ingest.');
      return;
    }
    setLoading(true);
    try {
      await api.ingest({ text, files });
      toast.success('Successfully added to vault index.');
      setText('');
      setFiles([]);
    } catch (err) {
      toast.error('Ingestion failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ingest Knowledge</h1>
          <p className="text-slate-500 mt-1">Add documents or text snippets to your semantic index.</p>
        </div>
        <Button onClick={handleIngest} disabled={loading} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? 'Processing...' : 'Run Ingestion'}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Direct Text Input</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea 
              placeholder="Paste or type content here..." 
              className="flex-1 min-h-[300px] resize-none bg-slate-50"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-2">Approximate tokens: {Math.ceil(text.length / 4)}</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">File Upload</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div 
              {...getRootProps()} 
              className={cn(
                "h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer",
                isDragActive ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              )}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-600">Drag & drop files here</p>
              <p className="text-xs text-slate-400 mt-1">Support for .txt, .csv, .pdf (coming soon)</p>
            </div>
            <div className="mt-6 space-y-2 max-h-[150px] overflow-y-auto">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white border rounded-md group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-slate-700 truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <button onClick={() => setFiles(f => f.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}