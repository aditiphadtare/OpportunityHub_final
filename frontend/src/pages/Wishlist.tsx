import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Clock, Loader2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import OpportunityCard from "@/components/OpportunityCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { fetchWishlist, removeFromWishlist } from "@/services/opportunityService";
import { useToast } from "@/hooks/use-toast";
import type { Opportunity } from "@/services/opportunityService";

const Wishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.uid) loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await fetchWishlist(user!.uid);
      setItems(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error loading wishlist",
        description: "Could not load saved opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    await removeFromWishlist(user!.uid, id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const sorted = [...items].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/home")}>
          ← Back to Home
        </Button>

        <div className="flex items-center gap-3 my-6">
          <Bookmark className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Your Wishlist</h1>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="mx-auto w-12 h-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No saved opportunities yet
            </p>
          </div>
        ) : (
          <>
            {/* Deadlines */}
            <div className="bg-card rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" />
                <h2 className="font-semibold">Upcoming Deadlines</h2>
              </div>

              {sorted.slice(0, 5).map((opp) => {
                const days = Math.ceil(
                  (new Date(opp.deadline).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <div key={opp.id} className="flex justify-between py-2">
                    <span>{opp.title}</span>
                    <span>{days > 0 ? `${days} days left` : "Expired"}</span>
                  </div>
                );
              })}
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((opp, idx) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isWishlisted
                  onWishlistToggle={handleRemove}
                  colorIndex={idx}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
