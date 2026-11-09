/* =====================================================================
   eps-code.js — « code du cours » commun aux applis EPS (Lycée G. Pompidou)
   Source : mon-eps/atelier/applis-eleves/eps-code.js (recopié tel quel
   dans chaque appli élève ET dans chaque outil prof).

   But : les élèves utilisent leur téléphone ; sans verrou, ils pourraient
   remplir chez eux des séances futures ou retoucher les anciennes.
   - Chaque classe a une clé secrète, créée par l'outil prof et transmise
     aux téléphones par le QR de classe (champ « cc »).
   - Le code du cours (4 chiffres) = HMAC-SHA-256(clé, classe|date|séance).
     L'outil prof l'affiche ; le téléphone refait le calcul hors ligne.
   - Un code juste ouvre CETTE séance, ce jour-là, pendant 2 heures.
   - Sans clé (QR de classe scanné avant cette version), rien n'est bloqué.
   Pas de verrou en démo, dans une iframe ni pour les robots de test.
   ===================================================================== */
(function(){
  'use strict';
  if(window.EPSCode)return;
  var DUREE=2*60*60*1000,MAX_ESSAIS=5,ATTENTE=60*1000;
  var enc=new TextEncoder();
  function b64(u){var s='';u.forEach(function(x){s+=String.fromCharCode(x)});return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  function deb64(s){s=String(s).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
  function jour(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function lire(k){try{return JSON.parse(localStorage.getItem(k)||'{}')||{}}catch(e){return {}}}
  function ecrire(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function heure(t){var d=new Date(t);return d.getHours()+' h '+String(d.getMinutes()).padStart(2,'0')}

  async function code(cle,classe,date,seance){
    var k=await crypto.subtle.importKey('raw',deb64(cle),{name:'HMAC',hash:'SHA-256'},false,['sign']);
    var s=new Uint8Array(await crypto.subtle.sign('HMAC',k,enc.encode(['EPS',classe,date,String(seance)].join('|'))));
    var n=(s[0]*16777216)+(s[1]<<16)+(s[2]<<8)+s[3];
    return String(n%10000).padStart(4,'0');
  }
  function nouvelleCle(){return b64(crypto.getRandomValues(new Uint8Array(12)))}

  /* ---------- styles (fenêtre et bandeau, indépendants de l'appli) ---------- */
  function styles(){
    if(document.getElementById('eps-code-style'))return;
    var s=document.createElement('style');s.id='eps-code-style';
    s.textContent='.eps-code-voile{position:fixed;inset:0;z-index:2147482000;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:16px}'+
      '.eps-code-fen{background:#fff;color:#1c2128;border-radius:18px;max-width:420px;width:100%;padding:20px;box-shadow:0 10px 40px rgba(0,0,0,.3);font:16px/1.4 "Atkinson","Segoe UI",Roboto,Arial,sans-serif}'+
      '.eps-code-fen h3{margin:0 0 8px;font-size:21px}.eps-code-fen p{margin:6px 0}'+
      '.eps-code-saisie{display:block;width:100%;box-sizing:border-box;margin:12px 0;font:800 40px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.35em;text-align:center;padding:12px;border:2px solid #94a3b8;border-radius:14px}'+
      '.eps-code-fen .eps-code-err{color:#b91c1c;font-weight:700;min-height:1.4em}'+
      '.eps-code-fen .eps-code-bts{display:flex;gap:10px;justify-content:space-between;margin-top:10px;flex-wrap:wrap}'+
      '.eps-code-fen button,.eps-code-bandeau button{min-height:48px;padding:0 18px;border-radius:12px;border:0;font:700 16px "Atkinson","Segoe UI",Roboto,Arial,sans-serif;cursor:pointer}'+
      '.eps-code-ok{background:#1c2128;color:#fff}.eps-code-non{background:#e2e8f0;color:#1c2128}'+
      '.eps-code-grand{font:800 72px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.12em;text-align:center;margin:14px 0;color:#0f172a}'+
      '.eps-code-fen label{display:block;font-weight:700;margin-top:10px}.eps-code-fen select,.eps-code-fen input[type=date]{width:100%;min-height:46px;font:inherit;padding:6px 10px;border:2px solid #94a3b8;border-radius:12px;box-sizing:border-box;background:#fff;color:#1c2128}'+
      '.eps-code-bandeau{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:10px 0;padding:12px 14px;border-radius:14px;font:700 16px/1.35 "Atkinson","Segoe UI",Roboto,Arial,sans-serif}'+
      '.eps-code-bandeau.ferme{background:#fff1f2;border:2px solid #e11d48;color:#881337}.eps-code-bandeau.ferme button{background:#be123c;color:#fff}'+
      '.eps-code-bandeau.ouvert{background:#ecfdf5;border:2px solid #10b981;color:#065f46;font-weight:600}'+
      '@media print{.eps-code-bandeau,.eps-code-voile{display:none}}';
    document.head.appendChild(s);
  }
  function fenetre(html){
    styles();fermerFen();
    var v=document.createElement('div');v.className='eps-code-voile';v.id='eps-code-voile';
    v.innerHTML='<div class="eps-code-fen" role="dialog" aria-modal="true">'+html+'</div>';
    v.addEventListener('click',function(e){if(e.target===v)fermerFen()});
    document.body.appendChild(v);return v;
  }
  function fermerFen(){var v=document.getElementById('eps-code-voile');if(v)v.remove()}

  /* =====================================================================
     CÔTÉ ÉLÈVE
     EPSCode.eleve({
       app:'tte',                     identifiant de stockage
       classe:()=>'1G3',              classe du groupe ouvert ('' = aucun)
       seance:()=>'5',                séance affichée
       seances:()=>['1',…,'9'],       séances possibles de la classe
       nom:s=>'Séance 5',             libellé
       ouvrir:s=>{…},                 aller sur la séance s (après un bon code)
       zone:'#main',                  où la saisie est bloquée
       actif:()=>true,                l'écran affiché est-il un écran de saisie ?
       libre:['video',…],             data-act jamais bloqués (consultation)
       libreSel:'[data-tab]',         autres éléments jamais bloqués (sélecteur CSS)
       demo:()=>false,
       bandeau:true                   bandeau rouge/vert en haut de la zone
     })
     ===================================================================== */
  var C=null,K='',VER=null;
  function sto(){return lire(K)}
  function memoriserCle(classe,cle){if(!classe||!cle)return;var s=sto();s.cles=s.cles||{};s.cles[classe]=cle;ecrire(K,s)}
  function cleDe(classe){var s=sto();return (s.cles||{})[classe]||''}
  function sansVerrou(){return !C||navigator.webdriver||window.top!==window.self||/[?&]demo\b/.test(location.search)||(C.demo&&C.demo())}
  function ouverture(classe){var o=(sto().ouv||{})[classe];if(!o||o.d!==jour()||Date.now()>o.fin)return null;return o}
  /* 'libre' (pas de clé, démo…), 'ouverte' ou 'fermee' */
  function etat(seance){
    if(sansVerrou())return 'libre';
    var c=C.classe&&C.classe();if(!c||!cleDe(c))return 'libre';
    var o=ouverture(c);if(seance==null)seance=C.seance&&C.seance();
    return o&&String(o.s)===String(seance)?'ouverte':'fermee';
  }
  function nom(s){return C&&C.nom?C.nom(s):'Séance '+s}

  function demander(apres){
    var c=C.classe&&C.classe();if(!c)return;
    var cle=cleDe(c);if(!cle){if(apres)apres();return}
    var o=ouverture(c),cur=C.seance&&C.seance();
    var info=o?'<p>La séance ouverte aujourd’hui est <b>'+esc(nom(o.s))+'</b> (jusqu’à '+heure(o.fin)+').</p>'+(String(o.s)!==String(cur)?'<p><button type="button" class="eps-code-ok" id="eps-code-aller">Aller à '+esc(nom(o.s))+'</button></p>':''):'';
    var v=fenetre('<h3>🔑 Code du cours</h3><p>Tape le code à 4 chiffres donné par ton professeur en début de cours. Il ouvre la séance du jour pendant 2 heures.</p><p style="font-size:14px;color:#475569">Plus rapide : scanne le QR de la classe affiché par ton professeur, la séance s’ouvre toute seule.</p>'+info+
      '<input class="eps-code-saisie" id="eps-code-in" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" aria-label="Code du cours à 4 chiffres">'+
      '<p class="eps-code-err" id="eps-code-err" role="alert"></p>'+
      '<div class="eps-code-bts"><button type="button" class="eps-code-non" id="eps-code-non">Annuler</button><button type="button" class="eps-code-ok" id="eps-code-ok">Ouvrir la séance</button></div>');
    var inp=v.querySelector('#eps-code-in'),err=v.querySelector('#eps-code-err');
    var al=v.querySelector('#eps-code-aller');if(al)al.onclick=function(){fermerFen();C.ouvrir(o.s);rafraichir()};
    v.querySelector('#eps-code-non').onclick=fermerFen;
    async function essayer(){
      var x=(inp.value||'').replace(/\D/g,'');if(x.length!==4){err.textContent='Le code a 4 chiffres.';return}
      var s=sto(),e=s.essais||{n:0,t:0};
      if(e.n>=MAX_ESSAIS&&Date.now()-e.t<ATTENTE){err.textContent='Trop d’essais : attends '+Math.ceil((ATTENTE-(Date.now()-e.t))/1000)+' s.';return}
      if(e.n>=MAX_ESSAIS)e={n:0,t:0};
      var d=jour(),L=(C.seances&&C.seances())||[],trouve=null;
      if(cur!=null&&L.indexOf(String(cur))<0)L=[String(cur)].concat(L);
      for(var i=0;i<L.length;i++){if(await code(cle,c,d,L[i])===x){trouve=L[i];break}}
      if(trouve==null){e.n++;e.t=Date.now();s.essais=e;ecrire(K,s);inp.value='';
        err.textContent=e.n>=MAX_ESSAIS?'Code faux. Trop d’essais : attends 1 minute.':'Code faux. Vérifie la date du téléphone ou redemande le code.';return}
      s.essais={n:0,t:0};s.ouv=s.ouv||{};s.ouv[c]={s:trouve,d:d,h:Date.now(),fin:Date.now()+DUREE};ecrire(K,s);
      fermerFen();C.ouvrir(trouve);rafraichir();if(apres)apres();
    }
    v.querySelector('#eps-code-ok').onclick=essayer;
    inp.addEventListener('keydown',function(e){if(e.key==='Enter')essayer()});
    inp.addEventListener('input',function(){if(inp.value.replace(/\D/g,'').length===4)essayer()});
    setTimeout(function(){inp.focus()},60);
  }

  function bandeauHtml(st){
    var c=C.classe(),o=ouverture(c),cur=C.seance();
    if(st==='ouverte')return '<div class="eps-code-bandeau ouvert" data-eps-code>✅ '+esc(nom(cur))+' ouverte jusqu’à '+heure(o.fin)+'.</div>';
    var txt=o?'🔒 '+esc(nom(cur))+' : pas modifiable. La séance du jour est '+esc(nom(o.s))+'.':'🔒 '+esc(nom(cur))+' fermée : la saisie se fait en cours, avec le code du professeur.';
    return '<div class="eps-code-bandeau ferme" data-eps-code><span>'+txt+'</span><button type="button" data-eps-code-ouvrir>'+(o&&String(o.s)!==String(cur)?'Aller à '+esc(nom(o.s)):'🔑 Code du cours')+'</button></div>';
  }
  var enCours=false;
  function rafraichir(){
    if(!C||C.bandeau===false||enCours)return;
    var z=document.querySelector(C.zone||'#main');if(!z)return;
    styles();enCours=true;
    try{
      var vieux=z.querySelector(':scope > [data-eps-code]');
      var st=etat(),montrer=st!=='libre'&&(!C.actif||C.actif());
      var h=montrer?bandeauHtml(st):'',sig=h?String(h.length)+':'+h.slice(0,160):'';
      if(!h){if(vieux)vieux.remove()}
      else if(!vieux||vieux.getAttribute('data-eps-code')!==sig||z.firstElementChild!==vieux){if(vieux)vieux.remove();z.insertAdjacentHTML('afterbegin',h);z.firstElementChild.setAttribute('data-eps-code',sig)}
    }finally{enCours=false}
  }
  function bloque(t){
    if(!C||!t||!t.closest)return false;
    var z=document.querySelector(C.zone||'#main');if(!z||!z.contains(t))return false;
    if(t.closest('[data-eps-code]'))return false;
    if(C.actif&&!C.actif())return false;
    if(etat()!=='fermee')return false;
    var el=t.closest('input,select,textarea,button,label,[data-act],[contenteditable="true"]');if(!el)return false;
    if(el.closest('[data-libre],a[href],summary'))return false;
    var a=el.getAttribute('data-act');if(a&&C.libre&&C.libre.indexOf(a)>=0)return false;
    if(C.libreSel&&el.closest(C.libreSel))return false;
    return true;
  }
  var dernier=0;
  function stop(e){
    if(e.target&&e.target.closest&&e.target.closest('[data-eps-code-ouvrir]')){
      e.preventDefault();e.stopImmediatePropagation();
      var o=ouverture(C.classe());if(o&&String(o.s)!==String(C.seance())){C.ouvrir(o.s);rafraichir()}else demander();return}
    if(!bloque(e.target))return;
    e.preventDefault();e.stopImmediatePropagation();
    if(e.type==='focusin'&&e.target.blur)e.target.blur();
    if(Date.now()-dernier>800&&e.type!=='input'&&e.type!=='change'){dernier=Date.now();demander()}
  }
  function eleve(cfg){
    C=cfg;K='eps-code:'+(cfg.app||'appli');
    ['click','focusin','pointerdown','input','change','keydown'].forEach(function(ty){
      document.addEventListener(ty,function(e){if(ty==='pointerdown'||ty==='keydown'){if(e.target&&e.target.matches&&e.target.matches('input[type=range],input[type=checkbox],input[type=radio],select')&&bloque(e.target)){e.preventDefault();e.stopImmediatePropagation()}return}stop(e)},true);
    });
    var z0=function(){var z=document.querySelector(C.zone||'#main');if(!z){setTimeout(z0,300);return}
      if(window.MutationObserver)new MutationObserver(function(){if(!enCours)rafraichir()}).observe(z,{childList:true});rafraichir()};
    z0();
    clearInterval(VER);VER=setInterval(rafraichir,30000);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)rafraichir()});
  }
  /* Pour une action précise (gym : niveaux ⚠️) : lance f si la séance du jour est ouverte, sinon demande le code. */
  function exiger(f){if(etat()!=='fermee'){f();return}demander(f)}
  /* Heure à laquelle le code a été tapé, pour la joindre aux envois (null sans code). */
  function trace(){if(!C)return null;var o=ouverture(C.classe&&C.classe());return o?{s:o.s,h:o.h}:null}

  /* =====================================================================
     CÔTÉ PROF
     EPSCode.prof({app:'ttp', classe:'1G3', cle:'…', seances:[{v:'1',n:'Séance 1'},…]})
     Affiche le code du jour (ou d'une autre date, pour préparer).
     ===================================================================== */
  function prof(o){
    var KP='eps-code-prof:'+(o.app||'appli'),m=lire(KP),der=m[o.classe],L=o.seances||[];
    var prop=L.length?L[0].v:'';
    if(der){var i=L.findIndex(function(x){return String(x.v)===String(der.s)});
      if(i>=0)prop=der.d===jour()?L[i].v:(L[Math.min(L.length-1,i+1)]||L[i]).v}
    if(o.proposee!=null)prop=o.proposee;
    var une=L.length<=1;
    var v=fenetre('<h3>🔑 Code du cours · '+esc(o.classe)+'</h3>'+
      (une?'':'<label for="eps-code-s">Séance</label><select id="eps-code-s">'+L.map(function(x){return '<option value="'+esc(x.v)+'"'+(String(x.v)===String(prop)?' selected':'')+'>'+esc(x.n)+'</option>'}).join('')+'</select>')+
      '<label for="eps-code-d">Date du cours</label><input type="date" id="eps-code-d" value="'+jour()+'">'+
      '<div class="eps-code-grand" id="eps-code-val" aria-live="polite">····</div>'+
      '<p id="eps-code-txt" style="text-align:center;font-weight:700"></p>'+
      '<p style="font-size:14px;color:#475569">À écrire au tableau. Chaque groupe le tape sur son téléphone : la séance s’ouvre pour 2 heures. Valable seulement ce jour-là'+(une?'':' et pour cette séance')+'. Fonctionne sans internet.</p>'+
      '<p style="font-size:14px;color:#0f6b5c;font-weight:700">Plus rapide : le QR de la classe affiché aujourd’hui ouvre aussi '+(une?'la séance':'cette séance')+' (téléphones à jour). Un seul scan par groupe.</p>'+
      '<div class="eps-code-bts"><span></span><button type="button" class="eps-code-ok" id="eps-code-f">Fermer</button></div>');
    var sel=v.querySelector('#eps-code-s'),dat=v.querySelector('#eps-code-d');
    async function maj(){
      var s=sel?sel.value:(L[0]?L[0].v:'G'),d=dat.value||jour();
      v.querySelector('#eps-code-val').textContent=await code(o.cle,o.classe,d,s);
      var dd=new Date(d+'T12:00:00');
      v.querySelector('#eps-code-txt').textContent=(une?'':(L.find(function(x){return String(x.v)===String(s)})||{n:s}).n+' · ')+dd.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
      if(d===jour()){m=lire(KP);m[o.classe]={s:s,d:d};ecrire(KP,m)}
    }
    if(sel)sel.onchange=maj;dat.onchange=maj;v.querySelector('#eps-code-f').onclick=fermerFen;maj();
  }

  /* =====================================================================
     QR DU JOUR (novembre 2026)
     Le QR de la classe affiché un jour de cours porte aussi la séance
     ouverte : champ cj = {d:'AAAA-MM-JJ', s:séance, k:code}. Le téléphone
     qui le scanne vérifie le code avec la clé de la classe et ouvre la
     séance pendant 2 heures, sans rien taper. Le code au tableau reste
     valable (téléphones pas à jour, QR non scanné).
     Prof  : cj:await EPSCode.cjDuJour('gyp',classe,cle,'G')
             séance = celle choisie aujourd'hui dans « Code du cours »,
             sinon la séance par défaut (4e paramètre), sinon pas de cj.
     Élève : EPSCode.appliquerJour(classe,o.cj) dans recevoirClasse().
     ===================================================================== */
  async function cjDuJour(app,classe,cle,defaut){
    try{
      if(!cle||!classe)return undefined;
      var m=lire('eps-code-prof:'+(app||'appli'))[classe],s=m&&m.d===jour()?m.s:defaut;
      if(s==null||s==='')return undefined;
      var d=jour();return {d:d,s:String(s),k:await code(cle,classe,d,s)};
    }catch(e){return undefined}
  }
  async function appliquerJour(classe,cj){
    try{
      if(!cj||!classe||cj.d!==jour())return false;
      var cle=cleDe(classe);if(!cle)return false;
      if(await code(cle,classe,cj.d,cj.s)!==String(cj.k))return false;
      var s=sto();s.ouv=s.ouv||{};var o=s.ouv[classe];
      if(!(o&&o.d===cj.d&&String(o.s)===String(cj.s)&&Date.now()<o.fin)){s.ouv[classe]={s:String(cj.s),d:cj.d,h:Date.now(),fin:Date.now()+DUREE};ecrire(K,s)}
      if(C&&C.classe&&C.classe()===classe&&C.ouvrir&&C.seance&&String(C.seance())!==String(cj.s)){try{C.ouvrir(String(cj.s))}catch(e){}}
      if(C)rafraichir();
      return true;
    }catch(e){return false}
  }

  window.EPSCode={code:code,nouvelleCle:nouvelleCle,jour:jour,eleve:eleve,memoriserCle:memoriserCle,etat:etat,exiger:exiger,demander:function(){demander()},rafraichir:rafraichir,trace:trace,prof:prof,cjDuJour:cjDuJour,appliquerJour:appliquerJour};
})();
