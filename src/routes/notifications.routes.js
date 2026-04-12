// ============================================================
// src/routes/notifications.routes.js
// ============================================================
const express      = require('express');
const Notification = require('../models/Notification');
const { authJWT }  = require('../middlewares');

const router = express.Router();
router.use(authJWT);

const ok  = (res, d, s=200) => res.status(s).json({ success:true, data:d });
const err = (res, m, s=400) => res.status(s).json({ success:false, error:m });

// GET /api/notifications — mes notifications (non lues en premier)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const notifs = await Notification.find({ destinataireId: req.user._id })
      .sort({ lue: 1, createdAt: -1 })
      .limit(limit);
    const nbNonLues = await Notification.countDocuments({ destinataireId: req.user._id, lue: false });
    ok(res, { notifications: notifs, nbNonLues });
  } catch (e) { err(res, e.message, 500); }
});

// GET /api/notifications/count — juste le compteur non lues (léger, pour le badge)
router.get('/count', async (req, res) => {
  try {
    const nb = await Notification.countDocuments({ destinataireId: req.user._id, lue: false });
    ok(res, { nbNonLues: nb });
  } catch (e) { err(res, e.message, 500); }
});

// PUT /api/notifications/:id/lire — marquer une notif comme lue
router.put('/:id/lire', async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, destinataireId: req.user._id },
      { lue: true }
    );
    ok(res, { ok: true });
  } catch (e) { err(res, e.message, 500); }
});

// PUT /api/notifications/lire-tout — tout marquer comme lu
router.put('/lire-tout', async (req, res) => {
  try {
    await Notification.updateMany({ destinataireId: req.user._id, lue: false }, { lue: true });
    ok(res, { ok: true });
  } catch (e) { err(res, e.message, 500); }
});

module.exports = router;
