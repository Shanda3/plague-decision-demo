declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    OPENAI_API_KEY?: string;
    DECISIONS_ENABLED?: string;
    DECISIONS_PRICING_REVIEWED_UNTIL?: string;
    BUCKET?: R2Bucket;
  }
}
