export const domains = [
  "Web Development",
  "Mobile Development",
  "AI/ML",
  "Data Science",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "UI/UX Design",
  "Blockchain",
  "IoT",
  "Game Development",
  "Other"
];

export const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Kochi",
  "Indore",
  "Nagpur",
  "Coimbatore",
  "Remote / Pan-India"
];

export type OpportunityType = 'hackathon' | 'tech-event' | 'college-fest' | 'internship' | 'job';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  location: string;
  deadline: string;
  domains: string[];
  description: string;
  stipend?: string;
  duration?: string;
   reward?: string; 
  isRemote: boolean;
  logoUrl?: string;
}

const cardColors = ['purple', 'blue', 'grey', 'green', 'pink', 'orange'] as const;
export type CardColor = typeof cardColors[number];

export const getCardColor = (index: number): CardColor => {
  return cardColors[index % cardColors.length];
};

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Smart India Hackathon 2025',
    organization: 'Government of India',
    type: 'hackathon',
    location: 'Pan-India',
    deadline: '2025-02-15',
    domains: ['AI/ML', 'Web Development', 'IoT'],
    description: 'National level hackathon to solve real-world problems.',
    reward: '₹5,00,000 Prize Pool',
    isRemote: false,
  },
  {
    id: '2',
    title: 'Frontend Developer Intern',
    organization: 'TechCorp India',
    type: 'internship',
    location: 'Bangalore',
    deadline: '2025-01-30',
    domains: ['Web Development', 'UI/UX Design'],
    description: 'Work on cutting-edge React applications.',
    stipend: '₹25,000/month',
    duration: '6 months',
    isRemote: true,
  },
  {
    id: '3',
    title: 'TechFest 2025',
    organization: 'IIT Bombay',
    type: 'college-fest',
    location: 'Mumbai',
    deadline: '2025-01-20',
    domains: ['AI/ML', 'Robotics', 'Web Development'],
    description: 'Asia\'s largest science and technology festival.',
    isRemote: false,
  },
  {
    id: '4',
    title: 'ML Engineer',
    organization: 'AI Startup',
    type: 'job',
    location: 'Hyderabad',
    deadline: '2025-02-28',
    domains: ['AI/ML', 'Data Science'],
    description: 'Build production ML systems.',
    stipend: '₹18-25 LPA',
    isRemote: true,
  },
  {
    id: '5',
    title: 'Cloud DevOps Workshop',
    organization: 'AWS India',
    type: 'tech-event',
    location: 'Delhi',
    deadline: '2025-01-25',
    domains: ['Cloud Computing', 'DevOps'],
    description: 'Hands-on workshop on AWS services.',
    isRemote: false,
  },
  {
    id: '6',
    title: 'HackWithIndia',
    organization: 'Startup India',
    type: 'hackathon',
    location: 'Remote',
    deadline: '2025-02-10',
    domains: ['Web Development', 'Mobile Development', 'Blockchain'],
    description: '48-hour online hackathon with amazing prizes.',
    reward: '₹1,00,000 Prize Pool',
    isRemote: true,
  },
  {
    id: '7',
    title: 'Data Science Intern',
    organization: 'Analytics Pro',
    type: 'internship',
    location: 'Pune',
    deadline: '2025-01-28',
    domains: ['Data Science', 'AI/ML'],
    description: 'Work with big data and analytics.',
    stipend: '₹20,000/month',
    duration: '3 months',
    isRemote: false,
  },
  {
    id: '8',
    title: 'Riviera 2025',
    organization: 'VIT Vellore',
    type: 'college-fest',
    location: 'Chennai',
    deadline: '2025-02-05',
    domains: ['All Domains'],
    description: 'International techno-cultural fest.',
    isRemote: false,
  },
  {
    id: '9',
    title: 'Cybersecurity Analyst',
    organization: 'SecureNet',
    type: 'job',
    location: 'Bangalore',
    deadline: '2025-03-01',
    domains: ['Cybersecurity'],
    description: 'Protect enterprise systems from threats.',
    stipend: '₹12-18 LPA',
    isRemote: true,
  },
  {
    id: '10',
    title: 'React Conference India',
    organization: 'React India Community',
    type: 'tech-event',
    location: 'Goa',
    deadline: '2025-02-20',
    domains: ['Web Development'],
    description: 'Learn from React experts worldwide.',
    isRemote: false,
  },
  {
    id: '11',
    title: 'UI/UX Design Intern',
    organization: 'DesignHub',
    type: 'internship',
    location: 'Mumbai',
    deadline: '2025-01-22',
    domains: ['UI/UX Design'],
    description: 'Create beautiful user experiences.',
    stipend: '₹15,000/month',
    duration: '4 months',
    isRemote: true,
  },
  {
    id: '12',
    title: 'Code Gladiators',
    organization: 'TechGig',
    type: 'hackathon',
    location: 'Pan-India',
    deadline: '2025-02-18',
    domains: ['All Domains'],
    description: 'India\'s biggest coding competition.',
    reward: '₹10,000 Prize Pool',
    isRemote: true,
  },
];

export const typeLabels: Record<OpportunityType, string> = {
  'hackathon': 'Hackathon',
  'tech-event': 'Tech Event',
  'college-fest': 'College Fest',
  'internship': 'Internship',
  'job': 'Job',
};

export const typeColors: Record<OpportunityType, string> = {
  'hackathon': 'purple',
  'tech-event': 'blue',
  'college-fest': 'pink',
  'internship': 'green',
  'job': 'orange',
};
// -----------------------------
// Resume Analysis Mock Data
// -----------------------------

export interface ResumeAnalysis {
  score: number;
  status: string;
  strengths: string[];
  suggestions: string[];
}

export const mockResumeAnalysis: ResumeAnalysis = {
  score: 78,
  status: "Good Match",
  strengths: [
    "Strong React & TypeScript skills",
    "Good project portfolio",
    "Relevant internship experience",
  ],
  suggestions: [
    "Add more backend experience",
    "Include cloud certifications",
    "Quantify project impact",
  ],
};
// -----------------------------
// Dummy Upcoming Deadlines
// -----------------------------

export const mockUpcomingOpportunities: Opportunity[] = [
  {
    id: 'u1',
    title: 'AI Innovation Hackathon',
    organization: 'Tech Innovators',
    type: 'hackathon',
    location: 'Remote',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days later
    domains: ['AI/ML'],
    description: 'Build innovative AI solutions.',
    isRemote: true,
  },
  {
    id: 'u2',
    title: 'Frontend Intern',
    organization: 'Startup Labs',
    type: 'internship',
    location: 'Bangalore',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days later
    domains: ['Web Development'],
    description: 'Work on real-world React apps.',
    stipend: '₹20,000/month',
    duration: '3 months',
    isRemote: false,
  },
  {
    id: 'u3',
    title: 'Cloud Workshop',
    organization: 'AWS Community',
    type: 'tech-event',
    location: 'Mumbai',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    domains: ['Cloud Computing'],
    description: 'Hands-on cloud workshop.',
    isRemote: false,
  },
];
