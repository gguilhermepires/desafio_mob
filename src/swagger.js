require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')({ language: 'pt-BR' });
const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/index.ts'];
const fs = require('fs');

function getProfile() {
  try {
    const file = fs.readFileSync('user.json');
    const user = JSON.parse(file);
    return user['profile'];
  } catch (error) {
    return '';
  }
}
function getUsername() {
  try {
    const file = fs.readFileSync('user.json');
    const user = JSON.parse(file);
    return user['user_name'];
  } catch (error) {
    return '';
  }
}
function getToken() {
  try {
    const file = fs.readFileSync('user.json');
    const user = JSON.parse(file);
    return user['token'];
  } catch (error) {
    return '';
  }
}

const doc = {
  info: {
    title: 'Inceres',
    description: 'API for desafio',
  },
  host: 'desafio-saas-staging.eastus2.cloudapp.azure.com',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    login: {
      example: process.env.LOGIN_JSON,
    },
    host: 'desafio-saas-staging.eastus2.cloudapp.azure.com',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    definitions: {
      login: {
        example: process.env.LOGIN_JSON,
      },
      desafioUserToken: {
        example: getToken(),
      },
      desafioUsername: {
        example: getUsername(),
      },
      desafioProfileKey: {
        example: getProfile(),
      },
      AnomaliesDetailCauses: {
        id: 1,
        detailId: 2,
        causeId: 1,
      },
      AnomaliesDetailCausesList: [
        { $ref: '#/definitions/AnomaliesDetailCauses' },
      ],
      AnomaliesDetail: {
        id: 1,
        anomalyId: 2,
        filename: 'file.png',
        hint: 'Imagem',
        createdAt: '2021-01-24T15:00:00.000Z',
        updatedAt: '2021-01-24T15:00:00.000Z',
      },
      AnomaliesDetailList: [{ $ref: '#/definitions/AnomaliesDetail' }],
      AnomaliesDetailPin: {
        id: 1,
        detailId: 2,
        x: 'xvalue',
        y: 'yvalue',
        createdAt: '2021-01-24T15:00:00.000Z',
        updatedAt: '2021-01-24T15:00:00.000Z',
      },
      AnomaliesDetailPinTag: {
        id: 1,
        pinId: 2,
        tag: 'tag',
      },
      AnomaliesDetailPinTagList: [
        { $ref: '#/definitions/AnomaliesDetailPinTag' },
      ],
      Area: {
        id: 8834,
        name: 'Talhão 2',
        the_geom: {
          crs: {
            type: 'name',
            properties: {
              name: 'EPSG:4326',
            },
          },
          type: 'Polygon',
          coordinates: [
            [
              [-55.3779575228691, -13.299653697490513],
              [-55.3630793094635, -13.314253818920207],
              [-55.36843299865722, -13.318458678568547],
              [-55.382444858551025, -13.303695671332179],
              [-55.3779575228691, -13.299653697490513],
            ],
          ],
        },
        block: '22',
        field: 'Talhão 2',
        year: '2019-2020',
        deleted: false,
        farm_id: 1552,
        has_cycle: true,
        total_area: 157.987622,
        errors: NaN,
        manager_id: 688,
        v2_id: NaN,
        v2_sync: 'N',
        sm_id: 389428,
      },
      AreaList: [{ $ref: '#/definitions/Area' }],
      AreaSm: {
        id: 373909,
        nome: 'Th-01',
        descricao: NaN,
        params: NaN,
        ano_safra: '2019-2020',
        is_entity: true,
        is_lib: false,
        indice: NaN,
        origem_id: NaN,
        parent_id: NaN,
        perfil_id: 3922,
        usuario_atualizacao_id: NaN,
        usuario_criacao_id: NaN,
        tipo_id: 2,
        id_v2: NaN,
      },
      AreaSmList: [{ $ref: '#/definitions/AreaSm' }],
      CycleList: [{ $ref: '#/definitions/Cycle' }],
      Client: {
        id: 2866,
        name: '',
        activated: true,
        display_id: 64,
        farmer_id: NaN,
        farms: [
          {
            id: 1993,
            name: 'errei o nome',
            country: 'Brasil',
            state: NaN,
            city: NaN,
            year: NaN,
            manager_id: 688,
            client_id: 2866,
            v2_id: NaN,
            v2_sync: 'S',
            sm_id: 4359,
          },
        ],
        sm_id: 10337,
      },
      ClientList: [{ $ref: '#/definitions/Client' }],
      VirtualAreaSM: {
        id: 113448,
        nome: 'Mnaduri',
        descricao: NaN,
        params: NaN,
        ano_safra: '2017',
        is_entity: true,
        is_lib: false,
        indice: NaN,
        origem_id: NaN,
        parent_id: NaN,
        perfil_id: 2100,
        usuario_atualizacao_id: NaN,
        usuario_criacao_id: NaN,
        tipo_id: 2,
        id_v2: '161502',
      },
      type: 'Polygon',
      coordinates: [
        [
          [-55.3779575228691, -13.299653697490513],
          [-55.3630793094635, -13.314253818920207],
          [-55.36843299865722, -13.318458678568547],
          [-55.382444858551025, -13.303695671332179],
          [-55.3779575228691, -13.299653697490513],
        ],
      ],
    },
    block: '22',
    field: 'Talhão 2',
    year: '2019-2020',
    deleted: false,
    farm_id: 1552,
    has_cycle: true,
    total_area: 157.987622,
    errors: NaN,
    manager_id: 688,
    v2_id: NaN,
    v2_sync: 'N',
    sm_id: 389428,
  },
  definitions: {
    login: {
      ...JSON.parse(process.env.LOGIN_JSON_SWAGGER),
    },
  },
  AreaList: [{ $ref: '#/definitions/Area' }],
  AreaSm: {
    id: 373909,
    nome: 'Th-01',
    descricao: NaN,
    params: NaN,
    ano_safra: '2019-2020',
    is_entity: true,
    is_lib: false,
    indice: NaN,
    origem_id: NaN,
    parent_id: NaN,
    perfil_id: 3922,
    usuario_atualizacao_id: NaN,
    usuario_criacao_id: NaN,
    tipo_id: 2,
    id_v2: NaN,
  },
  AreaSmList: [{ $ref: '#/definitions/AreaSm' }],
  CycleList: [{ $ref: '#/definitions/Cycle' }],
  Client: {
    id: 2866,
    name: '',
    activated: true,
    display_id: 64,
    farmer_id: NaN,
    farms: [
      {
        id: 1993,
        name: 'errei o nome',
        country: 'Brasil',
        state: NaN,
        city: NaN,
        year: NaN,
        manager_id: 688,
        client_id: 2866,
        v2_id: NaN,
        v2_sync: 'S',
        sm_id: 4359,
      },
    ],
    sm_id: 10337,
  },
  ClientList: [{ $ref: '#/definitions/Client' }],
  VirtualAreaSM: {
    id: 113448,
    nome: 'Mnaduri',
    descricao: NaN,
    params: NaN,
    ano_safra: '2017',
    is_entity: true,
    is_lib: false,
    indice: NaN,
    origem_id: NaN,
    parent_id: NaN,
    perfil_id: 2100,
    usuario_atualizacao_id: NaN,
    usuario_criacao_id: NaN,
    tipo_id: 2,
    id_v2: '161502',
  },
  VirtualAreaSmList: [{ $ref: '#/definitions/VirtualAreaSm' }],
  FarmSm: {
    id: 3148,
    nome: 'Muriaé',
    time: false,
    email: NaN,
    ascendentes: NaN,
    descendentes: NaN,
    informacoes: NaN,
    documento: NaN,
    ativo: true,
    apagado: false,
    imagem1: NaN,
    imagem2: NaN,
    regra: NaN,
    params: '{}',
    adataCriacao: '2018-09-21T17:15:19.836Z',
    dataCriacao: '2018-09-21T17:15:19.836Z',
    dataAtualizacao: '2019-02-05T10:15:55.576Z',
    paiId: NaN,
    userId: 162,
    usuarioAtualizacaoId: NaN,
    usuarioCriacaoId: NaN,
    clienteId: 9950,
    idV2: '',
    statusSync: 'S',
    anoSafra: NaN,
  },
  FarmSmList: [{ $ref: '#/definitions/FarmSm' }],
  Grant: {
    id: 21,
    role: 'admin',
    resource: 'anomalydetail',
    action: 'read:own',
    attributes: '*',
    createdAt: '2021-02-12T12:52:37.172Z',
    updatedAt: '2021-02-12T12:52:37.172Z',
    deletedAt: 'null',
  },
  GrantList: [{ $ref: '#/definitions/Grant' }],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.ts');
});
