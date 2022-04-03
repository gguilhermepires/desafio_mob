
export class RespostaServidor {
    codigo: number;
    mensagem: string;
    dado: any | null;
    static criar(codigo: number = 500, mensagem: string = "",  dado: any | null = null ){
        let response = new RespostaServidor();
        response.codigo = codigo;
        response.mensagem = mensagem;
        response.dado = dado;
        return response;
    }
}