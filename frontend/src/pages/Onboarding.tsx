import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { domains, locations } from '@/lib/mock-data';
import { MapPin, Code, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [otherLocation, setOtherLocation] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [otherDomain, setOtherDomain] = useState('');
  const { updatePreferences, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      const finalLocation =
        selectedLocation === 'Other' ? otherLocation : selectedLocation;

      const finalDomains = otherDomain.trim()
        ? [...selectedDomains.filter(d => d !== 'Other'), otherDomain.trim()]
        : selectedDomains.filter(d => d !== 'Other');

      // Update local auth state (Lovable / localStorage)
      updatePreferences(
        finalLocation,
        finalDomains.length > 0 ? finalDomains : selectedDomains
      );

      // Save preferences to Firestore
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);

          await updateDoc(userRef, {
            location: finalLocation,
            domain: finalDomains,
          });
        } catch (error) {
          console.error("Firestore onboarding save failed:", error);
        }
      }

      toast({
        title: 'Preferences saved!',
        description: 'Your profile has been set up successfully.',
      });

      navigate('/home');
    }
  };

  const canProceed =
    step === 1
      ? selectedLocation !== '' &&
      (selectedLocation !== 'Other' || otherLocation.trim() !== '')
      : selectedDomains.length > 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-2xl animate-slide-up">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-primary-dark" />
          <h1 className="text-2xl font-bold text-foreground">
            OpportunityHub
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${step >= 1
              ? 'bg-primary-dark text-[#ffffff]'
              : 'bg-muted text-muted-foreground'
              }`}
          >
            {step > 1 ? <Check className="w-6 h-6" /> : '1'}
          </div>
          <div
            className={`w-24 h-1 rounded ${step > 1 ? 'bg-primary-dark' : 'bg-muted'
              }`}
          />
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${step >= 2
              ? 'bg-primary-dark text-[#ffffff]'
              : 'bg-muted text-muted-foreground'
              }`}
          >
            2
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8">
          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary-dark" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Where are you located?
                </h2>
                <p className="text-muted-foreground mt-2">
                  We'll show you opportunities in and around your city
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto mb-4">
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedLocation === location
                      ? 'border-primary-dark bg-primary/10 text-foreground'
                      : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <span className="font-medium">{location}</span>
                  </button>
                ))}
                <button
                  onClick={() => setSelectedLocation('Other')}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedLocation === 'Other'
                    ? 'border-primary-dark bg-primary/10 text-foreground'
                    : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <span className="font-medium">Other</span>
                </button>
              </div>

              {selectedLocation === 'Other' && (
                <Input
                  placeholder="Enter your city..."
                  value={otherLocation}
                  onChange={e => setOtherLocation(e.target.value)}
                  className="mt-4"
                />
              )}
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-primary-dark" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  What domains interest you?
                </h2>
                <p className="text-muted-foreground mt-2">
                  Select all that apply - we'll personalize your feed
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {domains.map(domain => (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedDomains.includes(domain)
                      ? 'border-primary-dark bg-primary/10 text-foreground'
                      : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{domain}</span>
                      {selectedDomains.includes(domain) && (
                        <Check className="w-5 h-5 text-primary-dark" />
                      )}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => toggleDomain('Other')}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedDomains.includes('Other')
                    ? 'border-primary-dark bg-primary/10 text-foreground'
                    : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Other</span>
                    {selectedDomains.includes('Other') && (
                      <Check className="w-5 h-5 text-primary-dark" />
                    )}
                  </div>
                </button>
              </div>

              {selectedDomains.includes('Other') && (
                <Input
                  placeholder="Enter your domain..."
                  value={otherDomain}
                  onChange={e => setOtherDomain(e.target.value)}
                  className="mt-4"
                />
              )}
            </>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            )}
            <Button
              variant="hero"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed}
              className={step === 1 ? 'ml-auto' : ''}
            >
              {step === 2 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        <p className="text-center text-muted-foreground mt-4 text-sm">
          You can update these preferences anytime in your profile settings
        </p>
      </div>
    </div>
  );
};

export default Onboarding;

