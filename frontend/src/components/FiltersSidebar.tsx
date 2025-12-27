import React from 'react';
import { OpportunityType, typeLabels } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { Code, MapPin, Settings, Sparkles, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockResumeAnalysis } from '@/lib/mock-data';


interface FiltersProps {
  selectedTypes: OpportunityType[];
  onTypeChange: (types: OpportunityType[]) => void;
  matchPercentage?: number;
  availableCount?: number;
  wishlistedCount?: number;
  urgentCount?: number;
}

const FiltersSidebar: React.FC<FiltersProps> = ({
  selectedTypes,
  onTypeChange,
  matchPercentage = 78,
  availableCount = 6,
  wishlistedCount = 0,
  urgentCount = 2,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const opportunityTypes: OpportunityType[] = ['hackathon', 'tech-event', 'college-fest', 'internship', 'job'];

  const toggleType = (type: OpportunityType) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const getMatchStatus = () => {
    if (matchPercentage >= 80) return { label: 'Excellent Match', color: 'text-accent-green' };
    if (matchPercentage >= 60) return { label: 'Good Match', color: 'text-primary-dark' };
    return { label: 'Fair Match', color: 'text-accent-orange' };
  };

  const matchStatus = getMatchStatus();

  return (
    <div className="space-y-4">
      {/* Preferences Card */}
      <div className="bg-card rounded-xl p-5 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Your Preferences</h3>
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => navigate('/profile')}>
            <Settings className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Domains */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Code className="w-4 h-4" />
            <span>Domains</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {user?.domains?.slice(0, 3).map((domain) => (
              <Badge key={domain} variant="secondary" className="text-xs font-normal">
                {domain}
              </Badge>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span>Locations</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs font-normal">Remote</Badge>
            <Badge variant="secondary" className="text-xs font-normal">{user?.location || 'Pan-India'}</Badge>
          </div>
        </div>

        <Link to="/profile">
          <Button variant="outline" size="sm" className="w-full text-sm">
            Edit Preferences
            <span className="ml-1">→</span>
          </Button>
        </Link>
      </div>

      {/* Resume Analysis Card */}
      <div className="bg-card rounded-xl p-5 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-dark" />
            <h3 className="font-semibold text-foreground">Resume Analysis</h3>
          </div>
          <Link to="/resume-analysis">
            <Button variant="ghost" size="sm" className="text-xs text-primary-dark h-auto py-1 px-2">
              Update
            </Button>
          </Link>
        </div>

        {/* Circular Progress */}
        <div className="flex justify-center mb-4">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(matchPercentage / 100) * 301.6} 301.6`}
                strokeLinecap="round"
                className="text-primary-dark"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{matchPercentage}%</span>
              <span className="text-xs text-muted-foreground">Overall</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent-green" />
          <span className={`text-sm font-medium ${matchStatus.color}`}>{matchStatus.label}</span>
        </div>
        {/* Strengths */}
<div className="mt-4">
  <h4 className="text-xs font-semibold text-green-600 mb-2">
    Strengths
  </h4>
  <ul className="space-y-2">
    {mockResumeAnalysis.strengths.map((strength, index) => (
      <li
        key={index}
        className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-xs"
      >
        {strength}
      </li>
    ))}
  </ul>
</div>

{/* Suggestions */}
<div className="mt-4">
  <h4 className="text-xs font-semibold text-orange-500 mb-2">
    Suggestions
  </h4>
  <ul className="space-y-2">
    {mockResumeAnalysis.suggestions.map((suggestion, index) => (
      <li
        key={index}
        className="bg-orange-50 text-orange-700 px-3 py-2 rounded-md text-xs"
      >
        {suggestion}
      </li>
    ))}
  </ul>
</div>
      </div>
    </div>
  );
};

export default FiltersSidebar;