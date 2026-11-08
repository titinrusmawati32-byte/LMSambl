import React from 'react';
import { FileText, Download, Eye, FileSpreadsheet, FileCode } from 'lucide-react';
import { TeachingResource } from '../types';

interface ResourceCardProps {
  resource: TeachingResource;
  onPreview: (res: TeachingResource) => void;
  onDownload: (res: TeachingResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onPreview,
  onDownload,
}) => {
  const isPdf = resource.fileType === 'pdf';
  const isDoc = resource.fileType === 'doc';
  const isXls = resource.fileType === 'xls';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between group">
      <div>
        {/* Top File Icon Matching Image 1 */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
              isPdf
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                : isDoc
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
            }`}
          >
            {isPdf ? (
              <FileText className="w-6 h-6 text-rose-500" />
            ) : isDoc ? (
              <FileCode className="w-6 h-6 text-blue-500" />
            ) : (
              <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
            )}
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {resource.fileSize}
          </span>
        </div>

        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug mb-1 group-hover:text-blue-600 transition-colors">
          {resource.title}
        </h4>
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4">
          <span>{resource.gradeLevel}</span>
          <span>•</span>
          <span>{resource.subject}</span>
        </div>
      </div>

      {/* Buttons Matching Image 1 */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <button
          onClick={() => onPreview(resource)}
          className="py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
        <button
          onClick={() => onDownload(resource)}
          className="py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-blue-600/30"
        >
          <Download className="w-3.5 h-3.5" /> Download
        </button>
      </div>
    </div>
  );
};
