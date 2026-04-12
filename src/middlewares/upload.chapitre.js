// ============================================================
// src/middlewares/upload.chapitre.js
// Multer pour les documents de référence IA d'un chapitre
// (PDF, TXT, DOCX, images — max 8 Mo — 5 docs max par chapitre)
// ============================================================
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const UPLOAD_BASE = path.join(__dirname, '../../uploads/chapitres');

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    // Un sous-dossier par chapitre → uploads/chapitres/{chapitreId}/
    const dir = path.join(UPLOAD_BASE, req.params.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9\-_]/gi, '_')
      .toLowerCase()
      .slice(0, 40);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const TYPES_AUTORISES = ['.pdf', '.txt', '.docx', '.doc', '.jpg', '.jpeg', '.png'];

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (TYPES_AUTORISES.includes(ext)) cb(null, true);
  else cb(new Error(`Type non autorisé. Formats acceptés : PDF, TXT, DOCX, JPG, PNG`), false);
};

const uploadChapitre = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 Mo max par fichier
});

module.exports = uploadChapitre;
