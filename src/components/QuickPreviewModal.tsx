/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, FileText, Image, FileSpreadsheet, Video, Presentation, Archive, Music, File, Download, Link, Calendar, Shield } from 'lucide-react';
import { FileItem } from '../types/explorer';
import { formatBytes } from '../logic/storage';

interface QuickPreviewModalProps {
  file: FileItem;
  onClose: () => void;
}

export default function QuickPreviewModal({ file, onClose }: QuickPreviewModalProps) {
  const getPreviewIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'image': return Image;
      case 'sheet': return FileSpreadsheet;
      case 'video': return Video;
      case 'presentation': return Presentation;
      case 'archive': return Archive;
      case 'audio': return Music;
      default: return File;
    }
  };

  const Icon = getPreviewIcon(file.type);

  // Simulated visual content blocks depending on type
  const renderVisualContent = () => {
    switch (file.type) {
      case 'image':
        return (
          <div className="w-full h-48 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center p-2 relative overflow-hidden group">
            {/* Elegant high quality custom graphic */}
            <div className="absolute inset-0 bg-linear-to-tr from-emerald-50 to-emerald-100/50 opacity-40"></div>
            <div className="relative text-center p-4">
              <Image className="w-12 h-12 text-emerald-500 mx-auto mb-2 drop-shadow-xs" />
              <p className="text-xs font-bold text-[#334155]">{file.name}</p>
              <p className="text-[10px] text-[#64748B] mt-1">Image Asset File</p>
            </div>
            <div className="absolute bottom-2 right-2 bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
              PNG / SVG Active
            </div>
          </div>
        );
      case 'pdf':
      case 'document':
        return (
          <div className="w-full h-48 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex flex-col justify-between p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="space-y-2">
              <FileText className="w-9 h-9 text-red-500" />
              <h4 className="text-sm font-bold text-[#0F172A]">{file.name}</h4>
              <p className="text-[10px] leading-relaxed text-[#64748B]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
              </p>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#94A3B8] font-bold">
              <span>PAGE 1 OF 12</span>
              <span>CONFIDENTIAL</span>
            </div>
          </div>
        );
      case 'sheet':
        return (
          <div className="w-full h-48 bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden flex flex-col text-xs font-medium">
            <div className="bg-[#EBFFFA] text-emerald-800 border-b border-[#E2E8F0] py-2 px-3 flex justify-between items-center">
              <span className="font-bold flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Sheet Grid Workspace
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Active XLS</span>
            </div>
            {/* Grid display */}
            <div className="flex-1 grid grid-cols-4 grid-rows-4 divide-x divide-y divide-[#F1F5F9] text-center text-[#64748B] select-none text-[10px]">
              <div className="bg-[#F8FAFC] py-1 text-center font-bold text-[#334155]">A</div>
              <div className="bg-[#F8FAFC] py-1 text-center font-bold text-[#334155]">B</div>
              <div className="bg-[#F8FAFC] py-1 text-center font-bold text-[#334155]">C</div>
              <div className="bg-[#F8FAFC] py-1 text-center font-bold text-[#334155]">D</div>
              <div className="py-2">Row 1</div>
              <div className="py-2 text-[#0F172A] font-bold">$14,500</div>
              <div className="py-2 text-emerald-600 font-bold">+8.2%</div>
              <div className="py-2">Active</div>
              <div className="py-2">Row 2</div>
              <div className="py-2 text-[#0F172A] font-bold">$18,250</div>
              <div className="py-2 text-red-500 font-bold">-2.1%</div>
              <div className="py-2">Stale</div>
              <div className="py-2">Total</div>
              <div className="py-[#3px] text-[#0F172A] font-bold bg-[#F8FAFC] flex items-center justify-center">$32,750</div>
              <div className="py-[#3px] text-emerald-600 font-bold bg-[#F8FAFC] flex items-center justify-center">+6.1%</div>
              <div className="py-2 bg-[#F8FAFC]">Checked</div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-48 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center p-6 text-center">
            <Icon className="w-12 h-12 text-blue-500 mb-2.5" />
            <span className="text-xs font-bold text-[#334155]">{file.name}</span>
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1">{file.type} Asset format</span>
          </div>
        );
    }
  };

  return (
    <div id="quick-preview-overlay" className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div 
        id="quick-preview-box" 
        className="bg-white border border-[#E2E8F0] shadow-2xl rounded-3xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#F1F5F9]">
          <h3 className="text-base font-bold text-[#0F172A]">Quick File Preview</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {renderVisualContent()}

          {/* Metadata Block */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4.5 space-y-3.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#64748B] font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" />
                Created At
              </span>
              <span className="text-[#334155] font-semibold">{new Date(file.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748B] font-bold flex items-center gap-1.5">
                <File className="w-4 h-4 text-purple-500" />
                File Size
              </span>
              <span className="text-[#334155] font-semibold">{formatBytes(file.size, 2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748B] font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                Asset Security
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                Secured SSL
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://explorer.applet/share/${file.id}`);
                alert('Copied secure share link to clipboard!');
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-200 text-xs font-bold text-[#475569] hover:text-blue-700 rounded-xl transition-all cursor-pointer"
            >
              <Link className="w-4 h-4" />
              <span>Share Link</span>
            </button>
            <button
              onClick={() => alert('Simulated asset downloading started...')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-100 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
