import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import DashboardPreview from "@/components/DashboardPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Lightbulb, Rocket } from "lucide-react";

interface ParticleProps {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

const Particle = ({ top, left, size, delay, duration }: ParticleProps) => (
  <motion.div
    className="absolute bg-lilac/20 rounded-full"
    style={{ top, left, width: size, height: size }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.5, 0] }}
    transition={{ delay: parseFloat(delay), duration: parseFloat(duration), repeat: Infinity }}
  />
);

const Index = () => {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    hero: false,
    features: false,
    benefits: false,
    cta: false
  });
  
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    benefits: useRef<HTMLDivElement>(null),
    cta: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2
    };

    const observers: IntersectionObserver[] = [];

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [key]: true }));
          }
        });
      }, observerOptions);
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const staggerDelay = 0.1;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section ref={sectionRefs.hero} className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        {/* Particles */}
        <Particle top="10%" left="20%" size="8px" delay="0" duration="8" />
        <Particle top="15%" left="80%" size="12px" delay="1" duration="10" />
        <Particle top="65%" left="75%" size="10px" delay="2" duration="7" />
        <Particle top="75%" left="10%" size="14px" delay="1.5" duration="9" />
        <Particle top="30%" left="60%" size="6px" delay="0.5" duration="12" />
        <Particle top="50%" left="30%" size="10px" delay="2.5" duration="8" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={visibleSections.hero ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-clash font-bold mb-8">
                <motion.span 
                  className="text-gradient inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Empower
                </motion.span> your resume.{" "}
                <motion.span 
                  className="text-gradient inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Understand
                </motion.span> your match.{" "}
                <motion.span 
                  className="text-gradient inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Get hired
                </motion.span> smarter.
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10 font-inter">
                JobWise uses AI to analyze your resume against job descriptions, providing smart insights and recommendations to maximize your success.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <Link to="/login">
                  <Button size="lg" className="bg-gradient-lilac hover:opacity-90 transition-opacity text-charcoal px-8 py-6 text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/#features">
                  <Button variant="outline" size="lg" className="glass glass-hover border-lilac/20 text-white hover:text-lilac px-8 py-6 text-lg">
                    See Features
                  </Button>
                </Link>
                {/* New Button for Resume Upgrader */}
                <a
                  href="https://corefunctionality1.streamlit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-lilac hover:opacity-90 transition-opacity text-charcoal px-8 py-6 text-lg"
                  >
                    Try resume upgrader
                  </Button>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={visibleSections.hero ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="mt-16 relative"
            >
              <div className="glass p-4 rounded-2xl lilac-glow">
                <div className="aspect-video w-full rounded-lg overflow-hidden relative">
                  {/* Dashboard Preview Component */}
                  <DashboardPreview />
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 glass rounded-xl rotate-12 animate-float" />
              <div className="absolute -left-4 -top-4 w-16 h-16 glass rounded-full animate-float" style={{ animationDelay: '1s' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={sectionRefs.features} id="features" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={visibleSections.features ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-5xl font-clash font-bold mb-6"
            >
              Cutting-Edge <span className="text-gradient">Features</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={visibleSections.features ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="text-white/70 max-w-2xl mx-auto"
            >
              JobWise combines powerful AI analysis with elegant design for an unmatched job application experience.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Resume Analysis",
                description: "Our AI analyzes your resume structure, content, and keywords to identify strengths and improvement areas.",
                icon: <Rocket className="text-lilac" size={24} />,
                delay: 0
              },
              {
                title: "Job Description Matching",
                description: "Upload any job description and get an instant compatibility score with detailed keyword analysis.",
                icon: <Briefcase className="text-lilac" size={24} />,
                delay: 1
              },
              {
                title: "Intelligent Recommendations",
                description: "Receive personalized suggestions to improve your resume based on industry standards and job requirements.",
                icon: <Lightbulb className="text-lilac" size={24} />,
                delay: 2
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.features ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: staggerDelay * feature.delay, duration: 0.7, ease: "easeOut" }}
              >
                <Card className="glass glass-hover h-full">
                  <CardContent className="p-6">
                    <div className="bg-lilac/10 p-3 rounded-full w-fit mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-space font-medium mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={sectionRefs.benefits} className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={visibleSections.benefits ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-clash font-bold mb-6">
                Why Choose <span className="text-gradient">JobWise</span>
              </h2>
              <p className="text-white/70 max-w-3xl mx-auto">
                Our platform combines cutting-edge AI with human-centered design to give you the edge in your job search.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={visibleSections.benefits ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="order-2 md:order-1"
              >
                <div className="glass p-6 rounded-2xl">
                  <ul className="space-y-6">
                    {[
                      "Analysis in seconds, not hours",
                      "Precise match scoring with industry standards",
                      "Actionable insights for improvement",
                      "Seamless integration with your workflow",
                      "Privacy-focused design keeps your data secure"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={visibleSections.benefits ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                        className="flex items-center"
                      >
                        <div className="h-2 w-2 bg-lilac rounded-full mr-3"></div>
                        <span className="text-white/80">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={visibleSections.benefits ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="order-1 md:order-2"
              >
                <div className="relative">
                  <div className="glass p-4 rounded-2xl overflow-hidden">
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <div className="absolute inset-0 bg-lilac/20 rounded-full animate-pulse"></div>
                          <div className="absolute inset-2 bg-lilac/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                          <div className="absolute inset-4 glass rounded-full flex items-center justify-center">
                            <span className="text-4xl font-clash font-bold text-gradient">98%</span>
                          </div>
                        </div>
                        <p className="text-white/80 font-space">Average match improvement</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -right-4 -top-4 w-20 h-20 glass rounded-xl -rotate-12 animate-float" />
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 glass rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={sectionRefs.cta} className="py-20 bg-black/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={visibleSections.cta ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-clash font-bold mb-6">
              Ready to <span className="text-gradient">transform</span> your job search?
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Join thousands of job seekers who are landing interviews faster with JobWise's AI-powered insights.
            </p>
            
            <Link to="/login">
              <Button size="lg" className="bg-gradient-lilac hover:opacity-90 transition-opacity text-charcoal px-10 py-6 text-lg animate-pulse-glow">
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-clash font-bold text-gradient">JobWise</h3>
              <p className="text-sm text-white/50 mt-1">© {new Date().getFullYear()} JobWise. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-8">
              <Link to="/" className="text-sm text-white/70 hover:text-lilac transition-colors">
                Terms
              </Link>
              <Link to="/" className="text-sm text-white/70 hover:text-lilac transition-colors">
                Privacy
              </Link>
              <Link to="/" className="text-sm text-white/70 hover:text-lilac transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
