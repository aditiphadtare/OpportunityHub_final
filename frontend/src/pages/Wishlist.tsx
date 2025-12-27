import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Bookmark, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWishlist, removeFromWishlist, type Opportunity } from '@/services/opportunityService';
import { useToast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlistedOpportunities, setWishlistedOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.uid) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const data = await fetchWishlist(user.uid);
      setWishlistedOpportunities(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast({
        title: 'Error loading wishlist',
        description: 'Failed to load your saved opportunities',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (id: string) => {
    if (!user?.uid) return;

    try {
      await removeFromWishlist(user.uid, id);
      setWishlistedOpportunities(prev => prev.filter(opp => opp.id !== id));
      toast({
        title: 'Removed from wishlist',
        description: 'Opportunity removed successfully',
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove from wishlist',
        variant: 'destructive',
      });
    }
  };

  const sortedByDeadline = [...wishlistedOpportunities].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-primary-dark" />
            <h1 className="text-3xl font-bold text-foreground">Your Wishlist</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your saved opportunities and their deadlines
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-primary-dark mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your wishlist...</p>
          </div>
        ) : sortedByDeadline.length > 0 ? (
          <>
            {/* Deadline Summary */}
            <div className="bg-card rounded-2xl p-6 mb-8 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary-dark" />
                <h2 className="font-bold text-foreground">Upcoming Deadlines</h2>
              </div>
              <div className="space-y-3">
                {sortedByDeadline.slice(0, 5).map((opp) => {
                  const deadline = new Date(opp.deadline);
                  const today = new Date();
                  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div key={opp.id} className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-semibold text-foreground">{opp.title}</p>
                        <p className="text-sm text-muted-foreground">{opp.organization}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${daysLeft <= 7 ? 'text-destructive' : 'text-foreground'}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedByDeadline.map((opportunity, index) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  isWishlisted={true}
                  onWishlistToggle={handleRemoveFromWishlist}
                  colorIndex={index}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl">
            <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No saved opportunities yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring and save opportunities you're interested in
            </p>
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
