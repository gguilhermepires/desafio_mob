'use strict';
const bcrypt = require('bcryptjs');
const BCRYPT_SALT = 13;

module.exports = {


  up: async (queryInterface) => {
  
    await queryInterface.bulkInsert('poi',
      [
        {
          nome: 'POI 1',
          raio: 500,
          latitude:-20.331011603798622 ,
          longitude:-40.27695433466487 ,
          deletado:false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nome: 'POI 2',
          raio: 100,
          latitude:-20.331011603798622 ,
          longitude:-40.27695433466487 ,
          deletado:false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nome: 'POI 3',
          raio: 50,
          latitude:-20.331011603798622 ,
          longitude:-40.27695433466487 ,
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
