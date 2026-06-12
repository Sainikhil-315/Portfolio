export interface Project {
  id: number;
  index: string;
  title: string;
  year: string;
  tagline: string;
  description: string;
  technologies: string[];
  github: string;
  liveLink: string;
  media: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    index: '01',
    title: 'Voice2Action',
    year: '2025',
    tagline: 'Civic issue reporting, by voice',
    description:
      'Voice2Action lets citizens report civic issues via voice, text, photos, or videos with GPS tagging and offline support. Users can track progress in real time through dashboards and notifications, building transparency. Admins get tools for verification, analytics, and authority coordination to speed up resolutions. Authorities receive instant SMS/email alerts with media access for efficient handling. A leaderboard and community stats foster healthy competition and civic participation.',
    technologies: [
      'React',
      'Node.js',
      'MongoDB',
      'Express.js',
      'Socket.io',
      'Leaflet',
      'Twilio API',
      'Cloudinary',
      'Tailwind CSS',
    ],
    github: 'https://github.com/Sainikhil-315/Voice2Action',
    liveLink: 'https://voice2action-steel.vercel.app',
    media: [
      '/voice2action-1.png',
      '/voice2action-2.png',
      '/voice2action-3.png',
      '/voice2action-4.png',
      '/voice2action-5.png',
    ],
  },
  {
    id: 2,
    index: '02',
    title: 'LeetRecall',
    year: '2025',
    tagline: 'Spaced repetition for LeetCode',
    description:
      'A browser extension that auto-schedules spaced repetition reminders in Google Calendar the moment you hit "Accepted" on LeetCode — so you never forget a problem you\'ve solved. Features real-time detection via MutationObserver, OAuth 2.0 authentication with automatic token refresh, configurable review intervals (fixed or difficulty-based), recall quality tracking with streak stats, and exports solve history as JSON or CSV with full offline support.',
    technologies: [
      'Manifest V3',
      'Chrome API',
      'Google Calendar API',
      'OAuth 2.0',
      'MutationObserver',
      'chrome.storage',
      'Vanilla JS',
    ],
    github: 'https://github.com/Sainikhil-315/leet-recall',
    liveLink: 'https://chromewebstore.google.com/detail/leetrecall',
    media: [
      '/leetrecall-1.png',
      '/leetrecall-2.png',
      '/leetrecall-3.png',
      '/leetrecall-4.png',
      '/leetrecall-5.png',
    ],
  },
  {
    id: 3,
    index: '03',
    title: 'Telemedicine Chatbot',
    year: '2024',
    tagline: 'AI-assisted medical consultations',
    description:
      'This project delivers a web-based chatbot for real-time medical consultations, symptom analysis, and preliminary health guidance. It integrates appointment scheduling and management, enabling seamless coordination between doctors and patients. The system combines AI-driven chatbot support with an accessible user interface to improve healthcare accessibility.',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express.js'],
    github: 'https://github.com/Sainikhil-315/telemedicine',
    liveLink: 'https://telemedicine-demo.com',
    media: [],
  },
  {
    id: 4,
    index: '04',
    title: 'Recipe Finder',
    year: '2024',
    tagline: 'Ingredient-first recipe discovery',
    description:
      'The Recipe Sharing Platform is a full-stack web application that allows users to search and share recipes based on ingredients and cuisine preferences. It includes user profile management, recipe creation features, and ingredient-based search with step-by-step cooking instructions. The platform also supports region-based categorization, making recipe discovery more intuitive and culturally diverse.',
    technologies: [
      'React',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Bootstrap',
      'Docker',
    ],
    github: 'https://github.com/Sainikhil-315/recipe-finder',
    liveLink: 'https://recipe-finder-demo.com',
    media: [],
  },
  {
    id: 5,
    index: '05',
    title: 'CineSphere',
    year: '2024',
    tagline: 'Movie discovery, tailored',
    description:
      'CineSphere is an engaging movie discovery platform that lets users explore trending, upcoming, and top-rated films with search and browse functionality. It features detailed movie pages, trailer integration, and personalized watchlist creation for a tailored experience. With its responsive and modern interface, the platform ensures seamless exploration across devices.',
    technologies: ['React', 'TMDB API', 'Bootstrap'],
    github: 'https://github.com/Sainikhil-315/CineSphere',
    liveLink: 'https://cine-sphere-pi.vercel.app/',
    media: [
      '/cinesphere-1.png',
      '/cinesphere-2.png',
      '/cinesphere-3.mp4',
      '/cinesphere-4.png',
      '/cinesphere-5.png',
    ],
  },
];

export const isVideo = (src: string) =>
  src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');

export const achievementGallery = Array.from({ length: 7 }, (_, i) => ({
  src: `/achievement${i + 1}.jpeg`,
  caption: `fig. 0${i + 1}`,
}));
