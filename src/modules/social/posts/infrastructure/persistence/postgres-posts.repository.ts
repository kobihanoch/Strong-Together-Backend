import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { SaveSql } from './writes/save.sql';
import { CreateSql } from './writes/create.sql';
import { FindPostByIdForUpdateSql } from './reads/find-by-id-for-update.sql';
import { PostsRepository } from '../../application/ports/posts.repository';
import { Post } from '../../domain/entities/post';
/** PostgreSQL implementation of post persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresPostsRepository implements PostsRepository {
  public constructor(
    private readonly createSql: CreateSql,
    private readonly saveSql: SaveSql,
    private readonly deleteSql: DeleteSql,
    private readonly findByIdForUpdateSql: FindPostByIdForUpdateSql,
  ) {}
  public async create(post: Post): Promise<Post> {
    const created = await this.createSql.create(post);
    return Post.restore({ ...post, id: created.id, content: post.content.value, visibility: post.visibility.value });
  }
  public async findByIdForUpdate(id: string): Promise<Post | undefined> {
    const post = await this.findByIdForUpdateSql.findByIdForUpdate(id);
    return post ? Post.restore(post) : undefined;
  }
  public async save(post: Post): Promise<boolean> {
    if (!post.id) throw new Error('Cannot save a post without an ID');
    return this.saveSql.save(post.id, post.content.value);
  }
  public async delete(id: string): Promise<boolean> {
    return this.deleteSql.delete(id);
  }
}
