import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { downloadResume } from '../utils/resumeGenerator';
import {
  ArrowDown,
  FileDown,
  Github,
  MapPin,
  Mail,
  Camera,
  Upload,
  Check,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, isAdmin, openEditModal, updatePersonal } = usePortfolio();
  const { personal, education } = data;
  const currentEdu = education[0];
  const [imageError, setImageError] = useState(false);
  const [uploadToast, setUploadToast] = useState(false);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  // Sync any uploaded base64 photo to server permanently
  useEffect(() => {
    if (personal.avatarUrl && personal.avatarUrl.startsWith('data:image/')) {
      fetch('/api/save-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: personal.avatarUrl }),
      }).catch(() => {});
    }
  }, [personal.avatarUrl]);

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projSection = document.querySelector('#projects');
    if (projSection) {
      projSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDirectPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      updatePersonal({
        ...personal,
        avatarUrl: base64,
      });
      setImageError(false);
      setUploadToast(true);
      setTimeout(() => setUploadToast(false), 5000);

      try {
        await fetch('/api/save-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });
      } catch (err) {
        console.warn('Saved to localStorage, server sync failed:', err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
              <Camera className="w-3.5 h-3.5" />
              <span>Change Photo & Details</span>
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
              <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-md relative">
                {personal.avatarUrl && !imageError ? (
                  <img
                    src={personal.avatarUrl}
                    alt={personal.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
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

                {/* Direct Click to Upload on Avatar */}
                <button
                  onClick={() => directFileInputRef.current?.click()}
                  className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-medium transition-opacity gap-1.5 cursor-pointer"
                  title="Click to select your actual photo from device"
                >
                  <Camera className="w-6 h-6 text-teal-400" />
                  <span className="font-semibold">Upload Photo</span>
                  <span className="text-[10px] text-zinc-300">Tap to browse file</span>
                </button>
              </div>

              {/* Status indicator on avatar */}
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-1.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Online</span>
              </div>
            </div>

            {/* Direct 1-Click Upload Button under Avatar */}
            <div className="w-36 sm:w-44 lg:w-64 mt-3">
              <input
                ref={directFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleDirectPhotoSelect}
              />
              <button
                type="button"
                onClick={() => directFileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Upload Real Photo</span>
              </button>

              {uploadToast && (
                <div className="mt-2 p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Real photo saved!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
