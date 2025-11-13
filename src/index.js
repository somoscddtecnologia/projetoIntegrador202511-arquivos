const express = require('express');
const app = express();

const PORT = process.env.PORT || 5002; 

app.get('/', (req, res) => {
  res.send('Hello World Arquivos!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});