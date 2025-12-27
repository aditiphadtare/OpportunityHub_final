import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { domains, locations } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, MapPin, Code, Save, Check } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [selectedLocation, setSelectedLocation] = useState(user?.location || '');
  const [selectedDomains, setSelectedDomains] = useState<string[]>(user?.domains || []);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    
    updateProfile({
      username,
      email,
      location: selectedLocation,
      domains: selectedDomains,
    });

    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/home')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground text-lg mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8 space-y-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-dark" />
              Personal Information
            </h2>
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Preference */}
          <div className="pt-6 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-dark" />
              Location Preference
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`p-3 rounded-xl border-2 text-left text-sm transition-all duration-200 ${
                    selectedLocation === location
                      ? 'border-primary-dark bg-primary/10 text-foreground'
                      : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Preferences */}
          <div className="pt-6 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Code className="w-5 h-5 text-primary-dark" />
              Domain Preferences
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => toggleDomain(domain)}
                  className={`p-3 rounded-xl border-2 text-left text-sm transition-all duration-200 ${
                    selectedDomains.includes(domain)
                      ? 'border-primary-dark bg-primary/10 text-foreground'
                      : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{domain}</span>
                    {selectedDomains.includes(domain) && (
                      <Check className="w-4 h-4 text-primary-dark" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-border">
            <Button
              variant="hero"
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
              <Save className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
