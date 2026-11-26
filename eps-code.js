/* =====================================================================
   eps-code.js — « séance du jour » (QR) commun aux applis EPS (Lycée G. Pompidou)
   Source : mon-eps/atelier/applis-eleves/eps-code.js (recopié tel quel
   dans chaque appli élève ET dans chaque outil prof).

   But : les élèves utilisent leur téléphone ; sans verrou, ils pourraient
   remplir chez eux des séances futures ou retoucher les anciennes.
   - Chaque classe a une clé secrète, créée par l'outil prof et transmise
     aux téléphones par le QR de classe (champ « cc »).
   - Preuve de séance (4 chiffres) = HMAC-SHA-256(clé, classe|date|séance).
     v2 (chantier 9, 26/11/2026) : elle n'est plus jamais affichée ni tapée.
     Elle voyage dans le QR de démarrage (champ cj) ; le téléphone refait le
     calcul hors ligne. Un QR juste ouvre CETTE séance, ce jour-là, 2 heures.
   - Sans clé (QR de classe scanné avant cette version), rien n'est bloqué.
   Pas de verrou en démo, dans une iframe ni pour les robots de test.
   ===================================================================== */
(function(){
  'use strict';
  if(window.EPSCode)return;
  var DUREE=2*60*60*1000,MAX_ESSAIS=5,ATTENTE=60*1000;
  /* window.EPS_CODE_JOURNEE=true (déclaré par l'appli) : le code reste valable jusqu'à minuit au lieu de 2 heures */
  function finOuv(){if(window.EPS_CODE_JOURNEE){var m=new Date();m.setHours(23,59,59,0);return m.getTime()}return Date.now()+DUREE}
  function duree(){return window.EPS_CODE_JOURNEE?'toute la journée':'pendant 2 heures'}
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
            '.eps-code-fen .eps-code-err{color:#b91c1c;font-weight:700;min-height:1.4em}'+
      '.eps-code-fen .eps-code-bts{display:flex;gap:10px;justify-content:space-between;margin-top:10px;flex-wrap:wrap}'+
      '.eps-code-fen button,.eps-code-bandeau button{min-height:48px;padding:0 18px;border-radius:12px;border:0;font:700 16px "Atkinson","Segoe UI",Roboto,Arial,sans-serif;cursor:pointer}'+
      '.eps-code-ok{background:#1c2128;color:#fff}.eps-code-non{background:#e2e8f0;color:#1c2128}'+
            '.eps-code-fen label{display:block;font-weight:700;margin-top:10px}.eps-code-fen select,.eps-code-fen input[type=date]{width:100%;min-height:46px;font:inherit;padding:6px 10px;border:2px solid #94a3b8;border-radius:12px;box-sizing:border-box;background:#fff;color:#1c2128}'+
      '.eps-code-bandeau{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:10px 0;padding:12px 14px;border-radius:14px;font:700 16px/1.35 "Atkinson","Segoe UI",Roboto,Arial,sans-serif}'+
      '.eps-code-bandeau.ferme{background:#fff1f2;border:2px solid #e11d48;color:#881337}.eps-code-bandeau.ferme button{background:#be123c;color:#fff}'+
      '.eps-code-bandeau.ouvert{background:#ecfdf5;border:2px solid #10b981;color:#065f46;font-weight:600}'+
      '.eps-code-qr{max-width:320px;margin:10px auto;background:#fff}.eps-code-qr svg{width:100%;height:auto;display:block}'+
      '#eps-code-impr{display:none}'+
      '@media print{.eps-code-bandeau,.eps-code-voile{display:none!important}html.eps-code-impr body>*:not(#eps-code-impr){display:none!important}html.eps-code-impr #eps-code-impr{display:block!important;text-align:center;font:16px/1.4 Arial,sans-serif;color:#000}#eps-code-impr svg{width:12cm;height:12cm}}';
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
       bandeau:true,                  bandeau rouge/vert en haut de la zone
       qrApp:'TTE',                   champ « a » attendu dans le QR de démarrage
       scanner:verif=>{…}             ouvre le lecteur ; pour chaque QR lu : await verif(objet) AVANT de le traiter
                                      (verif lève une erreur au message clair si le QR n'ouvre pas la séance)
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
    var c=C.classe&&C.classe();if(!c)return 'libre';
    if(!cleDe(c))return C.cleObligatoire?'fermee':'libre';   /* cleObligatoire : sans QR de classe récent, la saisie reste fermée */
    var o=ouverture(c);if(seance==null)seance=C.seance&&C.seance();
    return o&&String(o.s)===String(seance)?'ouverte':'fermee';
  }
  function nom(s){return C&&C.nom?C.nom(s):'Séance '+s}

  /* v2 : plus aucune saisie. Seul le QR de démarrage du jour (affiché par le professeur) ouvre la séance. */
  var SUITE=' Demande le QR du jour à ton professeur.';
  function demander(apres){
    var c=C.classe&&C.classe();if(!c)return;
    if(!cleDe(c)&&!C.cleObligatoire){if(apres)apres();return}
    var o=ouverture(c),cur=C.seance&&C.seance();
    var info=o?'<p>La séance ouverte aujourd’hui est <b>'+esc(nom(o.s))+'</b> (jusqu’à '+heure(o.fin)+').</p>'+(String(o.s)!==String(cur)?'<p><button type="button" class="eps-code-ok" id="eps-code-aller" style="width:100%">Aller à '+esc(nom(o.s))+'</button></p>':''):'';
    var v=fenetre('<h3>📷 Ouvrir la séance</h3><p>Scanne le <b>QR du jour</b> affiché par ton professeur : la séance s’ouvre toute seule '+duree()+'.</p>'+info+
      (C.scanner?'<p><button type="button" class="eps-code-ok" id="eps-code-scan" style="width:100%;min-height:56px;font-size:18px">📷 Scanner le QR du jour</button></p>':'<p><b>Ouvre « Scanner le QR de la classe » dans l’appli.</b></p>')+
      '<div class="eps-code-bts"><button type="button" class="eps-code-non" id="eps-code-non">Annuler</button></div>');
    var scb=v.querySelector('#eps-code-scan');if(scb)scb.onclick=function(){fermerFen();APRES=apres||null;C.scanner(verifierQR)};
    var al=v.querySelector('#eps-code-aller');if(al)al.onclick=function(){fermerFen();C.ouvrir(o.s);rafraichir()};
    v.querySelector('#eps-code-non').onclick=fermerFen;
  }
  var APRES=null;
  /* Contrôle d'un QR scanné pour ouvrir la séance (appelé par le lecteur de l'appli, AVANT de traiter le QR).
     Lève une erreur au message clair : le lecteur l'affiche et continue de viser. */
  async function verifierQR(q){
    function non(t){throw new Error(t+SUITE)}
    if(!q||typeof q!=='object')non('Ce QR n’est pas un QR de cette appli.');
    if(C&&C.qrApp&&q.a!==C.qrApp)non('Ce QR n’est pas un QR de cette appli.');
    if(q.t!=='C'||!q.c)non('Ce n’est pas le QR du jour de la classe.');
    var mien=C&&C.classe&&C.classe();
    if(mien&&q.c!==mien)non('Ce QR est celui de la classe '+q.c+', pas de la tienne ('+mien+').');
    var cj=q.cj;
    if(!cj||!cj.d||cj.s==null||!cj.k)non('Ce QR ne contient pas la séance du jour (QR ancien).');
    if(cj.d!==jour())non('Ce QR n’est pas celui d’aujourd’hui. Vérifie aussi la date du téléphone.');
    var cle=q.cc||cleDe(q.c);if(!cle)non('Ce QR est trop ancien pour ouvrir la séance.');
    var ok=false;try{ok=await code(cle,q.c,cj.d,cj.s)===String(cj.k)}catch(e){}
    if(!ok)non('Ce QR ne permet pas d’ouvrir la séance (abîmé ou modifié).');
    var L=(C&&C.seances&&C.seances())||[];if(L.length&&L.indexOf(String(cj.s))<0)non('Ce QR ouvre « '+cj.s+' », une séance qui n’existe pas dans ton carnet.');
    var a=APRES;APRES=null;if(a)setTimeout(function(){if(etat()!=='fermee')a()},400);
    return true;
  }

  function bandeauHtml(st){
    var c=C.classe(),o=ouverture(c),cur=C.seance();
    if(st==='ouverte')return '<div class="eps-code-bandeau ouvert" data-eps-code>✅ '+esc(nom(cur))+' ouverte jusqu’à '+heure(o.fin)+'.</div>';
    var txt=o?'🔒 '+esc(nom(cur))+' : pas modifiable. La séance du jour est '+esc(nom(o.s))+'.':'🔒 '+esc(nom(cur))+' fermée : la saisie se fait en cours, avec le QR du jour.';
    return '<div class="eps-code-bandeau ferme" data-eps-code><span>'+txt+'</span><button type="button" data-eps-code-ouvrir>'+(o&&String(o.s)!==String(cur)?'Aller à '+esc(nom(o.s)):'📷 Scanner le QR du jour')+'</button></div>';
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
  /* Pour une action précise (gym : niveaux ⚠️) : lance f si la séance du jour est ouverte, sinon demande le QR du jour. */
  function exiger(f){if(etat()!=='fermee'){f();return}demander(f)}
  /* Heure d'ouverture de la séance (QR du jour), pour la joindre aux envois (null sinon). */
  function trace(){if(!C)return null;var o=ouverture(C.classe&&C.classe());return o?{s:o.s,h:o.h}:null}

  /* =====================================================================
     CÔTÉ PROF (v2 : plus de code affiché)
     Le QR de démarrage porte toujours une séance : celle choisie aujourd'hui,
     sinon la suivante de la dernière ouverte, sinon la première.
     cj:await EPSCode.cjDuJour(app,classe,cle,defaut,ids)  (ids = séances possibles)
     EPSCode.preparer({app,classe,cle,seances:[{v,n}],titre,qr:async cj=>svg})
       → fenêtre « autre date / imprimer » (QR valable seulement ce jour-là).
     ===================================================================== */
  function memProf(app){return lire('eps-code-prof:'+(app||'appli'))}
  function seanceDuJour(app,classe,ids,defaut){
    var der=memProf(app)[classe];ids=(ids||[]).map(String);
    if(der&&der.d===jour()&&(!ids.length||ids.indexOf(String(der.s))>=0))return String(der.s);
    if(defaut!=null&&defaut!=='')return String(defaut);
    if(!ids.length)return der&&der.d===jour()?String(der.s):'';
    if(der){var i=ids.indexOf(String(der.s));if(i>=0)return ids[Math.min(ids.length-1,i+1)]}
    return ids[0];
  }
  function choisirSeance(app,classe,s){var m=memProf(app);m[classe]={s:String(s),d:jour()};ecrire('eps-code-prof:'+(app||'appli'),m)}
  async function cjPour(cle,classe,d,s){return {d:d,s:String(s),k:await code(cle,classe,d,s)}}
  async function cjDuJour(app,classe,cle,defaut,ids){
    try{
      if(!cle||!classe)return undefined;
      var s=seanceDuJour(app,classe,ids,defaut);if(s==null||s==='')return undefined;
      if(ids&&ids.length)choisirSeance(app,classe,s);
      return await cjPour(cle,classe,jour(),s);
    }catch(e){return undefined}
  }
  function demain(){var d=new Date();d.setDate(d.getDate()+1);return jour(d)}
  function dateLongue(d){return new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
  function preparer(o){
    var L=o.seances||[],ids=L.map(function(x){return String(x.v)}),une=L.length<=1;
    var prop=o.proposee!=null?String(o.proposee):seanceDuJour(o.app,o.classe,ids);
    var v=fenetre('<h3>🗓 QR pour un autre jour · '+esc(o.classe)+'</h3>'+
      '<p style="font-size:15px">À imprimer d’avance ou à garder sur un autre appareil. Ce QR ouvre la séance <b>seulement le jour choisi</b>.</p>'+
      '<label for="eps-code-d">Jour du cours</label><input type="date" id="eps-code-d" value="'+demain()+'">'+
      (une?'':'<label for="eps-code-s">Séance</label><select id="eps-code-s">'+L.map(function(x){return '<option value="'+esc(x.v)+'"'+(String(x.v)===String(prop)?' selected':'')+'>'+esc(x.n)+'</option>'}).join('')+'</select>')+
      '<p id="eps-code-txt" style="text-align:center;font-weight:700;margin-top:12px"></p><div class="eps-code-qr" id="eps-code-qr"></div>'+
      '<div class="eps-code-bts"><button type="button" class="eps-code-non" id="eps-code-f">Fermer</button><button type="button" class="eps-code-ok" id="eps-code-p">🖨 Imprimer</button></div>');
    var sel=v.querySelector('#eps-code-s'),dat=v.querySelector('#eps-code-d'),z=v.querySelector('#eps-code-qr'),t=v.querySelector('#eps-code-txt'),n=0;
    function etiquette(){var s=sel?sel.value:(L[0]?L[0].v:'');return (une?'':(L.find(function(x){return String(x.v)===String(s)})||{n:s}).n+' · ')+dateLongue(dat.value||jour())}
    async function maj(){var k=++n,s=sel?sel.value:(L[0]?L[0].v:''),d=dat.value||jour();
      var svg;try{svg=await o.qr(await cjPour(o.cle,o.classe,d,s))}catch(e){svg='<p style="color:#b91c1c">'+esc(e.message)+'</p>'}
      if(k!==n)return;z.innerHTML=svg;t.textContent=etiquette()}
    if(sel)sel.onchange=maj;dat.onchange=maj;v.querySelector('#eps-code-f').onclick=fermerFen;
    v.querySelector('#eps-code-p').onclick=function(){imprimer('<h1 style="font-size:26px;margin:0 0 6px">'+esc(o.titre||'QR de démarrage')+' · '+esc(o.classe)+'</h1><p style="font-size:20px;margin:0 0 14px"><b>'+esc(etiquette())+'</b></p>'+z.innerHTML+'<p style="font-size:16px;margin-top:14px">Dans l’appli élève : scanne ce QR. Il n’ouvre la séance que ce jour-là, pendant 2 heures.</p>')};
    maj();
  }
  function imprimer(html){
    styles();var a=document.getElementById('eps-code-impr');if(a)a.remove();
    a=document.createElement('div');a.id='eps-code-impr';a.innerHTML=html;document.body.appendChild(a);
    var r=document.documentElement;r.classList.add('eps-code-impr');
    var fin=function(){r.classList.remove('eps-code-impr');var x=document.getElementById('eps-code-impr');if(x)x.remove();window.removeEventListener('afterprint',fin)};
    window.addEventListener('afterprint',fin);setTimeout(function(){window.print();setTimeout(function(){if(!window.matchMedia||!window.matchMedia('print').matches)fin()},1500)},50);
  }
  async function appliquerJour(classe,cj){
    try{
      if(!cj||!classe||cj.d!==jour())return false;
      var cle=cleDe(classe);if(!cle)return false;
      if(await code(cle,classe,cj.d,cj.s)!==String(cj.k))return false;
      var s=sto();s.ouv=s.ouv||{};var o=s.ouv[classe];
      if(!(o&&o.d===cj.d&&String(o.s)===String(cj.s)&&Date.now()<o.fin)){s.ouv[classe]={s:String(cj.s),d:cj.d,h:Date.now(),fin:finOuv()};ecrire(K,s)}
      if(C&&C.classe&&C.classe()===classe&&C.ouvrir&&C.seance&&String(C.seance())!==String(cj.s)){try{C.ouvrir(String(cj.s))}catch(e){}}
      if(C)rafraichir();
      return true;
    }catch(e){return false}
  }

  window.EPSCode={v:2,code:code,nouvelleCle:nouvelleCle,jour:jour,eleve:eleve,memoriserCle:memoriserCle,cleDe:cleDe,etat:etat,exiger:exiger,demander:function(){demander()},rafraichir:rafraichir,trace:trace,
    verifierQR:verifierQR,seanceDuJour:seanceDuJour,choisirSeance:choisirSeance,cjDuJour:cjDuJour,cjPour:cjPour,preparer:preparer,imprimer:imprimer,appliquerJour:appliquerJour};
})();
