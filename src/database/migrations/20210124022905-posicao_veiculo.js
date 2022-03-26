'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posicao_veiculo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      placa: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      data_posicao: {
        allowNull: false,
        type: Sequelize.DATE,
      },
        velocidade: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      longitude: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      latitude: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      ignicao: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      deletado: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('posicao_veiculo');
  },
};
