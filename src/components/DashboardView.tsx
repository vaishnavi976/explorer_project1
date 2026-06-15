/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Clock, AlertCircle, HardDrive, ArrowUpRight } from 'lucide-react';
import { FileItem, FolderItem, FileTypeStat } from '../types/explorer';
import StorageOverview from './StorageOverview';
import FileCard from './FileCard';
import { formatBytes } from '../logic/storage';

interface DashboardViewProps {
  files: FileItem[];
  folders: FolderItem[];
  typeStats: FileTypeStat[];
  onToggleFavorite: (id: string, isFolder: boolean) => void;
  onTrash: (id: string, isFolder: boolean) => void;
  onView: (file: FileItem) => void;
  onViewChange: (view: 'files' | 'collections' | 'favorites' | 'recent') => void;
}

export default function DashboardView({
  files,
  folders,
  typeStats,
  onToggleFavorite,
  onTrash,
  onView,
  onViewChange,
}: DashboardViewProps) {
  // Extract lists and limits to prevent UI overflows
  const recentFiles = files
    .filter(f => !f.isTrash && f.isRecent)
    .sort((a, b) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime())
    .slice(0, 3);

  const favoriteFiles = files
    .filter(f => !f.isTrash && f.isFavorite)
    .slice(0, 3);

  const totalUsed = typeStats.reduce((sum, item) => sum + item.size, 0);
  const totalCapacity = 16106127360; // 15 GB

  return (
    <div id="dashboard-view-layout" className="space-y-6">
      {/* Welcome Banner */}
      <div id="dashboard-hero-banner" className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-100">
        <div>
          <span className="text-blue-100 font-bold uppercase tracking-wider text-xs">Dashboard</span>
          <h2 id="banner-title" className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">Welcome to Explorer</h2>
          <p id="banner-subtitle" className="text-blue-100 text-sm mt-1.5 max-w-lg">
            Manage, discover, and organize all your design, marketing, and business assets in one single workspace.
          </p>
        </div>
        <button
          onClick={() => onViewChange('files')}
          className="self-start md:self-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2.5 px-5 rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Browse Storage</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Storage Ring Chart + Quick Breakdown of file statistics */}
      <div id="dashboard-stats-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-full">
          <StorageOverview typeStats={typeStats} totalCapacity={totalCapacity} />
        </div>

        {/* Custom Type Charts (Statistics on File Types with Charts+) */}
        <div id="file-type-charts-card" className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Asset Statistics</h3>
              <p className="text-xs text-[#64748B]">Compare your active digital asset types</p>
            </div>
            <HardDrive className="w-5 h-5 text-blue-500" />
          </div>

          {/* Graphical Bar comparisons */}
          <div className="space-y-4">
            {typeStats.map(stat => {
              const filePercent = totalUsed > 0 ? Math.round((stat.size / totalUsed) * 100) : 0;
              return (
                <div key={stat.type} className="group flex items-center justify-between gap-4">
                  <div className="w-24 shrink-0 text-xs font-semibold text-[#475569]">{stat.label}</div>
                  
                  {/* Styled Bar Chart */}
                  <div className="flex-1 bg-[#F8FAFC] h-3 rounded-full relative overflow-hidden border border-[#EDF2F7]">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        backgroundColor: stat.color, 
                        width: `${Math.max(2, filePercent)}%` 
                      }}
                    ></div>
                  </div>

                  <div className="w-24 text-right shrink-0">
                    <span className="text-xs font-bold text-[#0F172A]">{formatBytes(stat.size)}</span>
                    <span className="text-[10px] text-[#94A3B8] font-bold ml-1">({filePercent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div id="dashboard-lists-row" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recently viewed */}
        <div id="recently-viewed-col" className="lg:col-span-6 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Recently Viewed Assets</span>
            </h3>
            <button onClick={() => onViewChange('recent')} className="text-xs text-blue-600 font-bold hover:underline">View all</button>
          </div>

          <div className="space-y-3">
            {recentFiles.length === 0 ? (
              <div className="bg-[#FAFCFF] border border-dashed border-[#CBD5E1] rounded-2xl p-6 text-center text-xs text-[#94A3B8]">
                <AlertCircle className="w-5 h-5 mx-auto mb-1 text-blue-300" />
                No files viewed recently
              </div>
            ) : (
              recentFiles.map(file => (
                <FileCard
                  key={file.id}
                  file={file}
                  onToggleFavorite={onToggleFavorite}
                  onTrash={onTrash}
                  onView={onView}
                />
              ))
            )}
          </div>
        </div>

        {/* Favorites list */}
        <div id="favorite-files-col" className="lg:col-span-6 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Starred Assets</span>
            </h3>
            <button onClick={() => onViewChange('favorites')} className="text-xs text-blue-600 font-bold hover:underline">View all</button>
          </div>

          <div className="space-y-3">
            {favoriteFiles.length === 0 ? (
              <div className="bg-[#FAFCFF] border border-dashed border-[#CBD5E1] rounded-2xl p-6 text-center text-xs text-[#94A3B8]">
                <Star className="w-5 h-5 mx-auto mb-1 text-amber-300" />
                Star your keys files to access them quickly
              </div>
            ) : (
              favoriteFiles.map(file => (
                <FileCard
                  key={file.id}
                  file={file}
                  onToggleFavorite={onToggleFavorite}
                  onTrash={onTrash}
                  onView={onView}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
