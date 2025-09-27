import { motion } from 'framer-motion';
import { Github, ExternalLink, Dock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Voice2Action',
      description: 'Voice2Action lets citizens report civic issues via voice, text, photos, or videos with GPS tagging and offline support. Users can track progress in real time through dashboards and notifications, building transparency. Admins get tools for verification, analytics, and authority coordination to speed up resolutions. Authorities receive instant SMS/email alerts with media access for efficient handling. A leaderboard and community stats foster healthy competition and civic participation.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Socket.io', 'Leaflet', 'Twilio API', 'Cloudinary', 'Tailwind CSS'],
      github: 'https://github.com/Sainikhil-315/Voice2Action',
      liveLink: 'https://voice2action-demo.com'
    },
    {
      id: 2,
      title: 'AQVH',
      description: 'The AQVH project explores hybrid optimization by combining classical heuristics with quantum-inspired algorithms to solve complex Vehicle Routing Problems (VRP). It features a scalable backend built with FastAPI, enabling modular handling of routing, distance management, and optimization workflows. The system is quantum-ready, running on simulators like Qiskit Aer and adaptable to future quantum hardware. An interactive frontend allows users to compare routes, benchmark algorithms, and analyze costs effectively',
      technologies: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Express.js', 'Chart.js', 'FastAPI', 'Qiskit', 'Python'],
      github: 'https://github.com/Sainikhil-315/AQVH---delivery-vehicles',
      liveLink: 'https://aqvh-demo.com'
    },
    {
      id: 3,
      title: 'Telemedicine Chatbot',
      description: 'This project delivers a web-based chatbot for real-time medical consultations, symptom analysis, and preliminary health guidance. It integrates appointment scheduling and management, enabling seamless coordination between doctors and patients. The system combines AI-driven chatbot support with an accessible user interface to improve healthcare accessibility.',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express.js'],
      github: 'https://github.com/Sainikhil-315/telemedicine',
      liveLink: 'https://telemedicine-demo.com'
    },
    {
      id: 4,
      title: 'Recipe Finder',
      description: 'The Recipe Sharing Platform is a full-stack web application that allows users to search and share recipes based on ingredients and cuisine preferences. It includes user profile management, recipe creation features, and ingredient-based search with step-by-step cooking instructions. The platform also supports region-based categorization, making recipe discovery more intuitive and culturally diverse.',
      technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'Docker'],
      github: 'https://github.com/Sainikhil-315/recipe-finder',
      liveLink: 'https://recipe-finder-demo.com'
    },
    {
      id: 5,
      title: 'CineSphere',
      description: 'CineSphere is an engaging movie discovery platform that lets users explore trending, upcoming, and top-rated films with search and browse functionality. It features detailed movie pages, trailer integration, and personalized watchlist creation for a tailored experience. With its responsive and modern interface, the platform ensures seamless exploration across devices.',
      technologies: ['React', 'Node.js', 'MongoDB', 'TMDB API', 'Express.js'],
      github: 'https://github.com/Sainikhil-315/CineSphere',
      liveLink: 'https://cinesphere-demo.com'
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

                    {/* Placeholder for future images/screenshots */}
                    <div className="flex items-center justify-center">
                      <div className="w-full h-48 lg:h-64 premium-border flex items-center justify-center bg-accent/20 rounded-lg">
                        <div className="text-center text-muted-foreground">
                          <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                            <ExternalLink className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm">Project Preview</p>
                          <p className="text-xs">Coming Soon</p>
                        </div>
                      </div>
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