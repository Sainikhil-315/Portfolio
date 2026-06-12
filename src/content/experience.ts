export interface ExperienceEntry {
  period: string;
  title: string;
  company: string;
  location: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export const experiences: ExperienceEntry[] = [
  {
    period: 'APR 2025 — PRESENT',
    title: 'Frontend Developer Intern',
    company: 'HealMeRight',
    location: 'Remote',
    description:
      'Developing recipe templates for users in a healthcare application that connects users with health coaches and ayurvedic experts. Building features for recipe template verification and validation within the application.',
    technologies: ['JavaScript', 'Node.js'],
    achievements: [
      'Developed user-friendly recipe template system',
      'Implemented template verification features',
      'Enhanced user experience in healthcare application',
    ],
  },
];
