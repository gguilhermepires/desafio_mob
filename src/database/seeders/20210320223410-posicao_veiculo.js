'use strict';
const bcrypt = require('bcryptjs');
const BCRYPT_SALT = 13;

module.exports = {


  up: async (queryInterface) => {
  
    await queryInterface.bulkInsert('poi',
      [
        {
          placa: 'placa1',
          data_posicao: new Date(),
          velocidade: 100,
          ignicao: true,
          latitude:-20.33156704648558 ,
          longitude:-40.27681084479051 ,
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
