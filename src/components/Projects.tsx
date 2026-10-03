import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Github, ExternalLink, Plus, Edit3, Trash2, FolderGit2, Terminal } from 'lucide-react';

export const Projects: React.FC = () => {
  const { data, isAdmin, openEditModal, showConfirm, deleteProject } = usePortfolio();

  return (
    <section id="projects" className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-600 dark:text-teal-400 font-mono">
              04. Software Artifacts
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
              Featured Projects
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xl">
              Curated implementations focusing on Object-Oriented design, persistent file systems, and core data structures.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => openEditModal('project')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Project</span>
            </button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {data.projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              {isAdmin && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
                  <button
                    onClick={() => openEditModal('project', project)}
                    className="p-1 text-zinc-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    title="Edit project"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      showConfirm('Delete Project', `Are you sure you want to delete "${project.title}"?`, () =>
                        deleteProject(project.id)
                      )
                    }
                    className="p-1 text-zinc-600 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                {/* Header Icon & Category */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200/60 dark:border-teal-900/40">
                    <Terminal className="w-4 h-4" />
                  </div>
                  {project.category && (
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      {project.category}
                    </span>
                  )}
                </div>

                {project.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-video bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Project Title */}
                <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              {/* Bottom: Tags & Links */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                {/* Tech Tags: Unboxed text with subtle typographic separators */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-4">
                  {project.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span className="text-teal-700 dark:text-teal-400 font-medium">{tag}</span>
                      {idx < project.tags.length - 1 && (
                        <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                    >
                      <span>Live Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
