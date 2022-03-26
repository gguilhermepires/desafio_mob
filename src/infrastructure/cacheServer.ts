import Cache from '../services/cache';

class CacheServer {
  
    static async get(key: string): Promise<any> {
        let cache = Cache();
        try{
            return await cache.get(key);
        }catch (e:any) {
            if(e.message === 'The "original" argument must be of type function. Received undefined')
                    throw new Error(`Erro de conexão com o cache server. Exception: ${e.message}`)
            throw e;
        }

    }
    static async set(key:string, value: any, ttl?: number | undefined) {
        let cache = Cache();
        try{
            await cache.set({key, value, ttl});
        }catch (e:any) {
               if(e.message === 'The "original" argument must be of type function. Received undefined')
                    throw new Error(`Erro de conexão com o cache server. Exception: ${e.message}`)
            throw e;
        }
    }
}

  export default CacheServer;


