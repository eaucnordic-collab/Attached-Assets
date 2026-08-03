import { useState, useRef } from 'react';
import { useListMedia, useCreateMediaItem, useDeleteMediaItem } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Search, Trash2, Image, FileText, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMedia() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useListMedia();
  const createMutation = useCreateMediaItem();
  const deleteMutation = useDeleteMediaItem();
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const filtered = (items || []).filter(m =>
    m.filename.toLowerCase().includes(search.toLowerCase()) ||
    m.originalName.toLowerCase().includes(search.toLowerCase())
  );

  const isImage = (mime: string) => mime.startsWith('image/');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const base64 = dataUrl.split(',')[1] || '';
      createMutation.mutate({
        filename: file.name.replace(/[^a-zA-Z0-9._-]/g, '_'),
        originalName: file.name,
        url: dataUrl,
        mimeType: file.type,
        size: file.size,
        data: base64,
      }, {
        onSuccess: () => { toast.success('File uploaded'); queryClient.invalidateQueries({ queryKey: ['/api/media'] }); },
        onError: () => toast.error('Upload failed'),
      });
    };
    reader.readAsDataURL(file);
    if (fileInput.current) fileInput.current.value = '';
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      toast.success('URL copied');
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatBytes = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
            <p className="text-muted-foreground">Upload and manage images and files.</p>
          </div>
          <div>
            <input ref={fileInput} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleUpload} />
            <Button onClick={() => fileInput.current?.click()} className="gap-2" disabled={createMutation.isPending}>
              <Upload className="w-4 h-4" />
              {createMutation.isPending ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search files..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Image className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No files yet. Upload your first file above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="group border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div
                  className="aspect-square bg-muted flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => isImage(item.mimeType) && setPreview(item.url)}
                >
                  {isImage(item.mimeType) ? (
                    <img src={item.url} alt={item.altText || item.filename} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate" title={item.originalName}>{item.originalName}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(item.size)}</p>
                  <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyUrl(item.id, item.url)}
                    >
                      {copied === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:text-destructive"
                      onClick={() => { if (confirm('Delete file?')) deleteMutation.mutate({ id: item.id }, { onSuccess: () => { toast.success('Deleted'); queryClient.invalidateQueries({ queryKey: ['/api/media'] }); } }); }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Preview</DialogTitle></DialogHeader>
          {preview && <img src={preview} alt="Preview" className="w-full rounded-md max-h-[70vh] object-contain" />}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
