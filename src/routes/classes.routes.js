
// ============================================================
// src/routes/classes.routes.js
// ============================================================
const expressL  = require('express');
const Classe    = require('../models/Classe');
const { authJWT: ajwtL, roleCheck: rcL } = require('../middlewares') 

const routerL = expressL.Router();
routerL.use(ajwtL);
const okL  = (res, d, s=200) => res.status(s).json({ success:true, data:d });
const errL = (res, m, s=400) => res.status(s).json({ success:false, error:m });

routerL.get('/mes-classes', rcL('prof','admin'), async (req, res) => {
  try {
    const classes = await Classe.find({ enseignantId: req.user._id }).populate('eleves','nom niveau');
    okL(res, classes);
  } catch (e) { errL(res, e.message, 500); }
});

routerL.post('/', rcL('admin'), async (req, res) => {
  try {
    const classe = await Classe.create(req.body);
    okL(res, classe, 201);
  } catch (e) { errL(res, e.message, 500); }
});

module.exports = routerL;
