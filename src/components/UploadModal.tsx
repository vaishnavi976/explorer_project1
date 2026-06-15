/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Upload, File, AlertCircle, Sparkles } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (name: string, size: number) => void;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [fileName, setFileName] = useState('');
  const [fileSizeMB, setFileSizeMB] = useState('2.5');
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle local form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;
    const sizeInBytes = parseFloat(fileSizeMB) * 1024 * 1024;
    onUpload(fileName.trim(), sizeInBytes);
  };

  // Handle real OS file drop!
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Automatically trigger upload of the drag-and-dropped file!
      onUpload(file.name, file.size);
    }
  };

  // Quick preset templates
  const presets = [
    { name: 'Pitch_Deck_V2.pptx', size: 14500000 },
    { name: 'homepage_hero.png', size: 4800000 },
    { name: 'User_Research.docx', size: 1200000 },
    { name: 'Financials_Q4.xlsx', size: 3100000 },
  ];

  return (
    <div id="upload-modal-overlay" className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div 
        id="upload-modal-box" 
        className="bg-white border border-[#E2E8F0] shadow-2xl rounded-3xl max-w-md w-full overflow-hidden transition-all transform scale-100"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-[#F1F5F9]">
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Upload Assets</span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form & Drop Zone */}
        <div className="p-6 space-y-5">
          {/* Real OS Drag & Drop Box */}
          <div
            id="drag-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
                : 'border-[#CBD5E1] hover:border-blue-400 hover:bg-[#FAFCFF]'
            }`}
          >
            <Upload className={`w-8 h-8 mx-auto mb-2 transition-transform ${isDragOver ? 'scale-110 text-blue-600' : 'text-blue-500'}`} />
            <p className="text-sm font-bold text-[#334155]">Drag & Drop files here</p>
            <p className="text-xs text-[#64748B] mt-1">Accepts images, videos, documents, PDFs, zip archives</p>
            <span className="inline-block bg-blue-50 font-bold text-blue-700 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full mt-3">
              Or pick preset below
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] px-1 block">Quick presets</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onUpload(preset.name, preset.size)}
                  className="px-3 py-2 text-left bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-200 rounded-xl text-xs font-semibold text-[#475569] hover:text-blue-700 truncate transition-all cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#475569] bg-amber-50/50 border border-amber-200 rounded-xl p-3">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Files dropped directly from your native computer file explorer will sync automatically into your Explorer drive!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
