import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { DEFAULT_AVATAR } from '../data/profileImage';
import { GraduationCap, BookOpen, Award, Calendar, Edit3, Plus, Trash2 } from 'lucide-react';

export const About: React.FC = () => {
  const { data, isAdmin, openEditModal, showConfirm, deleteEducation } = usePortfolio();

  return (
    <section id="about" className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-600 dark:text-teal-400 font-mono">
              01. Background & Journey
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
              About Me
            </h2>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal('about')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Bio</span>
              </button>
              <button
                onClick={() => openEditModal('education')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Editorial Grid: Bio on Left, Education on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
          {/* Left Column: Personal Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs relative">
              {/* Author Photo & Identity Lockup */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 shrink-0 shadow-xs">
                  <img
                    src={data.personal.avatarUrl || DEFAULT_AVATAR}
                    alt={data.personal.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_AVATAR) {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {data.personal.name}
                  </h4>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                    Software Engineering Student · The Islamia University of Bahawalpur
                  </p>
                </div>
              </div>

              <h3 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-3">
                Software Engineering Focus & Foundations
              </h3>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-base sm:text-lg">
                {data.aboutText}
              </p>

              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-zinc-400 font-mono">Location</span>
                  <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{data.personal.location}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-zinc-400 font-mono">Status</span>
                  <span className="font-medium text-sm text-teal-600 dark:text-teal-400">Open to Internships</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-zinc-400 font-mono">Degree Term</span>
                  <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">2025 – 2029</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Education Block */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-display font-semibold text-xl text-zinc-900 dark:text-zinc-100">
                Education
              </h3>
            </div>

            <div className="space-y-4">
              {data.education.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs relative group"
                >
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-90">
                      <button
                        onClick={() => openEditModal('education', edu)}
                        className="p-1.5 text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                        title="Edit education entry"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          showConfirm(
                            'Delete Education',
                            `Are you sure you want to remove "${edu.degree}"?`,
                            () => deleteEducation(edu.id)
                          )
                        }
                        className="p-1.5 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                        title="Delete education entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 pr-12">
                    {edu.degree}
                  </h4>
                  <p className="text-sm font-medium text-teal-700 dark:text-teal-400 mt-1">
                    {edu.institution}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-3 font-mono">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {edu.period}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-zinc-800 dark:text-zinc-200 font-semibold">
                      <Award className="w-3 h-3 text-amber-500" />
                      GPA: {edu.gpa}
                    </span>
                  </div>

                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Relevant Coursework</span>
                      </div>
                      <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                        {edu.coursework.map((course, idx) => (
                          <React.Fragment key={course}>
                            <span className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                              {course}
                            </span>
                            {idx < edu.coursework.length - 1 && (
                              <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
