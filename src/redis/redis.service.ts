import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor() {
    const options: RedisOptions = {
      host: 'localhost',
      port: 6379,
    };
    this.client = new Redis(options);
  }

  onModuleInit() {
    console.log('Redis Client Initialized');
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string) {
    await this.client.set(key, value);
  }
}
