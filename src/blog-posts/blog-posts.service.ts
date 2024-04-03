import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BlogPostsService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostsRepository: Repository<BlogPost>,
    private redisService: RedisService,
  ) {}

  // - An endpoint to create a new blog post.
  async create(createBlogPostDto: CreateBlogPostDto) {
    const newPost = this.blogPostsRepository.create(createBlogPostDto);
    const savedPost = await this.blogPostsRepository.save(newPost);
    if (savedPost) {
      const cacheKey = `blogPosts:${savedPost.id}`;
      await this.redisService.set(cacheKey, JSON.stringify(savedPost));
    }
    return savedPost;
  }

  // - An endpoint to retrieve a list of all blog posts, implementing basic pagination.
  async findAll(page: number, limit: number): Promise<BlogPost[]> {
    const cacheKey = `blogPosts`;
    const cachedResults = await this.redisService.get(cacheKey);

    if (!cachedResults) {
      // Data not in cache, fetch from DB
      const [results, _total] = await this.blogPostsRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        order: { createdAt: 'DESC' },
      });

      for (const res of results) {
        const key = `${cacheKey}:${res.id}`;
        // Cache the results
        await this.redisService.set(key, JSON.stringify(res)); // Cache for 5 minutes
      }
      return results;
    }

    // Return cached results
    return JSON.parse(cachedResults);
  }

  // - An endpoint to retrieve a single blog post by ID.
  async findOne(id: number) {
    const cacheKey = `blogPosts:${id}`;
    const cachedResults = await this.redisService.get(cacheKey);
    if (cachedResults) {
      return JSON.parse(cachedResults);
    }
    const getFromDb = await this.blogPostsRepository.findOne({ where: { id } });
    if (!getFromDb) {
      throw new NotFoundException(`BlogPosts with id ${id} not found`);
    }
    return getFromDb;
  }
}
