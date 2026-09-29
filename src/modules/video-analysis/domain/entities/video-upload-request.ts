import { VideoExercise } from '../value-objects/video-exercise';
import { VideoFileType } from '../value-objects/video-file-type';
import { InvalidVideoAnalysisJobIdError } from '../errors/video-analysis.errors';

/** Primitive values submitted when requesting a direct video upload. */
export interface VideoUploadRequestValues {
  exercise: string;
  fileType: string;
  jobId: string;
  userId: string;
  requestId?: string | undefined;
  sentryTrace: string;
  baggage: string;
}

/** Validated request for a video-analysis source upload. */
export class VideoUploadRequest {
  public readonly exercise: VideoExercise;
  public readonly fileType: VideoFileType;
  public readonly jobId: string;
  public readonly userId: string;
  public readonly requestId?: string | undefined;
  public readonly sentryTrace: string;
  public readonly baggage: string;

  private constructor(values: VideoUploadRequestValues) {
    const jobId = values.jobId.trim();
    if (jobId.length === 0 || jobId.length > 128) throw new InvalidVideoAnalysisJobIdError();
    this.exercise = new VideoExercise(values.exercise);
    this.fileType = new VideoFileType(values.fileType);
    this.jobId = jobId;
    this.userId = values.userId;
    this.requestId = values.requestId;
    this.sentryTrace = values.sentryTrace;
    this.baggage = values.baggage;
  }

  public static create(values: VideoUploadRequestValues): VideoUploadRequest {
    return new VideoUploadRequest(values);
  }

  /** Produces the existing unique object-key format for this upload. */
  public fileKey(timestamp: number): string {
    return `${this.exercise.value}_${this.userId}_${timestamp}`;
  }
}
