/* =====================================================================
   eps-rappel.js — commun à toutes les APPLIS ÉLÈVES EPS (Lycée G. Pompidou)
   Source : mon-eps/atelier/applis-eleves/eps-rappel.js (recopié tel quel).
   À chaque ouverture de l'appli : rappel sur le téléphone portable et les
   images des camarades, avec un bouton « J'ai compris ».
   Pas d'affichage en mode démo (?demo), dans une page incluse (iframe), ni
   pendant les tests automatiques (navigateur piloté).
   Texte modifiable ci-dessous (une ligne par paragraphe).
   Avatar facultatif : <script src="eps-rappel.js" data-avatar="img/avatars/stop.webp">
   (sans data-avatar, le rappel s'affiche comme avant, sans image).
   ===================================================================== */
(function(){
  'use strict';
  var RAPPEL={titre:'📵 Téléphone portable',lignes:[
    'Au lycée, le téléphone portable reste rangé, sauf quand ton professeur te demande de l’utiliser pour le cours.',
    'Pendant l’EPS, il sert uniquement au travail demandé : aucun autre usage (messages, réseaux sociaux, jeux, musique…).',
    'Tu ne filmes ni ne photographies personne sans son accord et celui du professeur, et aucune image ne quitte l’appli.'
  ],source:'Règlement intérieur du lycée Georges Pompidou.',bouton:'J’ai compris'};
  // Pas de rappel pour les tests automatiques (navigateur piloté : navigator.webdriver), ni en démo, ni dans une iframe.
  if(window.__epsRappel||navigator.webdriver||window.top!==window.self||/[?&]demo\b/.test(location.search))return;
  window.__epsRappel=true;
  var AV=(document.currentScript&&document.currentScript.getAttribute('data-avatar'))||'';
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function montrer(){
    if(document.getElementById('eps-rappel'))return;
    var st=document.createElement('style');
    st.textContent='#eps-rappel{position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px}'+
      '#eps-rappel .r-fen{background:#fff;color:#1c2128;border-radius:18px;padding:20px 22px;max-width:560px;width:100%;box-shadow:0 10px 30px rgba(0,0,0,.3);font:18px/1.45 "Atkinson","Atkinson Hyperlegible","Segoe UI",Roboto,Arial,sans-serif}'+
      '#eps-rappel h2{font:800 26px/1.15 "Archivo","Arial Narrow",Arial,sans-serif;margin:0 0 10px}'+
      '#eps-rappel p{margin:0 0 10px}#eps-rappel .r-src{font-size:15px;color:#5b6470}'+
      '#eps-rappel button{display:block;margin:14px 0 0 auto;min-height:56px;padding:0 26px;border:0;border-radius:14px;background:#1c2128;color:#fff;font-family:inherit;font-size:18px;font-weight:700;line-height:1;cursor:pointer}'+
      '#eps-rappel .r-tete{display:flex;align-items:center;gap:14px;margin:0 0 6px}#eps-rappel .r-tete img{height:120px;width:auto;flex:none}#eps-rappel .r-tete h2{margin:0}'+
      '@media (max-width:420px){#eps-rappel .r-tete img{height:90px}}'+
      '@media print{#eps-rappel{display:none}}';
    var d=document.createElement('div');d.id='eps-rappel';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','eps-rappel-t');
    // Avec l'avatar, l'emoji du titre fait doublon : on le retire.
    var h2='<h2 id="eps-rappel-t">'+esc(AV?RAPPEL.titre.replace(/^\S+\s+/,''):RAPPEL.titre)+'</h2>';
    d.innerHTML='<div class="r-fen">'+(AV?'<div class="r-tete"><img src="'+esc(AV)+'" alt="">'+h2+'</div>':h2)+RAPPEL.lignes.map(function(l){return '<p>'+esc(l)+'</p>'}).join('')+
      '<p class="r-src">'+esc(RAPPEL.source)+'</p><button type="button">'+esc(RAPPEL.bouton)+'</button></div>';
    d.querySelector('button').onclick=function(){d.remove();st.remove()};
    document.head.appendChild(st);document.body.appendChild(d);
    setTimeout(function(){var b=d.querySelector('button');if(b)b.focus()},50);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montrer);else montrer();
})();
