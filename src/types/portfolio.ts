export interface PersonalInfo {
  name: string;
  roleTitle: string;
  headlineIntro: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github: string;
  avatarUrl?: string | null;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  gpa: string;
  coursework: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'Learning' | 'Intermediate' | 'Proficient' | 'Advanced';
  category: 'Languages & Core' | 'CS Fundamentals' | 'Productivity & Office';
  percent: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location?: string;
  period: string;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  category?: string;
  imageUrl?: string | null;
}

export interface PortfolioData {
  personal: PersonalInfo;
  aboutText: string;
  education: EducationItem[];
  skills: SkillItem[];
  pythonLearningNote: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  customResumePdf?: string | null; // Base64 data URL if uploaded
  customResumeName?: string | null;
}
