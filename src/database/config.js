require('dotenv').config();

const options = {
  dialect: process.env.DATABASE_DIALECT || 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  define: {
    timestamps: true,
  },
  logging: false,
  dialectOptions: {
    useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: function (field, next) { // for reading from database
      if (field.type === 'DATETIME') {
        return field.string()
      }
      return next()
    },
  },
  timezone: '-03:00',
};

const configs = {
  development: options,
  production: options,
  test: options,
  testing: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: true,
  },
};

module.exports = configs;
