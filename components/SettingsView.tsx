import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

const SettingsView: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('zumbi_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem('zumbi_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem('zumbi_api_key');
    setApiKey('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-zinc-200">Settings</h2>
        <p className="text-zinc-400">Konfigurasi sistem Zumbi Gen.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
                <Icons.Cog className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1 space-y-1">
                <h3 className="text-lg font-medium text-zinc-200">Gemini API Key</h3>
                <p className="text-sm text-zinc-400">
                    Masukkan API Key pribadi Anda untuk menggunakan layanan ini.
                    Key disimpan secara lokal di browser Anda.
                </p>
            </div>
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">API Key String</label>
            <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-orange-500 transition-colors"
            />
        </div>

        <div className="flex items-center gap-4 pt-2">
            <button
                onClick={handleSave}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold rounded-lg transition-colors"
            >
                {saved ? 'Tersimpan!' : 'Simpan Konfigurasi'}
            </button>
            {apiKey && (
                <button
                    onClick={handleClear}
                    className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors"
                >
                    Hapus Key
                </button>
            )}
        </div>
      </div>
      
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <p className="text-xs text-zinc-500 text-center">
            Zumbi Gen v1.0 • Powered by Google Gemini 2.0 Flash
        </p>
      </div>
    </div>
  );
};

export default SettingsView;