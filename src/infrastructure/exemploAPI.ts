// import * as CustomTypes from "src/infrastructure/customTypes";
// import HttpRequest from "./httpRequest";
// import {InvalidUserProfile, UserNotFound} from "./erros";
// import debug from 'debug';
// const log = debug('desafio:services:InceresAPI');

// class InceresAPI {

//     static async refreshTokenFBI(token: string, email: string): Promise<string> {
//         try{
//             let data = { email, token};
//             let response = await HttpRequest.execute(HttpRequest.createConfig({
//                 method: 'post',
//                 url: `${process.env.IN_CERES_FBI_URL}/integrations/refresh-token`,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'INTEGRATION-TOKEN': String(process.env.IN_CERES_SERVICE_TOKEN),
//                 },
//                 data : data
//                 }
//             ));

//              if (!response.data)
//                throw new Error(`Error login on fbi api. Response: ${response.data}`);

//              if(response.data.token)
//                 return response.data.token;

//              throw new Error(`Error login on fbi api. Response: ${response.data}`);
//         }catch (e) {
//             // @ts-ignore
//             throw new InvalidUserProfile(`Não foi possível atualizar o token no fbi api. Exceção: ${e.message}`);
//         }
//     }

//     static async signFbiAPI(email: string, password: string): Promise<CustomTypes.tokenFbi> {
//         try{
//             let data = { email, password};
//             let response = await HttpRequest.execute(HttpRequest.createConfig({
//                 method: 'post',
//                 url: `${process.env.IN_CERES_FBI_URL}/login`,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'EMBASSY-TOKEN': String(process.env.IN_CERES_SERVICE_TOKEN),
//                     'EMBASSY-PROFILE': String(process.env.IN_CERES_SERVICE_PROFILE),
//                 },
//                 data : data
//                 }
//             ));

//              if (!response.data)
//                throw new Error(`Error login on fbi api. Response: ${response.data}`);
//             return response.data;
//         }catch (e) {
//             // @ts-ignore
//             throw new InvalidUserProfile(`Não foi possível login no fbi api. Usuário inválido. Exceção: ${e.message}`);
//         }
//     }

//     static async getUserFromInceresFBI(token: CustomTypes.tokenFbi): Promise<CustomTypes.userFBI | null> {
//         try{
//             let response = await HttpRequest.execute(HttpRequest.createConfig({
//                 method: 'get',
//                 url: `${process.env.IN_CERES_FBI_URL}/${token.profile}/me/info`,
//                  headers: {
//                          'Content-Type': 'application/json',
//                          'DEVICE-TYPE': 'mobile',
//                          'InceresUserToken': token.token,
//                          'InceresUserName': token.user_name,
//                          'InceresProfileKey': token.profile,
//                  }
//             }));
//             if (!response.data)
//                 throw new Error(`Error login on fbi api. Response: ${response.data}`);
//             return response.data;
//         }catch (e) {
//             throw new UserNotFound(`Não encontrou usuário do perfil ${token.profile} no fbi para o token ${token.token}`)
//         }
//     }

//     static async getInformationFromFBI(farmerId: number, farmId: number, fieldId: number): Promise< any | null> {
//         try{
//             let url = `${process.env.IN_CERES_FBI_URL}/integrations/me/farmers/${farmerId}/farms/${farmId}/fields/${fieldId}?with_label=true`;
//             let response = await HttpRequest.execute(HttpRequest.createConfig({
//                 method: 'get',
//                 url:url,
//                  headers: {
//                     'Content-Type': 'application/json',
//                      'INTEGRATION-TOKEN': String(process.env.IN_CERES_SERVICE_TOKEN)
//                  }
//             }));
//             if (!response.data)
//                 throw new Error(`Error call fbi api. Exceção 1: ${response.data}`);
//             return response.data;
//         }catch (e) {
//             throw new UserNotFound(`Error call fbi api. Exceção 2: ${e}`)
//         }
//     }

//     static async getCycle(token: CustomTypes.tokenFbi,clientId:number, farmId: number, cropYear: string): Promise<CustomTypes.userFBI | null> {
//         try{
//             let response = await HttpRequest.execute(HttpRequest.createConfig({
//                 method: 'get',
//                 url: `${process.env.IN_CERES_FBI_URL}/${token.profile}/me/clients/${clientId}/farms/${farmId}/cycles?areasSmIds=%5B%5D&year=${cropYear}`,
//                  headers: {
//                     'Content-Type': 'application/json',
//                     'DEVICE-TYPE': 'mobile',
//                     'InceresUserToken': token.token,
//                     'InceresUserName': token.user_name,
//                     'InceresProfileKey': token.profile,
//                  }
//             }));

//             if (!response.data)
//                 throw new Error(`Error login on fbi api. Response: ${response.data}`);
//             return response.data;
//         }catch (e) {
//             throw new UserNotFound(`Erro na api do fbi perfil ${token.profile} no fbi para o token ${token.token}. Exception: ${e}`)
//         }
//     }

//     static async resetPasswordFbi(email: string, password: string) {
//         try{
//             let data = { email, new_password:password};
//             let response = await HttpRequest.execute(HttpRequest.createConfig({
//                 method: 'post',
//                 url: `${process.env.IN_CERES_FBI_URL}/integrations/password-reset`,
//                  headers: {
//                      'Content-Type': 'application/json',
//                      'INTEGRATION-TOKEN': String(process.env.IN_CERES_SERVICE_TOKEN)
//                  },
//                 data: data
//             }));

//             if (response.status != 200)
//                 throw new Error(`Não foi possível resetar senha no fbi. Exception:  ${response.data}`);

//         }catch (e) {
//             throw new UserNotFound(`Não foi possível resetar senha no fbi. Exception:  ${e}`)
//         }
//     }

//     static async getGridFromToken(profile:string , token:string , userName:string, updateAt:string): Promise<any> {
//           try{
//             let response = await HttpRequest.execute(HttpRequest.createConfig({
//                 method: 'get',
//                 url: `${process.env.IN_CERES_MOTORS_URL}/${profile}/me/cars?updated_at=${updateAt}&compact_car=False`,
//                  headers: {
//                      'Content-Type': 'application/json',
//                      'DEVICE-TYPE': 'mobile',
//                      'desafioUserName': userName,
//                      'desafioUserToken': token,
//                      'desafioProfileKey': profile
//                  }
//             }));

//             if (response.status != 200)
//                 throw new Error(`Não foi possível buscar grade no motors. Exception:  ${response.data}`);
//             return response.data;
//         }catch (e) {
//             throw new Error(`Não foi possível buscar grade no motors. Exception:  ${e}`)
//         }
//     }

//     static async criarPitFarm(data:any ): Promise<any> {
//         try{
//             const blueprintId = 2;
//             let response = await HttpRequest.execute(HttpRequest.createConfig({
//               method: 'post',
//               url: `${process.env.IN_CERES_WORKFLOW_URL}/blueprints/${blueprintId}/assembly-lines`,
//                headers: {
//                    'Content-Type': 'application/json',
//                    'EMBASSY-TOKEN': String(process.env.IN_CERES_SERVICE_TOKEN),
//                    'EMBASSY-PROFILE': String(process.env.IN_CERES_SERVICE_PROFILE),
//                },
//                data : data
//           }));
//           if (response.status != 201 && response.status != 200)
//               throw new Error(`Não foi possível criar pit farm. Exception:  ${response.data}`);
//           return response.data;
//       }catch (e) {
//           throw new Error(`Não foi possivel criar pit farm. Exception:2: ${JSON.stringify(e)}`)
//       }
//   }
// }

// export default InceresAPI;


