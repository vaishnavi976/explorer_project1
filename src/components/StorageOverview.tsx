/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileTypeStat } from '../types/explorer';
import { formatBytes } from '../logic/storage';

interface StorageOverviewProps {
  typeStats: FileTypeStat[];
  totalCapacity: number;
}

export default function StorageOverview({
  typeStats,
  totalCapacity,
}: StorageOverviewProps) {
  // Calculate total used
  const totalUsed = typeStats.reduce((sum, item) => sum + item.size, 0);
  const usedPercent = Math.min(100, Math.round((totalUsed / totalCapacity) * 100));

  // Sort and pick top categories for preview
  const activeStats = typeStats.filter(stat => stat.size > 0);

  // SVG parameters for circle progress
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (usedPercent / 100) * circumference;

  return (
    <div id="storage-overview-card" className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div id="storage-header" className="flex justify-between items-start mb-6">
        <div>
          <h2 id="storage-headline" className="text-base font-bold text-[#0F172A]">Storage Overview</h2>
          <p id="storage-descr" className="text-xs text-[#64748B] mt-0.5">Check your current usage distribution</p>
        </div>
        <span id="storage-percent-tag" className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {usedPercent}% Full
        </span>
      </div>

      <div id="storage-visualizer" className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        {/* Circle Ring Progress using SVG */}
        <div id="storage-progress-[svg]" className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="url(#blue-gradient)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <span id="used-count" className="block text-xl font-extrabold text-[#0F172A]">{formatBytes(totalUsed, 1)}</span>
            <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">of {formatBytes(totalCapacity, 0)}</span>
          </div>
        </div>

        {/* Breakdown bar tags */}
        <div id="storage-stats-legend" className="flex-1 w-full space-y-2">
          {activeStats.length === 0 ? (
            <p className="text-xs text-center text-[#94A3B8] font-medium py-4">No cloud files imported yet</p>
          ) : (
            activeStats.slice(0, 4).map((stat) => {
              const filePercent = Math.max(1, Math.round((stat.size / totalCapacity) * 100));
              return (
                <div key={stat.type} id={`legend-item-${stat.type}`} className="text-sm">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-[#334155] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }}></span>
                      {stat.label}
                    </span>
                    <span className="text-[#64748B] font-medium">{formatBytes(stat.size)} ({filePercent}%)</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ backgroundColor: stat.color, width: `${filePercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
          {activeStats.length > 4 && (
            <div className="text-[11px] text-blue-600 font-semibold text-right hover:underline cursor-pointer">
              + {activeStats.length - 4} more categories
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
