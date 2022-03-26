import request from 'supertest';
//import ConversaoData from '../infrastructure/conversaoData';
import { app } from '../../app';
export class OsTestDomain {


    token: string = '';
    empresaId: number = 0;

    setToken(token: string) {
        this.token = token;
    }
    setEmpresaId(empresaId: number) {
        this.empresaId = empresaId;
    }

    async buscaOs(osId: number) {
        let response = await request(app).get(`/api/v1/empresas/${this.empresaId}/os/${osId}`)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });

        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('');
        expect(response.body.dado.id > 0).toBe(true);
        return response.body.dado;
    }

    async criarOs() {
        let dadoOs = {
            data_emissao: "17/02/2022",
            tipo_servico_id: 1,
            numero: "",
            status_id: 1,
            inicio_previsto: "",
            termino_previsto: "",
            inicio_real: "",
            termino_real: "",
            produtividade_historica: "0",
            produtividade_media_prevista: "0",
            produtividade_media_real: "0",
            justificativa: "",
            comentario: "",
            os_componentes: [
                {
                    id: 0,
                    nome: "Chapas de piso",
                    quantidade: 10,
                    componente: {
                        id: 8,
                        nome: "Chapas de piso",
                        parentId: 0
                    },
                    area: 100,
                    tipo: {
                        id: 0,
                        nome: ""
                    },
                    exibeListaEfetivo: true,
                    exibeListaForma: true,
                    efetivos: [],
                    listaForma: [],
                    parentId: 0,
                    filhosId: "",
                    porcentagemPlanejada: 0,
                    porcentagemExecutada: 0,
                    mExecutado: 0,
                    porcentagemExecutadaPreparo: 0,
                    mExecutadoPreparo: 0,
                    porcentagemAcumulada: 0,
                    m2Acumulada: 0
                }
            ],
            os_efetivos: [
                {
                    id: 0,
                    efetivo: {
                        id: 1,
                        nome: "Ely Carlos",
                        funcao: "Gerente"
                    },
                    servicoId: 0
                }
            ],
            os_fotos: [],
            os_projetos: [],
            os_hierarquias: []
        };

        let response = await request(app).post(`/api/v1/empresas/${this.empresaId}/os/0`)
            .send(dadoOs)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });

        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(201);
        expect(response.body.mensagem).toBe('OS salva com sucesso!');
        expect(response.body.dado.osId > 0).toBe(true);
        //TODO:: buscar a os por id para ver se foi salvo mesmo

        let dadoAbaPintura = {
            "listaPreparo": [
                {
                    "id": 0,
                    "item": "Grau de qualidade – ST-03",
                    "tipo_preparo": {
                        "id": 4,
                        "nome": "Grau de qualidade – ST-03",
                        "tipo": 4
                    },
                    "porcentagemPlanejadaCtl": "10",
                    "total": "0",
                    "listaEfetivoPreparoSuperficie": [],
                    "componentes": [],
                    "porcentagemExecutada": "10",
                    "mExecutado": "",
                    "horaAtividade": "",
                    "horaInicio": "",
                    "horaFim": ""
                },
                {
                    "id": 0,
                    "item": "Lavagem",
                    "tipo_preparo": {
                        "id": 1,
                        "nome": "Lavagem",
                        "tipo": 1
                    },
                    "porcentagemPlanejadaCtl": "10",
                    "total": "0",
                    "listaEfetivoPreparoSuperficie": [],
                    "componentes": [],
                    "porcentagemExecutada": "10",
                    "mExecutado": "",
                    "horaAtividade": "",
                    "horaInicio": "",
                    "horaFim": ""
                },
                {
                    "id": 0,
                    "item": "Limpeza com solvente",
                    "tipo_preparo": {
                        "id": 2,
                        "nome": "Limpeza com solvente",
                        "tipo": 2
                    },
                    "porcentagemPlanejadaCtl": "12",
                    "total": "0",
                    "listaEfetivoPreparoSuperficie": [],
                    "componentes": [],
                    "porcentagemExecutada": "12",
                    "mExecutado": "",
                    "horaAtividade": "",
                    "horaInicio": "",
                    "horaFim": ""
                },
                {
                    "id": 0,
                    "item": "Lixamento",
                    "tipo_preparo": {
                        "id": 3,
                        "nome": "Lixamento",
                        "tipo": 3
                    },
                    "porcentagemPlanejadaCtl": "13",
                    "total": "0",
                    "listaEfetivoPreparoSuperficie": [],
                    "componentes": [],
                    "porcentagemExecutada": "13",
                    "mExecutado": "",
                    "horaAtividade": "",
                    "horaInicio": "",
                    "horaFim": ""
                },
                {
                    "id": 0,
                    "item": "Jateamento Abrasivo: SA-2 ½",
                    "tipo_preparo": {
                        "id": 7,
                        "nome": "Jateamento Abrasivo: SA-2 ½",
                        "tipo": 5
                    },
                    "porcentagemPlanejadaCtl": "15",
                    "total": "0",
                    "listaEfetivoPreparoSuperficie": [],
                    "componentes": [],
                    "porcentagemExecutada": "15",
                    "mExecutado": "",
                    "horaAtividade": "",
                    "horaInicio": "",
                    "horaFim": ""
                },
                {
                    "id": 0,
                    "item": "Hidrojateamento: WJ-1",
                    "tipo_preparo": {
                        "id": 10,
                        "nome": "Hidrojateamento: WJ-1",
                        "tipo": 6
                    },
                    "porcentagemPlanejadaCtl": "15",
                    "total": "0",
                    "listaEfetivoPreparoSuperficie": [],
                    "componentes": [],
                    "porcentagemExecutada": "15",
                    "mExecutado": "",
                    "horaAtividade": "",
                    "horaInicio": "",
                    "horaFim": ""
                }
            ],
            "listaAplicacao": [
                {
                    "id": 0,
                    "rdoId": 0,
                    "tinta": {
                        "id": 5,
                        "nome": "N-2628 Tinta Epóxi Poliamida de Alta Espessura EPS 200"
                    },
                    "porcentagem": "10",
                    "tintaAplicacao": {
                        "id": 1,
                        "nome": "Fundo"
                    },
                    "total": "0",
                    "porcentagemAcumulada": "0",
                    "m2Acumulada": "0",
                    "componentes": [],
                    "efetivosGeral": [],
                    "aplicacaoTintaHoraAtividadeController": "",
                    "horaInicio": "",
                    "horaFim": ""
                },
                {
                    "id": 0,
                    "rdoId": 0,
                    "tinta": {
                        "id": 5,
                        "nome": "N-2628 Tinta Epóxi Poliamida de Alta Espessura EPS 200"
                    },
                    "porcentagem": "12",
                    "tintaAplicacao": {
                        "id": 2,
                        "nome": "Intermediária"
                    },
                    "total": "0",
                    "porcentagemAcumulada": "0",
                    "m2Acumulada": "0",
                    "componentes": [],
                    "efetivosGeral": [],
                    "aplicacaoTintaHoraAtividadeController": "",
                    "horaInicio": "",
                    "horaFim": ""
                },
                {
                    "id": 0,
                    "rdoId": 0,
                    "tinta": {
                        "id": 4,
                        "nome": "N-2630 Tinta Epóxi - Fosfato de Zinco de Alta Espessura EPS 100"
                    },
                    "porcentagem": "30",
                    "tintaAplicacao": {
                        "id": 3,
                        "nome": "Acabamento"
                    },
                    "total": "0",
                    "porcentagemAcumulada": "0",
                    "m2Acumulada": "0",
                    "componentes": [],
                    "efetivosGeral": [],
                    "aplicacaoTintaHoraAtividadeController": "",
                    "horaInicio": "",
                    "horaFim": ""
                }
            ]
        };

        response = await request(app).post(`/api/v1/empresas/1/os/${response.body.dado.osId}/pintura`)
            .send(dadoAbaPintura)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });

        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('');
        expect(response.body.dado.osId > 0).toBe(true);

        return response.body.dado.osId;
    }

    async removerOs(osId: number) {
        const dado = [{ "osId": osId }];
        const response = await request(app).delete(`/api/v1/empresas/${this.empresaId}/os`)
            .send(dado)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });

        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('Excluido com sucesso');
    }
}