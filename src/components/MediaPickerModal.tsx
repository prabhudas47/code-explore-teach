import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MediaUpload } from './MediaUpload';

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  accept?: string;
}

export const MediaPickerModal = ({ open, onClose, onSelect, accept }: MediaPickerModalProps) => {
  const [files, setFiles] = useState<{ name: string; created_at: string; metadata: any }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'pdf'>('all');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const loadFiles = async () => {
    setLoading(true);
    const { data } = await supabase.storage.from('portfolio-media').list('uploads', {
      limit: 500,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (data) setFiles(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
    setLoading(false);
  };

  useEffect(() => {
    if (open) loadFiles();
  }, [open]);

  if (!open) return null;

  const isImage = (n: string) => /\.(webp|jpg|jpeg|png|gif|svg|bmp)$/i.test(n);
  const isVideo = (n: string) => /\.(mp4|webm|mov|avi)$/i.test(n);
  const isPdf = (n: string) => /\.pdf$/i.test(n);

  const getUrl = (name: string) => {
    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(`uploads/${name}`);
    return data.publicUrl;
  };

  const filtered = files.filter(f => {
    if (filter === 'image' && !isImage(f.name)) return false;
    if (filter === 'video' && !isVideo(f.name)) return false;
    if (filter === 'pdf' && !isPdf(f.name)) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSelect = (name: string) => {
    onSelect(getUrl(name));
    onClose();
  };

  const handleNewUpload = (url: string) => {
    if (url) {
      onSelect(url);
      onClose();
      toast.success('File uploaded & selected!');
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[80vh] mx-4 rounded-xl overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Choose from Media Library</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-border">
          <div className="flex gap-1">
            {(['all', 'image', 'video', 'pdf'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 text-[10px] rounded-full border transition-colors ${filter === f ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                {f === 'all' ? 'All' : f === 'image' ? 'Images' : f === 'video' ? 'Videos' : 'PDFs'}
              </button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 min-w-[100px] bg-transparent border border-border rounded-lg px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
          <button onClick={() => setShowUpload(!showUpload)} className="text-[10px] px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            {showUpload ? 'Hide Upload' : '+ Upload New'}
          </button>
        </div>

        {/* Upload area (toggled) */}
        {showUpload && (
          <div className="px-5 py-3 border-b border-border">
            <MediaUpload label="Upload New File" value="" onChange={handleNewUpload} accept={accept || 'image/*,video/*,.pdf'} maxSizeMB={50} />
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-xs text-muted-foreground text-center py-12">Loading media...</p>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-12">
              {files.length === 0 ? 'No files yet. Upload one above!' : 'No files match your filter.'}
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {filtered.map(file => (
                <button
                  key={file.name}
                  onClick={() => handleSelect(file.name)}
                  className="group border border-border rounded-lg overflow-hidden hover:border-foreground/50 hover:ring-1 hover:ring-foreground/20 transition-all duration-200 text-left"
                >
                  <div className="aspect-square bg-accent/20 flex items-center justify-center overflow-hidden">
                    {isImage(file.name) ? (
                      <img src={getUrl(file.name)} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    ) : isVideo(file.name) ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black/20">
                        <video src={getUrl(file.name)} className="w-full h-full object-cover" muted preload="metadata" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 bg-foreground/80 rounded-full flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="hsl(var(--background))"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    )}
                  </div>
                  <p className="text-[8px] text-muted-foreground truncate px-1.5 py-1 group-hover:text-foreground transition-colors">{file.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
