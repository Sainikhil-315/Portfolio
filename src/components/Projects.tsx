import { motion } from 'framer-motion';
import { Github, ExternalLink, Dock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION = 4000; // 4 seconds per slide

  useEffect(() => {
    if (isPaused) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideInterval);
    };
  }, [currentIndex, isPaused, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setProgress(0);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const isVideo = (src: string) => {
    return src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');
  };

  return (
    <div
      className="relative w-full h-48 lg:h-64 overflow-hidden rounded-lg premium-border group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image/Video Display */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full h-full"
      >
        {isVideo(images[currentIndex]) ? (
          <video
            src={images[currentIndex]}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain bg-accent/10"
          />
        ) : (
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-contain bg-accent/10"
          />
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/20 hover:scale-110 transform z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 text-primary" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/20 hover:scale-110 transform z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 text-primary" />
      </button>

      {/* Progress Bar Container */}
      <div className="absolute bottom-0 left-0 right-0 bg-background/40 backdrop-blur-sm p-3">
        <div className="flex gap-1.5">
          {images.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-muted-foreground/20 rounded-full overflow-hidden cursor-pointer"
              onClick={() => goToSlide(index)}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%'
                }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image Counter */}
      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-lg">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1"
        >
          <div className="w-1 h-3 bg-primary rounded-full" />
          <div className="w-1 h-3 bg-primary rounded-full" />
          <span className="ml-1">Paused</span>
        </motion.div>
      )}
    </div>
  );
};

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Voice2Action',
      description: 'Voice2Action lets citizens report civic issues via voice, text, photos, or videos with GPS tagging and offline support. Users can track progress in real time through dashboards and notifications, building transparency. Admins get tools for verification, analytics, and authority coordination to speed up resolutions. Authorities receive instant SMS/email alerts with media access for efficient handling. A leaderboard and community stats foster healthy competition and civic participation.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Socket.io', 'Leaflet', 'Twilio API', 'Cloudinary', 'Tailwind CSS'],
      github: 'https://github.com/Sainikhil-315/Voice2Action',
      liveLink: 'https://voice2action-steel.vercel.app',
      images: [
        '/voice2action-1.png',
        '/voice2action-2.png',
        '/voice2action-3.png',
        '/voice2action-4.png',
        '/voice2action-5.png'
      ]
    },
    {
      id: 2,
      title: 'LeetRecall',
      description: 'A browser extension that auto-schedules spaced repetition reminders in Google Calendar the moment you hit "Accepted" on LeetCode — so you never forget a problem you\'ve solved. Features real-time detection via MutationObserver, OAuth 2.0 authentication with automatic token refresh, configurable review intervals (fixed or difficulty-based), recall quality tracking with streak stats, and exports solve history as JSON or CSV with full offline support.',
      technologies: ['Manifest V3', 'Chrome API', 'Google Calendar API', 'OAuth 2.0', 'MutationObserver', 'chrome.storage', 'Vanilla JS'],
      github: 'https://github.com/Sainikhil-315/leet-recall',
      liveLink: 'https://chromewebstore.google.com/detail/leetrecall',
      images: [
        '/leetrecall-1.png',
        '/leetrecall-2.png',
        '/leetrecall-3.png',
        '/leetrecall-4.png',
        '/leetrecall-5.png'
      ]
    },
    {
      id: 3,
      title: 'Telemedicine Chatbot',
      description: 'This project delivers a web-based chatbot for real-time medical consultations, symptom analysis, and preliminary health guidance. It integrates appointment scheduling and management, enabling seamless coordination between doctors and patients. The system combines AI-driven chatbot support with an accessible user interface to improve healthcare accessibility.',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express.js'],
      github: 'https://github.com/Sainikhil-315/telemedicine',
      liveLink: 'https://telemedicine-demo.com',
      images: []
    },
    {
      id: 4,
      title: 'Recipe Finder',
      description: 'The Recipe Sharing Platform is a full-stack web application that allows users to search and share recipes based on ingredients and cuisine preferences. It includes user profile management, recipe creation features, and ingredient-based search with step-by-step cooking instructions. The platform also supports region-based categorization, making recipe discovery more intuitive and culturally diverse.',
      technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'Docker'],
      github: 'https://github.com/Sainikhil-315/recipe-finder',
      liveLink: 'https://recipe-finder-demo.com',
      images: []
    },
    {
      id: 5,
      title: 'CineSphere',
      description: 'CineSphere is an engaging movie discovery platform that lets users explore trending, upcoming, and top-rated films with search and browse functionality. It features detailed movie pages, trailer integration, and personalized watchlist creation for a tailored experience. With its responsive and modern interface, the platform ensures seamless exploration across devices.',
      technologies: ['React', 'TMDB API', 'Bootstrap'],
      github: 'https://github.com/Sainikhil-315/CineSphere',
      liveLink: 'https://cine-sphere-pi.vercel.app/',
      images: [
        '/cinesphere-1.png',
        '/cinesphere-2.png',
        '/cinesphere-3.mp4',
        '/cinesphere-4.png',
        '/cinesphere-5.png'
      ]
    }
  ];

  return (
    <section className="py-32 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-playfair font-bold mb-6">
            My <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of innovative solutions and creative implementations
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="relative"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background hidden md:block" />

                {/* Content card */}
                <div className="md:ml-20 premium-border p-8 hover-lift group glow-effect-hover hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition duration-300 ease-in-out">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Project Info */}
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-gradient mb-4">
                        {project.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div>
                        <h4 className="font-semibold mb-3">Tech Skills Implemented:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      <div className="flex gap-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="group"
                          onClick={() => window.open(project.github, '_blank')}
                        >
                          <Github className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                          GitHub
                        </Button>
                        <Button 
                          size="sm" 
                          className="group"
                          onClick={() => window.open(project.liveLink, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          Live Demo
                        </Button>
                      </div>
                    </div>

                    {/* Image Slider or Placeholder */}
                    <div className="flex items-center justify-center">
                      {project.images && project.images.length > 0 ? (
                        <ImageSlider images={project.images} />
                      ) : (
                        <div className="relative w-full h-48 lg:h-64 premium-border rounded-lg overflow-hidden group">
                          {/* Animated gradient background */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/20 to-muted/30"
                            animate={{
                              backgroundPosition: ['0% 0%', '100% 100%'],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              repeatType: 'reverse',
                              ease: 'easeInOut'
                            }}
                            style={{ backgroundSize: '200% 200%' }}
                          />

                          {/* Floating orbs */}
                          <div className="absolute inset-0 overflow-hidden">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute rounded-full bg-primary/20 blur-xl"
                                style={{
                                  width: `${80 + i * 40}px`,
                                  height: `${80 + i * 40}px`,
                                }}
                                animate={{
                                  x: [0, 100, 0],
                                  y: [0, 80, 0],
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: 8 + i * 2,
                                  repeat: Infinity,
                                  repeatType: 'reverse',
                                  ease: 'easeInOut',
                                  delay: i * 0.5,
                                }}
                              />
                            ))}
                          </div>

                          {/* Content */}
                          <div className="relative flex items-center justify-center h-full backdrop-blur-sm">
                            <div className="text-center text-muted-foreground p-6">
                              <motion.div
                                className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center"
                                animate={{
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 10, -10, 0],
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: 'easeInOut'
                                }}
                              >
                                <ExternalLink className="w-10 h-10 text-primary" />
                              </motion.div>

                              <motion.p
                                className="text-lg font-semibold mb-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                {project.title}
                              </motion.p>

                              <motion.p
                                className="text-sm opacity-70"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ delay: 0.4 }}
                              >
                                Visual preview coming soon
                              </motion.p>

                              {/* Decorative elements */}
                              <div className="flex justify-center gap-2 mt-4">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-primary/40"
                                    animate={{
                                      scale: [1, 1.5, 1],
                                      opacity: [0.4, 1, 0.4],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: i * 0.3,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Corner accent */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;