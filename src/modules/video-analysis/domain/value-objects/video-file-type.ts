/** Video MIME type accepted for direct analysis uploads. */
export class VideoFileType {
  public readonly value: 'video/mp4' | 'video/quicktime' | 'video/webm';
  public constructor(value: string) {
    if (value !== 'video/mp4' && value !== 'video/quicktime' && value !== 'video/webm') throw new UnsupportedVideoFileTypeError();
    this.value = value;
  }
}
import { UnsupportedVideoFileTypeError } from '../errors/video-analysis.errors';
