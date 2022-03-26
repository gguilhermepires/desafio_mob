'use strict';
const bcrypt = require('bcryptjs');
const BCRYPT_SALT = 13;

module.exports = {


  up: async (queryInterface) => {
  
    await queryInterface.bulkInsert('poi',
      [
        {
          nome: 'POI 1',
          raio: 100,
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
