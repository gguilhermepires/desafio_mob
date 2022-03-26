import { InspecaoTestDomain } from './testDomain/inspecaoTestDomain';
import { GeralTestDomain } from './testDomain/geralTestDomain';

let domainInspecao: InspecaoTestDomain;
let domainGeral: GeralTestDomain;


describe('INS', () => {

    beforeAll(async () => {
        domainInspecao = new InspecaoTestDomain();
        domainInspecao.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
        domainInspecao.setEmpresaId(1);

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

    it('Criar componente', async () => {
        let dado = {
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

        let id = await domainInspecao.salvarInsComponente(dado);
        expect(id > 0).toBe(true);
    });
    it('Busca componente', async () => {
        let dado = domainInspecao.geraDadoInsComponente();
        let id = await domainInspecao.salvarInsComponente(dado);
        let ins = await domainInspecao.buscaIns(id);
        expect(ins.id > 0).toBe(true);
    });
    it('Editar componente', async () => {
        let dado = domainInspecao.geraDadoInsComponente();
        let id = await domainInspecao.salvarInsComponente(dado);
        //let ins = await domainInspecao.buscaIns(id);

        dado = {
            "id": id,
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
                    "id": 23,
                    "valor": 1,
                    "numero": 1,
                    "aprovado": false
                }
            ],
            "aderenciax_aprovado": 0,
            "aderenciax_reprovado": 0,
            "aderenciax_na": 0,
            "aderenciax_fotos": [],
            "aderenciax_amostra": [
                {
                    "id": 23,
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
        let id2 = await domainInspecao.salvarInsComponente(dado);
        expect(id2 > 0).toBe(true);
        expect(id2 == id ).toBe(true);
    });
    it('Busca tabela componentes', async () => {
        let parentId = 6,
            plantaId = 1,
            areaId = 2,
            subAreaId = 3,
            linhaId = 4,
            equipamentoId = 5,
            conjuntoId = 6,
            componenteId = 0,
            offset = 0,
            limit = 30;
        let textBusca = '', endpointTabela = 'componente';

        let dado = domainInspecao.geraDadoInsComponente();
        let id = await domainInspecao.salvarInsComponente(dado);
        let ins = await domainInspecao.buscaIns(id);
        
        expect(ins.id > 0).toBe(true);

        let inspecoes = await domainInspecao.buscaInsComponentes(
            parentId, 
            plantaId,
            areaId,
            subAreaId,
            linhaId,
            equipamentoId,
            conjuntoId,
            componenteId,
            offset,
            limit,
            textBusca,
            endpointTabela
        );
        
        expect(inspecoes.count > 0).toBe(true);
    });



    it('Criar inspecao conjunto', async () => {
        let dado = domainInspecao.geraDadoInsConjunto();
        let id = await domainInspecao.salvarInsConjunto(dado);
        let ins = await domainInspecao.buscaIns(id);
        expect(ins.id > 0).toBe(true);
    });
    it('Busca tabela conjunto', async () => {
        let parentId = 5,
            plantaId = 1,
            areaId = 2,
            subAreaId = 3,
            linhaId = 4,
            equipamentoId = 5,
            conjuntoId = 6,
            componenteId = 0,
            offset = 0,
            limit = 30;
        let textBusca = '', endpointTabela = 'conjunto';

        let dado = domainInspecao.geraDadoInsConjunto();
        let id = await domainInspecao.salvarInsConjunto(dado);
        let ins = await domainInspecao.buscaIns(id);
        
        expect(ins.id > 0).toBe(true);

        let inspecoes = await domainInspecao.buscaInsConjunto(
            parentId, 
            plantaId,
            areaId,
            subAreaId,
            linhaId,
            equipamentoId,
            conjuntoId,
            componenteId,
            offset,
            limit,
            textBusca,
            endpointTabela
        );
        
        expect(inspecoes.count > 0).toBe(true);
    });
    it('Editar conjunto', async () => {
        let dado = domainInspecao.geraDadoInsConjunto();
        let id = await domainInspecao.salvarInsConjunto(dado);
        dado = {
            "id": id,
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
                    "id": 23,
                    "valor": 1,
                    "numero": 1,
                    "aprovado": false
                }
            ],
            "aderenciax_aprovado": 0,
            "aderenciax_reprovado": 0,
            "aderenciax_na": 0,
            "aderenciax_fotos": [],
            "aderenciax_amostra": [
                {
                    "id": 23,
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
        let id2 = await domainInspecao.salvarInsConjunto(dado);
        expect(id2 > 0).toBe(true);
        expect(id2 == id ).toBe(true);
    });



    it('Busca tabela planta', async () => {
        let parentId = 0,
            plantaId = 1,
            areaId = 2,
            subAreaId = 3,
            linhaId = 4,
            equipamentoId = 5,
            conjuntoId = 6,
            componenteId = 0,
            offset = 0,
            limit = 30;
        let textBusca = '', endpointTabela = 'planta';

        let inspecoes = await domainInspecao.buscaInsConjunto(
            parentId, 
            plantaId,
            areaId,
            subAreaId,
            linhaId,
            equipamentoId,
            conjuntoId,
            componenteId,
            offset,
            limit,
            textBusca,
            endpointTabela
        );
        expect(inspecoes.count > 0).toBe(true);
    });
    it('Busca tabela area', async () => {
        let parentId = 1,
            plantaId = 1,
            areaId = 2,
            subAreaId = 3,
            linhaId = 4,
            equipamentoId = 5,
            conjuntoId = 6,
            componenteId = 0,
            offset = 0,
            limit = 30;
        let textBusca = '', endpointTabela = 'area';

        let inspecoes = await domainInspecao.buscaInsConjunto(
            parentId, 
            plantaId,
            areaId,
            subAreaId,
            linhaId,
            equipamentoId,
            conjuntoId,
            componenteId,
            offset,
            limit,
            textBusca,
            endpointTabela
        );
        expect(inspecoes.count > 0).toBe(true);
    });
    it('Busca tabela subArea', async () => {
        let parentId = 2,
            plantaId = 1,
            areaId = 2,
            subAreaId = 3,
            linhaId = 4,
            equipamentoId = 5,
            conjuntoId = 6,
            componenteId = 0,
            offset = 0,
            limit = 30;
        let textBusca = '', endpointTabela = 'subarea';

        let inspecoes = await domainInspecao.buscaInsConjunto(
            parentId, 
            plantaId,
            areaId,
            subAreaId,
            linhaId,
            equipamentoId,
            conjuntoId,
            componenteId,
            offset,
            limit,
            textBusca,
            endpointTabela
        );
        expect(inspecoes.count > 0).toBe(true);
    });
    it('Busca tabela linha', async () => {
        let parentId = 3,
            plantaId = 1,
            areaId = 2,
            subAreaId = 3,
            linhaId = 4,
            equipamentoId = 5,
            conjuntoId = 6,
            componenteId = 0,
            offset = 0,
            limit = 30;
        let textBusca = '', endpointTabela = 'linha';

        let inspecoes = await domainInspecao.buscaInsConjunto(
            parentId, 
            plantaId,
            areaId,
            subAreaId,
            linhaId,
            equipamentoId,
            conjuntoId,
            componenteId,
            offset,
            limit,
            textBusca,
            endpointTabela
        );
        console.log(JSON.stringify(inspecoes));
        
        expect(inspecoes.count > 0).toBe(true);
    });
    it('Busca tabela equipamento', async () => {
        let parentId = 4,
            plantaId = 1,
            areaId = 2,
            subAreaId = 3,
            linhaId = 4,
            equipamentoId = 5,
            conjuntoId = 6,
            componenteId = 0,
            offset = 0,
            limit = 30;
        let textBusca = '', endpointTabela = 'equipamento';

        let inspecoes = await domainInspecao.buscaInsConjunto(
            parentId, 
            plantaId,
            areaId,
            subAreaId,
            linhaId,
            equipamentoId,
            conjuntoId,
            componenteId,
            offset,
            limit,
            textBusca,
            endpointTabela
        );
        expect(inspecoes.count > 0).toBe(true);
    });
    it('Busca tabela conjunto', async () => {
        let parentId = 5,
            plantaId = 1,
            areaId = 2,
            subAreaId = 3,
            linhaId = 4,
            equipamentoId = 5,
            conjuntoId = 6,
            componenteId = 0,
            offset = 0,
            limit = 30;
        let textBusca = '', endpointTabela = 'conjunto';

        let inspecoes = await domainInspecao.buscaInsConjunto(
            parentId, 
            plantaId,
            areaId,
            subAreaId,
            linhaId,
            equipamentoId,
            conjuntoId,
            componenteId,
            offset,
            limit,
            textBusca,
            endpointTabela
        );
        expect(inspecoes.count > 0).toBe(true);
    });
    it('Busca tabela componente', async () => {
        let parentId = 6,
            plantaId = 1,
            areaId = 2,
            subAreaId = 3,
            linhaId = 4,
            equipamentoId = 5,
            conjuntoId = 6,
            componenteId = 0,
            offset = 0,
            limit = 30;
        let textBusca = '', endpointTabela = 'componente';

        let inspecoes = await domainInspecao.buscaInsConjunto(
            parentId, 
            plantaId,
            areaId,
            subAreaId,
            linhaId,
            equipamentoId,
            conjuntoId,
            componenteId,
            offset,
            limit,
            textBusca,
            endpointTabela
        );
        expect(inspecoes.count > 0).toBe(true);
    });
}
);
