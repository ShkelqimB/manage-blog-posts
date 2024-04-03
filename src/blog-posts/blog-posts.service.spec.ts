import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostsService } from './blog-posts.service';
// import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
};
const mockBlogPostsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
};

describe('BlogPostsService', () => {
  let service: BlogPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostsService,
        {
          provide: getRepositoryToken(BlogPost),
          useValue: mockBlogPostsRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<BlogPostsService>(BlogPostsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of blog posts', async () => {
    const testPosts = [{ id: 1, title: 'Test Post', body: 'This is a test' }];
    mockBlogPostsRepository.findAndCount.mockReturnValue(
      Promise.resolve([testPosts, 1]),
    );

    const posts = await service.findAll(1, 10);
    expect(posts).toEqual(testPosts);
  });

  it('should return a single blog post by ID', async () => {
    const blogPost = { id: 1, title: 'Test Post', body: 'Test Body' };
    const id = 1;
    mockRedisService.get.mockResolvedValue(null);
    mockBlogPostsRepository.findOne.mockResolvedValue(blogPost);

    const result = await service.findOne(id);

    expect(result).toEqual(blogPost);
    expect(mockRedisService.get).toHaveBeenCalledWith(`blogPosts:${id}`);
    expect(mockBlogPostsRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  });

  it('should return a single blog post from cache if available', async () => {
    const blogPost = { id: 1, title: 'Test Post', body: 'Test Body' };
    const id = 1;
    mockRedisService.get.mockResolvedValue(JSON.stringify(blogPost));

    const result = await service.findOne(id);

    expect(result).toEqual(blogPost);
    expect(mockRedisService.get).toHaveBeenCalledWith(`blogPosts:${id}`);
    expect(mockBlogPostsRepository.findOne).not.toHaveBeenCalled();
  });

  it('should successfully create a new blog post and cache it', async () => {
    const createBlogPostDto = { title: 'Test Title', body: 'Test Body' };
    const savedPost = { id: 1, ...createBlogPostDto };
    mockBlogPostsRepository.create.mockReturnValue(createBlogPostDto);
    mockBlogPostsRepository.save.mockResolvedValue(savedPost);

    const result = await service.create(createBlogPostDto);

    expect(result).toEqual(savedPost);
    expect(mockRedisService.set).toHaveBeenCalledWith(
      `blogPosts:${savedPost.id}`,
      JSON.stringify(savedPost),
    );
  });
});
