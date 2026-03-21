
import { motion } from 'framer-motion';
import { useRef } from 'react';

const About = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = [
    { number: 3, suffix: '+', label: 'Major Projects' },
    { number: 4, suffix: '', label: 'Hackathon Wins' },
    { number: 9.46, suffix: '', label: 'CGPA' },
    { number: 10, suffix: '+', label: 'Technologies Mastered' },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-playfair font-bold mb-6">
                About <span className="text-gradient">Me</span>
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  I'm currently pursuing B.Tech in Artificial Intelligence & Data Science 
                  at SRKR Engineering College, Bhimavaram with a CGPA of 9.46/10.0. 
                  My passion for full-stack development drives me to create innovative solutions.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  I specialize in the MERN stack and have proven my skills through hackathon 
                  victories, including 1st place at Brain O Vision MERN Stack Hackathon. 
                  I'm experienced in Python, JavaScript, TypeScript, and modern web technologies.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  Currently working as a Frontend Developer Intern at HealMeRight, 
                  developing healthcare applications and recipe template systems. 
                  I believe in delivering scalable web applications with clean, maintainable code.
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="premium-border p-6 text-center hover-lift glow-effect"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="text-4xl font-bold text-gradient mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  <span>{stat.number}</span>
                  <span>{stat.suffix}</span>
                </motion.div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-l from-primary/5 to-transparent blur-3xl" />
    </section>
  );
};

export default About;
