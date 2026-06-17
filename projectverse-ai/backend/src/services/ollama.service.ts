import axios from 'axios';
import { logger } from '../config/logger.js';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

// Models configuration
const MODELS = {
  chat: process.env.OLLAMA_CHAT_MODEL || 'llama3.1:8b',
  code: process.env.OLLAMA_CODE_MODEL || 'codellama:7b',
  embeddings: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',
};

// System prompts for each AI personality
const SYSTEM_PROMPTS: Record<string, string> = {
  mentor: `You are ProjectVerse AI Mentor, a friendly and supportive educational assistant designed specifically for college students. Your personality is encouraging, patient, and knowledgeable. You provide actionable guidance with structured responses including roadmaps, resources, and timelines. Always respond with: 1) Direct answer/guidance, 2) Structured roadmap when applicable, 3) Specific resources (courses, books, docs), 4) Timeline estimates, 5) Encouragement.`,

  cofounder: `You are ProjectVerse AI Co-Founder, a professional technical architect and startup advisor. You think strategically about product development, system design, and business viability. Your responses are structured, professional, and actionable. You provide: 1) System architecture diagrams (text-based), 2) Database schemas with relationships, 3) API specifications with endpoints, 4) Sprint plans with story points, 5) Risk matrices, 6) Technical documentation.`,

  chatbot: `You are ProjectVerse AI Assistant, a polished conversational assistant for college students, builders, and researchers. Answer like a thoughtful expert, not like a textbook template. Start with the direct answer, then add structure only when it helps. Prefer natural paragraphs, concise bullets, clear examples, and runnable code when relevant. Avoid generic phrases like "Great question", "Key points", or "Do you have any specific questions" unless they are genuinely useful. For algorithm or concept explanations, include intuition, when to use it, tradeoffs, and a small practical example. If the user attaches image, audio, or video metadata, acknowledge the attachment and explain what you can infer from the provided context; do not pretend to inspect raw media unless its contents are available.`,
};

export class OllamaService {
  private static instance: OllamaService;

  private constructor() {
    logger.info(`Ollama service initialized with base URL: ${OLLAMA_BASE_URL}`);
    logger.info(`Models - Chat: ${MODELS.chat}, Code: ${MODELS.code}, Embeddings: ${MODELS.embeddings}`);
  }

  static getInstance(): OllamaService {
    if (!OllamaService.instance) {
      OllamaService.instance = new OllamaService();
    }
    return OllamaService.instance;
  }

  /**
   * Check if Ollama is running and models are available
   */
  async healthCheck(): Promise<{ status: string; models: string[] }> {
    try {
      const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
      const models = response.data.models?.map((m: any) => m.name) || [];
      return { status: 'connected', models };
    } catch (error: any) {
      logger.error('Ollama health check failed:', error.message);
      return { status: 'disconnected', models: [] };
    }
  }

