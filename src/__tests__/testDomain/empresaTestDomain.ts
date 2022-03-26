import request from 'supertest';
import { app } from '../../app';
export class EmpresaTestDomain {
    token: string = '';
    empresaId: number = 0;

    setToken(token: string) {
        this.token = token;
    }
    setEmpresaId(empresaId: number) {
        this.empresaId = empresaId;
    }
    async buscaEmpresaUsuario(email:string, senha:string) {
        let dado = {
            email,senha
        };
        const response = await request(app).post('/api/v1/usuarios/login')
        .send(dado);
        expect(response.status).toBe(200);
        expect(response.body.mensagem).toBe('');
        expect(response.body.dado.token != '').toBe(true);
        return response.body.dado;
    }
}