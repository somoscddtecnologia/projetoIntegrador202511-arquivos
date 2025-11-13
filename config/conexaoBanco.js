const knex = require('knex');
const config = require('../knexfile');

const conexao = knex(config.development);

console.log('🔄 Iniciando conexão com o Knex (MySQL)...');

module.exports = conexao;