import Bull, { Queue } from "bull";
import { AnalyzeVideoPayload } from "../../types/dto/video-analysis.dto.ts";

declare global {
  var analyzeVideoQueue: Queue<AnalyzeVideoPayload> | undefined;
}

let analyzeVideoQueue = globalThis.analyzeVideoQueue || null;

const prefix = process.env.NODE_ENV === "development" ? "dev" : "prod";

if (!analyzeVideoQueue) {
  analyzeVideoQueue = new Bull<AnalyzeVideoPayload>(
    `${prefix}:analyzeVideoQueue`,
    process.env.REDIS_URL || "",
  );
  globalThis.analyzeVideoQueue = analyzeVideoQueue;
}

export default analyzeVideoQueue as Queue<AnalyzeVideoPayload>;
