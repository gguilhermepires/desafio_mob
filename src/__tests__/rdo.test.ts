//@ts-nocheck
import { app } from '../app';
import request from 'supertest';
import ConversaoData from '../infrastructure/conversaoData';
import { RdoTestDomain } from './testDomain/rdoTestDomain';
import { OsTestDomain } from './testDomain/osTestDomain';
import { GeralTestDomain } from './testDomain/geralTestDomain';

let domainRdo: RdoTestDomain;
let domainOs: OsTestDomain;
let domainGeral: GeralTestDomain;

describe('RDO', () => {

    beforeAll(async () => {
        domainRdo = new RdoTestDomain();
        domainRdo.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
        domainRdo.setEmpresaId(1);

        domainOs = new OsTestDomain();
        domainOs.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
        domainOs.setEmpresaId(1);

        domainGeral = new GeralTestDomain();
        domainGeral.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
        domainGeral.setEmpresaId(1);
    });

    afterAll(async () => {
        console.log('after');
    });

    it('Status API', async () => {
        await domainGeral.healthCheckApi();
    });

    it('Criar RDO ', async () => {
        const osId = await domainOs.criarOs();
        let dado = await domainRdo.criaDados(osId);
        const response = await request(app).post(`/api/v1/empresas/${domainRdo.empresaId}/os/${osId}/rdo`)
            .send(dado)
            .set({
                'Authorization': `Bearer ${domainRdo.token}`,
                'Accept': 'application/json'
            });

        expect(response.status).toBe(200);
        expect(response.body.codigo).toBe(200);
        expect(response.body.mensagem).toBe('Salvo com sucesso');
        expect(response.body.dado.id > 0).toBe(true);
        //TODO:: buscar a os por id para ver se foi salvo mesmo
    });

    it('Editar RDO ', async () => {
        domainRdo = new RdoTestDomain();
        domainRdo.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
        domainRdo.setEmpresaId(1);
        let osId = await domainOs.criarOs();
        let rdoId = await domainRdo.salvarRdo(osId);
        let rdo = await domainRdo.buscarRdo(osId, rdoId);
        rdo.data_rdo = '2022-06-25T10:32:24.240Z';
        let dado = {
            "dados": {
                "rdoId": rdo.id,
                "data_rdo": ConversaoData.extraiSomenteDataDataBanco(rdo.data_rdo),
                "hora_chegada": ConversaoData.extraiHoraDataBanco(rdo.hora_chegada),
                "hora_inicio": ConversaoData.extraiHoraDataBanco(rdo.hora_inicio),
                "hora_fim": ConversaoData.extraiHoraDataBanco(rdo.hora_fim),
                "os_rdo_efetivos": rdo.os_rdo_efetivos.map((elem: any) => {
                    return {
                        id: elem.mao_de_obra.id,
                        nome: elem.mao_de_obra.funcao,
                        funcao: elem.mao_de_obra.funcao,
                        teste: elem
                    }
                }),
                "encarregado": rdo.encarregado,
                "ckManhaBom": rdo.tempo_manha == 1 ? true : false,
                "ckManhaNublado": rdo.tempo_manha == 2 ? true : false,
                "ckManhaChuva": rdo.tempo_manha == 3 ? true : false,
                "ckTardeBom": rdo.tempo_tarde == 1 ? true : false,
                "ckTardeNublado": rdo.tempo_tarde == 2 ? true : false,
                "ckTardeChuva": rdo.tempo_tarde == 3 ? true : false,
                "ckNoiteBom": rdo.tempo_noite == 1 ? true : false,
                "ckNoiteNublado": rdo.tempo_noite == 2 ? true : false,
                "ckNoiteChuva": rdo.tempo_noite == 3 ? true : false,
                "os_rdo_ferramenta": rdo.os_rdo_ferramenta.map((elem: any) => {
                    return {
                        equipamento: elem.ferramenta,
                        quantidade: elem.quantidade
                    }
                }),
                "os_rdo_preparo_superficies": rdo.os_rdo_preparo_superficies.map((elem: any) => {
                    return {
                        id: elem.id,
                        rdoId: elem.rdo_id,
                        osPinturaPreparoSuperficie: {
                            id: elem.os_pintura_preparo_superficie,
                            tipoPreparoId: elem.os_pintura_preparo_superficie.tipo_preparo_id,
                            servicoId: elem.os_pintura_preparo_superficie.servico_id,
                            porcentagem: elem.os_pintura_preparo_superficie.porcentagem,
                            porcentagemAcumulada: elem.os_pintura_preparo_superficie.porcentagem_acumulada,
                            m2Acumulado: elem.os_pintura_preparo_superficie.m2_acumulado,
                            areaTotal: elem.os_pintura_preparo_superficie.area_total,
                            osTipoPreparo: {
                                id: elem.os_pintura_preparo_superficie.tipo_preparo.id,
                                nome: elem.os_pintura_preparo_superficie.tipo_preparo.nome,
                                descricao: elem.os_pintura_preparo_superficie.tipo_preparo.descricao,
                            }
                        },
                        componentes: elem.os_rdo_ps_componentes.map((elem: any) => {
                            return {
                                id: elem.id,
                                osRdoPreparoSuperficie: {
                                    id: elem.rdo_preparo_superficie.id,
                                    rdoId: elem.rdo_preparo_superficie.rdo_id,
                                    preparoSuperficieId: elem.rdo_preparo_superficie.preparo_superficie_id,
                                    horaInicio: elem.rdo_preparo_superficie.hora_inicio,
                                    horaFim: elem.rdo_preparo_superficie.hora_fim,
                                    osPinturaPreparoSuperficie: {
                                        id: elem.rdo_preparo_superficie.preparo_superficie.id,
                                        osTipoPreparo: {
                                            id: elem.rdo_preparo_superficie.preparo_superficie.tipo_preparo_id
                                        },
                                        servicoId: elem.rdo_preparo_superficie.preparo_superficie.servico_id,
                                        porcentagem: elem.rdo_preparo_superficie.preparo_superficie.porcentagem,
                                        porcentagemAcumulada: elem.rdo_preparo_superficie.preparo_superficie.porcentagem_acumulada,
                                        m2Acumulado: elem.rdo_preparo_superficie.preparo_superficie.m2_acumulado,
                                        areaTotal: elem.rdo_preparo_superficie.preparo_superficie.area_total,
                                    },
                                    componentes: []
                                },
                                efetivos: [],
                                // elem.os_rdo_ps_componentes_efetivos.map((elem:any)=>{
                                //     return elem;
                                // }),
                                componenteOs: {
                                    id: elem.os_componente.id,
                                    area: elem.os_componente.area,
                                    quantidade: elem.os_componente.quantidade,
                                    servicoId: elem.os_componente.servico_id,
                                    porcentagemAcumulada: elem.os_componente.porcentagem_acumulada,
                                    m2Acumulado: elem.os_componente.m2_acumulado,
                                    componente: {
                                        id: elem.os_componente.componente.id,
                                        parentId: elem.os_componente.componente.parent_id,
                                        empresaId: elem.os_componente.componente.empresa_id,
                                        filhosId: elem.os_componente.componente.filhos_id,
                                        nome: elem.os_componente.componente.nome,
                                        componente_tipo: {
                                            id: elem.os_componente.componente.tipo.id,
                                            nome: elem.os_componente.componente.tipo.nome,
                                            calculo: elem.os_componente.componente.tipo.calculo,
                                            subtipo: elem.os_componente.componente.tipo.subtipo,
                                        }
                                    }
                                },
                                porcentagemExecutada: elem.porcentagem_executada,
                                m2Executada: elem.m2_executada
                            };
                        }),
                        horaInicio: ConversaoData.extraiHoraDataBanco(elem.hora_inicio),
                        // horaFim: "20:17",
                        horaFim: ConversaoData.extraiHoraDataBanco(elem.hora_fim),
                    }
                }),
                "os_rdo_aplicacao_tinta": rdo.os_rdo_aplicacao_tinta.map((elem: any) => {
                    return {
                        id: elem.id,
                        rdoId: elem.rdo_id,
                        horaInicio: ConversaoData.extraiHoraDataBanco(elem.hora_inicio),
                        horaFim: ConversaoData.extraiHoraDataBanco(elem.hora_fim),
                        osPinturaAplicacaoTintaId: elem.os_pintura_aplicacao_tinta.id,
                        tintaPlanejamento: {
                            id: elem.os_pintura_aplicacao_tinta.tinta.id,
                            nome: elem.os_pintura_aplicacao_tinta.tinta.nome
                        },
                        tintaAplicacao: {
                            id: elem.os_pintura_aplicacao_tinta.tinta_aplicacao.id,
                            nome: elem.os_pintura_aplicacao_tinta.tinta_aplicacao.nome
                        },
                        componentes: elem.os_rdo_at_componentes.map((elem2: any) => {
                            return {
                                id: elem2.id,
                                rdoAplicacaoTintaId: elem2.rdo_aplicacao_tinta_id,
                                componenteOs: {
                                    id: elem2.os_componente.id,
                                    quantidade: elem2.os_componente.quantidade,
                                    area: elem2.os_componente.area,
                                    componente: {
                                        id: elem2.os_componente.componente.id,
                                        nome: elem2.os_componente.componente.nome,
                                        parentId: elem2.os_componente.componente.filhos_id,
                                        area: elem2.os_componente.componente.area,
                                        componente_tipo: {
                                            id: elem2.os_componente.componente.tipo.id,
                                            nome: elem2.os_componente.componente.tipo.nome
                                        }
                                    }
                                },
                                exibeListaEfetivo: true,
                                exibeListaForma: true,
                                listaForma:
                                    elem2.formas_aplicacoes.map((elem3: any) => {
                                        return {
                                            id: elem3.id,
                                            tipoAplicacao: {
                                                id: elem3.tipo_aplicacao.id,
                                                nome: elem3.tipo_aplicacao.nome
                                            },
                                            porcentagemExecutada: elem3.porcentagem_executada,
                                            m2Executada: elem3.m2_executada,
                                            listaEfetivo: elem3.os_rdo_at_comp_aplicacao_efetivos.map((elem4: any) => {
                                                return {
                                                    id: elem4.id,
                                                    componenteTipoAplicacaoId: elem3.id,
                                                    maoDeObra: {
                                                        id: elem4.mao_de_obra.id,
                                                        nome: elem4.mao_de_obra.nome,
                                                        funcao: elem4.mao_de_obra.funcao.nome
                                                    }
                                                };
                                            })
                                        };
                                    })
                            };
                        })
                    };
                }),
                "os_rdo_material_aplicacaos": rdo.os_rdo_material_aplicacaos.map((elem: any) => {
                    return {
                        materialAplicacaoItem: elem.tinta,
                        unidade: elem.unidade,
                        quantidade: elem.quantidade
                    }
                }),
                "os_rdo_material_consumos": rdo.os_rdo_material_de_consumos.map((elem: any) => {
                    return {
                        "id": elem.id,
                        "materialConsumoItem": elem.material_de_consumo,
                        "unidade": elem.unidade,
                        "quantidade": elem.quantidade
                    }
                }),
                "os_rdo_interferencia_operacionals": rdo.os_rdo_interferencia_operacionals.map((elem: any) => {
                    return {
                        interferenciaOperacionalItem: elem.interferencia_operacional,
                        horaInicio: ConversaoData.extraiHoraDataBanco(elem.hora_inicio),
                        horaFim: ConversaoData.extraiHoraDataBanco(elem.hora_fim)
                    }
                })
            }
        };
        rdoId = await domainRdo.salvarRdo(osId, dado);
        expect(rdoId > 0).toBe(true);
    });

    it('Remover RDO ', async () => {
        const osId = await domainOs.criarOs();
        const rdoId = await domainRdo.salvarRdo(osId);
        expect(rdoId > 0).toBe(true);
        await domainRdo.removerRdo(osId, rdoId);
    });

    it('Aprovação encarregado RDO ', async () => {
        const osId = await domainOs.criarOs();
        const rdoId = await domainRdo.salvarRdo(osId);
        await domainRdo.aprovacaoRdo(osId, rdoId, "APE");
    });

    it('Aprovação fiscal RDO ', async () => {
        const osId = await domainOs.criarOs();
        const rdoId = await domainRdo.salvarRdo(osId);
        await domainRdo.aprovacaoRdo(osId, rdoId, "APF");
    });

    it('Listagem  RDO ', async () => {
        const osId = await domainOs.criarOs();
        await domainRdo.salvarRdo(osId);
        await domainRdo.salvarRdo(osId);
        let lista = await domainRdo.buscaListagemRdo(osId);
        expect(lista.length).toBe(2);
    });
}
);
