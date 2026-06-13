import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../config/logger.js';

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// System prompts for each AI personality
const SYSTEM_PROMPTS = {
  mentor: `You are ProjectVerse AI Mentor, a friendly and supportive educational assistant designed specifically for college students. Your personality is encouraging, patient, and knowledgeable. You provide actionable guidance with structured responses including roadmaps, resources, and timelines. Always respond with: 1) Direct answer/guidance, 2) Structured roadmap when applicable, 3) Specific resources (courses, books, docs), 4) Timeline estimates, 5) Encouragement.`,

  cofounder: `You are ProjectVerse AI Co-Founder, a professional technical architect and startup advisor. You think strategically about product development, system design, and business viability. Your responses are structured, professional, and actionable. You provide: 1) System architecture diagrams (text-based), 2) Database schemas with relationships, 3) API specifications with endpoints, 4) Sprint plans with story points, 5) Risk matrices, 6) Technical documentation.`,

  chatbot: `You are ProjectVerse AI Assistant, a friendly and knowledgeable chatbot for college students. You can help with coding, concepts, projects, and general queries. You respond quickly, use examples, and keep responses concise but complete.`,
};

export class GeminiService {
  private static instance: GeminiService;
  private models: { [key: string]: any } = {};

  private constructor() {
    this.models.mentor = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPTS.mentor,
    });
    this.models.cofounder = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPTS.cofounder,
    });
    this.models.chatbot = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPTS.chatbot,
    });
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async generateResponse(aiType: string, message: string, context?: string): Promise<string> {
    try {
      const model = this.models[aiType] || this.models.chatbot;
      const prompt = context ? `${context}\n\nUser: ${message}` : message;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      logger.error('Gemini API error:', error.message);

      // Fallback responses if API fails
      if (aiType === 'mentor') {
        return this.getMentorFallback(message);
      } else if (aiType === 'cofounder') {
        return this.getCoFounderFallback(message);
      }
      return `I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment. In the meantime, feel free to ask a simpler question or try one of the quick action buttons.`;
    }
  }

  async generateRoadmap(careerGoal: string, skills: string[], level: string): Promise<string> {
    const prompt = `Create a detailed learning roadmap for becoming a ${careerGoal}. Current skills: ${skills.join(', ')}. Current level: ${level}. Include phases, specific skills, certifications, and project ideas.`;
    return this.generateResponse('mentor', prompt);
  }

  async generateArchitecture(projectIdea: string, requirements: string[]): Promise<string> {
    const prompt = `Design a complete system architecture for: ${projectIdea}. Requirements: ${requirements.join(', ')}. Provide: 1) High-level architecture diagram, 2) Component breakdown, 3) Technology stack with justifications, 4) Deployment strategy, 5) Scalability considerations.`;
    return this.generateResponse('cofounder', prompt);
  }

  async generateDatabaseSchema(projectIdea: string, features: string[]): Promise<string> {
    const prompt = `Design a MongoDB database schema for: ${projectIdea}. Features: ${features.join(', ')}. Provide collections, fields, types, indexes, and relationships.`;
    return this.generateResponse('cofounder', prompt);
  }

  async generateSprintPlan(features: string[], teamSize: number, duration: number): Promise<string> {
    const prompt = `Create a sprint plan for ${teamSize} developers over ${duration} weeks. Features: ${features.join(', ')}. Provide sprints with story points, dependencies, and milestones.`;
    return this.generateResponse('cofounder', prompt);
  }

  async generateInterviewPrep(topic: string, difficulty: string): Promise<string> {
    const prompt = `Generate ${difficulty} interview questions for ${topic} with detailed answers and follow-up questions.`;
    return this.generateResponse('mentor', prompt);
  }

  async codeHelp(code: string, language: string, problem: string): Promise<string> {
    const prompt = `Help with this ${language} code. Problem: ${problem}\n\nCode:\n${code}\n\nProvide: 1) Bug fix, 2) Explanation, 3) Best practices.`;
    return this.generateResponse('chatbot', prompt);
  }

  async explainConcept(concept: string, level: string): Promise<string> {
    const prompt = `Explain ${concept} in simple terms for a ${level} level student. Use analogies and examples.`;
    return this.generateResponse('chatbot', prompt);
  }

  // AI Resume Generator
  async generateResume(userData: any): Promise<string> {
    const prompt = `Generate an ATS-friendly HTML resume for: ${userData.firstName} ${userData.lastName}. Skills: ${userData.skills?.map((s: any) => s.name).join(', ')}. Projects: ${userData.projects?.map((p: any) => p.title).join(', ')}. Use proper HTML with inline CSS for ATS compatibility.`;
    return this.generateResponse('mentor', prompt);
  }

  // AI Portfolio Generator
  async generatePortfolio(userData: any): Promise<string> {
    const prompt = `Create a stunning personal portfolio website as a single HTML file for ${userData.firstName} ${userData.lastName}. Include: Hero section, About, Skills, Projects showcase, Certifications, Contact. Use modern CSS with animations. Make it responsive. Data: ${JSON.stringify(userData)}`;
    return this.generateResponse('mentor', prompt);
  }

  private getMentorFallback(message: string): string {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('roadmap') || lowerMsg.includes('path')) {
      return `Here's a general tech career roadmap:\n\n**Phase 1: Foundations (3-6 months)**\n- Learn programming fundamentals\n- Data structures and algorithms\n- Version control (Git)\n\n**Phase 2: Specialization (6-12 months)**\n- Choose: Web, Mobile, AI, or DevOps\n- Build 3-5 projects\n- Learn frameworks and tools\n\n**Phase 3: Professional Growth (ongoing)**\n- Contribute to open source\n- Get certifications\n- Network and attend events\n\nWould you like me to create a more specific roadmap?`;
    }
    return `I appreciate your question! As your AI Mentor, I'm here to help. Currently, I'm experiencing some connectivity issues, but I can still provide general guidance.\n\nCould you try rephrasing your question or check back in a few moments? In the meantime, feel free to explore the quick action buttons on the left sidebar for common topics like roadmaps, interview prep, and certifications.`;
  }

  private getCoFounderFallback(message: string): string {
    return `I'd be happy to help you architect your project! Here's a general approach:\n\n**1. Start with MVP Features**\n- Identify core functionality\n- Define user flows\n- Choose simple, proven tech\n\n**2. Architecture Pattern**\n- Frontend: React/Vue + REST API\n- Backend: Node.js/Python + Database\n- Hosting: Vercel/Render/AWS\n\n**3. Database Basics**\n- Start with MongoDB (flexible)\n- Define core collections\n- Add indexes for performance\n\nPlease try again for a more detailed analysis of your specific project!`;
  }
}
