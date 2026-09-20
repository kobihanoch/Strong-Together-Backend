/** Schedules side effects relative to the active application transaction. */
export abstract class TransactionHooks {
  /**
   * Registers best-effort work to run only after the active transaction commits.
   *
   * @param action - The asynchronous operation to execute after commit.
   * @returns Nothing.
   */
  abstract afterCommit(action: () => Promise<void>): void;
}
