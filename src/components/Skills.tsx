import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillItem } from '../types/portfolio';
import { Terminal, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

export const Skills: React.FC = () => {
  const { data, isAdmin, openEditModal, showConfirm, deleteSkill } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Languages & Core', 'CS Fundamentals', 'Productivity & Office'];

  const filteredSkills =
    selectedCategory === 'all'
      ? data.skills
      : data.skills.filter((s) => s.category === selectedCategory);

  const getLevelBadgeColor = (level: SkillItem['level']) => {
    switch (level) {
      case 'Learning':
        return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50';
      case 'Intermediate':
        return 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/50';
      case 'Proficient':
        return 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900/50';
      case 'Advanced':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50';
      default:
        return 'text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800';
    }
  };

  return (
    <section id="skills" className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-600 dark:text-teal-400 font-mono">
              02. Technical Competencies
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
              Skills & Proficiencies
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => openEditModal('skill')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
                <button
                  onClick={() => openEditModal('note')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-200 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Note</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Category Filter Tabs (Interactive Segmented Control) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-fit mb-8 border border-zinc-200/80 dark:border-zinc-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {cat === 'all' ? 'All Skills' : cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs relative group flex flex-col justify-between"
            >
              {isAdmin && (
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => openEditModal('skill', skill)}
                    className="p-1 text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 rounded transition-colors"
                    title="Edit skill"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      showConfirm('Delete Skill', `Are you sure you want to delete "${skill.name}"?`, () =>
                        deleteSkill(skill.id)
                      )
                    }
                    className="p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                    title="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2 pr-12">
                  <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-zinc-100">
                    {skill.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-mono font-medium rounded-sm ${getLevelBadgeColor(
                      skill.level
                    )}`}
                  >
                    {skill.level}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {skill.category}
                  </span>
                </div>
              </div>

              {/* Honest Level Visual Meter */}
              <div className="mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1">
                  <span>Proficiency index</span>
                  <span className="tabular-nums">{skill.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${skill.percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Python Practical Learning Highlight Callout */}
        <div className="bg-zinc-900 text-zinc-100 dark:bg-zinc-900 dark:border-teal-900/50 p-6 sm:p-8 rounded-xl border border-zinc-800 relative overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="p-3 bg-teal-950/80 text-teal-400 rounded-lg border border-teal-800/50 shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Python Practical Learning & Implementation
                </h3>
                <span className="text-xs font-mono text-teal-400 font-medium hidden sm:inline">
                  [Hands-on Focus]
                </span>
              </div>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                {data.pythonLearningNote}
              </p>
              <div className="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Control Flow & Loops
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Modular Functions & OOP
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> File Handling (I/O)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Custom DSA in Python
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
