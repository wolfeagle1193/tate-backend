// ============================================================
// src/routes/matieres.routes.js
// ============================================================
const express  = require('express');
const Matiere  = require('../models/Matiere');
const { authJWT, roleCheck } = require('../middlewares') 

const router = express.Router();
router.use(authJWT);
const ok  = (res, d, s=200) => res.status(s).json({ success:true, data:d });
const err = (res, m, s=400) => res.status(s).json({ success:false, error:m });

router.get('/', async (req, res) => {
  try {
    const matieres = await Matiere.find({ actif: true }).sort({ ordre: 1 });
    ok(res, matieres);
  } catch (e) { err(res, e.message, 500); }
});

router.post('/', roleCheck('admin'), async (req, res) => {
  try {
    const matiere = await Matiere.create(req.body);
    ok(res, matiere, 201);
  } catch (e) { err(res, e.message, 500); }
});

router.put('/:id', roleCheck('admin'), async (req, res) => {
  try {
    const matiere = await Matiere.findByIdAndUpdate(req.params.id, req.body, { new: true });
    ok(res, matiere);
  } catch (e) { err(res, e.message, 500); }
});

// DELETE /api/matieres/:id — désactiver une catégorie (soft delete)
router.delete('/:id', roleCheck('admin'), async (req, res) => {
  try {
    const matiere = await Matiere.findByIdAndUpdate(
      req.params.id, { actif: false }, { new: true }
    );
    if (!matiere) return err(res, 'Matière introuvable', 404);
    ok(res, { message: `Catégorie "${matiere.nom}" désactivée` });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
