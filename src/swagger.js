require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')({ language: 'pt-BR' });
const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/index.ts'];
const fs = require('fs');

const doc = {
  info: {
    title: 'desafio',
    description: 'API for desafio',
  },
  host: 'localhost',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    login: {
      example: process.env.LOGIN_JSON,
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    definitions: {
  }
}
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.ts');
});
