/** Stored image details returned by crew image storage. */
export type StoredCrewImage = { path: string; publicUrl: string };

/** Object-storage capability required by crew profile-picture use cases. */
export abstract class CrewImageStorage {
  public abstract upload(key: string, data: Buffer, contentType: string): Promise<StoredCrewImage>;
  public abstract delete(path: string): Promise<void>;
}
