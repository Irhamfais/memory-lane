'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle2, Circle, Clock, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Memory {
  id: string;
  title: string;
  content: string;
  image_url: string;
  memory_date: string;
  is_delivered: boolean;
  showParticles?: boolean;
}

const ParticleBurst = ({ active }: { active: boolean }) => {
  if (!active) return null;
  const particles = Array.from({ length: 8 });
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const rad = angle * (Math.PI / 180);
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#8A9A5B]"
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 0],
              x: Math.cos(rad) * 40,
              y: Math.sin(rad) * 40,
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
};

export default function DashboardPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMemories();

    // Dengar tangkapan sinyal dari komponen QuickCapture
    const handleNewMemory = () => fetchMemories();
    window.addEventListener('memory-added', handleNewMemory);
    
    return () => {
      window.removeEventListener('memory-added', handleNewMemory);
    };
  }, []);

  async function fetchMemories() {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(error);
    }
    if (data) setMemories(data);
    setIsLoading(false);
  }

  const toggleDelivered = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI update
    setMemories(memories.map(m => m.id === id ? { ...m, is_delivered: newStatus, showParticles: newStatus } : m));

    // Matikan partikel setelah animasi selesai (600ms)
    if (newStatus) {
      setTimeout(() => {
        setMemories(prev => prev.map(m => m.id === id ? { ...m, showParticles: false } : m));
      }, 600);
    }

    const { error } = await supabase
      .from('memories')
      .update({ is_delivered: newStatus })
      .eq('id', id);

    if (error) {
      alert("Gagal mengupdate status cerita.");
      fetchMemories(); // revert on fail
    }
  };

  if (isLoading) return <div className="p-8 text-center font-lora">Memuat Story Queue...</div>;

  return (
    <div className="max-w-3xl mx-auto w-full p-6 pt-12 pb-24">
      <h1 className="text-4xl font-bold font-lora mb-2 text-[#8A9A5B]">Story Queue</h1>
      <p className="text-zinc-500 mb-8 font-lora text-lg">Haii Nomi Sayang, disini kamu bisa ceritain semua yang kamu lakukan tanpa khawatir kamu bakal lupa, aku harap website ini bisa berguna yahhh.</p>

      <div className="flex flex-col gap-4">
        {memories.length === 0 ? (
          <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700">
            <p className="text-zinc-400 font-lora text-lg">Belum ada cerita niii. klik tombol + di bawah kalo nomi sayang punya cerita baru!</p>
          </div>
        ) : (
          <AnimatePresence>
            {memories.map((memory) => (
              <motion.div 
                key={memory.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: memory.is_delivered ? 0.45 : 1, 
                  scale: memory.is_delivered ? 0.98 : 1,
                  y: 0 
                }}
                transition={{ duration: 0.4 }}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start gap-4 ${
                  memory.is_delivered 
                    ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800' 
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="relative mt-1 flex-shrink-0">
                  <button 
                    onClick={() => toggleDelivered(memory.id, memory.is_delivered)}
                    className="focus:outline-none relative z-20"
                    aria-label="Tandai tersampaikan"
                  >
                    {memory.is_delivered ? (
                      <CheckCircle2 className="w-7 h-7 text-[#8A9A5B]" />
                    ) : (
                      <Circle className="w-7 h-7 text-zinc-300 dark:text-zinc-600 hover:text-[#8A9A5B] transition-colors" />
                    )}
                  </button>
                  <ParticleBurst active={!!memory.showParticles} />
                </div>

                <div className="flex-1 font-lora">
                <h3 className={`text-xl font-bold ${memory.is_delivered ? 'line-through text-zinc-500' : 'text-zinc-800 dark:text-zinc-100'}`}>
                  {memory.title}
                </h3>
                {memory.content && (
                  <p className="text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed text-lg">
                    {memory.content}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4 text-sm font-medium text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-300" />
                    <span>{memory.memory_date ? new Date(memory.memory_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Hari ini'}</span>
                  </div>
                  {memory.image_url && (
                    <div className="flex items-center gap-1.5 text-[#8A9A5B]">
                      <ImageIcon className="w-4 h-4" />
                      <span>Ada Foto</span>
                    </div>
                  )}
                </div>
              </div>

              {memory.image_url && (
                <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden mt-4 md:mt-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={memory.image_url} alt="Memory" className="w-full h-full object-cover" />
                </div>
              )}
            </motion.div>
          ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
