/** Exercise identifier supported in video object keys and analysis jobs. */
export class VideoExercise {
  public readonly value: string;
  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0 || normalized.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(normalized)) throw new Error('Invalid exercise name');
    this.value = normalized;
  }
}
