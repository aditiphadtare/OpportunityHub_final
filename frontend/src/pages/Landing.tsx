import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Target, FileText, Calendar, Users } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Target,
      title: 'Personalized Opportunities',
      description: 'Get hackathons, internships, and jobs tailored to your skills and location.',
      color: 'bg-card-purple',
    },
    {
      icon: FileText,
      title: 'Resume Analysis',
      description: 'Match your resume with job descriptions and get improvement suggestions.',
      color: 'bg-card-blue',
    },
    {
      icon: Calendar,
      title: 'Deadline Tracking',
      description: 'Never miss an application deadline with our smart wishlist feature.',
      color: 'bg-card-green',
    },
    {
      icon: Users,
      title: 'Student-Focused',
      description: 'Designed specifically for students looking to kickstart their careers.',
      color: 'bg-card-pink',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <span className="text-[#ffffff] font-bold text-xl">O</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-green rounded-full border-2 border-background" />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-primary-dark">Opportunity</span>
                <span className="text-2xl font-light text-foreground">Hub</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="default">Get Started</Button>
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto animate-slide-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              Your Gateway to{' '}
              <span className="text-primary-dark">Amazing</span>{' '}
              Opportunities
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover hackathons, tech events, internships, and jobs perfectly matched to your skills, 
              interests, and location. All in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From discovering opportunities to perfecting your resume, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`${feature.color} rounded-2xl p-6 hover:shadow-hover transition-all duration-300 hover:-translate-y-1`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-background/60 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-dark" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark to-primary/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ffffff] mb-6">
            Ready to unlock your potential?
          </h2>
          <p className="text-xl text-[#ffffff]/80 mb-10">
            Join thousands of students who have found their dream opportunities through OpportunityHub.
          </p>
          <Link to="/signup">
            <Button
              size="xl"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl"
            >
              Create Your Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-[#ffffff] font-bold text-sm">O</span>
              </div>
              <div className="flex items-baseline">
                <span className="font-semibold text-primary-dark">Opportunity</span>
                <span className="font-light text-foreground">Hub</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 OpportunityHub. Made for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
