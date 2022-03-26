import { app }  from '../app';
import request from 'supertest';
import { OsTestDomain } from './testDomain/osTestDomain';
import { GeralTestDomain } from './testDomain/geralTestDomain';

let domainOs: OsTestDomain;
let domainGeral: GeralTestDomain;

describe('OS', ()=>{
  
  beforeAll(async () => {
    domainOs = new OsTestDomain();
    domainOs.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
    domainOs.setEmpresaId(1);

    domainGeral = new GeralTestDomain();
    domainGeral.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
    domainGeral.setEmpresaId(1);
  });

  afterAll(async ()=> {
    console.log('after');

  });

  it('Status API',async () => {
    await domainGeral.healthCheckApi();
  });


  it('Criar Os - Aba geral',async () => {
    let dado = {
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

    const response = await request(app).post(`/api/v1/empresas/${domainOs.empresaId}/os/0`)
    .send(dado)
    .set({ 'Authorization': `Bearer ${domainOs.token}`,
     'Accept': 'application/json' });
    
    expect(response.status).toBe(200);
    expect(response.body.codigo).toBe(201);
    expect(response.body.mensagem).toBe('OS salva com sucesso!');
    expect(response.body.dado.osId > 0).toBe(true);
    //TODO:: buscar a os por id para ver se foi salvo mesmo

    await domainOs.removerOs(response.body.dado.osId);
  });

  it('Criar Os - Aba pintura',async () => {
    let dado = {
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

    const response = await request(app).post(`/api/v1/empresas/${domainOs.empresaId}/os/0/pintura`)
    .send(dado)
    .set({ 'Authorization': `Bearer ${domainOs.token}`,
     'Accept': 'application/json' });
     
    expect(response.status).toBe(200);
    expect(response.body.codigo).toBe(200);
    expect(response.body.mensagem).toBe('');
    expect(response.body.dado.osId > 0).toBe(true);
    //TODO:: buscar a os por id para ver se foi salvo mesmo
  });

  it('Criar Os - completa - aba geral e pintura',async () => {
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

    let response = await request(app).post(`/api/v1/empresas/${domainOs.empresaId}/os/0`)
    .send(dadoOs)
    .set({ 'Authorization': `Bearer ${domainOs.token}`,
     'Accept': 'application/json' });
    
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

    response = await request(app).post(`/api/v1/empresas/${domainOs.empresaId}/os/${response.body.dado.osId}/pintura`)
    .send(dadoAbaPintura)
    .set({ 'Authorization': `Bearer ${domainOs.token}`,
     'Accept': 'application/json' });
     
    expect(response.status).toBe(200);
    expect(response.body.codigo).toBe(200);
    expect(response.body.mensagem).toBe('');
    expect(response.body.dado.osId > 0).toBe(true);
  });

  it('Remover Os',async () => {
    let osId = await domainOs.criarOs();

    const dado = [{"osId":osId}];
    const response = await request(app).delete(`/api/v1/empresas/${domainOs.empresaId}/os`)
    .send(dado)
    .set({ 'Authorization': `Bearer ${domainOs.token}`,
    'Accept': 'application/json' });
    
    expect(response.status).toBe(200);
    expect(response.body.codigo).toBe(200);
    expect(response.body.mensagem).toBe('Excluido com sucesso');
    //TODO:: procurar para ver se excluiu mesmo

  });

  it('Editar Os completa - Aba geral',async () => {
    const osId = await domainOs.criarOs();

    let dado = {
        "data_emissao": "17/02/2022",
        "tipo_servico_id": 1,
        "tipo_servico": {
            "id": 1,
            "nome": "Pintura de retoque"
        },
        "numero": "11",
        "status_id": 1,
        "status": {
            "id": 1,
            "nome": "Aberta"
        },
        "inicio_previsto": "",
        "termino_previsto": "",
        "inicio_real": "",
        "termino_real": "",
        "produtividade_historica": "0",
        "produtividade_media_prevista": "0",
        "produtividade_media_real": "0",
        "justificativa": "",
        "comentario": "",
        "os_componentes": [
            {
                "id": 19,
                "nome": "Chapas de piso",
                "quantidade": 10,
                "componente": {
                    "id": 8,
                    "nome": "Chapas de piso",
                    "parentId": 0,
                    "area": 10,
                    "componente_tipo": {
                        "id": 0,
                        "nome": ""
                    }
                },
                "area": 100,
                "tipo": {
                    "id": 0,
                    "nome": ""
                },
                "exibeListaEfetivo": true,
                "exibeListaForma": true,
                "efetivos": [],
                "listaForma": [],
                "parentId": 0,
                "filhosId": "",
                "porcentagemPlanejada": 0,
                "porcentagemExecutada": 0,
                "mExecutado": 0,
                "porcentagemExecutadaPreparo": 0,
                "mExecutadoPreparo": 0,
                "porcentagemAcumulada": 0,
                "m2Acumulada": 0
            }
        ],
        "os_efetivos": [
            {
                "id": 24,
                "efetivo": {
                    "id": 1,
                    "nome": "Ely Carlos",
                    "funcao": "Gerente"
                },
                "servicoId": 11
            }
        ],
        "os_fotos": [],
        "os_projetos": [],
        "os_hierarquias": []
    };

    const response = await request(app).post(`/api/v1/empresas/1/os/${osId}`)
    .send(dado)
    .set({ 'Authorization': `Bearer ${domainOs.token}`,
     'Accept': 'application/json' });
    
    expect(response.status).toBe(200);
    expect(response.body.codigo).toBe(200);
    expect(response.body.mensagem).toBe('OS salva com sucesso!');
    expect(response.body.dado.osId > 0).toBe(true);
    //TODO:: buscar a os por id para ver se foi salvo mesmo
  });

  it('Editar Os completa - Aba  pintura',async () => {
    const osId = await domainOs.criarOs();

    let dado = {
        "listaPreparo": [
            {
                "id": 128,
                "item": "Grau de qualidade – ST-03",
                "tipo_preparo": {
                    "id": 4,
                    "nome": "Grau de qualidade – ST-03",
                    "tipo": 0
                },
                "porcentagemPlanejadaCtl": "10",
                "total": "0",
                "listaEfetivoPreparoSuperficie": [],
                "componentes": [],
                "porcentagemExecutada": "0",
                "mExecutado": "",
                "horaAtividade": "",
                "horaInicio": "",
                "horaFim": ""
            },
            {
                "id": 129,
                "item": "Lavagem",
                "tipo_preparo": {
                    "id": 1,
                    "nome": "Lavagem",
                    "tipo": 0
                },
                "porcentagemPlanejadaCtl": "10",
                "total": "0",
                "listaEfetivoPreparoSuperficie": [],
                "componentes": [],
                "porcentagemExecutada": "0",
                "mExecutado": "",
                "horaAtividade": "",
                "horaInicio": "",
                "horaFim": ""
            },
            {
                "id": 130,
                "item": "Limpeza com solvente",
                "tipo_preparo": {
                    "id": 2,
                    "nome": "Limpeza com solvente",
                    "tipo": 0
                },
                "porcentagemPlanejadaCtl": "12",
                "total": "0",
                "listaEfetivoPreparoSuperficie": [],
                "componentes": [],
                "porcentagemExecutada": "0",
                "mExecutado": "",
                "horaAtividade": "",
                "horaInicio": "",
                "horaFim": ""
            },
            {
                "id": 131,
                "item": "Lixamento",
                "tipo_preparo": {
                    "id": 3,
                    "nome": "Lixamento",
                    "tipo": 0
                },
                "porcentagemPlanejadaCtl": "13",
                "total": "0",
                "listaEfetivoPreparoSuperficie": [],
                "componentes": [],
                "porcentagemExecutada": "0",
                "mExecutado": "",
                "horaAtividade": "",
                "horaInicio": "",
                "horaFim": ""
            },
            {
                "id": 132,
                "item": "Jateamento Abrasivo: SA-2 ½",
                "tipo_preparo": {
                    "id": 7,
                    "nome": "Jateamento Abrasivo: SA-2 ½",
                    "tipo": 0
                },
                "porcentagemPlanejadaCtl": "15",
                "total": "0",
                "listaEfetivoPreparoSuperficie": [],
                "componentes": [],
                "porcentagemExecutada": "0",
                "mExecutado": "",
                "horaAtividade": "",
                "horaInicio": "",
                "horaFim": ""
            },
            {
                "id": 133,
                "item": "Hidrojateamento: WJ-1",
                "tipo_preparo": {
                    "id": 10,
                    "nome": "Hidrojateamento: WJ-1",
                    "tipo": 0
                },
                "porcentagemPlanejadaCtl": "15",
                "total": "0",
                "listaEfetivoPreparoSuperficie": [],
                "componentes": [],
                "porcentagemExecutada": "0",
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

    const response = await request(app).post(`/api/v1/empresas/1/os/${osId}/pintura`)
    .send(dado)
    .set({ 'Authorization': `Bearer ${domainOs.token}`,
     'Accept': 'application/json' });
    
    expect(response.status).toBe(200);
    expect(response.body.codigo).toBe(200);
    expect(response.body.mensagem).toBe('');
    expect(response.body.dado.osId > 0).toBe(true);
    //TODO:: buscar a os por id para ver se foi salvo mesmo
  });

  it('Listagem OS',async () => {
    await domainOs.criarOs();
    await domainOs.criarOs();

    const response = await request(app).get(`/api/v1/empresas/1/os`)
    .set({ 'Authorization': `Bearer ${domainOs.token}`,
     'Accept': 'application/json' });
    
    expect(response.status).toBe(200);
    expect(response.body.length >= 2).toBe(true);
  });

}
);
