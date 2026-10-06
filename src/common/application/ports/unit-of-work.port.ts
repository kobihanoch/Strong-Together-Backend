/** Owns an application transaction and work that must run after it commits. */
export abstract class UnitOfWork {
  /** Executes an operation inside an RLS-configured transaction. */
  public abstract execute<T>(userId: string | undefined, operation: () => Promise<T>): Promise<T>;

  /** Executes an operation inside a read-only, RLS-configured transaction. */
  public abstract executeReadOnly<T>(userId: string | undefined, operation: () => Promise<T>): Promise<T>;

  /** Registers work that runs only after the active transaction commits. */
  public abstract afterCommit(operation: () => Promise<void>): void;
}
