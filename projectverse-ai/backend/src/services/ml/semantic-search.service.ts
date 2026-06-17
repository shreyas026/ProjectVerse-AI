import { EmbeddingService } from './embedding.service.js';
import { Project } from '../../models/Project.js';
import { User } from '../../models/User.js';
import { logger } from '../../config/logger.js';

/**
 * ML Feature 8: Semantic Search Engine
 * 
 * Model: BAAI/bge-small-en-v1.5 (via @xenova/transformers)
 * Source: https://huggingface.co/BAAI/bge-small-en-v1.5
 * Vector Dimension: 384
 * 
 * Provides meaning-based search across projects, users, and events.
 */
export class SemanticSearchService {
  private static instance: SemanticSearchService;
  private embeddings: EmbeddingService;

  private constructor() {
    this.embeddings = EmbeddingService.getInstance();
  }

  static getInstance(): SemanticSearchService {
    if (!SemanticSearchService.instance) {
      SemanticSearchService.instance = new SemanticSearchService();
    }
    return SemanticSearchService.instance;
  }

  /**
   * Search projects by semantic meaning
   */
  async searchProjects(
    query: string,
    limit: number = 10
  ): Promise<Array<{
    projectId: string;
    title: string;
    description: string;
    similarity: number;
  }>> {
    try {
      // Generate query embedding using BGE model
      const [queryEmbedding] = await this.embeddings.generateBGEEmbeddings([query]);

      // Fetch projects with embeddings
      const projects = await Project.find({ isPublic: true }).select(
        'title description embedding owner technologies'
      );

      // Calculate similarity for each project
      const results = projects
        .filter((p: any) => p.embedding && p.embedding.length > 0)
        .map((p: any) => ({
          projectId: p._id.toString(),
          title: p.title,
          description: p.description?.substring(0, 200) || '',
          similarity: Math.round(
            this.embeddings.cosineSimilarity(queryEmbedding, p.embedding) * 100
          ),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return results;
    } catch (error: any) {
      logger.error('Semantic project search error:', error.message);
      return [];
    }
  }

  /**
   * Search users by semantic meaning (skills, interests)
   */
  async searchUsers(
    query: string,
    limit: number = 10
  ): Promise<Array<{
    userId: string;
    name: string;
    avatar: string;
    department: string;
    similarity: number;
  }>> {
    try {
      const [queryEmbedding] = await this.embeddings.generateBGEEmbeddings([query]);

      const users = await User.find({ role: 'student' }).select(
        'firstName lastName avatar embedding college.department skills'
      );

      const results = users
        .filter((u: any) => u.embedding && u.embedding.length > 0)
        .map((u: any) => ({
          userId: u._id.toString(),
          name: `${u.firstName} ${u.lastName}`,
          avatar: u.avatar || '',
          department: u.college?.department || 'Unknown',
          similarity: Math.round(
            this.embeddings.cosineSimilarity(queryEmbedding, u.embedding) * 100
          ),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return results;
    } catch (error: any) {
      logger.error('Semantic user search error:', error.message);
      return [];
    }
  }
}
