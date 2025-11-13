// Local: migrations/20251112221449_criar_tabela_arquivo.js
/**
 * @param { import("knex").Knex } knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('arquivo', (tabela) => {
    tabela.uuid('uuid').primary(); 
    tabela.string('nome').notNullable();
    tabela.string('extensao').notNullable();
    
    tabela.string('chave_s3').notNullable();
    tabela.timestamp('data_criacao').defaultTo(knex.fn.now()); 
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function(knex) {
  return knex.schema.dropTable('arquivo');
};