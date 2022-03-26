import request from 'supertest';
//import ConversaoData from '../infrastructure/conversaoData';
import { app } from '../../app';
export class GeralTestDomain {
    token: string = '';
    empresaId: number = 0;

    setToken(token: string) {
        this.token = token;
    }
    setEmpresaId(empresaId: number) {
        this.empresaId = empresaId;
    }
    async healthCheckApi() {
        const response = await request(app).get('/api/v1/healthcheck').send();
        expect(response.status).toBe(200);
        expect(response.body.databaseStatus).toBe(true);
        expect(response.body.message).toBe('Bem vindo a API de Autenticação !');
    }
}