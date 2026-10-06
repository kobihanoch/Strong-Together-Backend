/** Read operations required by application queries. */
export abstract class VerificationQueries {
  abstract getVerificationStatus(username: string): Promise<boolean>;
}
