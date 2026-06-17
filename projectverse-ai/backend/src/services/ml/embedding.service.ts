import { logger } from '../../config/logger.js';

// Dynamic import for @xenova/transformers (ESM module)
let Pipeline: any = null;

async function loadPipeline() {
  if (!Pipeline) {
    const transformers = await import('@xenova/transformers');
    Pipeline = transformers.pipeline;
  }
  return Pipeline;
}

/**
 * Local Embedding Service using @xenova/transformers
 * 
 * Runs HuggingFace models LOCALLY on CPU - no API key needed.
 * Models auto-download on first use (~80-130MB each).
 * 
 * Models used:
 * - Xenova/all-MiniLM-L6-v2 (384-dim) → Originality check, Team recommendation
 * - Xenova/bge-small-en-v1.5 (384-dim) → Semantic search
 */
export class EmbeddingService {
  private static instance: EmbeddingService;
  private models: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  private constructor() {}

  static getInstance(): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
    }
    return EmbeddingService.instance;
  }

  /**
   * Load a model lazily (only when first needed)
   */
  private async loadModel(modelName: string): Promise<any> {
    if (this.models.has(modelName)) {
      return this.models.get(modelName);
    }

    // Prevent duplicate loading
    if (this.loadingPromises.has(modelName)) {
      return this.loadingPromises.get(modelName);
    }

    const loadPromise = (async () => {
      try {
        logger.info(`Loading HuggingFace model: ${modelName} (this may take a moment on first run)...`);
        const pipelineFn = await loadPipeline();
        const model = await pipelineFn('feature-extraction', modelName, {
          quantized: true, // Use quantized version for faster CPU inference
        });
        this.models.set(modelName, model);
        logger.info(`Model ${modelName} loaded successfully`);
        return model;
      } catch (error: any) {
        logger.error(`Failed to load model ${modelName}:`, error.message);
        this.loadingPromises.delete(modelName);
        throw error;
      }
    })();

    this.loadingPromises.set(modelName, loadPromise);
    return loadPromise;
  }

  /**
   * Generate embeddings using all-MiniLM-L6-v2
   * Used for: Project Originality, Team Recommendation
   * Vector dimension: 384
   */
  async generateMiniLMEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const model = await this.loadModel('Xenova/all-MiniLM-L6-v2');
      const embeddings: number[][] = [];

      for (const text of texts) {
        const output = await model(text, { pooling: 'mean', normalize: true });
        embeddings.push(Array.from(output.data));
      }

      return embeddings;
    } catch (error: any) {
      logger.error('MiniLM embedding error:', error.message);
      // Return random embeddings as fallback for development
      return texts.map(() => Array.from({ length: 384 }, () => Math.random() * 2 - 1));
    }
  }

  /**
   * Generate embeddings using bge-small-en-v1.5
   * Used for: Semantic Search
   * Vector dimension: 384
   */
  async generateBGEEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const model = await this.loadModel('Xenova/bge-small-en-v1.5');
      const embeddings: number[][] = [];

      for (const text of texts) {
        const output = await model(text, { pooling: 'cls', normalize: true });
        embeddings.push(Array.from(output.data));
      }

      return embeddings;
    } catch (error: any) {
      logger.error('BGE embedding error:', error.message);
      return texts.map(() => Array.from({ length: 384 }, () => Math.random() * 2 - 1));
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dot / denominator;
  }
}
