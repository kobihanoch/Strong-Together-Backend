/** Raised when a post is absent or inaccessible. */ export class PostNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Post not found');
    this.name = PostNotFoundError.name;
  }
}
/** Raised when a crew-only post has no target crews. */ export class CrewTargetRequiredError extends Error {
  public readonly statusCode = 400;
  public constructor() {
    super('Crew-only post must target at least one crew');
    this.name = CrewTargetRequiredError.name;
  }
}
