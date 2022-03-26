import axios, {AxiosPromise, AxiosRequestConfig} from "axios";

class HttpRequest {
    static createConfig(_config: any){
        let config: AxiosRequestConfig;
        if (_config.method == 'post'){
             config = {
              method: _config.method,
              url: _config.url,
              headers: _config.headers,
                data : _config.data
            };
        }
        if (_config.method == 'get'){
             config = {
              method: _config.method,
              url: _config.url,
              headers: _config.headers,
            };
        }
           if (_config.method == 'delete'){
             config = {
              method: _config.method,
              url: _config.url,
              headers: _config.headers,
            };
        }
         // @ts-ignore
        return config;
    }
    static execute(_config:AxiosRequestConfig): AxiosPromise<any>{
        return axios(_config);
    }
}

export default HttpRequest;