import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface FileUploadProps {
  bucket: string;
  folder?: string;
  accept?: string;
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export default function FileUpload({ bucket, folder = 'uploads', accept = 'image/*', onUploadSuccess, currentImageUrl, label = 'Upload Image' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      
      setPreview(data.publicUrl);
      onUploadSuccess(data.publicUrl);
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      toast.error(`Error uploading file: ${error.message}`);
      console.error(error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-video flex items-center justify-center group max-w-sm">
          {accept.includes('image') ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-sm font-medium text-gray-500">File uploaded: {preview.split('/').pop()}</div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onUploadSuccess('');
              }}
              className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-accent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="mx-auto h-8 w-8 text-accent animate-spin" />
              <span className="mt-2 block text-sm font-semibold text-gray-900">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-semibold text-gray-900">Click to upload file</span>
              <span className="mt-1 block text-xs text-gray-500">{accept}</span>
            </div>
          )}
        </button>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
    </div>
  );
}
