export type SkillCategory = 'Language' | 'Frontend' | 'Backend' | 'Tooling';

export interface Skill {
  name: string;
  level: number;
  category: SkillCategory;
}

export const skills: Skill[] = [
  { name: 'JavaScript', level: 85, category: 'Language' },
  { name: 'TypeScript', level: 70, category: 'Language' },
  { name: 'C++', level: 70, category: 'Language' },
  { name: 'React', level: 90, category: 'Frontend' },
  { name: 'HTML5', level: 95, category: 'Frontend' },
  { name: 'CSS3', level: 90, category: 'Frontend' },
  { name: 'Bootstrap', level: 85, category: 'Frontend' },
  { name: 'Tailwind CSS', level: 90, category: 'Frontend' },
  { name: 'Node.js', level: 85, category: 'Backend' },
  { name: 'Express.js', level: 85, category: 'Backend' },
  { name: 'MongoDB', level: 65, category: 'Backend' },
  { name: 'MySQL', level: 75, category: 'Backend' },
  { name: 'Oracle', level: 70, category: 'Backend' },
  { name: 'Git', level: 90, category: 'Tooling' },
  { name: 'GitHub', level: 90, category: 'Tooling' },
  { name: 'Docker', level: 75, category: 'Tooling' },
  { name: 'Postman', level: 85, category: 'Tooling' },
  { name: 'Thunder Client', level: 80, category: 'Tooling' },
];

/** proficiency words > percentages — honest and typographic */
export const proficiencyWord = (level: number) =>
  level >= 85 ? 'Fluent' : level >= 70 ? 'Proficient' : 'Working';
