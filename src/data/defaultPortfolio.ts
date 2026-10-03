import { PortfolioData } from '../types/portfolio';

export const DEFAULT_PORTFOLIO: PortfolioData = {
  personal: {
    name: 'Sami Ullah',
    roleTitle: 'Software Engineering Student | AI & Software Development Enthusiast',
    headlineIntro: 'Dedicated to writing clean, maintainable code, mastering algorithmic problem solving, and building practical software solutions.',
    email: 'samiullah1717sp@gmail.com',
    phone: '+92 329 1171812',
    location: 'Pakpattan, Pakistan',
    linkedin: 'https://www.linkedin.com/in/sami-ullah-3834ab435/',
    github: 'https://github.com/sami-ullah17',
    avatarUrl: '/src/assets/images/sami_suit_portrait_1791027197219.jpg',
  },
  aboutText:
    'Software Engineering student with a strong interest in Artificial Intelligence and software development. Completed Object-Oriented Programming (OOP), Data Structures and Algorithms (DSA), and file handling in Python. Currently learning SQL and database management to strengthen my technical skills. A quick learner with strong problem-solving abilities, eager to apply my knowledge, gain practical experience, and grow in a professional software development environment.',
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Software Engineering',
      institution: 'The Islamia University of Bahawalpur (IUB), Pakistan',
      period: '2025 - 2029',
      gpa: '3.44 / 4.00',
      coursework: [
        'Object-Oriented Programming (OOP)',
        'Data Structures and Algorithms (DSA)',
        'Digital Logic Design',
        'Python Fundamentals',
        'Database Systems',
      ],
    },
  ],
  skills: [
    {
      id: 'skill-python',
      name: 'Python',
      level: 'Intermediate',
      category: 'Languages & Core',
      percent: 75,
    },
    {
      id: 'skill-sql',
      name: 'SQL',
      level: 'Learning',
      category: 'Languages & Core',
      percent: 45,
    },
    {
      id: 'skill-dsa',
      name: 'Data Structures & Algorithms',
      level: 'Intermediate',
      category: 'CS Fundamentals',
      percent: 72,
    },
    {
      id: 'skill-oop',
      name: 'Object-Oriented Programming',
      level: 'Intermediate',
      category: 'CS Fundamentals',
      percent: 78,
    },
    {
      id: 'skill-filehandling',
      name: 'File Handling & Persistence',
      level: 'Proficient',
      category: 'Languages & Core',
      percent: 82,
    },
    {
      id: 'skill-office',
      name: 'Microsoft Office & Operations',
      level: 'Proficient',
      category: 'Productivity & Office',
      percent: 88,
    },
  ],
  pythonLearningNote:
    'Hands-on practice with loops, functions, conditional statements, file handling, console-based programs, and implementing fundamental data structures and algorithms.',
  experience: [
    {
      id: 'exp-1',
      role: 'Computer Operator Intern',
      organization: 'The Islamia University of Bahawalpur (IUB), Vocational Training Institute (VTI)',
      location: 'Bahawalpur, Pakistan',
      period: 'January 2025 - May 2025',
      highlights: [
        'Gained practical experience in data entry, document preparation, file management, and office administration using Microsoft Office.',
        'Learned computer operations, record management, internet usage, printing, scanning, and basic troubleshooting in a professional training environment.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Student Record Management System',
      description:
        'A comprehensive console-based software system engineered in Python adhering to Object-Oriented principles. Features persistent local file handling for data records, robust user input sanitization, dynamic search by student identifier, and full CRUD record tracking.',
      tags: ['Python', 'OOP', 'File Handling', 'CLI', 'Persistence'],
      githubUrl: 'https://github.com/sami-ullah17/student-record-management',
      category: 'Console Applications',
    },
    {
      id: 'proj-2',
      title: 'Algorithmic Task Scheduler & Organizer',
      description:
        'An algorithmic command-line utility implementing custom priority queues and sorting algorithms in pure Python. Enables task ranking, deadline calculation, and session persistence to text/binary files without external dependencies.',
      tags: ['Python', 'DSA', 'Priority Queues', 'Algorithms', 'CLI'],
      githubUrl: 'https://github.com/sami-ullah17/python-task-scheduler',
      category: 'Algorithms & Utilities',
    },
  ],
  customResumePdf: null,
  customResumeName: null,
};
