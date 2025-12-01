import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Download, Code, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <motion.div
              key={i}
              className="border-r border-b border-border/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.05,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-4"
            >
              
              <motion.h1 
                className="text-6xl lg:text-8xl font-playfair font-bold"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              >
                <span className="block text-gradient">Sai Nikhil</span>
                <span className="block">Mullapudi</span>
                <span className='text-sm lg:text-sm font-playfair font-bold text-white'>Portfolio under progress</span>
              </motion.h1>
              <motion.h2 className="text-2xl lg:text-2xl font-playfair font-bold">
                <span className="block text-gradient">Web Developer</span>
              </motion.h2>
              <motion.p 
                className="text-xl text-muted-foreground max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Full-stack developer specializing in MERN stack, delivering scalable web applications. 
                Passionate about problem-solving and creating innovative solutions.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-6 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-primary" />
                  <span>90+ Contributions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <span>19 Repositories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span>95+ LeetCode Problems</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>1400+ Contest Rating</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="group premium-border hover-lift glow-effect bg-primary text-white hover:bg-primary/90"
              >
                <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Download Resume
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="glass-effect hover-lift group"
                  onClick={() => window.open('https://github.com/Sainikhil-315', '_blank')}
                >
                  <Github className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="glass-effect hover-lift group"
                  onClick={() => window.open('https://in.linkedin.com/in/sai-nikhil-mullapudi-24522a303', '_blank')}
                >
                  <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="glass-effect hover-lift group"
                  onClick={() => window.open('https://leetcode.com/u/Sai_Nikhil_315/', '_blank')}
                >
                  <Code className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="glass-effect hover-lift group"
                  onClick={() => window.open('mailto: sainikhilmullapudi1604@gmail.com', '_blank')}
                >
                  <Mail className="h-5 w-5 group-hover:animate-pulse" />
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div 
                className="relative w-80 h-80 lg:w-96 lg:h-96"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border border-primary/10"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-card via-accent to-muted glass-effect flex items-center justify-center">
                    <img 
                      src="/OMS_4611.jpg" 
                      alt="Sai Nikhil Mullapudi" 
                      className="w-full h-full object-cover rounded-full"
                     />
                </div>
                
                {[
                  { icon: '⚛️', label: 'React' },
                  { icon: '🟢', label: 'Node.js' },
                  { icon: '🎨', label: 'Tailwind' },
                  { icon: '⚡', label: 'JavaScript' },
                  { icon: '🔥', label: 'TypeScript' },
                  { icon: '🍃', label: 'MongoDB' },
                  { icon: '🚀', label: 'Express' },
                  { icon: '💻', label: 'Full Stack' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="absolute w-12 h-12 rounded-full glass-effect flex items-center justify-center text-xl"
                    style={{
                      top: `${50 + Math.sin((index * 2 * Math.PI) / 8) * 35}%`,
                      left: `${50 + Math.cos((index * 2 * Math.PI) / 8) * 35}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: 'easeInOut'
                    }}
                    title={item.label}
                  >
                    {item.icon}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-primary/50 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
