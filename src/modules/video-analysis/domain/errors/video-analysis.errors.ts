import { DomainValidationError } from '../../../../common/domain/errors/domain.errors';

export class InvalidVideoAnalysisJobIdError extends DomainValidationError {
  constructor() {
    super('Invalid video-analysis job ID');
  }
}
export class InvalidVideoExerciseError extends DomainValidationError {
  constructor() {
    super('Invalid exercise name');
  }
}
export class UnsupportedVideoFileTypeError extends DomainValidationError {
  constructor() {
    super('Unsupported video file type');
  }
}
export class VideoAnalysisResultIdentifiersRequiredError extends DomainValidationError {
  constructor() {
    super('Video analysis result identifiers are required');
  }
}
