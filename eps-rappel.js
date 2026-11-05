/* =====================================================================
   eps-rappel.js — commun à toutes les APPLIS ÉLÈVES EPS (Lycée G. Pompidou)
   Source : mon-eps/atelier/applis-eleves/eps-rappel.js (recopié tel quel).
   À chaque ouverture de l'appli : rappel sur le téléphone portable et les
   images des camarades, avec un bouton « J'ai compris ».
   Pas d'affichage en mode démo (?demo) ni dans une page incluse (iframe).
   Texte modifiable ci-dessous (une ligne par paragraphe).
   ===================================================================== */
(function(){
  'use strict';
  var RAPPEL={titre:'📵 Téléphone portable',lignes:[
    'Au lycée, le téléphone portable reste rangé, sauf quand ton professeur te demande de l’utiliser pour le cours.',
    'Pendant l’EPS, il sert uniquement au travail demandé : aucun autre usage (messages, réseaux sociaux, jeux, musique…).',
    'Tu ne filmes ni ne photographies personne sans son accord et celui du professeur, et aucune image ne quitte l’appli.'
  ],source:'Règlement intérieur du lycée Georges Pompidou.',bouton:'J’ai compris'};
  if(window.__epsRappel||window.top!==window.self||/[?&]demo\b/.test(location.search))return;
  window.__epsRappel=true;
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function montrer(){
    if(document.getElementById('eps-rappel'))return;
    var st=document.createElement('style');
    st.textContent='#eps-rappel{position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px}'+
      '#eps-rappel .r-fen{background:#fff;color:#1c2128;border-radius:18px;padding:20px 22px;max-width:560px;width:100%;box-shadow:0 10px 30px rgba(0,0,0,.3);font:18px/1.45 "Atkinson","Atkinson Hyperlegible","Segoe UI",Roboto,Arial,sans-serif}'+
      '#eps-rappel h2{font:800 26px/1.15 "Archivo","Arial Narrow",Arial,sans-serif;margin:0 0 10px}'+
      '#eps-rappel p{margin:0 0 10px}#eps-rappel .r-src{font-size:15px;color:#5b6470}'+
      '#eps-rappel button{display:block;margin:14px 0 0 auto;min-height:56px;padding:0 26px;border:0;border-radius:14px;background:#1c2128;color:#fff;font:700 18px/1 inherit;cursor:pointer}'+
      '@media print{#eps-rappel{display:none}}';
    var d=document.createElement('div');d.id='eps-rappel';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','eps-rappel-t');
    d.innerHTML='<div class="r-fen"><h2 id="eps-rappel-t">'+esc(RAPPEL.titre)+'</h2>'+RAPPEL.lignes.map(function(l){return '<p>'+esc(l)+'</p>'}).join('')+
      '<p class="r-src">'+esc(RAPPEL.source)+'</p><button type="button">'+esc(RAPPEL.bouton)+'</button></div>';
    d.querySelector('button').onclick=function(){d.remove();st.remove()};
    document.head.appendChild(st);document.body.appendChild(d);
    setTimeout(function(){var b=d.querySelector('button');if(b)b.focus()},50);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montrer);else montrer();
})();
