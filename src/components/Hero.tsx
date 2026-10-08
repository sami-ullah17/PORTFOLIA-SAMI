import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { downloadResume } from '../utils/resumeGenerator';
import { DEFAULT_AVATAR } from '../data/profileImage';
import {
  ArrowDown,
  FileDown,
  Github,
  MapPin,
  Mail,
  Edit3,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, isAdmin, openEditModal } = usePortfolio();
  const { personal, education } = data;
  const currentEdu = education[0];
  const [imageError, setImageError] = useState(false);

  const displayAvatar = personal.avatarUrl || DEFAULT_AVATAR;

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projSection = document.querySelector('#projects');
    if (projSection) {
      projSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Section Control */}
        {isAdmin && (
          <div className="mb-6 flex justify-end gap-2">
            <button
              onClick={() => openEditModal('personal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile Details</span>
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout: Text on Left, Portrait Frame on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Info (Col 7 / 8) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            {/* Status kicker: Clean unboxed metadata with typographic dot */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-5">
              <span className="inline-flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-semibold tracking-wide uppercase text-xs">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                Undergraduate Portfolio
              </span>
              <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {personal.location}
              </span>
              {currentEdu && (
                <>
                  <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span>The Islamia University of Bahawalpur</span>
                </>
              )}
            </div>

            {/* Name Display */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.08] mb-5 text-balance">
              {personal.name}
            </h1>

            {/* Subtitle / Role */}
            <p className="text-lg sm:text-xl font-semibold text-teal-700 dark:text-teal-400 mb-4 tracking-tight font-display">
              {personal.roleTitle}
            </p>

            {/* Short Intro */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8 max-w-2xl">
              {personal.headlineIntro}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a
                href="#projects"
                onClick={handleScrollToProjects}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 dark:text-zinc-950 rounded-lg transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                <span>View Projects</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={() => downloadResume(data)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                <FileDown className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Social Links & Direct Contacts */}
            <div className="flex items-center gap-5 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 font-mono">
                Connect
              </span>

              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  aria-label="GitHub profile (opens in new tab)"
                >
                  <Github className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}

              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  aria-label="Send direct email"
                >
                  <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Profile Picture Frame (Col 4) */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-start lg:items-end">
            <div className="relative group">
              <div className="w-44 h-44 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-md relative">
                {displayAvatar && !imageError ? (
                  <img
                    src={displayAvatar}
                    alt={personal.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_AVATAR) {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      } else {
                        setImageError(true);
                      }
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-teal-600 dark:text-teal-400">
                    <span className="font-display font-extrabold text-4xl sm:text-5xl text-zinc-700 dark:text-zinc-300">
                      SU
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
                      Sami Ullah
                    </span>
                  </div>
                )}
              </div>

              {/* Status indicator on avatar */}
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-1.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
