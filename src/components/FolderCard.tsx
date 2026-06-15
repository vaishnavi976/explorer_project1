/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Folder, MoreVertical, Star, Trash2, FolderOpen } from 'lucide-react';
import { FolderItem } from '../types/explorer';

interface FolderCardProps {
  key?: string | number;
  folder: FolderItem;
  onDoubleClick: (folderId: string) => void;
  onToggleFavorite: (id: string, isFolder: boolean) => void;
  onTrash: (id: string, isFolder: boolean) => void;
  onMoveItem: (itemId: string, isFolder: boolean, targetFolderId: string | null) => void;
}

export default function FolderCard({
  folder,
  onDoubleClick,
  onToggleFavorite,
  onTrash,
  onMoveItem,
}: FolderCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const { itemId, isFolder } = JSON.parse(dataStr);
        // Prevent moving folder into itself
        if (isFolder && itemId === folder.id) return;
        onMoveItem(itemId, isFolder, folder.id);
      }
    } catch (err) {
      console.error('Failed to handle drop', err);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ itemId: folder.id, isFolder: true }));
  };

  return (
    <div
      id={`folder-card-${folder.id}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={() => onDoubleClick(folder.id)}
      className={`group relative bg-white border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
        isDragOver 
          ? 'border-blue-500 bg-blue-50/50 scale-[1.02] shadow-sm' 
          : 'border-[#E2E8F0] hover:border-blue-400 hover:shadow-[#EFF6FF] hover:shadow-lg'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
          isDragOver ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
        }`}>
          {isDragOver ? <FolderOpen className="w-5.5 h-5.5" /> : <Folder className="w-5.5 h-5.5 fill-blue-600/10" />}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#0F172A] truncate group-hover:text-blue-600 transition-colors">
            {folder.name}
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
            Folder
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
        {folder.isFavorite && (
          <button 
            onClick={() => onToggleFavorite(folder.id, true)}
            className="p-1.5 text-amber-500 hover:bg-[#F8FAFC] rounded-lg transition-colors"
          >
            <Star className="w-4 h-4 fill-amber-500" />
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)}></div>
              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E2E8F0] shadow-xl rounded-xl p-1 z-40">
                <button
                  onClick={() => {
                    onToggleFavorite(folder.id, true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#334155] hover:bg-[#F8FAFC] rounded-lg text-left"
                >
                  <Star className={`w-4 h-4 ${folder.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-[#64748B]'}`} />
                  <span>{folder.isFavorite ? 'Unfavorite' : 'Add to Favorite'}</span>
                </button>
                <div className="h-[1px] bg-[#F1F5F9] my-1"></div>
                <button
                  onClick={() => {
                    onTrash(folder.id, true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#EF4444] hover:bg-red-50 hover:text-red-600 rounded-lg text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Move to Trash</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
