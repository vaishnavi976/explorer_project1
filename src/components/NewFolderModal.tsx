/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

interface NewFolderModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function NewFolderModal({ onClose, onCreate }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    onCreate(folderName.trim());
  };

  return (
    <div id="new-folder-overlay" className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div 
        id="new-folder-modal-box" 
        className="bg-white border border-[#E2E8F0] shadow-2xl rounded-3xl max-w-sm w-full overflow-hidden"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#F1F5F9]">
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            <span>New Folder</span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] px-1 block mb-2">Folder name</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Q4 Reports"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none transition-colors"
              maxLength={40}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className="px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] text-white rounded-xl shadow-lg shadow-blue-100 disabled:shadow-none transition-all cursor-pointer"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
