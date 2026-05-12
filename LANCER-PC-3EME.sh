#!/bin/bash
# Script maître — Lance les 4 scripts PC 3ème dans l'ordre
# À exécuter depuis le dossier tate-backend sur ta machine

echo "=========================================="
echo "  UPLOAD PC 3ème — TATÉ PLATFORM"
echo "=========================================="
echo ""

echo "▶ ÉTAPE 1/4 — Matière + Chapitres L01-L06 + QCMs..."
node upload-pc-3eme-part1.cjs
if [ $? -ne 0 ]; then
  echo "❌ Erreur à l'étape 1. Arrêt."
  exit 1
fi

echo ""
echo "▶ ÉTAPE 2/4 — Chapitres L07-L11 + QCMs..."
node upload-pc-3eme-part2.cjs
if [ $? -ne 0 ]; then
  echo "❌ Erreur à l'étape 2. Arrêt."
  exit 1
fi

echo ""
echo "▶ ÉTAPE 3/4 — Épreuves BFEM 2017, 2018, 2019..."
node upload-pc-3eme-epreuves.cjs
if [ $? -ne 0 ]; then
  echo "❌ Erreur à l'étape 3. Arrêt."
  exit 1
fi

echo ""
echo "▶ ÉTAPE 4/4 — Entraînements BST Joseph Turpin 2019-2020..."
node upload-pc-3eme-entrainements.cjs
if [ $? -ne 0 ]; then
  echo "❌ Erreur à l'étape 4. Arrêt."
  exit 1
fi

echo ""
echo "=========================================="
echo "  ✅ PC 3ème COMPLET ! Chapitres, QCMs,"
echo "     épreuves BFEM et entraînements sont"
echo "     tous en ligne."
echo "=========================================="
