import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('blog-posts')
@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  // - An endpoint to create a new blog post.
  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
  @ApiBody({ type: CreateBlogPostDto })
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostsService.create(createBlogPostDto);
  }

  // - An endpoint to retrieve a list of all blog posts, implementing basic pagination.
  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all blog posts' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of posts per page' })
  @ApiResponse({ status: 200, description: 'Array of blog posts' })
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = page ? +page : 1;
    const limitNumber = limit ? +limit : 10;
    return this.blogPostsService.findAll(pageNumber, limitNumber);
  }

  // - An endpoint to retrieve a single blog post by ID.
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single blog post by ID' })
  @ApiResponse({ status: 200, description: 'The found blog post', type: CreateBlogPostDto })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findOne(@Param('id') id: string) {
    return this.blogPostsService.findOne(+id);
  }
}
