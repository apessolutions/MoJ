import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Global, Inject, Injectable } from '@nestjs/common';

@Injectable()
@Global()
export class CustomCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getKeys(pattern = '*') {
    return await this.cacheManager.store.keys(pattern);
  }

  async get(key: string) {
    return await this.cacheManager.get(key);
  }

  async cache(key: string, data: any) {
    await this.cacheManager.set(key, data);
  }

  async resetKeys(pattern: string) {
    const keys = await this.getKeys(pattern);
    await Promise.all(keys.map(async (key) => this.cacheManager.del(key)));
  }
}
