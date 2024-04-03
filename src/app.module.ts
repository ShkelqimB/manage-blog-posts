import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BlogPost } from './blog-posts/entities/blog-post.entity';
import { BlogPostsController } from './blog-posts/blog-posts.controller';
import { BlogPostsService } from './blog-posts/blog-posts.service';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([BlogPost]),
    BlogPost,
  ],
  controllers: [AppController, BlogPostsController],
  providers: [AppService, BlogPostsService, RedisService],
})
export class AppModule {}
