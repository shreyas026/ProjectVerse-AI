/**
 * Database Seed Script
 * Creates demo users, projects, events, teams, and coding challenges
 * 
 * Usage: npx tsx src/seed.ts
 */

import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Project } from './models/Project.js';
import { Event } from './models/Event.js';
import { Team } from './models/Team.js';
import { CodingChallenge } from './models/CodingChallenge.js';
import { Company } from './models/Company.js';
import { JobPosting } from './models/JobPosting.js';
import { logger } from './config/logger.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/projectverse';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  logger.info('Connected to MongoDB for seeding');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Event.deleteMany({}),
    Team.deleteMany({}),
    CodingChallenge.deleteMany({}),
    Company.deleteMany({}),
    JobPosting.deleteMany({}),
  ]);
  logger.info('Cleared existing data');

  // ==========================================
  // USERS
  // ==========================================
  const users = await User.create([
    {
      email: 'demo@projectverse.ai', password: 'Demo@12345',
      firstName: 'John', lastName: 'Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      role: 'student', status: 'active', isEmailVerified: true,
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
      ],
      interests: ['AI/ML', 'Web Development', 'Open Source', 'Cloud Computing'],
      achievements: [
        { title: 'Hackathon Winner', description: 'Won first place at University Hackathon 2024', date: '2024-03-15', icon: 'trophy' },
        { title: '100 Days Streak', description: 'Solved coding problems for 100 consecutive days', date: '2024-02-20', icon: 'flame' },
      ],
      certifications: [
        { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2024-01-15' },
        { name: 'React Developer Certificate', issuer: 'Meta', issueDate: '2023-11-20' },
      ],
    },
    {
      email: 'sarah@projectverse.ai', password: 'Demo@12345',
      firstName: 'Sarah', lastName: 'Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      role: 'student', status: 'active', isEmailVerified: true,
      college: { name: 'Stanford University', department: 'CSE', yearOfStudy: 4 },
      scores: { codingRating: 2200, contributionScore: 8100, innovationScore: 9100, reliabilityScore: 95 },
      skills: [
        { name: 'Python', level: 'advanced', verified: true },
        { name: 'TensorFlow', level: 'advanced', verified: true },
        { name: 'React', level: 'intermediate', verified: true },
        { name: 'Docker', level: 'intermediate', verified: false },
      ],
      interests: ['Deep Learning', 'Computer Vision', 'Research'],
    },
    {
      email: 'alex@projectverse.ai', password: 'Demo@12345',
      firstName: 'Alex', lastName: 'Rivera',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      role: 'student', status: 'active', isEmailVerified: true,
      college: { name: 'MIT', department: 'ECE', yearOfStudy: 2 },
      scores: { codingRating: 1600, contributionScore: 5500, innovationScore: 7200, reliabilityScore: 88 },
      skills: [
        { name: 'AWS', level: 'advanced', verified: true },
        { name: 'Kubernetes', level: 'intermediate', verified: true },
        { name: 'Go', level: 'intermediate', verified: false },
        { name: 'Terraform', level: 'intermediate', verified: true },
      ],
      interests: ['Cloud Computing', 'DevOps', 'Infrastructure'],
    },
    {
      email: 'emma@projectverse.ai', password: 'Demo@12345',
      firstName: 'Emma', lastName: 'Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      role: 'student', status: 'active', isEmailVerified: true,
      college: { name: 'Stanford University', department: 'CSE', yearOfStudy: 3 },
      scores: { codingRating: 2750, contributionScore: 9200, innovationScore: 9800, reliabilityScore: 97 },
      skills: [
        { name: 'React', level: 'advanced', verified: true },
        { name: 'Flutter', level: 'advanced', verified: true },
        { name: 'Node.js', level: 'advanced', verified: true },
        { name: 'Firebase', level: 'advanced', verified: true },
      ],
      interests: ['Mobile Development', 'UI/UX', 'Startups'],
    },
    {
      email: 'faculty@projectverse.ai', password: 'Demo@12345',
      firstName: 'Dr. Emily', lastName: 'Zhang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      role: 'faculty', status: 'active', isEmailVerified: true,
      college: { name: 'Stanford University', department: 'CSE' },
      skills: [{ name: 'Machine Learning', level: 'advanced', verified: true }, { name: 'Research', level: 'advanced', verified: true }],
    },
    {
      email: 'admin@projectverse.ai', password: 'Admin@12345',
      firstName: 'Admin', lastName: 'User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      role: 'admin', status: 'active', isEmailVerified: true,
    },
  ]);
  logger.info(`Created ${users.length} users`);

  const [john, sarah, alex, emma, faculty, admin] = users;

  // ==========================================
  // PROJECTS
  // ==========================================
  const projects = await Project.create([
    {
      title: 'Smart Agriculture IoT Platform',
      description: 'A comprehensive IoT-based smart farming solution that uses sensors, ML models, and a modern web dashboard to help farmers monitor crops, predict yields, and optimize resource usage.',
      shortDescription: 'IoT-based smart agriculture monitoring system with ML-powered insights',
      owner: john._id,
      team: [{ userId: john._id, role: 'Lead Developer', contribution: 'Full-stack development' }],
      thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop',
      githubUrl: 'https://github.com/johndoe/smart-agri',
      liveUrl: 'https://smart-agri.demo',
      category: 'IoT',
      technologies: ['React', 'Node.js', 'MongoDB', 'Python', 'TensorFlow', 'MQTT'],
      tags: ['agriculture', 'iot', 'machine-learning'],
      status: 'completed', isPublic: true, originalityScore: 85,
      views: 1240, likes: [sarah._id, alex._id, emma._id],
    },
    {
      title: 'AI Study Assistant',
      description: 'An intelligent study companion powered by LLMs that helps students prepare for exams.',
      shortDescription: 'AI-powered study companion for students',
      owner: sarah._id,
      team: [{ userId: sarah._id, role: 'Solo Developer', contribution: 'Everything' }],
      thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop',
      category: 'AI/ML',
      technologies: ['Next.js', 'Python', 'LangChain', 'PostgreSQL'],
      tags: ['ai', 'education', 'productivity'],
      status: 'in_progress', isPublic: true, views: 856, likes: [john._id, emma._id],
    },
    {
      title: 'Campus Marketplace',
      description: 'A peer-to-peer marketplace for college students to buy, sell, and exchange items.',
      shortDescription: 'P2P marketplace for college students',
      owner: emma._id,
      team: [{ userId: emma._id, role: 'Lead Developer' }, { userId: alex._id, role: 'DevOps' }],
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      liveUrl: 'https://campus-market.demo',
      category: 'Web Dev',
      technologies: ['React', 'Firebase', 'Stripe API'],
      tags: ['marketplace', 'e-commerce', 'students'],
      status: 'deployed', isPublic: true, views: 2100, likes: [john._id, sarah._id, alex._id],
    },
    {
      title: 'Autonomous Drone Navigation',
      description: 'Computer vision-based autonomous navigation system for delivery drones using ROS.',
      shortDescription: 'CV-powered autonomous drone navigation',
      owner: alex._id,
      thumbnail: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&h=400&fit=crop',
      category: 'Robotics',
      technologies: ['Python', 'ROS', 'OpenCV', 'C++'],
      tags: ['robotics', 'computer-vision', 'drones'],
      status: 'in_progress', isPublic: true, views: 650, likes: [sarah._id],
    },
  ]);
  logger.info(`Created ${projects.length} projects`);

  // ==========================================
  // EVENTS
  // ==========================================
  const now = new Date();
  const events = await Event.create([
    {
      title: 'AI Innovation Hackathon 2024',
      description: '48-hour hackathon focused on building AI-powered solutions. $10,000 in prizes!',
      organizer: faculty._id, organizerType: 'faculty',
      type: 'hackathon',
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      mode: 'hybrid', venue: 'Engineering Block, Room 301',
      banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
      maxParticipants: 200, currentParticipants: 156,
      prizes: [{ position: '1st', reward: '$5,000', amount: 5000 }, { position: '2nd', reward: '$3,000', amount: 3000 }],
      tags: ['ai', 'hackathon', 'innovation'],
      technologies: ['Python', 'TensorFlow', 'PyTorch'],
      skillLevel: 'intermediate', status: 'published',
    },
    {
      title: 'Full Stack Workshop Series',
      description: 'Learn to build production-ready full-stack applications with React, Node.js, and MongoDB.',
      organizer: john._id, organizerType: 'student',
      type: 'workshop',
      startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      mode: 'offline', venue: 'CS Lab 2',
      tags: ['webdev', 'fullstack', 'workshop'],
      technologies: ['React', 'Node.js', 'MongoDB'],
      skillLevel: 'beginner', status: 'published',
    },
    {
      title: 'Weekly Coding Contest #42',
      description: 'Test your problem-solving skills against the best coders on campus.',
      organizer: sarah._id, organizerType: 'student',
      type: 'coding_contest',
      startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      mode: 'online',
      maxParticipants: 500, currentParticipants: 234,
      tags: ['coding', 'competitive-programming'],
      technologies: ['C++', 'Java', 'Python'],
      skillLevel: 'all', status: 'published',
    },
  ]);
  logger.info(`Created ${events.length} events`);

  // ==========================================
  // TEAMS
  // ==========================================
  const teams = await Team.create([
    {
      name: 'Neural Ninjas',
      description: 'Building cutting-edge AI/ML projects for the annual tech fest',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=neural',
      leader: john._id,
      members: [
        { userId: john._id, role: 'Lead', joinedAt: new Date(), contribution: 40 },
        { userId: sarah._id, role: 'ML Engineer', joinedAt: new Date(), contribution: 35 },
      ],
      requirements: { skillsNeeded: ['Python', 'TensorFlow', 'React'], rolesNeeded: ['Frontend Dev'], isOpen: true },
      status: 'active',
    },
    {
      name: 'Cloud Architects',
      description: 'Exploring cloud-native architectures and DevOps practices',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=cloud',
      leader: alex._id,
      members: [{ userId: alex._id, role: 'Lead', joinedAt: new Date(), contribution: 50 }],
      requirements: { skillsNeeded: ['AWS', 'Docker', 'Kubernetes'], rolesNeeded: ['DevOps Engineer'], isOpen: true },
      status: 'forming',
    },
  ]);
  logger.info(`Created ${teams.length} teams`);

  // ==========================================
  // CODING CHALLENGES
  // ==========================================
  const challenges = await CodingChallenge.create([
    {
      title: 'Two Sum', difficulty: 'easy', category: 'algorithms',
      description: 'Given an array of integers and a target, return indices of two numbers that add up to target.',
      problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume each input has exactly one solution.',
      inputFormat: 'First line: n\nSecond line: n integers\nThird line: target',
      outputFormat: 'Two space-separated indices',
      constraints: '2 <= nums.length <= 10^4',
      examples: [{ input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }],
      testCases: [
        { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
        { input: '3\n3 2 4\n6', expectedOutput: '1 2', isHidden: true },
      ],
      tags: ['array', 'hash-table'], points: 10, timeLimit: 1000, memoryLimit: 256,
      totalSubmissions: 15420, totalAccepted: 12300, acceptanceRate: 79.8,
      hints: ['Try using a hash map'],
    },
    {
      title: 'Binary Tree Level Order Traversal', difficulty: 'medium', category: 'data_structures',
      description: 'Given the root of a binary tree, return the level order traversal.',
      problemStatement: 'Given the root of a binary tree, return the level order traversal of its nodes\' values.',
      inputFormat: 'Serialized binary tree',
      outputFormat: 'Each level on a new line',
      constraints: '0 <= nodes <= 2000',
      examples: [{ input: '3 9 20 null null 15 7', output: '3\n9 20\n15 7' }],
      testCases: [{ input: '3 9 20 null null 15 7', expectedOutput: '3\n9 20\n15 7', isHidden: false }],
      tags: ['tree', 'bfs'], points: 25, timeLimit: 1000, memoryLimit: 128,
      totalSubmissions: 12300, totalAccepted: 9800, acceptanceRate: 79.7,
      hints: ['Use a queue for BFS'],
    },
    {
      title: 'Merge K Sorted Lists', difficulty: 'hard', category: 'data_structures',
      description: 'Merge k sorted linked lists into one sorted list.',
      problemStatement: 'You are given an array of k linked-lists, each sorted. Merge all into one sorted linked-list.',
      inputFormat: 'First line: k\nNext k lines: sorted integers',
      outputFormat: 'Space-separated sorted integers',
      constraints: '0 <= k <= 10^4',
      examples: [{ input: '3\n1 4 5\n1 3 4\n2 6', output: '1 1 2 3 4 4 5 6' }],
      testCases: [{ input: '3\n1 4 5\n1 3 4\n2 6', expectedOutput: '1 1 2 3 4 4 5 6', isHidden: false }],
      tags: ['linked-list', 'heap', 'divide-and-conquer'], points: 50, timeLimit: 2000, memoryLimit: 256,
      totalSubmissions: 8900, totalAccepted: 4500, acceptanceRate: 50.6,
      hints: ['Consider using a min-heap'],
    },
  ]);
  logger.info(`Created ${challenges.length} coding challenges`);

  // ==========================================
  // DONE
  // ==========================================
  logger.info('');
  logger.info('==========================================');
  logger.info('   Database seeded successfully!');
  logger.info('==========================================');
  logger.info('');
  logger.info('Demo accounts:');
  logger.info('  Student:  demo@projectverse.ai / Demo@12345');
  logger.info('  Student:  sarah@projectverse.ai / Demo@12345');
  logger.info('  Student:  alex@projectverse.ai / Demo@12345');
  logger.info('  Faculty:  faculty@projectverse.ai / Demo@12345');
  logger.info('  Admin:    admin@projectverse.ai / Admin@12345');
  logger.info('');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
