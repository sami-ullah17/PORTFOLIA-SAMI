import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Calendar, MapPin, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

export const Experience: React.FC = () => {
  const { data, isAdmin, openEditModal, showConfirm, deleteExperience } = usePortfolio();

  return (
    <section
      id="experience"
      className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-600 dark:text-teal-400 font-mono">
              03. Career & Practical Training
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
              Experience
            </h2>
          </div>

          {isAdmin && (
            <button
              onClick={() => openEditModal('experience')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience</span>
            </button>
          )}
        </div>

        {/* Timeline Layout */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-10">
          {data.experience.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-teal-600 dark:border-teal-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
              </div>

              {/* Experience Card */}
              <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs relative">
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal('experience', item)}
                      className="p-1.5 text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 rounded transition-colors"
                      title="Edit experience"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        showConfirm(
                          'Delete Experience',
                          `Are you sure you want to delete "${item.role}" at ${item.organization}?`,
                          () => deleteExperience(item.id)
                        )
                      }
                      className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                      title="Delete experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="pr-12">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wide font-mono">
                    <Briefcase className="w-3.5 h-3.5" />
                    Internship
                  </span>
                  <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-50 mt-1">
                    {item.role}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-zinc-700 dark:text-zinc-300 mt-1">
                    {item.organization}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-3 font-mono">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    {item.period}
                  </span>
                  {item.location && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        {item.location}
                      </span>
                    </>
                  )}
                </div>

                {/* Bullet Highlights */}
                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
