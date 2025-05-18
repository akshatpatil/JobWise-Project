
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Bell, 
  Search, 
  User, 
  MessageSquare,
  Briefcase,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const TopNavBar = () => {
  const { currentUser, logout } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      className="sticky top-0 z-20 w-full backdrop-blur-lg bg-charcoal/80 border-b border-white/10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="hidden md:flex items-center">
              <h2 className="text-xl font-clash font-bold text-gradient">JobWise</h2>
            </Link>
          </div>
          
          {/* Middle section - Search */}
          <div className={`relative max-w-md w-full mx-4 transition-all duration-300 ${
            searchFocused ? "scale-105" : ""
          }`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="text"
                placeholder="Search jobs, skills, keywords..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-lilac/50 transition-colors"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
          
          {/* Right section - Actions */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-lilac rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Briefcase className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-lilac/20">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass backdrop-blur-xl" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleLogout}>
                  <span className="text-red-400">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="flex space-x-1 overflow-x-auto pb-2 hide-scrollbar">
          {[].map((tab, i) => (
            <Button
              key={i}
              variant={i === 0 ? "default" : "ghost"}
              className={i === 0 ? "bg-lilac text-charcoal" : "text-white/70 hover:text-white"}
              size="sm"
            >
              {tab}
              {i === 0 && (
                <span className="ml-2 bg-charcoal/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  New
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TopNavBar;
