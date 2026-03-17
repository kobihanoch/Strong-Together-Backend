import Bull from "bull";

let analyzeVideoQueue = globalThis.analyzeVideoQueue || null;

const prefix = process.env.NODE_ENV === "development" ? "dev" : "prod";

if (!analyzeVideoQueue) {
  analyzeVideoQueue = new Bull(
    `${prefix}:analyzeVideoQueue`,
    process.env.REDIS_URL,
  );
  globalThis.analyzeVideoQueue = analyzeVideoQueue;
}

export default analyzeVideoQueue;
