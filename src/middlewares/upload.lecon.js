// ============================================================
// src/middlewares/upload.lecon.js
// Multer pour les documents temporaires du professeur lors de
// la préparation d'un cours. Les fichiers sont supprimés
// automatiquement après l'appel IA (pas de stockage permanent).
// ============================================================
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const TEMP_DIR = path.join(__dirname, '../../uploads/lecons/temp');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, TEMP_DIR),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const uid  = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${uid}${ext}`);
  },
});

const TYPES_AUTORISES = ['.pdf', '.txt', '.docx', '.doc', '.jpg', '.jpeg', '.png'];

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (TYPES_AUTORISES.includes(ext)) cb(null, true);
  else cb(new Error('Type non autorisé : PDF, TXT, DOCX, JPG, PNG seulement'), false);
};

const uploadLecon = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 Mo max
});

module.exports = uploadLecon;
