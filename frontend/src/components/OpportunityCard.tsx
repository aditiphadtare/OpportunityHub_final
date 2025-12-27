import React, { useState } from 'react';
import { typeLabels, getCardColor, CardColor } from '@/lib/mock-data';
import { Opportunity } from '@/services/opportunityService';
import { MapPin, Bookmark, BookmarkCheck, Clock, Building2, ExternalLink, Lightbulb, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchRecommendations } from '@/services/resumeService';
import { useAuth } from '@/lib/auth-context';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  colorIndex: number;
}

const cardColorClasses: Record<CardColor, string> = {
  purple: 'bg-card-purple',
  blue: 'bg-card-blue',
  grey: 'bg-card-grey',
  green: 'bg-card-green',
  pink: 'bg-card-pink',
  orange: 'bg-card-orange',
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isWishlisted = false,
  onWishlistToggle,
  colorIndex,
}) => {
  const { user } = useAuth();
  const cardColor = getCardColor(colorIndex);
  const deadline = new Date(opportunity.deadline);
  const today = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const [isGuidanceLoading, setIsGuidanceLoading] = useState(false);
  const [guidance, setGuidance] = useState<any>(null);

  // Use live match percentage if available
  const matchPercentage = opportunity.matchPercentage || (user?.resumeText ? 75 : 0);

  const getTypeColor = () => {
    switch (opportunity.type) {
      case 'hackathon': return 'bg-accent-green/20 text-accent-green';
      case 'internship': return 'bg-primary/40 text-primary-dark';
      case 'job': return 'bg-accent-blue/20 text-accent-blue';
      case 'tech-event': return 'bg-accent-orange/20 text-accent-orange';
      case 'college-fest': return 'bg-accent-pink/20 text-accent-pink';
      default: return 'bg-secondary text-foreground';
    }
  };

  const handleFetchGuidance = async () => {
    if (guidance) return;
    setIsGuidanceLoading(true);
    try {
      const data = await fetchRecommendations({
        type: opportunity.type,
        domains: opportunity.domains
      });
      setGuidance(data);
    } catch (error) {
      console.error("Failed to fetch guidance:", error);
    } finally {
      setIsGuidanceLoading(false);
    }
  };

  return (
    <div className={`rounded-xl p-5 transition-all duration-200 hover:shadow-hover border border-border/30 ${cardColorClasses[cardColor]}`}>
      {/* Type Badge and Match */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className={`text-xs font-medium ${getTypeColor()}`}>
            {typeLabels[opportunity.type]}
          </Badge>
          {matchPercentage > 0 && (
            <div className="flex items-center gap-1.5" title="Match Score based on Resume">
              <span className="text-[10px] font-bold text-primary-dark">{matchPercentage}%</span>
              <Progress value={matchPercentage} className="w-12 h-1" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="p-1 rounded-md hover:bg-background/50 transition-colors"
                onClick={handleFetchGuidance}
              >
                <Lightbulb className="w-4 h-4 text-yellow-500" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Career Guidance & Tips
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {isGuidanceLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : guidance ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-primary" />
                        Winning Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {guidance.improvements?.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        Relevant Projects
                      </h4>
                      <ul className="space-y-2">
                        {guidance.projects?.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Could not load suggestions. Please try again.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <button
            onClick={() => onWishlistToggle?.(opportunity.id)}
            className="p-1 rounded-md hover:bg-background/50 transition-colors"
          >
            {isWishlisted ? (
              <BookmarkCheck className="w-4 h-4 text-primary-dark" />
            ) : (
              <Bookmark className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-primary-dark mb-2 line-clamp-2">
        {opportunity.title}
      </h3>

      {/* Organization */}
      <div className="flex items-center gap-1.5 mb-3">
        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{opportunity.organization}</span>
      </div>

      {/* Domains */}
      <div className="flex flex-wrap gap-1.5">
        {opportunity.domains.slice(0, 3).map((domain) => (
          <Badge
            key={domain}
            variant="secondary"
            className="text-xs font-normal px-2 py-0.5"
          >
            {domain}
          </Badge>
        ))}
      </div>

      {/* Highlighted info below domains */}
      <div className="mt-2 text-xs font-semibold text-foreground mb-4">
        {opportunity.type === 'hackathon' && opportunity.reward && (
          <span>Prize: {opportunity.reward}</span>
        )}

        {opportunity.type === 'job' && opportunity.stipend && (
          <span>Salary: {opportunity.stipend}</span>
        )}

        {opportunity.type === 'internship' && (
          <span>{opportunity.stipend ? 'Paid Internship' : 'Unpaid Internship'}</span>
        )}

        {(opportunity.type === 'tech-event' ||
          opportunity.type === 'college-fest') && (
            <span>Certificate will be provided</span>
          )}
      </div>


      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-foreground/10">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {opportunity.isRemote ? 'Remote' : opportunity.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        {daysLeft <= 7 && daysLeft > 0 && (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
            {daysLeft}d left
          </Badge>
        )}
      </div>

      {/* Apply Now */}
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-3 text-sm bg-background/50 hover:bg-background"
        onClick={() => opportunity.link && window.open(opportunity.link, '_blank')}
      >
        {opportunity.type === 'job' || opportunity.type === 'internship' ? 'Apply Now' : 'Register Now'}
        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
      </Button>
    </div>
  );
};

export default OpportunityCard;