import React from 'react';
import { typeLabels } from '@/lib/mock-data';
import { Opportunity } from '@/services/opportunityService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpcomingDeadlinesProps {
  opportunities: Opportunity[];
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ opportunities }) => {

  const getDaysLeftInfo = (deadline: string | Date) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();

    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    const daysLeft = Math.floor(hoursLeft / 24);

    if (hoursLeft <= 0) {
      return { label: 'Today', color: 'text-destructive', urgent: true };
    }

    if (hoursLeft < 24) {
      return { label: `${hoursLeft} hrs`, color: 'text-destructive', urgent: true };
    }

    if (daysLeft <= 3) {
      return { label: `${daysLeft}`, color: 'text-destructive', urgent: true };
    }

    if (daysLeft <= 7) {
      return { label: `${daysLeft}`, color: 'text-accent-orange', urgent: false };
    }

    return { label: `${daysLeft}`, color: 'text-accent-green', urgent: false };
  };

  // 🔹 Filter only upcoming deadlines
  const upcomingOpportunities = opportunities
    .map((opp) => {
      const now = new Date();
      const deadlineDate = new Date(opp.deadline);
      const diffTime = deadlineDate.getTime() - now.getTime();

      return { ...opp, diffTime };
    })
    .filter((opp) => opp.diffTime >= 0)
    .sort((a, b) => a.diffTime - b.diffTime)
    .slice(0, 4);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hackathon':
        return 'bg-accent-green/20 text-accent-green';
      case 'internship':
        return 'bg-primary/30 text-primary-dark';
      case 'job':
        return 'bg-accent-blue/30 text-blue-700';
      case 'tech-event':
        return 'bg-accent-orange/30 text-orange-700';
      case 'college-fest':
        return 'bg-accent-pink/30 text-pink-700';
      default:
        return 'bg-secondary text-foreground';
    }
  };

  return (
    <div className="bg-card rounded-xl p-5 border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-dark" />
          <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
        </div>
        <Link to="/wishlist">
          <Button variant="ghost" size="sm" className="text-xs text-primary-dark h-auto py-1 px-2">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {upcomingOpportunities.map((opp) => {
          const daysInfo = getDaysLeftInfo(opp.deadline);

          return (

            <div
              key={opp.id}
              className={`p-3 rounded-lg border border-border/50 transition-colors cursor-pointer
    ${daysInfo.urgent ? 'animate-pulse border-destructive/50 bg-destructive/5' : 'hover:border-primary/30'}
  `}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Badge className={`text-[10px] px-1.5 py-0 mb-1.5 ${getTypeColor(opp.type)}`}>
                    {typeLabels[opp.type]}
                  </Badge>

                  <h4 className="font-medium text-sm text-foreground truncate">
                    {opp.title}
                  </h4>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(opp.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-lg font-bold ${daysInfo.color}`}>
                    {daysInfo.label}
                  </span>
                  {!daysInfo.label.includes('hrs') && daysInfo.label !== 'Today' && (
                    <p className="text-[10px] text-muted-foreground">days</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {upcomingOpportunities.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No upcoming deadlines
        </p>
      )}
    </div>
  );
};

export default UpcomingDeadlines;
