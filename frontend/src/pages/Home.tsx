import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { OpportunityType } from "@/lib/mock-data";
import {
  Opportunity,
  fetchOpportunities,
  fetchWishlist,
} from "@/services/opportunityService";

import Navbar from "@/components/Navbar";
import OpportunityCard from "@/components/OpportunityCard";
import FiltersSidebar from "@/components/FiltersSidebar";
import UpcomingDeadlines from "@/components/UpcomingDeadlines";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, toggleWishlist } =
    useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------------------------- AUTH ---------------------------------- */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  /* --------------------------- FETCH OPPORTUNITIES --------------------------- */
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const loadOpportunities = async () => {
      setIsLoading(true);
      try {
        const data = await fetchOpportunities({
          location: user.location,
          domains: user.domains,
        });
        setOpportunities(data);
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
  }, [isAuthenticated, user?.location, user?.domains]);

  /* ----------------------------- FETCH WISHLIST ------------------------------ */
  useEffect(() => {
    if (!user?.uid) return;

    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist(user.uid);
        setWishlistItems(data);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      }
    };

    loadWishlist();
  }, [user?.uid]);

  /* --------------------------- WISHLIST TOGGLING ------------------------------ */
  const handleWishlistToggle = async (id: string) => {
    await toggleWishlist(id);

    // refresh wishlist after toggle
    if (user?.uid) {
      const data = await fetchWishlist(user.uid);
      setWishlistItems(data);
    }
  };

  /* ---------------------------- SEARCH FILTERING ----------------------------- */
  const filteredOpportunities = useMemo(() => {
    let data = opportunities;

    // UI type pills (frontend only)
    if (selectedTypes.length > 0) {
      data = data.filter((opp) => selectedTypes.includes(opp.type as any));
    }

    if (!searchQuery) return data;

    const q = searchQuery.toLowerCase();
    return data.filter(
      (opp) =>
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.domains?.some((d) => d.toLowerCase().includes(q))
    );
  }, [opportunities, selectedTypes, searchQuery]);

  /* ----------------------------- URGENT COUNT -------------------------------- */
  const urgentCount = filteredOpportunities.filter((opp) => {
    if (!opp.deadline) return false;

    const daysLeft =
      (new Date(opp.deadline).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);

    return daysLeft <= 7;
  }).length;

  /* ------------------------------ TYPE PILLS --------------------------------- */
  const typeFilters: { type: OpportunityType | "all"; label: string }[] = [
    { type: "all", label: "All" },
    { type: "hackathon", label: "Hackathons" },
    { type: "tech-event", label: "Events" },
    { type: "college-fest", label: "Fests" },
    { type: "internship", label: "Internships" },
    { type: "job", label: "Jobs" },
  ];

  const handleTypeFilter = (type: OpportunityType | "all") => {
    if (type === "all") setSelectedTypes([]);
    else setSelectedTypes([type]);
  };

  /* -------------------------------- LOADING --------------------------------- */
  if (authLoading || (isLoading && opportunities.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  /* ---------------------------------- UI ------------------------------------ */
  return (
    <div className="min-h-screen bg-background">
      <Navbar
        showSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* LEFT */}
          <div className="hidden lg:block w-64 shrink-0">
            <FiltersSidebar
              selectedTypes={selectedTypes}
              onTypeChange={setSelectedTypes}
              availableCount={filteredOpportunities.length}
              wishlistedCount={wishlistItems.length}
              urgentCount={urgentCount}
            />
          </div>

          {/* CENTER */}
          <div className="flex-1">
            {/* Type Pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {typeFilters.map(({ type, label }) => (
                <Button
                  key={type}
                  size="sm"
                  variant={
                    (type === "all" && selectedTypes.length === 0) ||
                      selectedTypes.includes(type as any)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleTypeFilter(type)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Stat label="Available" value={filteredOpportunities.length} />
              <Stat label="Wishlisted" value={wishlistItems.length} />
              <Stat label="Urgent" value={urgentCount} danger />
            </div>

            {/* Cards */}
            {filteredOpportunities.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredOpportunities.map((opp, idx) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    colorIndex={idx}
                    isWishlisted={wishlistItems.some((w) => w.id === opp.id)}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border">
                <p className="text-muted-foreground">
                  No opportunities found matching your criteria.
                </p>
                <Button className="mt-4" onClick={() => setSelectedTypes([])}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden xl:block w-72 shrink-0">
            <UpcomingDeadlines
              opportunities={
                wishlistItems.length > 0 ? wishlistItems : opportunities
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

/* ----------------------------- STAT COMPONENT ----------------------------- */
const Stat = ({
  label,
  value,
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) => (
  <div className="bg-card border rounded-xl p-4 text-center">
    <p
      className={`text-2xl font-bold ${danger ? "text-destructive" : "text-primary"
        }`}
    >
      {value}
    </p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default Home;
