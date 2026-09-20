import { Module } from '@nestjs/common';
import { CrewsModule } from './crews/crews.module';
import { CrewRequestsModule } from './crews/requests/crew-requests.module';
import { CommentsModule } from './posts/comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './posts/reactions/reactions.module';
import { SocialSummaryModule } from './summary/social-summary.module';
import { SocialUsersModule } from './users/social-users.module';

@Module({
  imports: [CrewRequestsModule, CrewsModule, PostsModule, CommentsModule, ReactionsModule, SocialUsersModule, SocialSummaryModule],
  exports: [CrewRequestsModule, CrewsModule, PostsModule, CommentsModule, ReactionsModule, SocialUsersModule, SocialSummaryModule],
})
/** Composes and re-exports the independently usable social capabilities. */
export class SocialModule {}
