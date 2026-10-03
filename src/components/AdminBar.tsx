import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  ShieldAlert,
  Plus,
  FileUp,
  Download,
  Upload,
  RotateCcw,
  KeyRound,
  LogOut,
  Edit2,
} from 'lucide-react';

export const AdminBar: React.FC = () => {
  const {
    isAdmin,
    logoutAdmin,
    resetToDefault,
    exportDataJson,
    importDataJson,
    openEditModal,
    showConfirm,
  } = usePortfolio();

  if (!isAdmin) return null;

  return (
    <aside
      aria-label="Admin controls"
      className="fixed bottom-4 left-4 right-4 z-50 max-w-5xl mx-auto bg-zinc-900/95 dark:bg-zinc-900/95 backdrop-blur-md text-white border border-amber-500/40 rounded-xl px-4 py-3 shadow-2xl transition-all"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Admin Badge */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider block">
              Admin Mode Active
            </span>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              Changes persist in browser localStorage
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
          <button
            onClick={() => openEditModal('personal')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Edit hero & personal details"
          >
            <Edit2 className="w-3 h-3 text-amber-400" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => openEditModal('project')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Add a new project"
          >
            <Plus className="w-3 h-3 text-teal-400" />
            <span>Project</span>
          </button>

          <button
            onClick={() => openEditModal('experience')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Add experience item"
          >
            <Plus className="w-3 h-3 text-teal-400" />
            <span>Experience</span>
          </button>

          <button
            onClick={() => openEditModal('skill')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Add skill entry"
          >
            <Plus className="w-3 h-3 text-teal-400" />
            <span>Skill</span>
          </button>

          <button
            onClick={() => openEditModal('upload_resume')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Manage PDF Resume (Auto-generate or Upload custom PDF)"
          >
            <FileUp className="w-3 h-3 text-sky-400" />
            <span>PDF Resume</span>
          </button>

          <button
            onClick={exportDataJson}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Export portfolio data to a JSON backup file"
          >
            <Download className="w-3 h-3 text-zinc-400" />
            <span className="hidden md:inline">Export</span>
          </button>

          <label
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
            title="Import portfolio data from a JSON backup file"
          >
            <Upload className="w-3 h-3 text-zinc-400" />
            <span className="hidden md:inline">Import</span>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const content = reader.result as string;
                  const ok = importDataJson(content);
                  if (ok) {
                    alert('Portfolio data successfully imported and loaded!');
                  } else {
                    alert('Import failed: The JSON file does not match the portfolio schema.');
                  }
                };
                reader.readAsText(file);
                e.target.value = '';
              }}
            />
          </label>

          <button
            onClick={() => openEditModal('password')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Change Admin Password"
          >
            <KeyRound className="w-3 h-3 text-zinc-400" />
            <span className="hidden md:inline">Password</span>
          </button>

          <button
            onClick={() =>
              showConfirm(
                'Reset Portfolio Data',
                'Are you sure you want to reset all data back to original defaults? Any custom modifications will be replaced.',
                resetToDefault
              )
            }
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-red-950/80 text-zinc-300 hover:text-red-300 transition-colors"
            title="Reset to default data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-zinc-950 font-semibold transition-colors ml-1"
          >
            <LogOut className="w-3 h-3" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
