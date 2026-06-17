import { Event } from '../../models/Event.js';
import { logger } from '../../config/logger.js';

/**
 * ML Feature 3: Event Recommendation Engine
 * 
 * Algorithm: Content-Based Filtering (no ML model needed)
 * 
 * Calculates relevance scores based on:
 * - Skill match (40%)
 * - Interest match (30%)
 * - Event type preference (20%)
 * - Recency boost (10%)
 */
export class EventRecommendationService {
  private static instance: EventRecommendationService;

  private constructor() {}

  static getInstance(): EventRecommendationService {
    if (!EventRecommendationService.instance) {
      EventRecommendationService.instance = new EventRecommendationService();
    }
    return EventRecommendationService.instance;
  }

  /**
   * Get event recommendations for a user
   */
  async getRecommendations(
    interests: string[],
    skills: string[],
    pastEventTypes?: string[]
  ): Promise<Array<{
    eventId: string;
    title: string;
    type: string;
    relevanceScore: number;
    reasons: string[];
  }>> {
    try {
      // Get upcoming events
      const events = await Event.find({
        status: 'published',
        startDate: { $gte: new Date() },
      });

      const recommendations = events.map((event: any) => {
        let score = 0;
        const reasons: string[] = [];

        // Skill match (40% weight)
        const skillMatch = this.calculateOverlap(
          skills,
          event.technologies || []
        );
        score += skillMatch * 0.4;
        if (skillMatch > 0) {
          const matched = (event.technologies || []).filter((t: string) =>
            skills.some((s) => s.toLowerCase() === t.toLowerCase())
          );
          reasons.push(`Matches your skills: ${matched.slice(0, 3).join(', ')}`);
        }

        // Interest match (30% weight)
        const interestMatch = this.calculateOverlap(
          interests,
          event.tags || []
        );
        score += interestMatch * 0.3;
        if (interestMatch > 0) {
          reasons.push('Aligns with your interests');
        }

        // Event type preference (20% weight)
        if (pastEventTypes && pastEventTypes.length > 0) {
          const typePreference = pastEventTypes.includes(event.type) ? 1 : 0.3;
          score += typePreference * 0.2;
          if (pastEventTypes.includes(event.type)) {
            reasons.push(`You enjoy ${event.type} events`);
          }
        } else {
          score += 0.5 * 0.2; // Neutral if no history
        }

        // Recency boost (10% weight) - closer events get higher scores
        const daysUntil = Math.max(
          0,
          (new Date(event.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const recencyBoost = daysUntil < 7 ? 1 : daysUntil < 30 ? 0.7 : 0.3;
        score += recencyBoost * 0.1;
        if (daysUntil < 7) {
          reasons.push('Starting soon!');
        }

        return {
          eventId: event._id.toString(),
          title: event.title,
          type: event.type,
          relevanceScore: Math.round(score * 100),
          reasons,
        };
      });

      return recommendations
        .filter((r) => r.relevanceScore > 10)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 10);
    } catch (error: any) {
      logger.error('Event recommendation error:', error.message);
      return [];
    }
  }

  private calculateOverlap(userItems: string[], eventItems: string[]): number {
    if (userItems.length === 0 || eventItems.length === 0) return 0;
    const normalizedUser = userItems.map((i) => i.toLowerCase());
    const normalizedEvent = eventItems.map((i) => i.toLowerCase());
    const matches = normalizedUser.filter((i) => normalizedEvent.includes(i)).length;
    return Math.min(matches / Math.max(normalizedUser.length, 1), 1);
  }
}
