
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Lightbulb, Rocket } from "lucide-react";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    setIsLoaded(true);
    
    const timer = setTimeout(() => {
      setProgress(87);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-charcoal">
      <TopNavBar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-lilac/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-lilac">JD</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-1">John Doe</h2>
                  <p className="text-sm text-white/60 mb-4">UX/UI Designer</p>
                  
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                    <motion.div 
                      className="bg-gradient-lilac h-1.5 rounded-full" 
                      initial={{ width: "0%" }}
                      animate={{ width: isLoaded ? "70%" : "0%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    ></motion.div>
                  </div>
                  <p className="text-xs text-white/50">Profile completed: 70%</p>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="glass glass-hover">
                    My Resume
                  </Button>
                  <Button variant="outline" size="sm" className="glass glass-hover">
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Matches */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white/70">Recent Matches</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-4">
                  {[
                    { title: "Senior UX Designer", company: "Google", match: 92 },
                    { title: "Product Designer", company: "Apple", match: 87 },
                    { title: "UI/UX Lead", company: "Microsoft", match: 76 }
                  ].map((job, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div>
                        <h3 className="text-sm font-medium">{job.title}</h3>
                        <p className="text-xs text-white/60">{job.company}</p>
                      </div>
                      <div className="bg-lilac/20 px-2 py-1 rounded text-xs font-medium text-lilac">
                        {job.match}%
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Score Card */}
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold mb-1">Senior UX Designer</h2>
                    <p className="text-sm text-white/60">Google • San Francisco, CA</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-xs text-white/60">Overall Match</p>
                      <p className="text-3xl font-bold text-gradient">{progress}%</p>
                    </div>
                    <div className="w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle 
                          cx="32" cy="32" r="28" 
                          stroke="currentColor" 
                          strokeWidth="6" 
                          fill="transparent"
                          className="text-white/10" 
                        />
                        <motion.circle 
                          cx="32" cy="32" r="28" 
                          stroke="url(#circleGradient)" 
                          strokeWidth="6" 
                          fill="transparent"
                          strokeLinecap="round"
                          strokeDasharray={28 * 2 * Math.PI} 
                          strokeDashoffset={(28 * 2 * Math.PI) * ((100 - progress) / 100)}
                          initial={{ strokeDashoffset: 28 * 2 * Math.PI }}
                          animate={{ strokeDashoffset: (28 * 2 * Math.PI) * ((100 - progress) / 100) }}
                          transition={{ duration: 1.5, delay: 0.2 }}
                        />
                        <defs>
                          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#B9A6FF" />
                            <stop offset="100%" stopColor="#9b87f5" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Tabs defaultValue="breakdown" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-transparent">
                      <TabsTrigger 
                        value="breakdown"
                        className="data-[state=active]:glass data-[state=active]:text-lilac"
                      >
                        Breakdown
                      </TabsTrigger>
                      <TabsTrigger 
                        value="keywords"
                        className="data-[state=active]:glass data-[state=active]:text-lilac"
                      >
                        Keywords
                      </TabsTrigger>
                      <TabsTrigger 
                        value="improve"
                        className="data-[state=active]:glass data-[state=active]:text-lilac"
                      >
                        Improve
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="breakdown" className="mt-6">
                      <div className="space-y-4">
                        {[
                          { name: "Skills Match", score: 92 },
                          { name: "Experience", score: 85 },
                          { name: "Education", score: 90 },
                          { name: "Job Requirements", score: 78 }
                        ].map((item, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <span className="text-lilac">{item.score}%</span>
                            </div>
                            <Progress value={item.score} className="h-1.5" />
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="keywords" className="mt-6">
                      <div className="flex flex-wrap gap-2">
                        {[
                          { keyword: "UX Design", match: true },
                          { keyword: "Figma", match: true },
                          { keyword: "User Research", match: true },
                          { keyword: "Prototyping", match: true },
                          { keyword: "Wireframing", match: true },
                          { keyword: "Design Systems", match: false },
                          { keyword: "User Testing", match: true },
                          { keyword: "Accessibility", match: false },
                          { keyword: "Adobe XD", match: true }
                        ].map((keyword, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: 0.05 * index }}
                            className={`px-3 py-1.5 rounded-full text-xs ${
                              keyword.match 
                                ? "bg-lilac/20 text-lilac" 
                                : "bg-white/10 text-white/60"
                            }`}
                          >
                            {keyword.keyword}
                            {keyword.match && <span className="ml-1">✓</span>}
                            {!keyword.match && <span className="ml-1">+</span>}
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="improve" className="mt-6">
                      <div className="space-y-4">
                        {[
                          {
                            icon: <Lightbulb className="text-lilac" size={16} />,
                            title: "Add Design System Experience", 
                            description: "This job requires Design Systems knowledge which is missing from your resume."
                          },
                          {
                            icon: <Rocket className="text-lilac" size={16} />,
                            title: "Highlight Accessibility Knowledge", 
                            description: "Mention your experience with accessibility standards and guidelines."
                          },
                          {
                            icon: <Briefcase className="text-lilac" size={16} />,
                            title: "Quantify Your Achievements", 
                            description: "Add metrics to show the impact of your design work."
                          }
                        ].map((item, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                            className="bg-white/5 rounded-lg p-4 flex"
                          >
                            <div className="mr-3 mt-0.5">
                              {item.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                              <p className="text-xs text-white/60">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
            
            {/* Suggestions */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white/70">Smart Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {[
                  {
                    title: "Highlight your Figma proficiency",
                    description: "This role heavily emphasizes Figma skills. Consider adding a portfolio link showcasing your Figma projects.",
                    type: "high"
                  },
                  {
                    title: "Add quantitative results",
                    description: "Try including metrics like '95% positive user testing feedback' or '15% increase in user engagement' to your experience.",
                    type: "medium"
                  },
                  {
                    title: "Reorganize skills section",
                    description: "Place the most relevant skills for this position at the top of your skills section.",
                    type: "low"
                  }
                ].map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                    className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{suggestion.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        suggestion.type === "high" 
                          ? "bg-green-500/20 text-green-400" 
                          : suggestion.type === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {suggestion.type === "high" ? "High Impact" : suggestion.type === "medium" ? "Medium Impact" : "Helpful"}
                      </span>
                    </div>
                    <p className="text-xs text-white/60">{suggestion.description}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
