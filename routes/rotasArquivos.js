const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

require('dotenv').config();
const upload = require('../upload/configs3');
const knex = require('../config/conexaoBanco');

const s3Cliente = new S3Client({
  region: process.env.AWS_BUCKET_REGIAO,
  credentials: {
    accessKeyId: process.env.AWS_CHAVE_ACESSO,
    secretAccessKey: process.env.AWS_CHAVE_SECRETA,
  }
});



router.post('/enviar', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado.' });
    }
    const { originalname, key } = req.file; 
    const extensao = path.extname(originalname);
    const novoUuid = crypto.randomUUID();

    const dadosParaSalvar = {
      uuid: novoUuid,
      nome: originalname,
      extensao: extensao,
      chave_s3: key,
    };

    await knex('arquivo').insert(dadosParaSalvar);
    res.status(201).json(dadosParaSalvar);

  } catch (error) {
    console.error('Erro ao salvar no banco de dados (Knex):', error);
    next(error); 
  }
});

router.get('/pegar/:uuid', async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const arquivo = await knex('arquivo')
      .where({ uuid: uuid })
      .first(); 

    if (!arquivo) {
      return res.status(404).json({ erro: 'Arquivo não encontrado.' });
    }
    const comando = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NOME,
      Key: arquivo.chave_s3,
    });

    const s3Resposta = await s3Cliente.send(comando);

    const buffer = await s3Resposta.Body.transformToByteArray();

    const mimeTypes = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
    };
    const contentType = mimeTypes[arquivo.extensao] || "application/octet-stream";
    
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${arquivo.nome}"`); 
    res.send(Buffer.from(buffer));
 

  } catch (error) {
    console.error('Erro ao buscar arquivo (Knex/S3):', error);
    if (error.name === 'NoSuchKey') {
      return res.status(404).json({ erro: 'Arquivo não encontrado no S3.' });
    }
    next(error);
  }
});

module.exports = router;