import React, { useState } from 'react';
import { BookOpen, Search, Filter, Grid, List, Sparkles } from 'lucide-react';
import { ResourceCard } from '../components/ResourceCard';
import { TeachingResource } from '../types';

interface ResourcesPageProps {
  resources: TeachingResource[];
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ resources }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [previewItem, setPreviewItem] = useState<TeachingResource | null>(null);

  const categories = ['Semua', 'Modul Ajar', 'Prota', 'Promes', 'KKTP', 'Bahan Ajar'];

  const filtered = resources.filter((r) => {
    const matchCat = selectedCategory === 'Semua' || r.category === selectedCategory;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Perangkat Ajar <span className="text-slate-400 font-normal">›</span> Pusat Kurikulum
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Repository Modul Ajar, ATP, Prota, Promes, dan KKTP terintegrasi Google Drive
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Matching Image 1 */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari dokumen perangkat ajar..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-full border border-transparent focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 border border-transparent focus:outline-none focus:border-amber-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'Semua' ? 'Semua Kategori' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills Matching Image 1 */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid Matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((res) => (
          <ResourceCard
            key={res.id}
            resource={res}
            onPreview={(item) => setPreviewItem(item)}
            onDownload={(item) => alert(`Mengunduh file: ${item.title} (${item.fileSize}) dari Google Drive...`)}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Pratinjau Dokumen
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
              <div><strong>Judul:</strong> {previewItem.title}</div>
              <div><strong>Kategori:</strong> {previewItem.category}</div>
              <div><strong>Jenjang:</strong> {previewItem.gradeLevel}</div>
              <div><strong>Ukuran Berkas:</strong> {previewItem.fileSize}</div>
              <div><strong>Google Drive ID:</strong> <code className="font-mono text-blue-500">{previewItem.driveFileId}</code></div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
