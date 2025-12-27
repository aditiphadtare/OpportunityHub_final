import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, FileText, Bookmark, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ searchQuery = '', onSearchChange, showSearch = true }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border/50">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-[#ffffff] font-bold text-lg">O</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-green rounded-full border-2 border-background" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-primary-dark">Opportunity</span>
              <span className="text-xl font-light text-foreground">Hub</span>
            </div>
          </Link>

          {/* Center Search */}
          {showSearch && onSearchChange && (
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-11 bg-secondary/50 border-0 h-10"
                />
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent-green rounded-full" />
            </Button>
            
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Bookmark className="w-5 h-5 text-muted-foreground" />
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-border">
                  <User className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-semibold text-foreground">{user?.username}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/resume-analysis')} className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Resume Analysis
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wishlist')} className="cursor-pointer">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Wishlist
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;