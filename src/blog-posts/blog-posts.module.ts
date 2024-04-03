import { Module } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { BlogPostsController } from './blog-posts.controller';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [BlogPostsController],
  providers: [BlogPostsService, RedisService],
})
export class BlogPostsModule {}
