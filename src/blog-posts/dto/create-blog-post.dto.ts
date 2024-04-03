import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: 'comment',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The body content of the blog post',
    example: 'BODY',
  })
  @IsNotEmpty()
  body: string;
}
