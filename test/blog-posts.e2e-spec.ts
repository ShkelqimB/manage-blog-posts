import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BlogPostsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/blog-posts (GET)', () => {
    return request(app.getHttpServer())
      .get('/blog-posts')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });
});
