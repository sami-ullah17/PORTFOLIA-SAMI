import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Phone, MapPin, Linkedin, Github, Send, Copy, Check, Edit3, ArrowUpRight } from 'lucide-react';

export const Contact: React.FC = () => {
  const { data, isAdmin, openEditModal } = usePortfolio();
  const { personal } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const emailSubject = encodeURIComponent(
      formData.subject ? `[Portfolio Inquiry] ${formData.subject}` : `[Portfolio Inquiry] from ${formData.name}`
    );
    const bodyText = encodeURIComponent(
      `Hello Sami,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n`
    );

    // Open mail client via mailto
    window.location.href = `mailto:${personal.email}?subject=${emailSubject}&body=${bodyText}`;
    setFormSent(true);
    setTimeout(() => setFormSent(false), 6000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <section id="contact" className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-600 dark:text-teal-400 font-mono">
              05. Direct Inquiries
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
              Get in Touch
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xl">
              I am actively seeking internship opportunities, collaborative software projects, and technical discussions.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => openEditModal('personal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Contact Info</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Direct Clickable Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2">
              Contact Channels
            </h3>

            {/* Email Card */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex items-center justify-between group">
              <a
                href={`mailto:${personal.email}`}
                className="flex items-center gap-3.5 min-w-0 flex-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block text-xs uppercase tracking-wider text-zinc-400 font-mono">
                    Email Address
                  </span>
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate block">
                    {personal.email}
                  </span>
                </div>
              </a>
              <button
                onClick={handleCopyEmail}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 ml-2"
                title="Copy email to clipboard"
                aria-label="Copy email address"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone Card */}
            <a
              href={`tel:${personal.phone.replace(/\s+/g, '')}`}
              className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex items-center justify-between group hover:border-teal-500/50 transition-colors block"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block text-xs uppercase tracking-wider text-zinc-400 font-mono">
                    Phone / WhatsApp
                  </span>
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 font-mono">
                    {personal.phone}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors shrink-0" />
            </a>

            {/* Location Card */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(personal.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex items-center justify-between group hover:border-teal-500/50 transition-colors block"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block text-xs uppercase tracking-wider text-zinc-400 font-mono">
                    Location
                  </span>
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {personal.location}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors shrink-0" />
            </a>

            {/* Social Links Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex items-center gap-3 group hover:border-teal-500/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-teal-600 dark:text-teal-400 shrink-0">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-zinc-400 font-mono">Profile</span>
                  <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    LinkedIn
                  </span>
                </div>
              </a>

              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex items-center gap-3 group hover:border-teal-500/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-teal-600 dark:text-teal-400 shrink-0">
                  <Github className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-zinc-400 font-mono">Code</span>
                  <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    GitHub
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
              <h3 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                Send a Direct Message
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
                Fills out your default email client with your message addressed to <span className="font-mono text-zinc-700 dark:text-zinc-300">{personal.email}</span>.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Your Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Subject (Optional)
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="e.g. Internship Opportunity / Collaboration"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Message Content
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Write your note, question, or project inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 transition-all resize-y"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 dark:text-zinc-950 rounded-lg transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send via Email Client</span>
                  </button>

                  {formSent && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Email client launched!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
