/** Completed-or-failed worker result published to an application user. */
export class VideoAnalysisResultEvent<TResult> {
  public readonly payload: {
    jobId: string;
    userId: string;
    exercise: string;
    requestId?: string | undefined;
  } & ({ status: 'completed'; result: TResult[]; error: null } | { status: 'failed'; result: null; error: string });

  private constructor(payload: VideoAnalysisResultEvent<TResult>['payload']) {
    if (payload.jobId.length === 0 || payload.userId.length === 0) throw new VideoAnalysisResultIdentifiersRequiredError();
    this.payload = payload;
  }

  static create<TResult>(payload: VideoAnalysisResultEvent<TResult>['payload']): VideoAnalysisResultEvent<TResult> {
    return new VideoAnalysisResultEvent(payload);
  }
}
import { VideoAnalysisResultIdentifiersRequiredError } from '../errors/video-analysis.errors';
