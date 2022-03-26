import request from 'supertest';
//import ConversaoData from '../infrastructure/conversaoData';
import { app } from '../../app';

export class RdoTestDomain {
    async criaDados(osId:number){
        const dadosAddRdo = await this.buscaDadosAddRdo(osId);
        let dado = {
            "dados": {
                "rdoId": 0,
                "data_rdo": "04/03/2022",
                "hora_chegada": "16:17",
                "hora_inicio": "16:17",
                "hora_fim": "16:17",
                "os_rdo_efetivos": [
                    {
                        "id": 1,
                        "nome": "Ely Carlos",
                        "funcao": "Gerente"
                    }
                ],
                "encarregado": {
                    "id": 2,
                    "nome": "João da Silva",
                    "funcao": "Pintor"
                },
                "ckManhaBom": true,
                "ckManhaNublado": false,
                "ckManhaChuva": false,
                "ckTardeBom": false,
                "ckTardeNublado": false,
                "ckTardeChuva": true,
                "ckNoiteBom": true,
                "ckNoiteNublado": false,
                "ckNoiteChuva": false,
                "os_rdo_ferramenta": [
                    {
                        "equipamento": {
                            "id": 1,
                            "nome": "Rolo: lã alta 9cm"
                        },
                        "quantidade": 10
                    }
                ],
                "os_rdo_preparo_superficies": dadosAddRdo.os_rdo_preparo_superficie.map((elem: any) => {
                    return {
                        id: elem.id,
                        rdoId: elem.rdo_id,
                        osPinturaPreparoSuperficie: {
                            id: elem.os_pintura_preparo_superficie.id,
                            osTipoPreparo: {
                                id: elem.os_pintura_preparo_superficie.tipo_preparo.id,
                                nome: elem.os_pintura_preparo_superficie.tipo_preparo.nome,
                                descricao: null
                            },
                            porcentagem: elem.os_pintura_preparo_superficie.porcentagem,
                            servicoId: elem.os_pintura_preparo_superficie.servico_id
                        },
                        componentes: elem.os_rdo_ps_componentes.map((elem2: any) => {
                            return {
                                "id": null,
                                "osRdoPreparoSuperficie": {
                                    "id": elem2.rdo_preparo_superficie.id,
                                    "rdoId": elem2.rdo_preparo_superficie.rdo_id,
                                    "osPinturaPreparoSuperficie": {
                                        "id": elem2.rdo_preparo_superficie.preparo_superficie.id,
                                        "osTipoPreparo": {
                                            "id": elem2.rdo_preparo_superficie.preparo_superficie.tipo_preparo_id,
                                            "nome": "",
                                            "descricao": ""
                                        },
                                        "porcentagem": elem2.rdo_preparo_superficie.preparo_superficie.porcentagem,
                                        "servicoId": elem2.rdo_preparo_superficie.preparo_superficie.servico_id
                                    },
                                    "componentes": [],
                                    "horaInicio": "",
                                    "horaFim": ""
                                },
                                "componenteOs": {
                                    "id": elem2.os_componente.id,
                                    "quantidade": elem2.os_componente.quantidade,
                                    "componente": {
                                        "id": elem2.os_componente.componente.id,
                                        "nome": elem2.os_componente.componente.nome,
                                        "parentId": 0,
                                        "area": 0,
                                        "componente_tipo": {
                                            "id": 0,
                                            "nome": ""
                                        }
                                    },
                                    "area": elem2.os_componente.area,
                                    "servicoId": null
                                },
                                "porcentagemExecutada": 10,
                                "m2Executada": 20,
                                "efetivos": [
                                    {
                                        "id": 0,
                                        "psComponenteId": 0,
                                        "maoDeObra": {
                                            "id": 1,
                                            "nome": "Ely Carlos",
                                            "funcao": "Gerente"
                                        }
                                    }
                                ]
                            };
                        }),
                        horaInicio: elem.hora_inicio,
                        horaFim: elem.hora_fim
                    };
                }),
                "os_rdo_aplicacao_tinta": dadosAddRdo.os_rdo_aplicacao_tinta.map((elem3: any) => {
                    return {
                        "id": elem3.id,
                        "rdoId": elem3.rdo_id,
                        "osPinturaAplicacaoTintaId": elem3.os_pintura_aplicacao_tinta.id,
                        "tintaPlanejamento": {
                            "id": elem3.os_pintura_aplicacao_tinta.tinta.id,
                            "nome": elem3.os_pintura_aplicacao_tinta.tinta.nome
                        },
                        "tintaAplicacao": {
                            "id": elem3.os_pintura_aplicacao_tinta.tinta_aplicacao.id,
                            "nome": elem3.os_pintura_aplicacao_tinta.tinta_aplicacao.nome
                        },
                        "componentes": elem3.os_rdo_at_componentes.map((elem4: any) => {
                            return {
                                "id": null,
                                "rdoAplicacaoTintaId": 0,
                                "componenteOs": {
                                    "id": elem4.os_componente.id,
                                    "quantidade": elem4.os_componente.quantidade,
                                    "area": elem4.os_componente.area,
                                    "componente": {
                                        "id": elem4.os_componente.componente.id,
                                        "nome": elem4.os_componente.componente.nome,
                                        "parentId": 0,
                                        "area": 0,
                                        "componente_tipo": {
                                            "id": 0,
                                            "nome": ""
                                        }
                                    }
                                },
                                "exibeListaEfetivo": true,
                                "exibeListaForma": true,
                                "listaForma": [
                                    {
                                        "id": 0,
                                        "tipoAplicacao": {
                                            "id": 2,
                                            "nome": "Pistola convencional"
                                        },
                                        "porcentagemExecutada": 20,
                                        "m2Executada": 2,
                                        "listaEfetivo": [
                                            {
                                                "id": 0,
                                                "componenteTipoAplicacaoId": 0,
                                                "maoDeObra": {
                                                    "id": 1,
                                                    "nome": "Ely Carlos",
                                                    "funcao": "Gerente"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            };
                        }),
                        "horaInicio": "16:17",
                        "horaFim": "18:17"
                    };
                }),
                "os_rdo_material_aplicacaos": [
                    {
                        "materialAplicacaoItem": {
                            "id": 5,
                            "nome": "N-2628 Tinta Epóxi Poliamida de Alta Espessura EPS 200"
                        },
                        "unidade": {
                            "id": 2,
                            "nome": "Litros"
                        },
                        "quantidade": 100
                    }
                ],
                "os_rdo_material_consumos": [
                    {
                        "id": 0,
                        "materialConsumoItem": {
                            "id": 1,
                            "nome": "Solvente"
                        },
                        "unidade": {
                            "id": 2,
                            "nome": "Litros"
                        },
                        "quantidade": 10
                    }
                ],
                "os_rdo_interferencia_operacionals": [
                    {
                        "interferenciaOperacionalItem": {
                            "id": 2,
                            "nome": "Atraso bloqueio"
                        },
                        "horaInicio": "16:17",
                        "horaFim": "19:17"
                    }
                ]
            }
        };
        return dado;
    }
    async buscaDadosAddRdo(osId: number) {
        let response = await request(app).get(`/api/v1/empresas/${this.empresaId}/os/${osId}/rdo/dados/rdonovo`)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });

        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
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

    async removerRdo(osId: number, rdoId: number) {
        const dado = {
            lista: [{ "id": rdoId }]
        };
        const response = await request(app).delete(`/api/v1/empresas/${this.empresaId}/os/${osId}/rdo`)
            .send(dado)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('Excluido com sucesso');
    }

    async salvarRdo(osId: number, dado?: any) {
        let mensagem = 'Salvo com sucesso';
        if(dado == undefined){
            dado = await this.criaDados(osId);
        }
        let url = `/api/v1/empresas/${this.empresaId}/os/${osId}/rdo`;
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

    async buscarRdo(osId: number, rdoId?: any) {

        let url = `/api/v1/empresas/${this.empresaId}/os/${osId}/rdo/${rdoId}`;
        const response = await request(app).get(url)
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

    async buscaListagemRdo(osId: number) {

        let url = `/api/v1/empresas/${this.empresaId}/os/${osId}/rdo`;
        const response = await request(app).get(url)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });
        expect(response.status).toBe(200);
        return response.body;
    }

    async aprovacaoRdo(osId: number, rdoId: any, acao: string) {
        let dado = { "acao": acao };
        let mensagem = 'Aprovado com sucesso';

        let url = `/api/v1/empresas/${this.empresaId}/os/${osId}/rdo/${rdoId}/aprovacao`;
        const response = await request(app).post(url)
            .send(dado)
            .set({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            });
        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe(mensagem);
    }

}