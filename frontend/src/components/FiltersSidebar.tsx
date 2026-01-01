// import React from 'react';
// import { OpportunityType } from '@/lib/mock-data';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/lib/auth-context';
// import { Code, MapPin, Settings, Sparkles } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// interface FiltersProps {
//   selectedTypes: OpportunityType[];
//   onTypeChange: (types: OpportunityType[]) => void;
//   availableCount?: number;
//   wishlistedCount?: number;
//   urgentCount?: number;
// }

// const FiltersSidebar: React.FC<FiltersProps> = ({
//   selectedTypes,
//   onTypeChange,
// }) => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div className="space-y-4">
//       {/* Preferences Card */}
//       <div className="bg-card rounded-xl p-5 border border-border/50">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="font-semibold text-foreground">Your Preferences</h3>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="w-7 h-7"
//             onClick={() => navigate('/profile')}
//           >
//             <Settings className="w-4 h-4 text-muted-foreground" />
//           </Button>
//         </div>

//         {/* Domains */}
//         <div className="mb-4">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
//             <Code className="w-4 h-4" />
//             <span>Domains</span>
//           </div>
//           <div className="flex flex-wrap gap-1.5">
//             {user?.domains?.slice(0, 3).map((domain) => (
//               <Badge key={domain} variant="secondary" className="text-xs font-normal">
//                 {domain}
//               </Badge>
//             ))}
//           </div>
//         </div>

//         {/* Location */}
//         <div className="mb-4">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
//             <MapPin className="w-4 h-4" />
//             <span>Locations</span>
//           </div>
//           <div className="flex flex-wrap gap-1.5">
//             <Badge variant="secondary" className="text-xs font-normal">Remote</Badge>
//             <Badge variant="secondary" className="text-xs font-normal">
//               {user?.location || 'Pan-India'}
//             </Badge>
//           </div>
//         </div>

//         <Button
//           variant="outline"
//           size="sm"
//           className="w-full text-sm"
//           onClick={() => navigate('/profile')}
//         >
//           Edit Preferences →
//         </Button>
//       </div>

//       {/* Resume Analysis Card
//       <div
//         className="bg-card rounded-xl p-5 border border-border/50 cursor-pointer hover:border-primary/40 transition"
//         onClick={() => navigate('/resume-analysis')}
//       >
//         <div className="flex items-center gap-2 mb-2">
//           <Sparkles className="w-4 h-4 text-primary-dark" />
//           <h3 className="font-semibold text-foreground hover:underline">
//             Resume Analysis
//           </h3>
//         </div>

//         <p className="text-xs text-muted-foreground text-center">
//           Click here to analyze your resume and get skill-based insights.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default FiltersSidebar; */}

// {/* Resume Analysis Card */}
// <div
//   onClick={() => navigate('/resume-analysis')}
//   className="
//     bg-card rounded-xl p-5 border border-border/50 
//     cursor-pointer transition-all
//     hover:border-primary hover:shadow-md hover:-translate-y-0.5
//     group
//   "
// >
//   <div className="flex items-center gap-2 mb-1">
//     <Sparkles className="w-4 h-4 text-primary group-hover:scale-110 transition" />
//     <h3 className="font-semibold text-foreground">
//       Resume Analysis
//     </h3>
//   </div>

//   <p className="text-xs text-muted-foreground mb-3">
//     Analyze your resume and get AI-powered skill insights.
//   </p>

//   <div className="text-sm font-medium text-primary flex items-center gap-1">
//     Analyze Resume
//     <span className="transition-transform group-hover:translate-x-1">→</span>
//   </div>
// </div>

import React from 'react';
import { OpportunityType } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { Code, MapPin, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FiltersProps {
  selectedTypes: OpportunityType[];
  onTypeChange: (types: OpportunityType[]) => void;
  availableCount?: number;
  wishlistedCount?: number;
  urgentCount?: number;
}

const FiltersSidebar: React.FC<FiltersProps> = ({
  selectedTypes,
  onTypeChange,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">

      {/* Preferences Card */}
      <div className="bg-card rounded-xl p-5 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Your Preferences</h3>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={() => navigate('/profile')}
          >
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
              <Badge
                key={domain}
                variant="secondary"
                className="text-xs font-normal"
              >
                {domain}
              </Badge>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span>Locations</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs font-normal">
              Remote
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              {user?.location || 'Pan-India'}
            </Badge>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-sm"
          onClick={() => navigate('/profile')}
        >
          Edit Preferences →
        </Button>
      </div>

      {/* Resume Analysis Card */}
      <div
        onClick={() => navigate('/resume-analysis')}
        className="
          bg-card rounded-xl p-5 border border-border/50
          cursor-pointer transition-all
          hover:border-primary hover:shadow-md hover:-translate-y-0.5
          group
        "
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary group-hover:scale-110 transition" />
          <h3 className="font-semibold text-foreground">
            Resume Analysis
          </h3>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          Analyze your resume and get AI-powered skill insights.
        </p>

        <div className="text-sm font-medium text-primary flex items-center gap-1">
          Analyze Resume
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>

    </div>
  );
};

export default FiltersSidebar;
