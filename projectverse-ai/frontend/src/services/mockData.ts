import type { User, Project, Team, Event, Conversation, CodingChallenge, Notification, Company, JobPosting, ResearchOpportunity, Startup, WorkspaceTask, LeaderboardEntry, AIConversation, AnalyticsData } from '@/types';

export const mockUser: User = {
  _id: '1',
  email: 'john.doe@college.edu',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  role: 'student',
  phone: '+1-555-0123',
  college: { name: 'Stanford University', department: 'CSE', yearOfStudy: 3, rollNumber: 'CSE2021001', graduationYear: 2025 },
  social: { github: 'github.com/johndoe', linkedin: 'linkedin.com/in/johndoe', portfolio: 'johndoe.dev' },
  scores: { codingRating: 1850, contributionScore: 7200, innovationScore: 8500, reliabilityScore: 92, placementReadiness: 78 },
  skills: [
    { name: 'React', level: 'advanced', verified: true },
    { name: 'Node.js', level: 'advanced', verified: true },
    { name: 'Python', level: 'intermediate', verified: true },
    { name: 'Machine Learning', level: 'intermediate', verified: false },
    { name: 'TypeScript', level: 'advanced', verified: true },
    { name: 'MongoDB', level: 'intermediate', verified: true },
    { name: 'Docker', level: 'beginner', verified: false },
    { name: 'AWS', level: 'beginner', verified: false },
  ],
  interests: ['AI/ML', 'Web Development', 'Open Source', 'Cloud Computing', 'DevOps'],
  achievements: [
    { title: 'Hackathon Winner', description: 'Won first place at University Hackathon 2024', date: '2024-03-15', icon: 'trophy' },
    { title: '100 Days Streak', description: 'Solved coding problems for 100 consecutive days', date: '2024-02-20', icon: 'flame' },
    { title: 'Top Contributor', description: 'Most active contributor in CSE department', date: '2024-01-10', icon: 'star' },
  ],
  certifications: [
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2024-01-15', credentialUrl: 'https://credly.com' },
    { name: 'React Developer Certificate', issuer: 'Meta', issueDate: '2023-11-20', credentialUrl: 'https://coursera.org' },
  ],
  status: 'active',
  isEmailVerified: true,
  lastActive: new Date().toISOString(),
  createdAt: '2023-09-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

export const mockProjects: Project[] = [
  {
    _id: '1', title: 'Smart Agriculture IoT Platform', description: 'A comprehensive IoT-based smart farming solution that uses sensors, ML models, and a modern web dashboard to help farmers monitor crops, predict yields, and optimize resource usage. Features real-time soil moisture tracking, automated irrigation control, and AI-powered pest detection.', shortDescription: 'IoT-based smart agriculture monitoring system with ML-powered insights',
    owner: mockUser, team: [{ userId: mockUser, role: 'Lead Developer', contribution: 'Full-stack development, ML models' }],
    thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop', screenshots: [],
    githubUrl: 'https://github.com/johndoe/smart-agri', liveUrl: 'https://smart-agri.demo', category: 'IoT', technologies: ['React', 'Node.js', 'MongoDB', 'Python', 'TensorFlow', 'MQTT'], tags: ['agriculture', 'iot', 'machine-learning', 'fullstack'],
    status: 'completed', isPublic: true, originalityScore: 85, views: 1240, likes: ['2', '3', '4'], bookmarks: ['2'], comments: [], createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-05-15T00:00:00Z',
  },
  {
    _id: '2', title: 'AI Study Assistant', description: 'An intelligent study companion powered by LLMs that helps students prepare for exams, summarize lecture notes, and generate practice questions. Supports multiple subjects and adapts to individual learning styles.', shortDescription: 'AI-powered study companion for students',
    owner: mockUser, team: [{ userId: mockUser, role: 'Solo Developer', contribution: 'Everything' }],
    thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop', screenshots: [],
    githubUrl: 'https://github.com/johndoe/ai-study-assistant', category: 'AI/ML', technologies: ['Next.js', 'Python', 'OpenAI API', 'PostgreSQL'], tags: ['ai', 'education', 'productivity'],
    status: 'in_progress', isPublic: true, views: 856, likes: ['3', '5'], bookmarks: ['3', '4'], comments: [], createdAt: '2024-05-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    _id: '3', title: 'Campus Marketplace', description: 'A peer-to-peer marketplace platform for college students to buy, sell, and exchange textbooks, electronics, and other items. Features secure in-app messaging, verified student profiles, and campus pickup locations.', shortDescription: 'P2P marketplace for college students',
    owner: { ...mockUser, _id: '2', firstName: 'Sarah', lastName: 'Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' }, team: [],
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop', screenshots: [],
    githubUrl: 'https://github.com/sarah/campus-marketplace', liveUrl: 'https://campus-market.demo', category: 'Web Dev', technologies: ['React', 'Firebase', 'Stripe API'], tags: ['marketplace', 'e-commerce', 'students'],
    status: 'deployed', isPublic: true, views: 2100, likes: ['1', '4', '5'], bookmarks: ['1'], comments: [], createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-04-20T00:00:00Z',
  },
];

export const mockTeams: Team[] = [
  { _id: '1', name: 'Neural Ninjas', description: 'Building cutting-edge AI/ML projects for the annual tech fest', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=neural', leader: mockUser, members: [{ userId: mockUser, role: 'Lead', joinedAt: '2024-01-01', contribution: 40 }], requirements: { skillsNeeded: ['Python', 'TensorFlow', 'React'], rolesNeeded: ['ML Engineer', 'Frontend Dev'], departmentPreference: ['CSE'], isOpen: true }, status: 'active', createdAt: '2024-01-01' },
  { _id: '2', name: 'Cloud Architects', description: 'Exploring cloud-native architectures and DevOps practices', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=cloud', leader: { ...mockUser, _id: '3', firstName: 'Alex', lastName: 'Rivera' }, members: [], requirements: { skillsNeeded: ['AWS', 'Docker', 'Kubernetes'], rolesNeeded: ['DevOps Engineer'], departmentPreference: ['CSE', 'ECE'], isOpen: true }, status: 'forming', createdAt: '2024-05-15' },
];

export const mockEvents: Event[] = [
  { _id: '1', title: 'AI Innovation Hackathon 2024', description: '48-hour hackathon focused on building AI-powered solutions for real-world problems. $10,000 in prizes!', organizer: mockUser, organizerType: 'college', type: 'hackathon', startDate: '2024-07-15T09:00:00Z', endDate: '2024-07-17T18:00:00Z', registrationDeadline: '2024-07-10T23:59:00Z', mode: 'hybrid', venue: 'Engineering Block, Room 301', location: { address: 'Stanford University', city: 'Stanford', coordinates: [-122.1697, 37.4275] }, banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop', maxParticipants: 200, currentParticipants: 156, prizes: [{ position: '1st', reward: '$5,000 + Internship', amount: 5000 }, { position: '2nd', reward: '$3,000', amount: 3000 }, { position: '3rd', reward: '$2,000', amount: 2000 }], tags: ['ai', 'hackathon', 'innovation'], technologies: ['Python', 'TensorFlow', 'PyTorch'], skillLevel: 'intermediate', status: 'published', isRegistered: true, createdAt: '2024-06-01' },
  { _id: '2', title: 'Full Stack Workshop Series', description: 'Learn to build production-ready full-stack applications with React, Node.js, and MongoDB', organizer: mockUser, organizerType: 'faculty', type: 'workshop', startDate: '2024-07-20T10:00:00Z', endDate: '2024-07-22T16:00:00Z', registrationDeadline: '2024-07-18T23:59:00Z', mode: 'offline', venue: 'CS Lab 2', maxParticipants: 80, currentParticipants: 32, prizes: [], tags: ['webdev', 'fullstack', 'workshop'], technologies: ['React', 'Node.js', 'MongoDB'], skillLevel: 'beginner', status: 'published', isRegistered: false, createdAt: '2024-06-05' },
  { _id: '3', title: 'Weekly Coding Contest #42', description: 'Test your problem-solving skills against the best coders on campus', organizer: mockUser, organizerType: 'student', type: 'coding_contest', startDate: '2024-07-08T18:00:00Z', endDate: '2024-07-08T20:00:00Z', registrationDeadline: '2024-07-08T17:00:00Z', mode: 'online', maxParticipants: 500, currentParticipants: 234, prizes: [], tags: ['coding', 'competitive-programming', 'algorithms'], technologies: ['C++', 'Java', 'Python'], skillLevel: 'all', status: 'published', isRegistered: true, createdAt: '2024-06-10' },
];

export const mockConversations: Conversation[] = [
  { _id: '1', type: 'direct', participants: [mockUser, { ...mockUser, _id: '2', firstName: 'Sarah', lastName: 'Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' }], lastMessage: { content: 'Hey! Want to collaborate on the AI project?', sender: { ...mockUser, _id: '2', firstName: 'Sarah', lastName: 'Chen' }, timestamp: '2024-06-10T14:30:00Z' }, unreadCount: 2, createdAt: '2024-06-01', updatedAt: '2024-06-10' },
  { _id: '2', type: 'direct', participants: [mockUser, { ...mockUser, _id: '3', firstName: 'Alex', lastName: 'Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' }], lastMessage: { content: 'The architecture looks good!', sender: { ...mockUser, _id: '3', firstName: 'Alex', lastName: 'Rivera' }, timestamp: '2024-06-09T10:15:00Z' }, unreadCount: 0, createdAt: '2024-05-20', updatedAt: '2024-06-09' },
  { _id: '3', type: 'group', name: 'Neural Ninjas Team', description: 'Team chat for Neural Ninjas project', participants: [mockUser, { ...mockUser, _id: '2' }, { ...mockUser, _id: '3' }], lastMessage: { content: 'Meeting at 5 PM today', sender: mockUser, timestamp: '2024-06-10T12:00:00Z' }, unreadCount: 5, createdAt: '2024-01-01', updatedAt: '2024-06-10' },
];

export const mockChallenges: CodingChallenge[] = [
  { _id: '1', title: 'Two Sum', description: 'Given an array of integers and a target, return indices of two numbers that add up to target.', difficulty: 'easy', problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.', inputFormat: 'First line: n (number of elements)\nSecond line: n space-separated integers\nThird line: target', outputFormat: 'Two space-separated indices', constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9', examples: [{ input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }], tags: ['array', 'hash-table'], category: 'algorithms', points: 10, timeLimit: 1000, memoryLimit: 256, totalSubmissions: 15420, totalAccepted: 12300, acceptanceRate: 79.8, hints: ['Try using a hash map to store visited elements'], createdAt: '2024-01-01' },
  { _id: '2', title: 'Merge K Sorted Lists', description: 'Merge k sorted linked lists and return it as one sorted list.', difficulty: 'hard', problemStatement: 'You are given an array of k linked-lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.', inputFormat: 'First line: k (number of lists)\nNext k lines: space-separated sorted integers for each list', outputFormat: 'Space-separated sorted integers', constraints: 'k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500', examples: [{ input: '3\n1 4 5\n1 3 4\n2 6', output: '1 1 2 3 4 4 5 6', explanation: 'The linked-lists are: [1->4->5], [1->3->4], [2->6]. Merging them into one sorted list: 1->1->2->3->4->4->5->6' }], tags: ['linked-list', 'divide-and-conquer', 'heap'], category: 'data_structures', points: 50, timeLimit: 2000, memoryLimit: 256, totalSubmissions: 8900, totalAccepted: 4500, acceptanceRate: 50.6, hints: ['Consider using a min-heap', 'Divide and conquer approach also works'], createdAt: '2024-01-15' },
  { _id: '3', title: 'Binary Tree Level Order Traversal', description: 'Given the root of a binary tree, return the level order traversal of its nodes values.', difficulty: 'medium', problemStatement: 'Given the root of a binary tree, return the level order traversal of its nodes\' values. (i.e., from left to right, level by level).', inputFormat: 'Serialized binary tree (level order)', outputFormat: 'Each level on a new line, space-separated values', constraints: 'The number of nodes in the tree is in the range [0, 2000]\n-1000 <= Node.val <= 1000', examples: [{ input: '3 9 20 null null 15 7', output: '3\n9 20\n15 7', explanation: 'Level 0: [3], Level 1: [9,20], Level 2: [15,7]' }], tags: ['tree', 'bfs', 'binary-tree'], category: 'data_structures', points: 25, timeLimit: 1000, memoryLimit: 128, totalSubmissions: 12300, totalAccepted: 9800, acceptanceRate: 79.7, hints: ['Use a queue for BFS'], createdAt: '2024-02-01' },
];

export const mockNotifications: Notification[] = [
  { _id: '1', recipient: '1', type: 'team_invite', title: 'New Team Invitation', message: 'Sarah Chen invited you to join "Code Crusaders"', entityType: 'team', entityId: '2', isRead: false, createdAt: '2024-06-10T15:00:00Z' },
  { _id: '2', recipient: '1', type: 'event_reminder', title: 'Event Reminder', message: 'AI Innovation Hackathon starts in 24 hours!', entityType: 'event', entityId: '1', isRead: false, createdAt: '2024-06-10T14:00:00Z' },
  { _id: '3', recipient: '1', type: 'project_like', title: 'New Like', message: 'Alex Rivera liked your Smart Agriculture project', entityType: 'project', entityId: '1', isRead: true, createdAt: '2024-06-09T10:00:00Z' },
];

export const mockCompanies: Company[] = [
  { _id: '1', userId: { ...mockUser, _id: '10', firstName: 'Google', lastName: '', avatar: 'https://logo.clearbit.com/google.com' }, companyDetails: { name: 'Google', logo: 'https://logo.clearbit.com/google.com', description: 'Google is a multinational technology company focusing on search engines, cloud computing, and AI.', mission: 'To organize the world\'s information and make it universally accessible and useful.', culture: 'Innovation-driven, collaborative, and inclusive', founded: 1998, employees: '10000+', website: 'https://google.com', industry: 'Technology' }, locations: [{ type: 'headquarter', city: 'Mountain View', state: 'CA', country: 'USA', address: '1600 Amphitheatre Parkway' }], benefits: ['Free meals', 'Health insurance', 'Stock options', 'Gym membership'], hiringStatus: true, openPositions: 45, verified: true },
  { _id: '2', userId: { ...mockUser, _id: '11', firstName: 'Microsoft', lastName: '', avatar: 'https://logo.clearbit.com/microsoft.com' }, companyDetails: { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', description: 'Microsoft Corporation is a technology company producing software, consumer electronics, and personal computers.', mission: 'Empower every person and organization on the planet to achieve more.', founded: 1975, employees: '10000+', website: 'https://microsoft.com', industry: 'Technology' }, locations: [{ type: 'headquarter', city: 'Redmond', state: 'WA', country: 'USA', address: 'One Microsoft Way' }], benefits: ['Flexible work', 'Health benefits', '401k matching', 'Parental leave'], hiringStatus: true, openPositions: 32, verified: true },
];

export const mockJobs: JobPosting[] = [
  { _id: '1', companyId: mockCompanies[0], title: 'Software Engineering Intern', description: 'Join our team to build next-generation search features using AI and machine learning.', type: 'internship', skillsRequired: [{ skill: 'Python', level: 'intermediate' }, { skill: 'Machine Learning', level: 'intermediate' }, { skill: 'Java', level: 'beginner' }], experience: { min: 0, max: 1 }, location: { type: 'hybrid', city: 'Mountain View', country: 'USA' }, salary: { min: 8000, max: 10000, currency: 'USD', period: 'monthly' }, applicationDeadline: '2024-08-01', status: 'active', createdAt: '2024-06-01' },
  { _id: '2', companyId: mockCompanies[1], title: 'Frontend Developer', description: 'Build beautiful, accessible, and performant user interfaces for Microsoft Teams.', type: 'full_time', skillsRequired: [{ skill: 'React', level: 'advanced' }, { skill: 'TypeScript', level: 'advanced' }, { skill: 'CSS', level: 'intermediate' }], experience: { min: 0, max: 2 }, location: { type: 'hybrid', city: 'Redmond', country: 'USA' }, salary: { min: 120000, max: 150000, currency: 'USD', period: 'yearly' }, applicationDeadline: '2024-07-30', status: 'active', createdAt: '2024-06-05' },
];

export const mockResearch: ResearchOpportunity[] = [
  { _id: '1', facultyId: { ...mockUser, _id: '20', firstName: 'Dr. Emily', lastName: 'Zhang', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' }, title: 'Federated Learning for Healthcare', description: 'Research on privacy-preserving machine learning techniques for medical diagnosis across distributed healthcare institutions.', domain: 'AI/ML', skillsRequired: ['Python', 'PyTorch', 'Differential Privacy'], positionsAvailable: 3, duration: '6 months', stipend: { amount: 2000, currency: 'USD', period: 'monthly' }, status: 'open', applications: [], createdAt: '2024-06-01' },
  { _id: '2', facultyId: { ...mockUser, _id: '21', firstName: 'Prof. Michael', lastName: 'Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael' }, title: 'Autonomous Vehicle Perception', description: 'Develop computer vision algorithms for real-time object detection and tracking in autonomous vehicles.', domain: 'Computer Vision', skillsRequired: ['Python', 'OpenCV', 'Deep Learning', 'C++'], positionsAvailable: 2, duration: '1 year', stipend: { amount: 2500, currency: 'USD', period: 'monthly' }, status: 'open', applications: [], createdAt: '2024-06-05' },
];

export const mockStartups: Startup[] = [
  { _id: '1', founderId: mockUser, name: 'EduSpark', tagline: 'AI-powered personalized learning for every student', description: 'EduSpark uses AI to create personalized learning paths for students, adapting to their pace and style.', industry: 'EdTech', stage: 'mvp', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=eduspark', teamMembers: [{ userId: mockUser, role: 'Founder & CEO' }], lookingFor: { coFounders: true, developers: true, designers: false, marketers: true, investors: true }, status: 'active', createdAt: '2024-04-01' },
  { _id: '2', founderId: { ...mockUser, _id: '30', firstName: 'Priya', lastName: 'Sharma' }, name: 'GreenCart', tagline: 'Sustainable shopping made simple', description: 'GreenCart connects eco-conscious consumers with sustainable products and local vendors.', industry: 'E-commerce', stage: 'idea', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=greencart', teamMembers: [], lookingFor: { coFounders: true, developers: true, designers: true, marketers: true, investors: false }, status: 'active', createdAt: '2024-05-15' },
];

export const mockTasks: WorkspaceTask[] = [
  { _id: '1', projectId: '1', title: 'Design database schema', description: 'Create MongoDB collections and relationships', status: 'done', priority: 'high', assignee: mockUser, createdBy: mockUser, dueDate: '2024-06-05', tags: ['database', 'backend'], createdAt: '2024-06-01', updatedAt: '2024-06-05' },
  { _id: '2', projectId: '1', title: 'Implement JWT authentication', description: 'Add login, register, and middleware', status: 'in_progress', priority: 'high', assignee: { ...mockUser, _id: '2', firstName: 'Sarah', lastName: 'Chen' }, createdBy: mockUser, dueDate: '2024-06-15', tags: ['auth', 'backend'], createdAt: '2024-06-02', updatedAt: '2024-06-10' },
  { _id: '3', projectId: '1', title: 'Build React dashboard UI', description: 'Create main dashboard with charts and widgets', status: 'todo', priority: 'medium', assignee: { ...mockUser, _id: '3', firstName: 'Alex', lastName: 'Rivera' }, createdBy: mockUser, dueDate: '2024-06-20', tags: ['frontend', 'ui'], createdAt: '2024-06-03', updatedAt: '2024-06-03' },
  { _id: '4', projectId: '1', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated deployment', status: 'review', priority: 'medium', assignee: mockUser, createdBy: { ...mockUser, _id: '3' }, dueDate: '2024-06-12', tags: ['devops', 'ci-cd'], createdAt: '2024-06-04', updatedAt: '2024-06-10' },
];

export const mockAIConversations: AIConversation[] = [
  { _id: '1', aiType: 'mentor', title: 'Becoming an AI Engineer', messages: [{ role: 'user', content: 'I want to become an AI Engineer. Can you guide me?', timestamp: '2024-06-10T10:00:00Z' }, { role: 'assistant', content: 'That\'s an excellent goal! Here\'s a comprehensive roadmap to become an AI Engineer:\n\n## Phase 1: Foundations (3 months)\n- **Mathematics**: Linear Algebra, Calculus, Probability & Statistics\n- **Programming**: Python mastery, NumPy, Pandas\n- **Tools**: Git, Jupyter Notebooks, VS Code\n\n## Phase 2: Machine Learning (4 months)\n- **Theory**: Supervised/Unsupervised learning, model evaluation\n- **Libraries**: Scikit-learn, TensorFlow, PyTorch\n- **Projects**: House price prediction, sentiment analysis\n\n## Phase 3: Deep Learning (4 months)\n- **Neural Networks**: CNNs, RNNs, Transformers\n- **Frameworks**: PyTorch (recommended for research)\n- **Projects**: Image classification, text generation\n\n## Phase 4: MLOps & Specialization (3 months)\n- **Deployment**: Docker, Kubernetes, AWS/GCP\n- **Monitoring**: MLflow, Weights & Biases\n- **Specialize**: NLP, Computer Vision, or Reinforcement Learning\n\n## Recommended Certifications:\n1. Deep Learning Specialization (Coursera)\n2. TensorFlow Developer Certificate\n3. AWS Machine Learning Specialty\n\nWould you like me to dive deeper into any specific area?', timestamp: '2024-06-10T10:00:05Z', attachments: [{ type: 'roadmap', data: { phases: 4, totalDuration: '14 months' } }] }], context: { topic: 'AI Engineering', careerGoal: 'AI Engineer', skills: ['Python', 'Math'] }, createdAt: '2024-06-10', updatedAt: '2024-06-10' },
  { _id: '2', aiType: 'cofounder', title: 'Smart Agriculture Platform', messages: [{ role: 'user', content: 'I want to build a Smart Agriculture Platform', timestamp: '2024-06-09T14:00:00Z' }, { role: 'assistant', content: 'Great idea! Here\'s a complete technical architecture for your Smart Agriculture Platform:\n\n## System Architecture\n\n### Frontend Layer\n- **Web Dashboard**: React + TypeScript + Tailwind\n- **Mobile App**: Flutter for farmers\n- **Real-time**: WebSocket for live sensor data\n\n### Backend Layer\n- **API Gateway**: Express.js + TypeScript\n- **Microservices**:\n  - Sensor Data Service (Node.js)\n  - ML Prediction Service (Python/FastAPI)\n  - Notification Service (Node.js + Socket.IO)\n\n### Database Layer\n- **Primary**: MongoDB (sensor readings, user data)\n- **Time-series**: InfluxDB (historical sensor data)\n- **Cache**: Redis (real-time data, sessions)\n\n### ML Pipeline\n- **Data Ingestion**: Apache Kafka\n- **Processing**: Python + PyTorch\n- **Models**: Crop disease detection, yield prediction\n- **Deployment**: Docker + Kubernetes\n\n### Infrastructure\n- **Cloud**: AWS (EC2, S3, IoT Core)\n- **IoT**: MQTT broker for sensor communication\n- **Monitoring**: Grafana + Prometheus\n\n## Sprint Plan (12 weeks)\n\n**Sprint 1-2**: Setup + Auth + Basic Dashboard\n**Sprint 3-4**: Sensor integration + Data pipeline\n**Sprint 5-6**: ML models + Predictions\n**Sprint 7-8**: Mobile app + Notifications\n**Sprint 9-10**: Testing + Optimization\n**Sprint 11-12**: Deployment + Launch\n\nWould you like me to elaborate on any component?', timestamp: '2024-06-09T14:00:10Z', artifacts: [{ type: 'architecture', data: { stack: 'MERN + Python + AWS' } }] }], context: { topic: 'Smart Agriculture', projectIdea: 'Smart Agriculture Platform' }, createdAt: '2024-06-09', updatedAt: '2024-06-09' },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { userId: { ...mockUser, _id: '50', firstName: 'Emma', lastName: 'Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' }, innovationScore: 9800, codingScore: 2750, contributionScore: 9200, totalScore: 29500, rank: 1 },
  { userId: { ...mockUser, _id: '51', firstName: 'James', lastName: 'Liu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' }, innovationScore: 9200, codingScore: 2600, contributionScore: 8800, totalScore: 27000, rank: 2 },
  { userId: { ...mockUser, _id: '1', firstName: 'John', lastName: 'Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' }, innovationScore: 8500, codingScore: 1850, contributionScore: 7200, totalScore: 20500, rank: 3 },
  { userId: { ...mockUser, _id: '52', firstName: 'Aisha', lastName: 'Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisha' }, innovationScore: 7800, codingScore: 2100, contributionScore: 6500, totalScore: 18400, rank: 4 },
  { userId: { ...mockUser, _id: '53', firstName: 'Carlos', lastName: 'Mendez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos' }, innovationScore: 6500, codingScore: 1900, contributionScore: 7100, totalScore: 16500, rank: 5 },
];

export const mockAnalytics: AnalyticsData = {
  totalUsers: 12540,
  totalProjects: 8930,
  totalEvents: 450,
  activeUsers: 3420,
  departmentStats: [
    { department: 'CSE', userCount: 4500, projectCount: 3200, avgCodingScore: 1850 },
    { department: 'ECE', userCount: 2100, projectCount: 1500, avgCodingScore: 1400 },
    { department: 'Mechanical', userCount: 1800, projectCount: 900, avgCodingScore: 600 },
    { department: 'Civil', userCount: 1500, projectCount: 700, avgCodingScore: 450 },
    { department: 'Biotechnology', userCount: 1200, projectCount: 850, avgCodingScore: 520 },
    { department: 'MBA', userCount: 1440, projectCount: 1780, avgCodingScore: 380 },
  ],
  monthlyGrowth: [
    { month: 'Jan', users: 800, projects: 600, events: 30 },
    { month: 'Feb', users: 950, projects: 720, events: 35 },
    { month: 'Mar', users: 1100, projects: 850, events: 40 },
    { month: 'Apr', users: 1250, projects: 980, events: 38 },
    { month: 'May', users: 1400, projects: 1100, events: 45 },
    { month: 'Jun', users: 1600, projects: 1250, events: 50 },
  ],
  topProjects: mockProjects,
  leaderboard: mockLeaderboard,
};
