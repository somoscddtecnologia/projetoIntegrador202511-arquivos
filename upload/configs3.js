require('dotenv').config();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const path = require('path');
const crypto = require('crypto');

const s3Cliente = new S3Client({
  region: process.env.AWS_BUCKET_REGIAO,
  credentials: {
    accessKeyId: process.env.AWS_CHAVE_ACESSO,
    secretAccessKey: process.env.AWS_CHAVE_SECRETA,
  }
});

const filtroDeArquivo = (req, file, callback) => {
  const tiposPermitidos = /jpeg|jpg|png|pdf/;
  const extensao = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimetype = tiposPermitidos.test(file.mimetype);

  if (extensao && mimetype) {
    callback(null, true);
  } else {
    callback(new Error('Tipo de arquivo inválido. Apenas PDF, JPG, JPEG ou PNG são permitidos.'));
  }
};

const upload = multer({
  fileFilter: filtroDeArquivo,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  storage: multerS3({
    s3: s3Cliente,
    bucket: process.env.AWS_BUCKET_NOME,
    contentType: multerS3.AUTO_CONTENT_TYPE, 
  
    key: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err);
        const extensao = path.extname(file.originalname);
        const nomeUnico = `${hash.toString('hex')}${extensao}`;
        callback(null, nomeUnico);
      });
    }
  })
});

module.exports = upload;