import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortfolioData,
  PersonalInfo,
  EducationItem,
  SkillItem,
  ExperienceItem,
  ProjectItem,
} from '../types/portfolio';
import { DEFAULT_PORTFOLIO } from '../data/defaultPortfolio';

const STORAGE_KEY = 'sami_portfolio_data_v4';
const ADMIN_AUTH_KEY = 'sami_portfolio_admin_auth';
const ADMIN_PW_KEY = 'sami_portfolio_admin_pw';
const THEME_KEY = 'sami_portfolio_theme';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

interface EditModalState {
  isOpen: boolean;
  type:
    | 'personal'
    | 'about'
    | 'education'
    | 'skill'
    | 'experience'
    | 'project'
    | 'note'
    | 'password'
    | 'upload_resume'
    | null;
  item?: any;
}

interface PortfolioContextType {
  data: PortfolioData;
  isAdmin: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPw: string) => void;
  updatePersonal: (personal: PersonalInfo) => void;
  updateAbout: (aboutText: string) => void;
  addEducation: (edu: EducationItem) => void;
  updateEducation: (edu: EducationItem) => void;
  deleteEducation: (id: string) => void;
  addSkill: (skill: SkillItem) => void;
  updateSkill: (skill: SkillItem) => void;
  deleteSkill: (id: string) => void;
  updatePythonLearningNote: (note: string) => void;
  addExperience: (exp: ExperienceItem) => void;
  updateExperience: (exp: ExperienceItem) => void;
  deleteExperience: (id: string) => void;
  addProject: (proj: ProjectItem) => void;
  updateProject: (proj: ProjectItem) => void;
  deleteProject: (id: string) => void;
  setCustomResumePdf: (base64: string | null, filename?: string | null) => void;
  resetToDefault: () => void;
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => boolean;

  // Global modals
  editModal: EditModalState;
  openEditModal: (type: EditModalState['type'], item?: any) => void;
  closeEditModal: () => void;
  confirmDialog: ConfirmDialogState;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Data state
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading localStorage portfolio data:', e);
    }
    return DEFAULT_PORTFOLIO;
  });

  // 2. Admin Auth state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  // 3. Dark Mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved !== null) {
      return saved === 'dark';
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // 4. Modals state
  const [editModal, setEditModal] = useState<EditModalState>({ isOpen: false, type: null });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Sync data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error persisting portfolio data:', e);
    }
  }, [data]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Admin login
  const loginAdmin = (password: string): boolean => {
    const savedPw = localStorage.getItem(ADMIN_PW_KEY) || 'admin123';
    if (password === savedPw) {
      setIsAdmin(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const changeAdminPassword = (newPw: string) => {
    localStorage.setItem(ADMIN_PW_KEY, newPw);
  };

  // Updaters
  const updatePersonal = (personal: PersonalInfo) => {
    setData((prev) => ({ ...prev, personal }));
  };

  const updateAbout = (aboutText: string) => {
    setData((prev) => ({ ...prev, aboutText }));
  };

  const addEducation = (edu: EducationItem) => {
    setData((prev) => ({ ...prev, education: [...prev.education, edu] }));
  };

  const updateEducation = (edu: EducationItem) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === edu.id ? edu : item)),
    }));
  };

  const deleteEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  const addSkill = (skill: SkillItem) => {
    setData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
  };

  const updateSkill = (skill: SkillItem) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((item) => (item.id === skill.id ? skill : item)),
    }));
  };

  const deleteSkill = (id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item.id !== id),
    }));
  };

  const updatePythonLearningNote = (note: string) => {
    setData((prev) => ({ ...prev, pythonLearningNote: note }));
  };

  const addExperience = (exp: ExperienceItem) => {
    setData((prev) => ({ ...prev, experience: [...prev.experience, exp] }));
  };

  const updateExperience = (exp: ExperienceItem) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) => (item.id === exp.id ? exp : item)),
    }));
  };

  const deleteExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  const addProject = (proj: ProjectItem) => {
    setData((prev) => ({ ...prev, projects: [...prev.projects, proj] }));
  };

  const updateProject = (proj: ProjectItem) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === proj.id ? proj : item)),
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };

  const setCustomResumePdf = (base64: string | null, filename?: string | null) => {
    setData((prev) => ({
      ...prev,
      customResumePdf: base64,
      customResumeName: filename || null,
    }));
  };

  const resetToDefault = () => {
    setData(DEFAULT_PORTFOLIO);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PORTFOLIO));
    } catch (e) {
      console.error(e);
    }
  };

  const exportDataJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `sami_ullah_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.personal && parsed.skills && parsed.projects) {
        setData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import', e);
    }
    return false;
  };

  // Modal helpers
  const openEditModal = (type: EditModalState['type'], item?: any) => {
    setEditModal({ isOpen: true, type, item });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, type: null, item: undefined });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        closeConfirm();
      },
    });
  };

  const closeConfirm = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isAdmin,
        isDarkMode,
        toggleDarkMode,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        updatePersonal,
        updateAbout,
        addEducation,
        updateEducation,
        deleteEducation,
        addSkill,
        updateSkill,
        deleteSkill,
        updatePythonLearningNote,
        addExperience,
        updateExperience,
        deleteExperience,
        addProject,
        updateProject,
        deleteProject,
        setCustomResumePdf,
        resetToDefault,
        exportDataJson,
        importDataJson,
        editModal,
        openEditModal,
        closeEditModal,
        confirmDialog,
        showConfirm,
        closeConfirm,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
