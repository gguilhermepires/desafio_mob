import * as NodeRedis from 'node-cache-redis';

export type CacheInstance = Readonly<{
  set: <T>({key,value,ttl,}: {key: string;value: T;ttl: number | undefined;}) => Promise<string>;
  get: <T>(key: string) => Promise<T>;
  keys: () => Promise<string[]>;
  has: (key: string) => boolean;
  del: (keys?: string[] | undefined) => Promise<number>;
}>;

export default function Cache(): CacheInstance {
  NodeRedis.init({
    name: 'desafio',
    redisOptions: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT || '6379'),
    },
  });

  return Object.freeze({ set, get, keys, has, del });

  function set<T>({key,value,ttl,}: {key: string;value: T;ttl: number | undefined;}) {
    return NodeRedis.set(key, value, ttl);
  }

  async function get<T>(key: string): Promise<T> {
    return NodeRedis.get(key) as Promise<T>;
  }

  async function keys(): Promise<string[]> {
    return NodeRedis.keys('*');
  }

  function has(key: string): boolean {
    return !!NodeRedis.get(key);
  }

  function del(keys?: string[]) {
    return NodeRedis.del(keys);
  }
}
