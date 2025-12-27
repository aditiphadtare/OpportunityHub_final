import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  OpportunityType,
} from '@/lib/mock-data';
import { Opportunity, fetchOpportunities } from '@/services/opportunityService';
import Navbar from '@/components/Navbar';
import OpportunityCard from '@/components/OpportunityCard';
import FiltersSidebar from '@/components/FiltersSidebar';
import UpcomingDeadlines from '@/components/UpcomingDeadlines';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated, isLoading: authLoading, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const loadOpportunities = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      try {
        const data = await fetchOpportunities({
          type: selectedTypes.length > 0 ? selectedTypes[0] : undefined,
          domains: user?.domains,
          location: user?.location,
          resumeText: user?.resumeText
        });
        setOpportunities(data);
      } catch (error) {
        console.error("Failed to load opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
  }, [isAuthenticated, selectedTypes, user?.domains, user?.location, user?.resumeText]);

  const handleWishlistToggle = async (id: string) => {
    await toggleWishlist(id);
  };

  const filteredOpportunities = useMemo(() => {
    if (!searchQuery) return opportunities;

    const query = searchQuery.toLowerCase();
    return opportunities.filter((opp) => {
      return (
        opp.title.toLowerCase().includes(query) ||
        opp.organization.toLowerCase().includes(query) ||
        opp.domains.some(d => d.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, opportunities]);

  const urgentCount = opportunities.filter(opp => {
    const deadlineDate = new Date(opp.deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7;
  }).length;

  const typeFilters: { type: OpportunityType | 'all'; label: string }[] = [
    { type: 'all', label: 'All' },
    { type: 'hackathon', label: 'Hackathons' },
    { type: 'tech-event', label: 'Events' },
    { type: 'college-fest', label: 'Fests' },
    { type: 'internship', label: 'Internships' },
    { type: 'job', label: 'Jobs' },
  ];

  const handleTypeFilter = (type: OpportunityType | 'all') => {
    if (type === 'all') {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([type]);
    }
  };

  if (authLoading || (isLoading && opportunities.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} showSearch />

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <FiltersSidebar
              selectedTypes={selectedTypes}
              onTypeChange={setSelectedTypes}
              matchPercentage={user?.resumeText ? opportunities[0]?.matchPercentage || 75 : 0}
              availableCount={opportunities.length}
              wishlistedCount={user?.wishlist?.length || 0}
              urgentCount={urgentCount}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Type Filter Pills */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {typeFilters.map(({ type, label }) => (
                <Button
                  key={type}
                  variant={
                    (type === 'all' && selectedTypes.length === 0) ||
                      (type !== 'all' && selectedTypes.includes(type))
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  onClick={() => handleTypeFilter(type)}
                  className="shrink-0"
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
                <p className="text-2xl font-bold text-primary-dark">{opportunities.length}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
                <p className="text-2xl font-bold text-primary-dark">{user?.wishlist?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Wishlisted</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
                <p className="text-2xl font-bold text-destructive">{urgentCount}</p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>

            {/* Opportunities Grid */}
            {isLoading && opportunities.length > 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filteredOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOpportunities.map((opportunity, index) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    isWishlisted={user?.wishlist?.includes(opportunity.id)}
                    onWishlistToggle={handleWishlistToggle}
                    colorIndex={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border border-border/50">
                <p className="text-muted-foreground">No opportunities found matching your criteria.</p>
                <Button variant="soft" onClick={() => setSelectedTypes([])} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-72 shrink-0">
            <UpcomingDeadlines
              opportunities={
                opportunities.filter(opp => user?.wishlist?.includes(opp.id)).length > 0
                  ? opportunities.filter(opp => user?.wishlist?.includes(opp.id))
                  : opportunities
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;