import { UsuarioTestDomain } from './testDomain/usuarioTestDomain';
import { GeralTestDomain } from './testDomain/geralTestDomain';
import { EmpresaTestDomain } from './testDomain/empresaTestDomain';

let domainUsuario: UsuarioTestDomain;
let domainGeral: GeralTestDomain;
let domainEmpresa: EmpresaTestDomain;

describe('Empresa', ()=>{
  
  beforeAll(async () => {
    domainUsuario = new UsuarioTestDomain();
    domainUsuario.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
    domainUsuario.setEmpresaId(1);

    domainGeral = new GeralTestDomain();
    domainGeral.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
    domainGeral.setEmpresaId(1);

    domainEmpresa = new EmpresaTestDomain();
    domainEmpresa.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
    domainEmpresa.setEmpresaId(1);
  });

  afterAll(async ()=> {
    console.log('after');
  });

  it('Status API',async () => {
    await domainGeral.healthCheckApi();
  });

  it('busca empresas',async () => {
    await domainUsuario.login('gguilhermepires@mogai.com', '123456');
  });
}
);
