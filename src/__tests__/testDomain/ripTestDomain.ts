import request from 'supertest';
//import ConversaoData from '../infrastructure/conversaoData';
import { app } from '../../app';

export class RipTestDomain {

    token: string = '';
    empresaId: number = 0;

    setToken(token: string) {
        this.token = token;
    }
    setEmpresaId(empresaId: number) {
        this.empresaId = empresaId;
    }

    async salvarRip(osId: number, rdoId: number, dado?: any) {
        let mensagem = '';
    
        let url = `/api/v1/empresas/${this.empresaId}/os/${osId}/rdo/${rdoId}/rip`;
        const response = await request(app).post(url)
            .send(dado)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });
    
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe(mensagem);
        expect(response.body.dado.dados.ripId > 0).toBe(true);
        return response.body.dado.dados.ripId;
    }
    
    async buscarRip(osId: number, rdoId?: any) {
        let url = `/api/v1/empresas/${this.empresaId}/os/${osId}/rdo/${rdoId}/rip`;
        const response = await request(app).get(url).set({
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
        });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('');
        expect(response.body.dado.osRip.id > 0).toBe(true);
        return response.body.dado;
    }
    
    async aprovarRip(osId: number, rdoId: any, ripId: any) {
        let url = `/api/v1/empresas/${this.empresaId}/os/${osId}/rdo/${rdoId}/rip/${ripId}/aprovacao`;
        const response = await request(app).post(url).set({
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json '
        });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('Aprovado com sucesso');
    }
    
    async reprovarRip(osId: number, rdoId: any, ripId: any) {
        let url = `/api/v1/empresas/${this.empresaId}/os/${osId}/rdo/${rdoId}/rip/${ripId}/reprovacao`;
        const response = await request(app).post(url).set({
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json '
        });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('Reprovado com sucesso');
    }
}