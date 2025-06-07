import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { SelfAttentionWorkflow } from '@/components/SelfAttentionWorkflow';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { Brain, Cpu, Network, Sparkles, ArrowRight, GitBranch, MousePointer2, Code, Lightbulb, Zap, Layers, Share2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'available' | 'coming-soon';
  gradient: string;
  features: string[];
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SocialLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
}

function ParallaxText({ children, baseVelocity = 5 }: { children: string; baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  
  useEffect(() => {
    let timeoutId: number;
    function animate() {
      const x = baseX.get();
      if (x <= -100) {
        baseX.set(0);
      } else {
        baseX.set(x - baseVelocity * 0.02);
      }
      timeoutId = requestAnimationFrame(animate);
    }
    timeoutId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(timeoutId);
  }, [baseVelocity, baseX]);

  return (
    <div className="overflow-hidden whitespace-nowrap flex items-center">
      <motion.div style={{ x: baseX }} className="flex whitespace-nowrap">
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
      </motion.div>
    </div>
  );
}

function CodeParticles() {
  const particles: Particle[] = [
    { id: 1, x: 10, y: 20, text: 'matrix[i][j]' },
    { id: 2, x: 80, y: 40, text: 'attention' },
    { id: 3, x: 30, y: 70, text: 'softmax()' },
    { id: 4, x: 60, y: 90, text: 'q * k.T' },
    { id: 5, x: 40, y: 30, text: 'neural' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute text-sm font-mono opacity-20`}
          initial={{ 
            x: `${particle.x}%`, 
            y: `${particle.y}%`,
            opacity: 0.2 
          }}
          animate={{
            y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: particle.id * 2,
          }}
        >
          {particle.text}
        </motion.div>
      ))}
    </div>
  );
}

function FeatureCard({ feature, isDark }: { feature: { icon: LucideIcon; title: string; description: string }; isDark: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-6 rounded-xl ${
        isDark ? 'bg-slate-800/50' : 'bg-white'
      } border ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      } transition-colors duration-300`}
    >
      <div className={`mb-4 inline-flex p-3 rounded-lg ${
        isDark ? 'bg-slate-700/50' : 'bg-slate-100'
      }`}>
        <feature.icon className="w-6 h-6 text-blue-500" />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>{feature.title}</h3>
      <p className={`text-sm ${
        isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>{feature.description}</p>
    </motion.div>
  );
}

function AIConceptVisual({ isDark }: { isDark: boolean }) {
  const nodeCount = 6;
  const radius = 120;
  const center = { x: 150, y: 150 };
  
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2;
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  });

  return (
    <div className="relative w-[300px] h-[300px]">
      <svg width="300" height="300" className="absolute inset-0">
        {nodes.map((node, i) => (
          <g key={i}>
            {nodes.map((_, j) => (
              j !== i && (
                <motion.line
                  key={`${i}-${j}`}
                  x1={node.x}
                  y1={node.y}
                  x2={nodes[j].x}
                  y2={nodes[j].y}
                  stroke={isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)'}
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    delay: (i + j) * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              )
            ))}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="4"
              fill={isDark ? '#3b82f6' : '#2563eb'}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Landing() {
  const [isDark, setIsDark] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const sectionY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const sectionOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 25,
        y: (e.clientY - window.innerHeight / 2) / 25,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const modules: Module[] = [
    {
      id: 'self-attention',
      title: 'Self Attention Mechanism',
      description: 'Master the foundational concept behind transformers through our interactive matrix visualization system',
      icon: Brain,
      status: 'available',
      gradient: 'from-blue-500 to-purple-500',
      features: ['Interactive Matrix Operations', 'Real-time Visualization', 'Step-by-step Understanding']
    },
    {
      id: 'transformer',
      title: 'Transformer Architecture',
      description: 'Coming soon - Deep dive into the complete transformer architecture with animated data flow',
      icon: Cpu,
      status: 'coming-soon',
      gradient: 'from-emerald-500 to-teal-500',
      features: ['Multi-head Attention', 'Position Embeddings', 'Feed-forward Networks']
    },
    {
      id: 'llm',
      title: 'Large Language Models',
      description: 'Coming soon - Explore the architecture and principles behind modern LLMs',
      icon: Network,
      status: 'coming-soon',
      gradient: 'from-orange-500 to-red-500',
      features: ['Scaling Laws', 'Architecture Choices', 'Training Dynamics']
    }
  ];

  if (selectedModule === 'self-attention') {
    return (
      <ThemeProvider isDark={isDark}>
        <SelfAttentionWorkflow />
      </ThemeProvider>
    );
  }

  const features: Feature[] = [
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Watch as matrices transform and interact in real-time, making complex operations intuitive."
    },
    {
      icon: Layers,
      title: "Layer by Layer",
      description: "Break down complex neural architectures into understandable, interactive components."
    },
    {
      icon: Share2,
      title: "Interactive Learning",
      description: "Engage with each concept through hands-on manipulation and visualization."
    }
  ];
    const interactiveElements: string[] = [
    'Interactive matrix operations',
    'Real-time attention visualization',
    'Step-by-step concept breakdown'
  ];

  const socialLinks: SocialLink[] = [
    { icon: GitBranch, label: 'GitHub', href: '#' },
    { icon: Code, label: 'Documentation', href: '#' },
    { icon: Lightbulb, label: 'Blog', href: '#' }
  ];

  return (
    <ThemeProvider isDark={isDark}>
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} transition-colors duration-300 relative overflow-hidden`}>
        {/* Animated Background Grid */}
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-200"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            backgroundImage: `radial-gradient(${
              isDark ? 'rgb(255 255 255 / 0.075)' : 'rgb(0 0 0 / 0.075)'
            } 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '-20px -20px',
          }}
        />

        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className={`absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl bg-gradient-to-r from-blue-500 to-purple-500`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              top: '10%',
              right: '10%',
              transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
            }}
          />
          <motion.div 
            className={`absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl bg-gradient-to-r from-purple-500 to-blue-500`}
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              bottom: '10%',
              left: '10%',
              transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px)`,
            }}
          />
        </div>

        {/* Header with Glass Effect */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 border-b border-opacity-20 backdrop-blur-xl bg-opacity-80"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img src="/image.png" alt="Logo" className="h-8" />
              <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Vizuara AI Lab
              </h1>
            </motion.div>
            <ThemeToggle isDark={isDark} onToggle={setIsDark} />
          </div>
        </motion.nav>

        {/* Mouse Guide */}
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-sm text-slate-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <MousePointer2 className="w-4 h-4" />
          <span>Move mouse to interact with the background</span>
        </motion.div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          <motion.div 
            className="max-w-7xl mx-auto"
            style={{ y: textY }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div 
                className="flex justify-center mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="relative">
                  <Sparkles className={`w-12 h-12 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>

              <motion.h1 
                className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Visualize{' '}
                <motion.span 
                  className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  AI Concepts
                </motion.span>
              </motion.h1>

              <motion.p 
                className={`text-xl md:text-2xl mb-12 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience the inner workings of AI through interactive visualizations
              </motion.p>

              {/* Scrolling Text Banner */}
              <motion.div 
                className={`py-4 mb-12 ${isDark ? 'text-slate-400' : 'text-slate-500'} text-lg overflow-hidden`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <ParallaxText>
                  Matrix Operations • Neural Networks • Attention Mechanisms • Deep Learning • Transformers • 
                </ParallaxText>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Learning Modules Cards with 3D Effect */}
        <section className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className={`
                      relative overflow-hidden p-6 cursor-pointer group
                      ${isDark ? 'bg-slate-800/50 hover:bg-slate-800/70' : 'bg-white hover:bg-slate-50'}
                      border ${isDark ? 'border-slate-700' : 'border-slate-200'}
                      transition-all duration-300 hover:scale-105 hover:shadow-xl
                    `}
                    onClick={() => module.status === 'available' && setSelectedModule(module.id)}
                    style={{
                      transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
                    }}
                  >
                    <div className={`
                      absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300
                      bg-gradient-to-r ${module.gradient}
                    `} />
                    
                    <div className="relative z-10">
                      <module.icon className={`w-6 h-6 float-right bg-gradient-to-r ${module.gradient} bg-clip-text text-transparent mb-2`} />
                      <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {module.title}
                      </h3>
                      
                      <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {module.description}
                      </p>

                      <div className="mb-4">
                        <ul className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {module.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 mb-1">
                              <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${module.gradient}`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {module.status === 'available' ? (
                        <Button
                          className={`
                            w-full group-hover:bg-gradient-to-r ${module.gradient}
                            group-hover:text-white transition-all duration-300
                            ${isDark ? 'text-slate-300' : 'text-slate-600'}
                          `}
                        >
                          <span>Start Learning</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <GitBranch className="w-4 h-4" />
                          <span>Coming Soon</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Concept Visualization Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <CodeParticles />
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-20 transform -rotate-6" />
                <div className="relative">
                  <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Experience AI Like Never Before
                  </h2>
                  <p className={`text-lg mb-8 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Our interactive visualizations transform complex mathematical concepts into 
                    intuitive, visual experiences. See how data flows through neural networks 
                    and understand the mathematics behind modern AI.
                  </p>
                  <div className="flex flex-col gap-4">
                    {[
                      "Interactive matrix operations",
                      "Real-time attention visualization",
                      "Step-by-step concept breakdown"
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`flex items-center gap-3 ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        <div className="h-1 w-1 rounded-full bg-blue-500" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20" />
                  <AIConceptVisual isDark={isDark} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section with improved spacing and transitions */}
        <section className="py-32 px-6 relative">
          <motion.div
            style={{
              y: sectionY,
              opacity: sectionOpacity
            }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-20"
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500`}>
                Powerful Learning Features
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Advanced tools designed to make learning AI concepts intuitive and engaging
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <FeatureCard feature={feature} isDark={isDark} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Interactive Elements Section with smooth animations */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <CodeParticles />
            </motion.div>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="relative">
                  <motion.h2 
                    className={`text-4xl md:text-5xl font-bold mb-8 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    Master the Future of{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Machine Learning
                    </span>
                  </motion.h2>
                  <div className="space-y-6">
                    {[
                      "Hands-on neural network exploration",
                      "Interactive deep learning concepts",
                      "Visual transformer architecture"
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className={`flex items-center gap-4 ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        <span className="text-lg">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex justify-center"
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <AIConceptVisual isDark={isDark} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Learning Path Section */}
        <section className="py-24 px-6 relative">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, ${
                isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)'
              } 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Choose Your Path
              </h2>
              <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Start your journey into AI with our carefully crafted learning modules
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className={`
                      relative overflow-hidden p-6 cursor-pointer group
                      ${isDark ? 'bg-slate-800/50 hover:bg-slate-800/70' : 'bg-white hover:bg-slate-50'}
                      border ${isDark ? 'border-slate-700' : 'border-slate-200'}
                      transition-all duration-300 hover:scale-105 hover:shadow-xl
                    `}
                    onClick={() => module.status === 'available' && setSelectedModule(module.id)}
                    style={{
                      transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
                    }}
                  >
                    <div className={`
                      absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300
                      bg-gradient-to-r ${module.gradient}
                    `} />
                    
                    <div className="relative z-10">
                      <module.icon className={`w-6 h-6 float-right bg-gradient-to-r ${module.gradient} bg-clip-text text-transparent mb-2`} />
                      <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {module.title}
                      </h3>
                      
                      <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {module.description}
                      </p>

                      <div className="mb-4">
                        <ul className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {module.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 mb-1">
                              <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${module.gradient}`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {module.status === 'available' ? (
                        <Button
                          className={`
                            w-full group-hover:bg-gradient-to-r ${module.gradient}
                            group-hover:text-white transition-all duration-300
                            ${isDark ? 'text-slate-300' : 'text-slate-600'}
                          `}
                        >
                          <span>Start Learning</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <GitBranch className="w-4 h-4" />
                          <span>Coming Soon</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Connect With Us
              </h2>
              <p className={`text-lg mb-12 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Join our community and stay updated with the latest developments
              </p>
              
              <div className="flex justify-center gap-6">
                {socialLinks.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`
                      group flex flex-col items-center gap-2 p-4 rounded-lg
                      ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}
                      transition-all duration-300
                    `}
                  >
                    <div className={`
                      p-4 rounded-full 
                      ${isDark ? 'bg-slate-800/50' : 'bg-slate-100/80'}
                      group-hover:scale-110 transition-transform duration-300
                    `}>
                      <item.icon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {item.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Floating Call to Action */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={() => setSelectedModule('self-attention')}
            size="lg"
            className={`
              px-6 py-6 text-lg rounded-full
              bg-gradient-to-r from-blue-500 to-purple-500
              hover:from-blue-600 hover:to-purple-600
              text-white font-semibold
              transition-all duration-300 ease-out
              hover:scale-110 hover:shadow-2xl
              ${isDark ? 'shadow-blue-500/25' : 'shadow-blue-500/20'}
              group
            `}
          >
            <span>Start Learning</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </ThemeProvider>
  );
}
