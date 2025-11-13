require('dotenv').config();

const express = require('express');
const { MulterError } = require('multer');
const rotasArquivos = require('./routes/rotasArquivos');

const knex = require('./config/conexaoBanco');

const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(express.json());

knex.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('Conexão com o banco de dados ok.');
  })
  .catch((err) => {
    console.error(' nao conectou:', err);
    process.exit(1); 
  });

app.use('/api/arquivos', rotasArquivos);

app.use((err, req, res, next) => {
  console.error("Ocorreu um erro:", err.message);

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ erro: `Arquivo muito grande. Limite de 5MB.` });
    }
    return res.status(400).json({ erro: `Erro de upload (Multer): ${err.message}` });
  }

  if (err.message.startsWith('Tipo de arquivo inválido')) {
    return res.status(400).json({ erro: err.message });
  }

  return res.status(500).json({ erro: 'Ocorreu um erro interno no servidor.' });
});

app.listen(PORTA, () => {
  console.log(` Servidor rodando na porta ${PORTA}`);
});