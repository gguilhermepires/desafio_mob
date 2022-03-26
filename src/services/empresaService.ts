// import debug from "debug";
// const log = debug('desafio:service:integration');
import {
    CbEmpresa,
    CbEmpresaUsuario,
} from "../models/init-models";
const Sequelize = require('sequelize');

export default class EmpresaService {
    
    static async buscaEmpresasUsuarioId({ usuarioId , }: { usuarioId: number, reduzido:string }) {
        let listaEmpresas = await CbEmpresaUsuario.findAll({
            attributes: ['empresa_id'],
            where: {
                usuario_id: usuarioId
            }
        });
        return listaEmpresas;
        
    }

    static async buscaEmpresas({listaEmpresasUsuario, reduzido}:{listaEmpresasUsuario:any, reduzido:string}){

        listaEmpresasUsuario = listaEmpresasUsuario.map((elem:any) => {
            //@ts-ignore
            return elem.dataValues.empresa_id;
        });

        let busca = {
            where: {
                id: {
                    [Sequelize.Op.in]: listaEmpresasUsuario
                },
                deletado: false,
            }
        };

        let empresas = [];

        if (reduzido != undefined) {
            if (reduzido == 'true') {
                busca = {
                    where: {
                        id: {
                            [Sequelize.Op.in]: listaEmpresasUsuario
                        },
                        deletado: false,
                    },
                    //@ts-ignore
                    attributes: [
                        'id',
                        'nome',
                        'nome_fantasia',
                        'cnpj'
                    ],
                }
            }
        }

        empresas = await CbEmpresa.findAll(busca);
        return empresas;
    }
};

