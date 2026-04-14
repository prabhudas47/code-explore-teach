import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MediaPickerModal } from './MediaPickerModal';

interface MediaUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.75): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Compression failed')),
        'image/webp',
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export const MediaUpload = ({ label, value, onChange, accept = 'image/*,video/*,.pdf', maxSizeMB = 20 }: MediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = (f: File) => f.type.startsWith('image/');
  const isVideo = (f: File) => f.type.startsWith('video/');
  const isPdf = (f: File) => f.type === 'application/pdf';

  const handleFile = async (file: File) => {
    setError('');
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds ${maxSizeMB}MB limit`);
      return;
    }

    if (isImage(file) || isVideo(file)) {
      setPreview(URL.createObjectURL(file));
    } else if (isPdf(file)) {
      setPreview('pdf');
    }

    setUploading(true);
    setProgress(10);

    try {
      let uploadBlob: Blob = file;
      let ext = file.name.split('.').pop() || 'bin';

      if (isImage(file) && !file.type.includes('svg') && !file.type.includes('gif')) {
        setProgress(20);
        uploadBlob = await compressImage(file);
        ext = 'webp';
        setProgress(50);
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `uploads/${fileName}`;

      setProgress(60);
      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(path, uploadBlob, {
          cacheControl: '31536000',
          contentType: ext === 'webp' ? 'image/webp' : file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      setProgress(90);
      const { data: urlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(path);

      setProgress(100);
      onChange(urlData.publicUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    setError('');
  };

  const displayUrl = value || preview;
  const isCurrentImage = displayUrl && !displayUrl.endsWith('.pdf') && displayUrl !== 'pdf' && !displayUrl.endsWith('.mp4') && !displayUrl.endsWith('.webm');
  const isCurrentVideo = displayUrl && (displayUrl.endsWith('.mp4') || displayUrl.endsWith('.webm') || displayUrl.endsWith('.mov'));

  return (
    <div className="mb-3">
      {label && <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>}

      <div className="flex gap-2">
        {/* Upload area */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${dragOver ? 'border-foreground bg-accent/30' : 'border-border hover:border-foreground/40'}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />

          {uploading ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Compressing & uploading...</p>
              <div className="w-full bg-border rounded-full h-1.5">
                <div className="bg-foreground h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground">{progress}%</p>
            </div>
          ) : displayUrl ? (
            <div className="space-y-2">
              {isCurrentImage && (
                <img src={value || preview || ''} alt="Preview" className="max-h-32 mx-auto rounded object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
              )}
              {isCurrentVideo && (
                <video src={value || preview || ''} className="max-h-32 mx-auto rounded" muted controls={false} />
              )}
              {(displayUrl === 'pdf' || displayUrl?.endsWith('.pdf')) && (
                <div className="flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span className="text-xs text-muted-foreground">PDF uploaded</span>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground truncate max-w-xs mx-auto">{value}</p>
            </div>
          ) : (
            <div className="py-3">
              <svg className="mx-auto mb-2 text-muted-foreground" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p className="text-xs text-muted-foreground">Drop file or click to upload</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Images auto-compressed to WebP</p>
            </div>
          )}
        </div>

        {/* Library button */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="shrink-0 border-2 border-dashed border-border rounded-lg px-3 flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-300"
          title="Choose from media library"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          <span className="text-[8px] uppercase tracking-wider leading-tight text-center">Library</span>
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

      {value && (
        <button onClick={handleRemove} className="text-[10px] text-muted-foreground hover:text-red-400 mt-1 transition-colors">
          Remove file
        </button>
      )}

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => { onChange(url); setPickerOpen(false); }}
        accept={accept}
      />
    </div>
  );
};

export const MultiMediaUpload = ({ label, values, onChange, accept = 'image/*', maxSizeMB = 20 }: {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  accept?: string;
  maxSizeMB?: number;
}) => {
  const addUrl = (url: string) => onChange([...(values || []), url]);
  const removeUrl = (idx: number) => onChange((values || []).filter((_, i) => i !== idx));

  return (
    <div className="mb-3">
      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
      {(values || []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {values.map((url, i) => (
            <div key={i} className="relative group">
              <img src={url} alt="" className="w-16 h-12 object-cover rounded border border-border" onError={e => (e.currentTarget.src = '')} />
              <button onClick={() => removeUrl(i)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
          ))}
        </div>
      )}
      <MediaUpload label="" value="" onChange={addUrl} accept={accept} maxSizeMB={maxSizeMB} />
    </div>
  );
};
