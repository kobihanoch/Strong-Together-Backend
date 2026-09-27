/** Completed-or-failed worker result published to an application user. */
export class VideoAnalysisResultEvent<TResult> {
  public readonly payload: {
    jobId: string;
    userId: string;
    exercise: string;
    requestId?: string | undefined;
  } & ({ status: 'completed'; result: TResult[]; error: null } | { status: 'failed'; result: null; error: string });

  public constructor(payload: VideoAnalysisResultEvent<TResult>['payload']) {
    if (payload.jobId.length === 0 || payload.userId.length === 0) throw new Error('Video analysis result identifiers are required');
    this.payload = payload;
  }
}
