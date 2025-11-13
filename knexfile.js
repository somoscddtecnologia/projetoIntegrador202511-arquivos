require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2', 
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORTA,
      user: process.env.DB_USUARIO,
      password: process.env.DB_SENHA,
      database: process.env.DB_NOME
    },
    migrations: {
      directory: './migrations' 
    }
  }
 
};