import ConversaoData from '../infrastructure/conversaoData';
import { OsTestDomain } from './testDomain/osTestDomain';
import { RdoTestDomain } from './testDomain/rdoTestDomain';
import { RipTestDomain } from './testDomain/ripTestDomain';
import { GeralTestDomain } from './testDomain/geralTestDomain';

let domainOs: OsTestDomain;
let domainRdo: RdoTestDomain;
let domainRip: RipTestDomain;
let domainGeral: GeralTestDomain;


describe('RIP', () => {

    beforeAll(async () => {
        domainRdo = new RdoTestDomain();
        domainRdo.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
        domainRdo.setEmpresaId(1);

        domainOs = new OsTestDomain();
        domainOs.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
        domainOs.setEmpresaId(1);

        domainRip = new RipTestDomain();
        domainRip.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
        domainRip.setEmpresaId(1);

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

    it('Editar RIP ', async () => {
        let osId = await domainOs.criarOs();
        let rdoId = await domainRdo.salvarRdo(osId);
        let rip = await domainRip.buscarRip(osId, rdoId);
        if(rip.osRip.data_inspecao == null)
        rip.osRip.data_inspecao = ConversaoData.extraiSomenteDataDataBanco(
            "2022-02-14T12:00:00.000Z")
        
        let dado = {
            dados: {
                ripId: rip.osRip.id,
                rdoId: rip.osRip.rdo_id,
                encarregado: rip.osRip.inspetor!= null? {
                    id: rip.osRip.inspetor.id,
                    nome: rip.osRip.inspetor.nome
                }: null,
                data: rip.osRip.data_inspecao,
                listaPreparo: rip.osRipPreparoSuperficies.map((elem:any)=>{
                    let testeRugosidade = null;
                    if(elem.teste_rugosidade != null){
                        testeRugosidade = {
                            id: elem.teste_rugosidade.id,
                            instrumentoInspecao: elem.teste_rugosidade.instrumento_inspecao != null ?
                            {
                               id: elem.teste_rugosidade.instrumento_inspecao.id,
                               nome: elem.teste_rugosidade.instrumento_inspecao.nome,
                            }: null,
                            aprovado:elem.teste_rugosidade.aprovado,
                            reprovado:elem.teste_rugosidade.reprovado,
                            rugosidadeMax:elem.teste_rugosidade.rugosidade_max,
                            rugosidadeMin:elem.teste_rugosidade.rugosidade_min,
                            data: ConversaoData.extraiSomenteDataDataBanco(elem.teste_rugosidade.data),
                            areaTotal:elem.teste_rugosidade.area_total,
                            osRipPreparoSuperficieId:elem.teste_rugosidade.os_rip_preparo_superficie_id,
                            status:elem.teste_rugosidade.status,
                            amostras:elem.teste_rugosidade.teste_rugosidade_amostra,
                            fotos:elem.teste_rugosidade.teste_rugosidade_fotos
                        };
                    }
                  
                    return  {
                        id: elem.id,
                        ripId: elem.rip_id,
                        status: elem.status,
                        rdoPreparoSuperficie: {
                            id: elem.rdo_preparo_superficie.id,
                            rdoId: elem.rdo_preparo_superficie.rdo_id,
                            osPinturaPreparoSuperficie: {
                                id: elem.rdo_preparo_superficie.preparo_superficie.id,
                                osTipoPreparo: {
                                    id: elem.rdo_preparo_superficie.preparo_superficie.tipo_preparo.id,
                                    nome: elem.rdo_preparo_superficie.preparo_superficie.tipo_preparo.nome,
                                    descricao: null
                                },
                                porcentagem: 0,
                                servicoId: 0
                            },
                            componentes: [],
                            horaInicio: "",
                            horaFim: ""
                        },
                        testeSimples: elem.teste_simples != null ?{
                            id: elem.teste_simples.id,
                            osRipPreparoSuperficieId: elem.teste_simples.os_rip_preparo_superficie_id,
                            aprovado: elem.teste_simples.aprovado,
                            reprovado: elem.teste_simples.reprovado
                        }: null,
                        testeRugosidade: testeRugosidade
                    };
                }),
                listaAplicacao: rip.osRipAplicacaoTinta.map((elem2:any)=>{
                    return {
                        id: elem2.id,
                        rip_id: elem2.rip_id,
                        status: elem2.status,
                        osRdoAplicacaoTinta: {
                            id: elem2.rdo_aplicacao_tinta_id,
                            rdoId: rip.osRip.rdo_id,
                            osPinturaAplicacaoTintaId: elem2.rdo_aplicacao_tinta != null ? elem2.rdo_aplicacao_tinta.aplicacao_tinta.id : 0,
                            tintaPlanejamento: {
                                id: elem2.rdo_aplicacao_tinta != null ? elem2.rdo_aplicacao_tinta.aplicacao_tinta.tinta.id: 0,
                                nome: elem2.rdo_aplicacao_tinta != null ? elem2.rdo_aplicacao_tinta.aplicacao_tinta.tinta.nome: ''
                            },
                            tintaAplicacao: {
                                id: 0,
                                nome: ""
                            },
                            componentes: [],
                            horaInicio: "",
                            horaFim: ""
                        },
                        testeEpu: {
                            id: elem2.ripEpu.id,
                            espessuraMax: 0,
                            espessuraMin: 0,
                            aprovado: elem2.ripEpu.aprovado,
                            reprovado: elem2.ripEpu.reprovado,
                            quantidadeAlvo: elem2.ripEpu.quantidade_alvo,
                            amostras: elem2.ripEpuAmostra
                        },
                        testeEps: {
                            id: elem2.ripEps.id,
                            espessuraMax: 0,
                            espessuraMin: 0,
                            aprovado: elem2.ripEps.aprovado,
                            reprovado: elem2.ripEps.reprovado,
                            quantidadeAlvo: elem2.ripEps.quantidade_alvo,
                            instrumentoInspecao: elem2.ripEps.instrumento_inspecao != null ?
                              { id:elem2.ripEps.instrumento_inspecao.id}: null,
                            amostras: elem2.ripEpsAmostra
                        },
                        testeAderenciax: {
                            id: elem2.ripAderenciax.id,
                            aprovado: elem2.ripAderenciax.aprovado,
                            reprovado: elem2.ripAderenciax.reprovado,
                            quantidadeAlvo: elem2.ripAderenciax.quantidade_alvo,
                            amostras: elem2.ripAderenciax.ripAderenciaXAmostra
                        },
                        testeTracao: {
                            id: elem2.ripTracao.id,
                            instrumentoInspecao: elem2.ripTracao.instrumento_inspecao != null ? 
                            { id: elem2.ripTracao.instrumento_inspecao.id} : null,
                            reprovado: elem2.ripTracao.reprovado,
                            aprovado: elem2.ripTracao.aprovado,
                            amostras: elem2.ripTracao.ripTracaoAmostra
                        
                        },
                        testeDescontinuidade: {
                            id:elem2.ripDescontinuidade.id,
                            instrumentoInspecao: 
                            elem2.ripDescontinuidade.instrumento_inspecao != null?
                            { id:elem2.ripDescontinuidade.instrumento_inspecao.id} 
                            : null,
                            reprovado:elem2.ripDescontinuidade.reprovado,
                            aprovado:elem2.ripDescontinuidade.aprovado,
                            amostras: []
                        },
                        data: elem2.data == null ? ConversaoData.extraiSomenteDataDataBanco(
                            "2022-02-14T12:00:00.000Z"): null,
                        areaTotal: elem2.area_total
                    };
                })
            }
        };
        let ripId = await domainRip.salvarRip(osId, rdoId, dado);
        expect(ripId > 0).toBe(true);
    });

    it('Aprovar RIP ', async () => {
        let osId = await domainOs.criarOs();
        let rdoId = await domainRdo.salvarRdo(osId);
        let rip = await domainRip.buscarRip(osId, rdoId);
        await domainRip.aprovarRip(osId, rdoId, rip.osRip.id );
    });

    it('Reprovar RIP ', async () => {
        let osId = await domainOs.criarOs();
        let rdoId = await domainRdo.salvarRdo(osId);
        let rip = await domainRip.buscarRip(osId, rdoId);
        await domainRip.reprovarRip(osId, rdoId, rip.osRip.id );
    });
}
);
