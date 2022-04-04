import request from 'supertest';
import { app } from '../../app';
export class PoisTestDomain {

    async healthCheckApi() {
        const response = await request(app).get('/api/v1/healthcheck').send();
        expect(response.status).toBe(200);
        expect(response.body.databaseStatus).toBe(true);
        expect(response.body.message).toBe('Bem vindo a API de Autenticação !');
    }

}