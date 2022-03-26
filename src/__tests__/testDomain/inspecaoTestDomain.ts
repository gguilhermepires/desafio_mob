import request from 'supertest';
//import ConversaoData from '../infrastructure/conversaoData';
import { app } from '../../app';

export class InspecaoTestDomain {
    
    geraDadoInsConjunto() {
        return {
            "id": "0",
            "data": "25/03/2022",
            "porcentagem_corrosao": "24.5",
            "area_corrosao": "2.45",
            "tipo_corrosao_id": 1,
            "nivel_corrosao": 2,
            "fotos": [],
            "planta_id": 1,
            "area_id": 2,
            "sub_area_id": 3,
            "linha_id": 4,
            "equipamento_id": 5,
            "conjunto_id": 6,
            "componente_id": 0,
            "eps_instrumento_inspecao_id": 1,
            "eps_aprovado": 1,
            "eps_reprovado": 0,
            "eps_na": 0,
            "eps_fotos": [],
            "esp_amostra": [
                {
                    "id": 0,
                    "valor": 1,
                    "numero": 1,
                    "aprovado": false
                }
            ],
            "aderenciax_aprovado": 1,
            "aderenciax_reprovado": 0,
            "aderenciax_na": 0,
            "aderenciax_fotos": [],
            "aderenciax_amostra": [
                {
                    "id": 0,
                    "valor": 2,
                    "numero": 2,
                    "aprovado": false
                }
            ],
            "descontinuidade_instrumento_inspecao_id": 3,
            "descontinuidade_aprovado": 1,
            "descontinuidade_reprovado": 0,
            "descontinuidade_na": 0,
            "descontinuidade_fotos": []
        };
    }
    async salvarInsConjunto(dado:any){
        let mensagem = 'Salva com sucesso';
    
        let url = `/api/v1/empresas/${this.empresaId}/inspecoes`;
        const response = await request(app).post(url)
            .send(dado)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe(mensagem);
        expect(response.body.dado.id > 0).toBe(true);
        return response.body.dado.id;
    }
    async buscaInsConjunto(
        parentId: number,
         plantaId: number,
          areaId: number,
           subAreaId: number,
            linhaId: number,
             equipamentoId: number,
              conjuntoId: number,
              componenteId: number,
            offset: number,
            limit: number,
            textBusca: string,
            endpointTabela:string 
              ) {
        let url = `/api/v1/empresas/${this.empresaId}/tabela/inspecao?textoBusca=${textBusca}&limit=${limit}&offset=${offset}&endpointTabela=${endpointTabela}&parentId=${parentId}&plantaId=${plantaId}&areaId=${areaId}&subAreaId=${subAreaId}&linhaId=${linhaId}&equipamentoId=${equipamentoId}&conjuntoId=${conjuntoId}&componenteId=${componenteId}`;
        const response = await request(app).get(url).set({
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
        });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('');
        return response.body.dado;
    }

    async buscaInsComponentes(
        parentId: number,
         plantaId: number,
          areaId: number,
           subAreaId: number,
            linhaId: number,
             equipamentoId: number,
              conjuntoId: number,
              componenteId: number,
            offset: number,
            limit: number,
            textBusca: string,
            endpointTabela:string 
              ) {
        let url = `/api/v1/empresas/${this.empresaId}/tabela/inspecao?textoBusca=${textBusca}&limit=${limit}&offset=${offset}&endpointTabela=${endpointTabela}&parentId=${parentId}&plantaId=${plantaId}&areaId=${areaId}&subAreaId=${subAreaId}&linhaId=${linhaId}&equipamentoId=${equipamentoId}&conjuntoId=${conjuntoId}&componenteId=${componenteId}`;
        const response = await request(app).get(url).set({
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
        });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('');
        return response.body.dado;
    }

    token: string = '';
    empresaId: number = 0;

    setToken(token: string) {
        this.token = token;
    }
    setEmpresaId(empresaId: number) {
        this.empresaId = empresaId;
    }
    geraDadoInsComponente(){
        return {
            "id": "0",
            "data": "25/03/2022",
            "porcentagem_corrosao": "13",
            "area_corrosao": "1.3",
            "tipo_corrosao_id": 1,
            "nivel_corrosao": 3,
            "fotos": [],
            "planta_id": 1,
            "area_id": 2,
            "sub_area_id": 3,
            "linha_id": 4,
            "equipamento_id": 5,
            "conjunto_id": 6,
            "componente_id": 7,
            "eps_instrumento_inspecao_id": 1,
            "eps_aprovado": 1,
            "eps_reprovado": 0,
            "eps_na": 0,
            "eps_fotos": [],
            "esp_amostra": [
                {
                    "id": 0,
                    "valor": 1,
                    "numero": 1,
                    "aprovado": false
                }
            ],
            "aderenciax_aprovado": 0,
            "aderenciax_reprovado": 0,
            "aderenciax_na": 1,
            "aderenciax_fotos": [],
            "aderenciax_amostra": [
                {
                    "id": 0,
                    "valor": 2,
                    "numero": 2,
                    "aprovado": false
                }
            ],
            "descontinuidade_instrumento_inspecao_id": 3,
            "descontinuidade_aprovado": 1,
            "descontinuidade_reprovado": 0,
            "descontinuidade_na": 0,
            "descontinuidade_fotos": []
        };
    }

    async salvarInsComponente(dado: any) {
        let mensagem = 'Salva com sucesso';
    
        let url = `/api/v1/empresas/${this.empresaId}/inspecoes`;
        const response = await request(app).post(url)
            .send(dado)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe(mensagem);
        expect(response.body.dado.id > 0).toBe(true);
        return response.body.dado.id;
    }
    
    async buscaIns(insId: number) {
        let url = `/api/v1/empresas/${this.empresaId}/inspecoes/${insId}`;
        const response = await request(app).get(url).set({
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
        });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('');
        expect(response.body.dado.id > 0).toBe(true);
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