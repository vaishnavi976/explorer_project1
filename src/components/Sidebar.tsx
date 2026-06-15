/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  Files, 
  Clock, 
  Star, 
  Trash2, 
  History, 
  Settings, 
  Plus,
  FolderPlus,
  UploadCloud,
  Layers
} from 'lucide-react';
import { ActiveSection } from '../types/explorer';

interface SidebarProps {
  activeView: ActiveSection;
  onViewChange: (view: ActiveSection) => void;
  onNewFolderClick: () => void;
  onUploadClick: () => void;
}

export default function Sidebar({
  activeView,
  onViewChange,
  onNewFolderClick,
  onUploadClick,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'files', label: 'My Files', icon: Files },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'activity', label: 'Activity Logs', icon: History },
    { id: 'trash', label: 'Trash', icon: Trash2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside id="sidebar-container" className="w-64 bg-white border-r border-[#E2E8F0] h-screen flex flex-col fixed left-0 top-0 z-20">
      {/* Brand Header */}
      <div id="sidebar-brand-header" className="p-6 flex items-center gap-3 border-b border-[#F1F5F9]">
        <div id="brand-logo-container" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-100">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div>
          <h1 id="brand-title" className="text-xl font-bold text-[#0F172A] tracking-tight">Explorer</h1>
          <span id="brand-subtitle" className="text-xs font-medium text-blue-600">Digital Assets</span>
        </div>
      </div>

      {/* Action CTA Button */}
      <div id="sidebar-cta-container" className="p-4">
        <div id="create-new-dropdown" className="relative group">
          <button
            id="btn-create-new"
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all cursor-pointer duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>New Asset</span>
          </button>
          
          <div id="create-dropdown-menu" className="absolute left-0 mt-2 w-full bg-white rounded-xl border border-[#E2E8F0] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 p-1">
            <button
              id="btn-sub-new-folder"
              onClick={onNewFolderClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#334155] hover:bg-[#F8FAFC] hover:text-blue-600 rounded-lg transition-colors text-left"
            >
              <FolderPlus className="w-4 h-4 text-blue-500" />
              <span>New Folder</span>
            </button>
            <button
              id="btn-sub-upload"
              onClick={onUploadClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#334155] hover:bg-[#F8FAFC] hover:text-blue-600 rounded-lg transition-colors text-left"
            >
              <UploadCloud className="w-4 h-4 text-blue-500" />
              <span>Upload File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <nav id="sidebar-navigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              id={`nav-link-${item.id}`}
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-[#94A3B8]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Cloud Drive Style Bottom Bar */}
      <div id="sidebar-footer-info" className="p-4 border-t border-[#F1F5F9] bg-[#FAFCFF]">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className="text-xs font-semibold text-[#334155]">Active Storage</span>
        </div>
        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '64%' }}></div>
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-[#64748B] font-medium">
          <span>9.6 GB used</span>
          <span>15 GB total</span>
        </div>
      </div>
    </aside>
  );
}
