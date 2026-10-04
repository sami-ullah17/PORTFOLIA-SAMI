import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  X,
  Lock,
  AlertTriangle,
  FileCheck,
  Check,
  FileText,
  Trash2,
} from 'lucide-react';
import { SkillItem } from '../types/portfolio';

export const AdminModals: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    loginAdmin,
    confirmDialog,
    closeConfirm,
    editModal,
    closeEditModal,
    data,
    updatePersonal,
    updateAbout,
    addEducation,
    updateEducation,
    addSkill,
    updateSkill,
    updatePythonLearningNote,
    addExperience,
    updateExperience,
    addProject,
    updateProject,
    setCustomResumePdf,
    changeAdminPassword,
  } = usePortfolio();

  // ----------------------------------------------------
  // 1. LOGIN MODAL STATE
  // ----------------------------------------------------
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput.trim());
    if (success) {
      setPasswordInput('');
      setLoginError('');
      closeLoginModal();
    } else {
      setLoginError('Incorrect password. Default is "admin123"');
    }
  };

  // ----------------------------------------------------
  // 2. DYNAMIC FORM STATE
  // ----------------------------------------------------
  const [formData, setFormData] = useState<any>({});
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editModal.isOpen) {
      setFormData({});
      setUploadSuccess('');
      return;
    }

    const { type, item } = editModal;
    if (type === 'personal') {
      setFormData({ ...data.personal });
    } else if (type === 'about') {
      setFormData({ aboutText: data.aboutText });
    } else if (type === 'education') {
      setFormData(
        item
          ? { ...item, coursework: item.coursework.join(', ') }
          : {
              id: 'edu-' + Date.now(),
              degree: '',
              institution: '',
              period: '',
              gpa: '',
              coursework: '',
            }
      );
    } else if (type === 'skill') {
      setFormData(
        item
          ? { ...item }
          : {
              id: 'skill-' + Date.now(),
              name: '',
              level: 'Intermediate',
              category: 'Languages & Core',
              percent: 70,
            }
      );
    } else if (type === 'experience') {
      setFormData(
        item
          ? { ...item, highlights: item.highlights.join('\n') }
          : {
              id: 'exp-' + Date.now(),
              role: '',
              organization: '',
              location: '',
              period: '',
              highlights: '',
            }
      );
    } else if (type === 'project') {
      setFormData(
        item
          ? { ...item, tags: item.tags.join(', ') }
          : {
              id: 'proj-' + Date.now(),
              title: '',
              description: '',
              category: 'Console Applications',
              tags: '',
              githubUrl: '',
              liveUrl: '',
            }
      );
    } else if (type === 'note') {
      setFormData({ pythonLearningNote: data.pythonLearningNote });
    } else if (type === 'password') {
      setFormData({ newPassword: '', confirmPassword: '' });
    } else if (type === 'upload_resume') {
      setFormData({ customResumeName: data.customResumeName });
    }
  }, [editModal.isOpen, editModal.type, editModal.item, data]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { type, item } = editModal;

    if (type === 'personal') {
      updatePersonal(formData);
      if (formData.avatarUrl && formData.avatarUrl.startsWith('data:image/')) {
        fetch('/api/save-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: formData.avatarUrl }),
        }).catch(() => {});
      }
    } else if (type === 'about') {
      updateAbout(formData.aboutText);
    } else if (type === 'education') {
      const formatted = {
        ...formData,
        coursework: typeof formData.coursework === 'string'
          ? formData.coursework.split(',').map((s: string) => s.trim()).filter(Boolean)
          : formData.coursework,
      };
      if (item) {
        updateEducation(formatted);
      } else {
        addEducation(formatted);
      }
    } else if (type === 'skill') {
      const formatted: SkillItem = {
        ...formData,
        percent: Number(formData.percent) || 50,
      };
      if (item) {
        updateSkill(formatted);
      } else {
        addSkill(formatted);
      }
    } else if (type === 'experience') {
      const formatted = {
        ...formData,
        highlights: typeof formData.highlights === 'string'
          ? formData.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : formData.highlights,
      };
      if (item) {
        updateExperience(formatted);
      } else {
        addExperience(formatted);
      }
    } else if (type === 'project') {
      const formatted = {
        ...formData,
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map((s: string) => s.trim()).filter(Boolean)
          : formData.tags,
      };
      if (item) {
        updateProject(formatted);
      } else {
        addProject(formatted);
      }
    } else if (type === 'note') {
      updatePythonLearningNote(formData.pythonLearningNote);
    } else if (type === 'password') {
      if (!formData.newPassword || formData.newPassword !== formData.confirmPassword) {
        alert('Passwords do not match or are blank.');
        return;
      }
      changeAdminPassword(formData.newPassword);
      alert('Password updated successfully!');
    }

    closeEditModal();
  };

  // Resume PDF Upload handler
  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCustomResumePdf(base64, file.name);
      setUploadSuccess(`Uploaded "${file.name}"! Website visitors will now download this PDF.`);
    };
    reader.readAsDataURL(file);
  };

  const handleClearCustomPdf = () => {
    setCustomResumePdf(null, null);
    setUploadSuccess('Reverted to dynamic auto-generated PDF resume.');
  };

  return (
    <>
      {/* 1. ADMIN LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-7 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  Admin Login
                </h3>
                <p className="text-xs text-zinc-500">Edit and manage portfolio content</p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                  Default password is <code className="font-mono text-teal-600 dark:text-teal-400">admin123</code>.
                </p>
              </div>

              {loginError && (
                <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {loginError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeLoginModal}
                  className="px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CONFIRM DELETE MODAL */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
                {confirmDialog.title}
              </h3>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-5 leading-relaxed">
              {confirmDialog.message}
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeConfirm}
                className="px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC EDIT MODAL */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-7 max-w-xl w-full shadow-2xl relative my-8">
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-1">
              {editModal.type === 'personal' && 'Edit Profile & Hero'}
              {editModal.type === 'about' && 'Edit About Bio'}
              {editModal.type === 'education' && (editModal.item ? 'Edit Education' : 'Add Education')}
              {editModal.type === 'skill' && (editModal.item ? 'Edit Skill' : 'Add Skill')}
              {editModal.type === 'experience' && (editModal.item ? 'Edit Experience' : 'Add Experience')}
              {editModal.type === 'project' && (editModal.item ? 'Edit Project' : 'Add Project')}
              {editModal.type === 'note' && 'Edit Python Practical Learning Note'}
              {editModal.type === 'password' && 'Change Admin Password'}
              {editModal.type === 'upload_resume' && 'Manage Resume PDF'}
            </h3>
            <p className="text-xs text-zinc-500 mb-5">
              Changes will be saved to your browser session and remain active across page reloads.
            </p>

            {/* A. PERSONAL / HERO FORM */}
            {editModal.type === 'personal' && (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                {/* Profile Photo Upload / Edit */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Profile Picture (Image Option)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 shrink-0">
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-zinc-500">
                          SU
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setFormData((prev: any) => ({ ...prev, avatarUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="block w-full text-xs text-zinc-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 dark:file:bg-teal-950/80 dark:file:text-teal-300 hover:file:bg-teal-100 cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Or paste image URL"
                          value={formData.avatarUrl || ''}
                          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                        />
                        {formData.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, avatarUrl: null })}
                            className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded shrink-0"
                            title="Remove picture"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Role Title / Headline</label>
                  <input
                    type="text"
                    required
                    value={formData.roleTitle || ''}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Short Intro Line</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.headlineIntro || ''}
                    onChange={(e) => setFormData({ ...formData, headlineIntro: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone</label>
                    <input
                      type="text"
                      required
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github || ''}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button type="button" onClick={closeEditModal} className="px-3.5 py-2 text-xs font-medium text-zinc-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg">Save Changes</button>
                </div>
              </form>
            )}

            {/* B. ABOUT BIO FORM */}
            {editModal.type === 'about' && (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">About Biography</label>
                  <textarea
                    rows={6}
                    required
                    value={formData.aboutText || ''}
                    onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 leading-relaxed"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button type="button" onClick={closeEditModal} className="px-3.5 py-2 text-xs font-medium text-zinc-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg">Save Bio</button>
                </div>
              </form>
            )}

            {/* C. EDUCATION FORM */}
            {editModal.type === 'education' && (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Degree Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bachelor of Software Engineering"
                    value={formData.degree || ''}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Institution</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Islamia University of Bahawalpur (IUB), Pakistan"
                    value={formData.institution || ''}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Period</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2025 - 2029"
                      value={formData.period || ''}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">GPA / Score</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3.44 / 4.00"
                      value={formData.gpa || ''}
                      onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Relevant Coursework (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="OOP, DSA, Digital Logic Design, Python Fundamentals, Database Systems"
                    value={formData.coursework || ''}
                    onChange={(e) => setFormData({ ...formData, coursework: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button type="button" onClick={closeEditModal} className="px-3.5 py-2 text-xs font-medium text-zinc-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg">Save</button>
                </div>
              </form>
            )}

            {/* D. SKILL FORM */}
            {editModal.type === 'skill' && (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Python, SQL, DSA"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Honest Level</label>
                    <select
                      value={formData.level || 'Intermediate'}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="Learning">Learning</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Proficient">Proficient</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                    <select
                      value={formData.category || 'Languages & Core'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="Languages & Core">Languages & Core</option>
                      <option value="CS Fundamentals">CS Fundamentals</option>
                      <option value="Productivity & Office">Productivity & Office</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    <span>Proficiency Index ({formData.percent || 70}%)</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={formData.percent || 70}
                    onChange={(e) => setFormData({ ...formData, percent: Number(e.target.value) })}
                    className="w-full accent-teal-600"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button type="button" onClick={closeEditModal} className="px-3.5 py-2 text-xs font-medium text-zinc-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg">Save Skill</button>
                </div>
              </form>
            )}

            {/* E. EXPERIENCE FORM */}
            {editModal.type === 'experience' && (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Operator Intern"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Organization / Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Islamia University of Bahawalpur (IUB), Vocational Training Institute (VTI)"
                    value={formData.organization || ''}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Period</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. January 2025 - May 2025"
                      value={formData.period || ''}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Location (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Bahawalpur, Pakistan"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Key Highlights & Responsibilities (one per line)
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Gained practical experience in data entry...&#10;Learned computer operations, record management..."
                    value={formData.highlights || ''}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button type="button" onClick={closeEditModal} className="px-3.5 py-2 text-xs font-medium text-zinc-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg">Save Experience</button>
                </div>
              </form>
            )}

            {/* F. PROJECT FORM */}
            {editModal.type === 'project' && (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                {/* Project Screenshot / Cover Image */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Project Screenshot / Cover Image (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 shrink-0">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Project preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-zinc-400">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setFormData((prev: any) => ({ ...prev, imageUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="block w-full text-xs text-zinc-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 dark:file:bg-teal-950/80 dark:file:text-teal-300 hover:file:bg-teal-100 cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Or paste screenshot URL"
                          value={formData.imageUrl || ''}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                        />
                        {formData.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: null })}
                            className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded shrink-0"
                            title="Remove image"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Student Record Management System"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Category / Domain</label>
                  <input
                    type="text"
                    placeholder="e.g. Console Applications, Algorithms, Database Systems"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detailed description of features, architecture, algorithms used, and file persistence..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Tech Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Python, OOP, File Handling, CLI, Persistence"
                    value={formData.tags || ''}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">GitHub Repo URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={formData.githubUrl || ''}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Live URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.liveUrl || ''}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button type="button" onClick={closeEditModal} className="px-3.5 py-2 text-xs font-medium text-zinc-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg">Save Project</button>
                </div>
              </form>
            )}

            {/* G. PYTHON NOTE FORM */}
            {editModal.type === 'note' && (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Python Practical Learning Statement
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.pythonLearningNote || ''}
                    onChange={(e) => setFormData({ ...formData, pythonLearningNote: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button type="button" onClick={closeEditModal} className="px-3.5 py-2 text-xs font-medium text-zinc-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg">Save Note</button>
                </div>
              </form>
            )}

            {/* H. CHANGE PASSWORD FORM */}
            {editModal.type === 'password' && (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={formData.newPassword || ''}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={formData.confirmPassword || ''}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button type="button" onClick={closeEditModal} className="px-3.5 py-2 text-xs font-medium text-zinc-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg">Update Password</button>
                </div>
              </form>
            )}

            {/* I. UPLOAD CUSTOM RESUME PDF MODAL */}
            {editModal.type === 'upload_resume' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60">
                  <span className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-1">
                    Current Mode
                  </span>
                  {data.customResumePdf ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-500" />
                        <div>
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                            Custom PDF Active
                          </p>
                          <p className="text-xs text-zinc-500 font-mono">
                            {data.customResumeName || 'Uploaded PDF'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleClearCustomPdf}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors border border-red-200 dark:border-red-900/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revert to Auto-PDF</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                          Dynamic Vector PDF Active
                        </p>
                        <p className="text-xs text-zinc-500">
                          Auto-generates from current website data on every download.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Upload Your Own PDF Resume
                  </label>
                  <p className="text-xs text-zinc-500 mb-3">
                    If you have a customized or designed PDF, upload it here. When visitors click "Download Resume", they will receive your uploaded PDF.
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handlePdfFileSelect}
                    className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 dark:file:bg-teal-950/80 dark:file:text-teal-300 hover:file:bg-teal-100 cursor-pointer border border-zinc-200 dark:border-zinc-800 rounded-lg p-1.5"
                  />
                </div>

                {uploadSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                <div className="flex justify-end pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
