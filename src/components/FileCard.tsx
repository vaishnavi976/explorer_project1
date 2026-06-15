/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, ImageIcon, FileSpreadsheet, Video, Presentation, Archive, Music, File, 
  MoreVertical, Star, Trash2, Eye, RefreshCw 
} from 'lucide-react';
import { FileItem, FileType } from '../types/explorer';
import { formatBytes } from '../logic/storage';

interface FileCardProps {
  key?: string | number;
  file: FileItem;
  viewMode?: 'grid' | 'list';
  onToggleFavorite: (id: string, isFolder: boolean) => void;
  onTrash: (id: string, isFolder: boolean) => void;
  onRestore?: (id: string, isFolder: boolean) => void;
  onDeletePermanent?: (id: string, isFolder: boolean) => void;
  onView: (file: FileItem) => void;
}

export default function FileCard({
  file,
  viewMode = 'grid',
  onToggleFavorite,
  onTrash,
  onRestore,
  onDeletePermanent,
  onView,
}: FileCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getFileIcon = (type: FileType) => {
    const icons: Record<FileType, { icon: any, bg: string }> = {
      pdf: { icon: FileText, bg: 'bg-red-50 text-red-600' },
      image: { icon: ImageIcon || File, bg: 'bg-emerald-50 text-emerald-600' },
      sheet: { icon: FileSpreadsheet, bg: 'bg-green-50 text-green-600' },
      document: { icon: FileText, bg: 'bg-blue-50 text-blue-600' },
      video: { icon: Video, bg: 'bg-purple-50 text-purple-600' },
      presentation: { icon: Presentation, bg: 'bg-amber-50 text-amber-600' },
      archive: { icon: Archive, bg: 'bg-gray-100 text-gray-600' },
      audio: { icon: Music, bg: 'bg-pink-50 text-pink-600' },
      other: { icon: File, bg: 'bg-slate-100 text-slate-600' }
    };
    return icons[type] || icons.other;
  };

  const { icon: Icon, bg: iconBg } = getFileIcon(file.type);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ itemId: file.id, isFolder: false }));
  };

  if (viewMode === 'list') {
    return (
      <div
        id={`file-list-row-${file.id}`}
        draggable
        onDragStart={handleDragStart}
        className="w-full flex items-center justify-between py-2.5 px-4 bg-white border border-[#E2E8F0] hover:border-blue-300 hover:bg-[#FAFCFF] rounded-xl transition-all text-xs"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-[#0F172A] truncate hover:text-blue-600 cursor-pointer" onClick={() => onView(file)}>
            {file.name}
          </span>
        </div>
        <div className="w-24 text-right text-[#64748B] font-medium shrink-0">{formatBytes(file.size)}</div>
        <div className="w-32 text-right text-[#64748B] shrink-0 font-medium hidden md:block">{new Date(file.createdAt).toLocaleDateString()}</div>
        <div className="flex items-center gap-1.5 ml-4 shrink-0" onClick={e => e.stopPropagation()}>
          {file.isTrash ? (
            <>
              {onRestore && <button onClick={() => onRestore(file.id, false)} className="p-1 hover:bg-[#F1F5F9] text-[#64748B] rounded-lg"><RefreshCw className="w-3.5 h-3.5" /></button>}
              {onDeletePermanent && <button onClick={() => onDeletePermanent(file.id, false)} className="p-1 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>}
            </>
          ) : (
            <>
              <button onClick={() => onToggleFavorite(file.id, false)} className="p-1 hover:bg-[#F1F5F9] rounded-lg"><Star className={`w-3.5 h-3.5 ${file.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-[#94A3B8]'}`} /></button>
              <button onClick={() => onView(file)} className="p-1 hover:bg-[#F1F5F9] text-[#64748B] rounded-lg"><Eye className="w-3.5 h-3.5" /></button>
              <button onClick={() => onTrash(file.id, false)} className="p-1 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id={`file-card-${file.id}`}
      draggable
      onDragStart={handleDragStart}
      className="group relative bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-[#EFF6FF] hover:shadow-lg transition-all duration-200"
    >
      <div className="flex justify-between items-start gap-2 mb-3.5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
        
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          {file.isFavorite && !file.isTrash && (
            <button onClick={() => onToggleFavorite(file.id, false)} className="p-1 text-amber-500 rounded-lg"><Star className="w-4 h-4 fill-amber-500" /></button>
          )}

          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 hover:bg-[#F8FAFC] text-[#64748B] rounded-lg cursor-pointer"><MoreVertical className="w-4.5 h-4.5" /></button>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E2E8F0] shadow-xl rounded-xl p-1 z-40">
                  {file.isTrash ? (
                    <>
                      {onRestore && <button onClick={() => { onRestore(file.id, false); setIsMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[#F8FAFC] rounded-lg text-left"><RefreshCw className="w-4 h-4 text-blue-500" /><span>Restore File</span></button>}
                      {onDeletePermanent && <button onClick={() => { onDeletePermanent(file.id, false); setIsMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg text-left"><Trash2 className="w-4 h-4" /><span>Delete Permanently</span></button>}
                    </>
                  ) : (
                    <>
                      <button onClick={() => { onView(file); setIsMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[#F8FAFC] rounded-lg text-left"><Eye className="w-4 h-4 text-blue-500" /><span>Quick Preview</span></button>
                      <button onClick={() => { onToggleFavorite(file.id, false); setIsMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[#F8FAFC] rounded-lg text-left"><Star className={`w-4 h-4 ${file.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-[#64748B]'}`} /><span>{file.isFavorite ? 'Unfavorite' : 'Favorite'}</span></button>
                      <div className="h-[1px] bg-[#F1F5F9] my-1"></div>
                      <button onClick={() => { onTrash(file.id, false); setIsMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#EF4444] hover:bg-red-50 rounded-lg text-left"><Trash2 className="w-4 h-4" /><span>Move to Trash</span></button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="min-w-0" onClick={() => onView(file)}>
        <h3 className="text-sm font-semibold text-[#0F172A] truncate group-hover:text-blue-600 cursor-pointer">{file.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">{file.type}</span>
          <span className="w-1 h-1 rounded-full bg-[#E2E8F0]"></span>
          <span className="text-xs text-[#64748B] font-medium">{formatBytes(file.size)}</span>
        </div>
      </div>
    </div>
  );
}
