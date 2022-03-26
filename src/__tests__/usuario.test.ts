import { UsuarioTestDomain } from './testDomain/usuarioTestDomain';
import { GeralTestDomain } from './testDomain/geralTestDomain';

let domainUsuario: UsuarioTestDomain;
let domainGeral: GeralTestDomain;

describe('Usuario', ()=>{
  
  beforeAll(async () => {
    domainUsuario = new UsuarioTestDomain();
    domainUsuario.setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZ2d1aWxoZXJtZXBpcmVzQG1vZ2FpLmNvbSIsImlhdCI6MTY0NjMzMDA2MywiZXhwIjoxNjc3ODY2MDYzLCJhdWQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLmJyIiwiaXNzIjoiUGhvdG9Db2F0In0.NKv0emsMRHxjCdFrby9Uk68xqtdgD8YgiA0WI3cLs5jYGszbiXyKfOE4GlzLviOYmOhX_4Y411E4MCZYNwGiiw');
    domainUsuario.setEmpresaId(1);

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

  it('login',async () => {
    await domainUsuario.login('gguilhermepires@mogai.com', '123456');
    await domainUsuario.login('tfugiwara@mogai.com.br', '123456');
    await domainUsuario.login('mpiumbini@mogai.com.br', '123456');
    await domainUsuario.login('vanastacio@mogai.com.br', '123456');
    await domainUsuario.login('erico@mogai.com.br', '123456');
    await domainUsuario.login('fmachado@mogai.com.br', '123456');
    await domainUsuario.login('fcoimbra@mogai.com.br', '123456');
  });
}
);
