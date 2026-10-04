import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, Unlock, ArrowUp, Github, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, isAdmin, openLoginModal, logoutAdmin } = usePortfolio();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Identity & Copyright */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-display font-bold text-zinc-900 dark:text-zinc-100">
              <span>{data.personal.name}</span>
              <span className="text-zinc-400 font-normal">·</span>
              <span className="text-xs font-mono font-normal text-zinc-500">
                Software Engineering Portfolio
              </span>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              © {currentYear} {data.personal.name}. Handcrafted with clean code & modern web standards.
            </p>
          </div>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-6 text-zinc-500 dark:text-zinc-400">
            {data.personal.github && (
              <a
                href={data.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                aria-label="GitHub profile"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {data.personal.email && (
              <a
                href={`mailto:${data.personal.email}`}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                aria-label="Direct Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={scrollToTop}
              className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors"
              title="Scroll to top"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            {/* Subtle Admin Mode Lock Icon */}
            {isAdmin ? (
              <button
                onClick={logoutAdmin}
                className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/60 rounded transition-colors"
                title="Admin mode active. Click to logout."
                aria-label="Logout Admin"
              >
                <Unlock className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded transition-colors"
                title="Admin Authentication"
                aria-label="Open Admin Login"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
