import React, { useState } from 'react';
import { StoryboardResponse } from '../types';
import { Icons } from '../constants';

interface MetadataViewProps {
  data: StoryboardResponse | null;
}

const CopyBlock: React.FC<{ label: string, text: string }> = ({ label, text }) => {
    const [copied, setCopied] = useState(false);
  
    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition-colors">
            <div className="px-6 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
                <button 
                    onClick={handleCopy}
                    className={`text-xs font-medium px-2 py-1 rounded transition-colors ${copied ? 'text-green-400' : 'text-zinc-500 hover:text-orange-500'}`}
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="p-6">
                <p className="text-zinc-200 text-lg whitespace-pre-line">{text}</p>
            </div>
        </div>
    )
}

const MetadataView: React.FC<MetadataViewProps> = ({ data }) => {
  if (!data) {
     return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <Icons.ChartBar className="w-16 h-16 opacity-20" />
        <p>Data belum tersedia.</p>
      </div>
    );
  }

  const descAndTags = `${data.metadata.description}\n\n${data.metadata.hashtags.join(' ')}`;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-zinc-200">Metadata Viral</h2>
        <p className="text-zinc-400">Optimasi untuk YouTube Shorts & TikTok.</p>
      </div>

      <div className="space-y-6">
        <CopyBlock 
            label="Viral Title (Clickbait)" 
            text={data.metadata.title} 
        />

        <CopyBlock 
            label="Description & Hashtags" 
            text={descAndTags} 
        />
        
        <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-4 flex gap-3 items-start">
             <div className="mt-1 text-orange-500">
                <Icons.Sparkles className="w-4 h-4" />
             </div>
             <p className="text-sm text-zinc-400">
                 Tips: Gunakan musik trending saat upload dan paste deskripsi di atas untuk menjangkau audiens lebih luas.
             </p>
        </div>
      </div>
    </div>
  );
};

export default MetadataView;