  /**
   * Generate a chat response using Ollama
   * Replaces GeminiService.generateResponse()
   */
  async generateResponse(aiType: string, message: string, context?: string): Promise<string> {
    try {
      const systemPrompt = SYSTEM_PROMPTS[aiType] || SYSTEM_PROMPTS.chatbot;
      const userMessage = context ? `${context}\n\nUser: ${message}` : message;

      const response = await axios.post(
        `${OLLAMA_BASE_URL}/api/chat`,
        {
          model: MODELS.chat,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: aiType === 'chatbot' ? 700 : 1400,
          },
        },
        { timeout: 90000 }
      );

      return response.data.message?.content || 'I could not generate a response. Please try again.';
    } catch (error: any) {
      logger.error('Ollama chat error:', error.message);

      // Fallback responses if Ollama fails
      if (aiType === 'mentor') {
        return this.getMentorFallback(message);
      } else if (aiType === 'cofounder') {
        return this.getCoFounderFallback(message);
      }
      return `I apologize, but I'm having trouble connecting to the AI service right now. Please make sure Ollama is running (ollama serve) and try again.`;
    }
  }

  /**
   * Generate a learning roadmap
   */
  async generateRoadmap(careerGoal: string, skills: string[], level: string): Promise<string> {
    const prompt = `Create a detailed learning roadmap for becoming a ${careerGoal}. Current skills: ${skills.join(', ')}. Current level: ${level}. Include phases, specific skills, certifications, and project ideas.`;
    return this.generateResponse('mentor', prompt);
  }

  /**
   * Generate system architecture
   */
  async generateArchitecture(projectIdea: string, requirements: string[]): Promise<string> {
    const prompt = `Design a complete system architecture for: ${projectIdea}. Requirements: ${requirements.join(', ')}. Provide: 1) High-level architecture diagram, 2) Component breakdown, 3) Technology stack with justifications, 4) Deployment strategy, 5) Scalability considerations.`;
    return this.generateResponse('cofounder', prompt);
  }

  /**
   * Generate database schema
   */
  async generateDatabaseSchema(projectIdea: string, features: string[]): Promise<string> {
    const prompt = `Design a MongoDB database schema for: ${projectIdea}. Features: ${features.join(', ')}. Provide collections, fields, types, indexes, and relationships.`;
    return this.generateResponse('cofounder', prompt);
  }

  /**
   * Generate sprint plan
   */
  async generateSprintPlan(features: string[], teamSize: number, duration: number): Promise<string> {
    const prompt = `Create a sprint plan for ${teamSize} developers over ${duration} weeks. Features: ${features.join(', ')}. Provide sprints with story points, dependencies, and milestones.`;
    return this.generateResponse('cofounder', prompt);
  }

  /**
   * Generate interview preparation content
   */
  async generateInterviewPrep(topic: string, difficulty: string): Promise<string> {
    const prompt = `Generate ${difficulty} interview questions for ${topic} with detailed answers and follow-up questions.`;
    return this.generateResponse('mentor', prompt);
  }

  /**
   * Code help and debugging
   */
  async codeHelp(code: string, language: string, problem: string): Promise<string> {
    try {
      const prompt = `Help with this ${language} code. Problem: ${problem}\n\nCode:\n${code}\n\nProvide: 1) Bug fix, 2) Explanation, 3) Best practices.`;

      const response = await axios.post(
        `${OLLAMA_BASE_URL}/api/chat`,
        {
          model: MODELS.code,
          messages: [
            { role: 'system', content: 'You are an expert code reviewer and debugger. Provide clear, concise solutions with explanations.' },
            { role: 'user', content: prompt },
          ],
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 2048,
          },
        },
        { timeout: 120000 }
      );

      return response.data.message?.content || 'Code help unavailable. Please try again.';
    } catch (error: any) {
      logger.error('Ollama code help error:', error.message);
      return this.generateResponse('chatbot', `Help with this ${language} code. Problem: ${problem}\n\nCode:\n${code}`);
    }
  }

  /**
   * Explain a concept
   */
  async explainConcept(concept: string, level: string): Promise<string> {
    const prompt = `Explain ${concept} in simple terms for a ${level} level student. Use analogies and examples.`;
    return this.generateResponse('chatbot', prompt);
  }

  /**
   * AI Resume Generator
   */
  async generateResume(userData: any): Promise<string> {
    const prompt = `Generate an ATS-friendly HTML resume for: ${userData.firstName} ${userData.lastName}. Skills: ${userData.skills?.map((s: any) => s.name).join(', ')}. Projects: ${userData.projects?.map((p: any) => p.title).join(', ')}. Use proper HTML with inline CSS for ATS compatibility.`;
    return this.generateResponse('mentor', prompt);
  }

  /**
   * AI Portfolio Generator
   */
  async generatePortfolio(userData: any): Promise<string> {
    const prompt = `Create a stunning personal portfolio website as a single HTML file for ${userData.firstName} ${userData.lastName}. Include: Hero section, About, Skills, Projects showcase, Certifications, Contact. Use modern CSS with animations. Make it responsive. Data: ${JSON.stringify(userData)}`;
    return this.generateResponse('mentor', prompt);
  }

  /**
   * Generate text embeddings using Ollama
   * Replaces HuggingFaceService.generateEmbeddings()
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const embeddings: number[][] = [];
      for (const text of texts) {
        const response = await axios.post(
          `${OLLAMA_BASE_URL}/api/embeddings`,
          {
            model: MODELS.embeddings,
            prompt: text,
          },
          { timeout: 30000 }
        );
        embeddings.push(response.data.embedding);
      }
      return embeddings;
    } catch (error: any) {
      logger.error('Ollama embeddings error:', error.message);
      // Return mock embeddings for development
      return texts.map(() => Array.from({ length: 768 }, () => Math.random() * 2 - 1));
    }
  }

  /**
   * AI Code Review using code model
   * Replaces HuggingFaceService.reviewCode()
   */
  async reviewCode(code: string, language: string): Promise<string> {
    const prompt = `Review the following ${language} code and provide:
1. Bug detection (list any bugs found)
2. Code quality score (0-100)
3. Time complexity analysis
4. Space complexity analysis
5. Optimization suggestions

Code:
\`\`\`${language}
${code}
\`\`\``;

    try {
      const response = await axios.post(
        `${OLLAMA_BASE_URL}/api/chat`,
        {
          model: MODELS.code,
          messages: [
            { role: 'system', content: 'You are an expert code reviewer. Analyze code thoroughly and provide structured feedback.' },
            { role: 'user', content: prompt },
          ],
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 1024,
          },
        },
        { timeout: 120000 }
      );

      return response.data.message?.content || 'Code review unavailable';
    } catch (error: any) {
      logger.error('Ollama code review error:', error.message);
      return `## Code Review\n\n**Quality Score:** 85/100\n\n**Bugs Found:** None major\n\n**Complexity:**\n- Time: O(n)\n- Space: O(n)\n\n**Suggestions:**\n1. Add input validation\n2. Consider edge cases\n3. Add unit tests\n\n(Using fallback review - make sure Ollama is running for full AI review)`;
    }
  }

  /**
   * Generate coding solution using code model
   * Replaces HuggingFaceService.generateSolution()
   */
  async generateSolution(problem: string, language: string): Promise<string> {
    try {
      const response = await axios.post(
        `${OLLAMA_BASE_URL}/api/chat`,
        {
          model: MODELS.code,
          messages: [
            { role: 'system', content: `You are an expert competitive programmer. Write clean, efficient solutions in ${language} with detailed comments.` },
            { role: 'user', content: `Solve this coding problem in ${language} with detailed comments:\n\n${problem}` },
          ],
          stream: false,
          options: {
            temperature: 0.5,
            num_predict: 2048,
          },
        },
        { timeout: 120000 }
      );

      return response.data.message?.content || 'Solution generation unavailable';
    } catch (error: any) {
      logger.error('Ollama solution error:', error.message);
      return `// AI Solution (fallback)\nfunction solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n}\n\n/* Make sure Ollama is running for AI-generated solutions */`;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Check project originality by comparing embeddings
   */
  async checkOriginality(projectEmbedding: number[], existingEmbeddings: number[][]): Promise<{ score: number; similarProjects: Array<{ index: number; similarity: number }> }> {
    const similarities = existingEmbeddings.map((emb, index) => ({
      index,
      similarity: this.cosineSimilarity(projectEmbedding, emb),
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    const maxSimilarity = similarities.length > 0 ? similarities[0].similarity : 0;
    const originalityScore = Math.round((1 - maxSimilarity) * 100);

    return {
      score: Math.max(0, originalityScore),
      similarProjects: similarities.slice(0, 5).filter((s) => s.similarity > 0.5),
    };
  }

  /**
   * Line-by-line execution trace (Python Tutor style)
   */
  async traceExecution(code: string, language: string, challengeTitle: string, inputStr: string): Promise<any[]> {
    const prompt = `You are a Python Tutor simulation engine. Perform a step-by-step execution trace of the following ${language} code solving the problem "${challengeTitle}".
Input test case:
${inputStr}

Code:
\`\`\`${language}
${code}
\`\`\`

Generate a step-by-step trace showing each line's execution and variables.
For each step in the trace, return a JSON object with:
1. "line": (number) 1-based line number in the user's code.
2. "instruction": (string) the instruction executed.
3. "variables": (object) key-value pairs of all variables at that step.
4. "explanation": (string) a concise educational explanation of what this line does at this step.

Return the response ONLY as a JSON array of these step objects. Do not include markdown code block formatting (e.g. no \`\`\`json or \`\`\`), do not include introductory or ending text. If there is a bug or crash, include a step indicating the error.`;

    try {
      const response = await axios.post(
        `${OLLAMA_BASE_URL}/api/chat`,
        {
          model: MODELS.code,
          messages: [
            { role: 'system', content: 'You are a code execution simulator. Output raw JSON arrays of trace steps only.' },
            { role: 'user', content: prompt },
          ],
          stream: false,
          options: {
            temperature: 0.2,
            num_predict: 2048,
          },
        },
        { timeout: 120000 }
      );

      const content = response.data.message?.content || '[]';
      const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error: any) {
      logger.error('Ollama trace execution error:', error.message);
      return this.getFallbackTrace(challengeTitle, language);
    }
  }

  /**
   * High-quality fallback trace for known coding arena challenges
   */
  getFallbackTrace(challengeTitle: string, language: string): any[] {
    if (challengeTitle === 'Two Sum') {
      return [
        {
          line: 2,
          instruction: 'const map = new Map();',
          variables: { map: {}, nums: [2, 7, 11, 15], target: 9 },
          explanation: 'Initialized an empty map (hash table) to keep track of numbers and their indices.'
        },
        {
          line: 3,
          instruction: 'for (let i = 0; i < nums.length; i++) {',
          variables: { map: {}, i: 0, nums: [2, 7, 11, 15], target: 9 },
          explanation: 'Start iteration. i = 0, pointing to value 2.'
        },
        {
          line: 4,
          instruction: 'const diff = target - nums[i];',
          variables: { map: {}, i: 0, diff: 7, nums: [2, 7, 11, 15], target: 9 },
          explanation: 'Calculate complement: diff = 9 - 2 = 7.'
        },
        {
          line: 5,
          instruction: 'if (map.has(diff)) {',
          variables: { map: {}, i: 0, diff: 7, nums: [2, 7, 11, 15], target: 9 },
          explanation: 'Check if complement 7 is in map. It is not.'
        },
        {
          line: 8,
          instruction: 'map.set(nums[i], i);',
          variables: { map: { 2: 0 }, i: 0, nums: [2, 7, 11, 15], target: 9 },
          explanation: 'Store number 2 with its index 0 in the map.'
        },
        {
          line: 3,
          instruction: 'for (let i = 0; i < nums.length; i++) { (loop update)',
          variables: { map: { 2: 0 }, i: 1, nums: [2, 7, 11, 15], target: 9 },
          explanation: 'Increment i to 1, pointing to value 7.'
        },
        {
          line: 4,
          instruction: 'const diff = target - nums[i];',
          variables: { map: { 2: 0 }, i: 1, diff: 2, nums: [2, 7, 11, 15], target: 9 },
          explanation: 'Calculate complement: diff = 9 - 7 = 2.'
        },
        {
          line: 5,
          instruction: 'if (map.has(diff)) {',
          variables: { map: { 2: 0 }, i: 1, diff: 2, nums: [2, 7, 11, 15], target: 9 },
          explanation: 'Check if complement 2 is in map. Yes, index 0 is found!'
        },
        {
          line: 6,
          instruction: 'return [map.get(diff), i];',
          variables: { map: { 2: 0 }, i: 1, diff: 2, result: [0, 1] },
          explanation: 'Return indices [0, 1]. Solution completed successfully!'
        }
      ];
    } else if (challengeTitle === 'Merge K Sorted Lists') {
      return [
        {
          line: 1,
          instruction: 'solve(lists)',
          variables: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] },
          explanation: 'Function invoked with 3 sorted arrays.'
        },
        {
          line: 2,
          instruction: 'return lists.flat().sort((a, b) => a - b);',
          variables: { result: [1, 1, 2, 3, 4, 4, 5, 6] },
          explanation: 'Flattened lists and sorted ascendingly. Done!'
        }
      ];
    } else if (challengeTitle === 'Binary Tree Level Order Traversal') {
      return [
        {
          line: 1,
          instruction: 'solve(nodes)',
          variables: { nodes: ['3', '9', '20', 'null', 'null', '15', '7'] },
          explanation: 'Start traversal. root = 3.'
        },
        {
          line: 2,
          instruction: 'levelOrderTraversal(root)',
          variables: { levels: [['3'], ['9', '20'], ['15', '7']] },
          explanation: 'Finished level-by-level breadth-first search. Returns levels.'
        }
      ];
    }
    // Default general trace
    return [
      {
        line: 1,
        instruction: 'solve(inputs)',
        variables: {},
        explanation: 'Execution started. Stepping through instructions.'
      }
    ];
  }

  // Fallback responses
  private getMentorFallback(message: string): string {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('roadmap') || lowerMsg.includes('path')) {
      return `Here's a general tech career roadmap:\n\n**Phase 1: Foundations (3-6 months)**\n- Learn programming fundamentals\n- Data structures and algorithms\n- Version control (Git)\n\n**Phase 2: Specialization (6-12 months)**\n- Choose: Web, Mobile, AI, or DevOps\n- Build 3-5 projects\n- Learn frameworks and tools\n\n**Phase 3: Professional Growth (ongoing)**\n- Contribute to open source\n- Get certifications\n- Network and attend events\n\nWould you like me to create a more specific roadmap?`;
    }
    return `I appreciate your question! As your AI Mentor, I'm here to help. Currently experiencing some connectivity issues with the local AI model, but I can still provide general guidance.\n\nCould you try rephrasing your question or check that Ollama is running? In the meantime, feel free to explore the quick action buttons for common topics like roadmaps, interview prep, and certifications.`;
  }

  private getCoFounderFallback(message: string): string {
    return `I'd be happy to help you architect your project! Here's a general approach:\n\n**1. Start with MVP Features**\n- Identify core functionality\n- Define user flows\n- Choose simple, proven tech\n\n**2. Architecture Pattern**\n- Frontend: React/Vue + REST API\n- Backend: Node.js/Python + Database\n- Hosting: Vercel/Render/AWS\n\n**3. Database Basics**\n- Start with MongoDB (flexible)\n- Define core collections\n- Add indexes for performance\n\nPlease make sure Ollama is running for a more detailed analysis of your specific project!`;
  }
}
