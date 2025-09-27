import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Voice2Action',
      description: 'An innovative voice-controlled application that converts spoken commands into actionable tasks. Features real-time speech recognition, natural language processing, and seamless integration with various productivity tools and smart home devices.',
      technologies: ['React', 'Node.js', 'Web Speech API', 'Natural Language Processing', 'Express.js'],
      github: 'https://github.com/placeholder/voice2action',
      liveLink: 'https://voice2action-demo.com'
    },
    {
      id: 2,
      title: 'AQVH',
      description: 'Advanced Quality Verification Hub - A comprehensive quality assurance platform designed for manufacturing and production environments. Provides real-time monitoring, automated testing workflows, and detailed analytics for quality control processes.',
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express.js', 'Chart.js'],
      github: 'https://github.com/placeholder/aqvh',
      liveLink: 'https://aqvh-demo.com'
    },
    {
      id: 3,
      title: 'Telemedicine Chatbot',
      description: 'AI-powered healthcare chatbot that provides preliminary medical consultations and connects patients with healthcare providers. Features symptom assessment, appointment scheduling, medical history tracking, and emergency routing capabilities.',
      technologies: ['React', 'Node.js', 'OpenAI API', 'Socket.io', 'MongoDB', 'Express.js'],
      github: 'https://github.com/placeholder/telemedicine-chatbot',
      liveLink: 'https://telemedicine-demo.com'
    },
    {
      id: 4,
      title: 'Recipe Finder',
      description: 'Smart recipe discovery platform that helps users find recipes based on available ingredients, dietary preferences, and cooking time. Includes nutritional information, step-by-step cooking guides, and meal planning features.',
      technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Recipe API', 'Tailwind CSS'],
      github: 'https://github.com/placeholder/recipe-finder',
      liveLink: 'https://recipe-finder-demo.com'
    },
    {
      id: 5,
      title: 'CineSphere',
      description: 'Comprehensive movie and TV show discovery platform with personalized recommendations, watchlists, reviews, and social features. Integrates with multiple streaming services to show availability and provides detailed movie information and ratings.',
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Movie Database API', 'Express.js'],
      github: 'https://github.com/placeholder/cinesphere',
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
                <div className="md:ml-20 premium-border p-8 hover-lift group glow-effect-hover">
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