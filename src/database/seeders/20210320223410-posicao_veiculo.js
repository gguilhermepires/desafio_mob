'use strict';
const bcrypt = require('bcryptjs');
const BCRYPT_SALT = 13;

module.exports = {


  up: async (queryInterface) => {
    var data = new Date();
    var data2 =data;

    data2.setHours(data.getHours()+ 2);

    await queryInterface.bulkInsert('posicao_veiculo',
      [
        {
          placa: 'placa1',
          data_posicao: new Date(),
          velocidade: 100,
          ignicao: true,
          latitude:-20.332006238847846 ,
          longitude:-40.27659368976977 ,
          deletado:false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          placa: 'placa1',
          data_posicao: data2,
          velocidade: 100,
          ignicao: true,
          latitude:-20.33166361866251 ,
          longitude:-40.27724326533257 ,
          deletado:false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          placa: 'placa2',
          data_posicao: new Date(),
          velocidade: 100,
          ignicao: true,
          latitude:-20.33148840592836 ,
          longitude:-40.2783095427234 ,
          deletado:false,
          created_at: new Date(),
          updated_at: new Date(),
        }
      ],
      {},
    );
   
  },

  down: async (queryInterface) => {
  },
};
