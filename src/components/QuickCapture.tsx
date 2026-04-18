'use client';

import { useState, useRef } from 'react';
import { Plus, X, Send, Camera } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function QuickCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleOpen = () => setIsOpen(true);
  
  const handleClose = () => {
    setIsOpen(false);
    setText('');
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;
    
    setIsSubmitting(true);
    let imageUrl = null;

    try {
      // 1. Upload Gambar Jika Ada Formulir
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('memory-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Ambil URL Publik
        const { data: publicUrlData } = supabase.storage
          .from('memory-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Simpan Memori ke Database Supabase
      const { error: dbError } = await supabase
        .from('memories')
        .insert([
          { 
            content: text,
            image_url: imageUrl,
            memory_date: new Date().toISOString().split('T')[0],
          }
        ]);

      if (dbError) throw dbError;

      // Haptic Feedback Web API
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }
      
      // Memberitahu Dashboard untuk memuat ulang data tanpa refresh halaman
      window.dispatchEvent(new Event('memory-added'));

      // Reset Form & Tutup Modal
      handleClose();

    } catch (error) {
      console.error('Gagal saat menyimpan memori:', error);
      alert('Gagal mengambil atau menyimpan memori!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 lg:hidden z-40 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center font-jakarta"
        aria-label="Quick Capture"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm font-jakarta animation-fade-in">
          <div className="absolute inset-0" onClick={handleClose} aria-hidden="true" />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden p-6 scale-up-center flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                Quick Capture
              </h3>
              <button 
                onClick={handleClose}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto w-full">
              {/* Image Preview Container */}
              {imagePreview && (
                <div className="relative w-full h-48 bg-zinc-100 rounded-xl overflow-hidden">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="kamu mau cerita apa hari ini?"
                className="w-full h-32 p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#8A9A5B] focus:border-transparent resize-none transition-all text-zinc-800 dark:text-zinc-100"
                disabled={isSubmitting}
                autoFocus
              />
              
              <div className="flex justify-between items-center mt-2">
                 <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 p-3 text-zinc-600 hover:text-[#8A9A5B] bg-zinc-100 hover:bg-[#8A9A5B]/10 rounded-xl font-medium transition-colors"
                  disabled={isSubmitting}
                  aria-label="Ambil Foto"
                >
                  <Camera className="w-5 h-5" />
                </button>

                {/* HTML5 Camera Input */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="submit"
                  disabled={(!text.trim() && !imageFile) || isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Menyimpan..." : "Simpan Cerita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
