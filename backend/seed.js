const { admin, db } = require('./src/config/firebase');

const mockOpportunities = [
    {
        title: 'Smart India Hackathon 2025',
        organization: 'Government of India',
        type: 'hackathon',
        location: 'Pan-India',
        deadline: '2025-02-15',
        domains: ['AI/ML', 'Web Development', 'IoT'],
        description: 'National level hackathon to solve real-world problems.',
        reward: '₹5,00,000 Prize Pool',
        isRemote: false,
        link: 'https://sih.gov.in',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
        title: 'Frontend Developer Intern',
        organization: 'TechCorp India',
        type: 'internship',
        location: 'Bangalore',
        deadline: '2025-02-10',
        domains: ['Web Development', 'UI/UX Design'],
        description: 'Work on cutting-edge React applications using tailwind and shadcn.',
        stipend: '₹25,000/month',
        duration: '6 months',
        isRemote: true,
        link: 'https://techcorp.com/careers',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
        title: 'TechFest 2025',
        organization: 'IIT Bombay',
        type: 'college-fest',
        location: 'Mumbai',
        deadline: '2025-01-20',
        domains: ['AI/ML', 'Robotics', 'Web Development'],
        description: "Asia's largest science and technology festival.",
        isRemote: false,
        link: 'https://techfest.org',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
        title: 'ML Engineer',
        organization: 'AI Startup',
        type: 'job',
        location: 'Hyderabad',
        deadline: '2025-03-15',
        domains: ['AI/ML', 'Data Science'],
        description: 'Build production ML systems and work with LLMs.',
        stipend: '₹18-25 LPA',
        isRemote: true,
        link: 'https://aistartup.io/jobs',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
        title: 'Google Hash Code 2025',
        organization: 'Google',
        type: 'hackathon',
        location: 'Global',
        deadline: '2025-02-28',
        domains: ['Competitive Programming', 'Algorithms'],
        description: 'A team-based programming competition where you solve a real-life engineering problem.',
        reward: 'Global Recognition & Prizes',
        isRemote: true,
        link: 'https://codingcompetitions.withgoogle.com/hashcode',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
        title: 'DevFest Bangalore',
        organization: 'GDG Bangalore',
        type: 'tech-event',
        location: 'Bangalore',
        deadline: '2025-01-15',
        domains: ['Cloud', 'Android', 'Web', 'AI'],
        description: 'Community-led developer events hosted by GDGs around the globe.',
        isRemote: false,
        link: 'https://devfest.gdgbangalore.com',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
        title: 'Microsoft Imagine Cup',
        organization: 'Microsoft',
        type: 'hackathon',
        location: 'Global',
        deadline: '2025-01-30',
        domains: ['Azure', 'AI', 'Cloud Computing'],
        description: 'A global competition for students to use their imagination and passion to create technology solutions.',
        reward: '$100,000 winner prize',
        isRemote: true,
        link: 'https://imaginecup.microsoft.com',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
        title: 'Backend Intern (Node.js)',
        organization: 'Zomato',
        type: 'internship',
        location: 'Gurugram',
        deadline: '2025-02-05',
        domains: ['Node.js', 'PostgreSQL', 'System Design'],
        description: 'Join the backend team to build scalable delivery systems.',
        stipend: '₹40,000/month',
        duration: '3 months',
        isRemote: false,
        link: 'https://zomato.com/careers',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
        title: 'Cognizance 2025',
        organization: 'IIT Roorkee',
        type: 'college-fest',
        location: 'Roorkee',
        deadline: '2025-03-10',
        domains: ['Coding', 'Robotics', 'Management'],
        description: 'The annual technical festival of IIT Roorkee.',
        isRemote: false,
        link: 'https://cognizance.org.in',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
        title: 'Deep Learning Workshop',
        organization: 'NVIDIA',
        type: 'tech-event',
        location: 'Online',
        deadline: '2025-01-25',
        domains: ['AI/ML', 'Deep Learning'],
        description: 'Hands-on workshop on training deep neural networks.',
        isRemote: true,
        link: 'https://nvidia.com/dli',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
];

async function seed() {
    console.log('🌱 Seeding opportunities...');
    const batch = db.batch();

    mockOpportunities.forEach(opp => {
        const ref = db.collection('opportunities').doc();
        batch.set(ref, opp);
    });

    await batch.commit();
    console.log('✅ Seeding complete!');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
