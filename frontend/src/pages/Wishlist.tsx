import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Bookmark, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchOpportunities, type Opportunity } from '@/services/opportunityService';
import { useToast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { isAuthenticated, user, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [wishlistedOpportunities, setWishlistedOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.wishlist?.length) {
      loadWishlist();
    } else {
      setWishlistedOpportunities([]);
      setIsLoading(false);
    }
  }, [user?.wishlist]);

  const loadWishlist = async () => {
    if (!user?.wishlist) return;

    setIsLoading(true);
    try {
      const allOpportunities = await fetchOpportunities({});
      const filtered = allOpportunities.filter(opp =>
        user.wishlist?.includes(opp.id)
      );
      setWishlistedOpportunities(filtered);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wishlist',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedByDeadline = [...wishlistedOpportunities].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate('/home')} className="mb-4">
          ← Back to Home
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="w-8 h-8 text-primary-dark" />
          <h1 className="text-3xl font-bold text-foreground">Your Wishlist</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Track your saved opportunities and their deadlines
        </p>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            Loading wishlist...
          </div>
        ) : sortedByDeadline.length > 0 ? (
          <>
            {/* Deadlines */}
            <div className="bg-card rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Upcoming Deadlines</h2>
              </div>

              <div className="space-y-3">
                {sortedByDeadline.slice(0, 5).map(opp => {
                  const daysLeft = Math.ceil(
                    (new Date(opp.deadline).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={opp.id}
                      className="flex justify-between items-center p-3 rounded-lg bg-background"
                    >
                      <div>
                        <p className="font-medium">{opp.title}</p>
                        <p className="text-xs text-muted-foreground">{opp.organization}</p>
                      </div>
                      <span className={daysLeft <= 7 ? 'text-destructive' : ''}>
                        {daysLeft} days
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedByDeadline.map((opp, index) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isWishlisted={true}
                  onWishlistToggle={toggleWishlist}
                  colorIndex={index}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl">
            <Bookmark className="w-14 h-14 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No saved opportunities yet</h2>
            <Button onClick={() => navigate('/home')}>
              Browse Opportunities
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
