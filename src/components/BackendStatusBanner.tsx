import React from 'react';
import { isBackendConfigured } from '../services/api.js';
import { AlertTriangle, CheckCircle2, Cloud } from 'lucide-react';
import { APP_CONFIG } from '../config/config.js';

export const BackendStatusBanner: React.FC = () => {
  const configured = isBackendConfigured();

  if (configured) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/60 px-4 py-2 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Terhubung ke Backend GAS:</strong> Siap membaca & menulis data ke Google Sheets & Google Drive.
          </span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
          {APP_CONFIG.DATABASE.PROVIDER}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-4 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong>Mode Simulasi Aktif:</strong> URL Google Apps Script belum dikonfigurasi di{' '}
          <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">src/config/config.js</code>. Seluruh data & aksi berjalan di memori lokal.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-[11px] bg-amber-200/70 dark:bg-amber-900/60 px-2 py-0.5 rounded-full text-amber-900 dark:text-amber-100">
          <Cloud className="w-3 h-3" /> DEMO SIMULATION
        </span>
      </div>
    </div>
  );
};
