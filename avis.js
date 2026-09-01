/* =========================================================
   FACCIOLINI MOBILITY — COMPTEUR D'AVIS GOOGLE
   =========================================================
   >>> SEUL FICHIER À MODIFIER QUAND LE NOMBRE D'AVIS CHANGE <<<

   Changez les deux valeurs ci-dessous, poussez sur GitHub,
   Netlify redéploie et TOUT le site se met à jour :
   les textes visibles ET les données structurées Google.

   Dernière mise à jour : 01/09/2026
   ========================================================= */

window.AVIS = {
  nombre: 51,      // <-- nombre d'avis Google
  note: '5.0'      // <-- note moyenne (point décimal, format Google)
};

/* --------- Ne rien modifier en dessous de cette ligne --------- */
(function () {
  'use strict';

  function appliquer() {
    var a = window.AVIS;
    if (!a) return;
    var noteFR = String(a.note).replace('.', ',');

    // 1) Textes visibles : <span data-avis-nombre></span> et <span data-avis-note></span>
    document.querySelectorAll('[data-avis-nombre]').forEach(function (el) {
      el.textContent = a.nombre;
    });
    document.querySelectorAll('[data-avis-note]').forEach(function (el) {
      el.textContent = noteFR;
    });

    // 2) Données structurées JSON-LD : synchronise aggregateRating
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) {
      var data;
      try {
        data = JSON.parse(s.textContent);
      } catch (e) {
        return; // bloc illisible : on n'y touche pas
      }
      var modifie = false;

      function parcourir(o) {
        if (!o || typeof o !== 'object') return;
        if (Array.isArray(o)) { o.forEach(parcourir); return; }
        if (o['@type'] === 'AggregateRating') {
          if (String(o.reviewCount) !== String(a.nombre)) {
            o.reviewCount = String(a.nombre);
            modifie = true;
          }
          if (String(o.ratingValue) !== String(a.note)) {
            o.ratingValue = String(a.note);
            modifie = true;
          }
        }
        Object.keys(o).forEach(function (k) { parcourir(o[k]); });
      }

      parcourir(data);
      if (modifie) s.textContent = JSON.stringify(data, null, 2);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appliquer);
  } else {
    appliquer();
  }
})();
