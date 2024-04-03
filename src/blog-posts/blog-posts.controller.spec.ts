import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostsController } from './blog-posts.controller';
import { BlogPostsService } from './blog-posts.service';

const mockBlogPostsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('BlogPostsController', () => {
  let controller: BlogPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogPostsController],
      providers: [
        {
          provide: BlogPostsService,
          useValue: mockBlogPostsService,
        },
      ],
    }).compile();

    controller = module.get<BlogPostsController>(BlogPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
