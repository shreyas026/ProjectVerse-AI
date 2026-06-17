import { EmbeddingService } from './embedding.service.js';
import { User } from '../../models/User.js';
import { logger } from '../../config/logger.js';

/**
 * ML Feature 2: Team Recommendation Engine
 * 
 * Model: sentence-transformers/all-MiniLM-L6-v2 (via @xenova/transformers)
 * Source: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
 * Algorithm: Cosine Similarity on skill embeddings
 * 
 * Finds compatible team members based on skills, interests, and department.
 */
export class TeamRecommendationService {
  private static instance: TeamRecommendationService;
  private embeddings: EmbeddingService;

  private constructor() {
    this.embeddings = EmbeddingService.getInstance();
  }

  static getInstance(): TeamRecommendationService {
    if (!TeamRecommendationService.instance) {
      TeamRecommendationService.instance = new TeamRecommendationService();
    }
    return TeamRecommendationService.instance;
  }

  /**
   * Get team member recommendations for a user
   */
  async getRecommendations(
    userId: string,
    skills: string[],
    interests: string[]
  ): Promise<Array<{
    userId: string;
    name: string;
    avatar: string;
    department: string;
    compatibilityScore: number;
    matchedSkills: string[];
    reason: string;
  }>> {
    try {
      // 1. Generate embedding for the requesting user's profile
      const userText = `${skills.join(' ')} ${interests.join(' ')}`;
      const [userEmbedding] = await this.embeddings.generateMiniLMEmbeddings([userText]);

      // 2. Find other students
      const users = await User.find({
        _id: { $ne: userId },
        role: 'student',
      }).select('firstName lastName avatar skills embedding college.department interests');

      // 3. Calculate compatibility for each user
      const recommendations = users.map((u: any) => {
        // Embedding similarity (40% weight)
        const embeddingSimilarity = u.embedding?.length
          ? this.embeddings.cosineSimilarity(userEmbedding, u.embedding)
          : 0.3;

        // Skill match (60% weight) - complementary skills score higher
        const userSkills = u.skills?.map((s: any) => s.name) || [];
        const matchedSkills = userSkills.filter((s: string) => skills.includes(s));
        const complementarySkills = userSkills.filter((s: string) => !skills.includes(s));
        const skillMatch = Math.min(
          (matchedSkills.length * 0.3 + complementarySkills.length * 0.7) / Math.max(skills.length, 1),
          1
        );

        const compatibilityScore = Math.round(
          (embeddingSimilarity * 0.4 + skillMatch * 0.6) * 100
        );

        return {
          userId: u._id.toString(),
          name: `${u.firstName} ${u.lastName}`,
          avatar: u.avatar || '',
          department: u.college?.department || 'Unknown',
          compatibilityScore,
          matchedSkills,
          reason: this.generateReason(matchedSkills, complementarySkills, u.college?.department),
        };
      });

      // 4. Sort and filter
      return recommendations
        .filter((r) => r.compatibilityScore > 30)
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
        .slice(0, 10);
    } catch (error: any) {
      logger.error('Team recommendation error:', error.message);
      return [];
    }
  }

  private generateReason(matched: string[], complementary: string[], department: string): string {
    const parts: string[] = [];
    if (matched.length > 0) parts.push(`Shares ${matched.length} skill(s): ${matched.slice(0, 3).join(', ')}`);
    if (complementary.length > 0) parts.push(`Brings ${complementary.length} complementary skill(s)`);
    if (department) parts.push(`From ${department} department`);
    return parts.join('. ') || 'Potential team member';
  }
}
