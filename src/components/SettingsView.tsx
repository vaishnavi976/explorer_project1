/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trash2, Shield, Eye, HelpCircle, Sparkles, HardDrive } from 'lucide-react';

interface SettingsViewProps {
  onClearStorage: () => void;
}

export default function SettingsView({ onClearStorage }: SettingsViewProps) {
  return (
    <div id="settings-view-container" className="max-w-2xl mx-auto space-y-6">
      {/* Visual Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 id="settings-headline" className="text-lg font-bold text-[#0F172A]">Settings & Workspace Configuration</h2>
          <p id="settings-subtitle" className="text-xs text-[#64748B]">Configure your active preferences and cloud storage parameters</p>
        </div>

        {/* Profile Details */}
        <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-2xl border border-[#EDF2F7]">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-white text-lg">
            VC
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0F172A]">Vaish Chaudhari</h4>
            <p className="text-xs text-[#64748B]">vaishchaudhari976@gmail.com</p>
            <span className="inline-block mt-1 text-[9px] uppercase tracking-wider bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md">
              Administrator
            </span>
          </div>
        </div>

        {/* Configurations List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] px-1">Storage Management</h3>
          
          <div className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-blue-200 transition-colors">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">Reset Database</h4>
                <p className="text-xs text-[#64748B] mt-0.5">Wipe all uploaded assets and restore layout presets.</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to restore default files? This action is irreversible.')) {
                  onClearStorage();
                }
              }}
              className="px-4 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer"
            >
              Wipe Data
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-blue-200 transition-colors">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">Access Policies</h4>
                <p className="text-xs text-[#64748B] mt-0.5">Manage public share keys and read permissions parameters.</p>
              </div>
            </div>
            <button
              disabled
              className="px-4 py-2 text-xs font-bold bg-[#F1F5F9] text-[#94A3B8] rounded-xl cursor-not-allowed"
            >
              Configured
            </button>
          </div>
        </div>

        {/* Interactive Stats Info banner */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-blue-800">Auto-Scaling Infrastructure</h5>
            <p className="text-[#475569]">
              Explorer leverages persistent high-performance cache configurations allowing offline synchronization of files up to 500MB without performance degradation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
