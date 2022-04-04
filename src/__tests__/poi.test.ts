import { app }  from '../app';
import request from 'supertest';
import { PoisTestDomain } from './testDomain/poiTestDomain';

let domainPoi: PoisTestDomain;

describe('POI', ()=>{
  
  beforeAll(async () => {
    domainPoi = new PoisTestDomain();
  });

  it('Status API',async () => {
    await domainPoi.healthCheckApi();
  });

  it('Trazer toda lista',async () => {

    const response = await request(app).get(`/api/v1/poi/tabela?placa=&data=`)
    .set({'Accept': 'application/json' });
    
    expect(response.status).toBe(200);
    expect(response.body.length >= 2).toBe(true);
  });

}
);
