/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Clock, Eye, UploadCloud, FolderPlus, Move, Trash2, Star, RefreshCw } from 'lucide-react';
import { ActivityLog } from '../types/explorer';

interface ActivityViewProps {
  activities: ActivityLog[];
}

export default function ActivityView({ activities }: ActivityViewProps) {
  const getActionDetails = (action: ActivityLog['action']) => {
    switch (action) {
      case 'viewed': 
        return { icon: Eye, color: 'text-blue-500 bg-blue-50', label: 'Viewed' };
      case 'uploaded': 
        return { icon: UploadCloud, color: 'text-emerald-500 bg-emerald-50', label: 'Uploaded' };
      case 'created_folder': 
        return { icon: FolderPlus, color: 'text-indigo-500 bg-indigo-50', label: 'Created folder' };
      case 'moved': 
        return { icon: Move, color: 'text-purple-500 bg-purple-50', label: 'Moved' };
      case 'deleted': 
        return { icon: Trash2, color: 'text-red-500 bg-red-50', label: 'Deleted' };
      case 'starred': 
        return { icon: Star, color: 'text-amber-500 bg-amber-50', label: 'Favorited' };
      case 'unstarred': 
        return { icon: Star, color: 'text-gray-400 bg-gray-50', label: 'Unfavorited' };
      case 'restored': 
        return { icon: RefreshCw, color: 'text-teal-500 bg-teal-50', label: 'Restored' };
      default: 
        return { icon: Clock, color: 'text-gray-500 bg-gray-50', label: 'Activity' };
    }
  };

  return (
    <div id="activity-view-card" className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
      <div>
        <h2 id="activity-title" className="text-lg font-bold text-[#0F172A]">Activity Logs</h2>
        <p id="activity-descr" className="text-xs text-[#64748B]">Review chronological asset state transitions and logs</p>
      </div>

      <div id="timeline" className="relative pl-6 border-l border-[#E2E8F0] space-y-6 ml-3">
        {activities.length === 0 ? (
          <div className="text-center text-xs text-[#94A3B8] py-8">
            No system activities recorded yet
          </div>
        ) : (
          activities.slice(0, 15).map((log) => {
            const { icon: Icon, color, label } = getActionDetails(log.action);
            return (
              <div key={log.id} className="relative group">
                {/* Timeline Ball indicator */}
                <div className={`absolute -left-[35px] top-1 w-7.5 h-7.5 rounded-full border border-white flex items-center justify-center shadow-sm ${color} z-10`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="text-xs">
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-semibold text-[#334155]">
                      {log.userName}{' '}
                      <span className="font-normal text-[#64748B]">
                        {label.toLowerCase()}{' '}
                        {log.targetType === 'folder' ? 'folder' : 'file'}{' '}
                        <span className="font-bold text-[#0F172A]">{log.targetName}</span>
                      </span>
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-bold whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-500 mt-1 font-semibold">{log.userId}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
