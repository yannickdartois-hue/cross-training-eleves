/* =====================================================================
   oubli.js — code secret oublié : le professeur peut le retrouver
   (même principe que l'appli gym)
   ---------------------------------------------------------------------
   Le QR de la classe apporte une clé publique du professeur (champ ek,
   ECDH P-256). Quand un groupe tape son code (création ou ouverture du
   carnet), une copie du code est rangée sur l'appareil CHIFFRÉE pour cette
   clé : seul l'outil prof (clé privée sur l'iPad) peut la lire.
   Code oublié → « Code oublié ? » montre un QR (t:'O') → le professeur le
   scanne dans son outil → son écran affiche le code. Rien ne passe par
   internet ; le carnet lui-même n'est pas modifié.
   Un groupe est protégé dès qu'il a scanné le QR de la classe (nouvelle
   version) puis ouvert son carnet une fois avec son code.
   Chargé après app.js, sans le modifier.
   ===================================================================== */
(function(){
'use strict';
const APP='CTE',PREF='ct';
const enc=new TextEncoder();
const b64u=u=>{let s='';new Uint8Array(u).forEach(x=>s+=String.fromCharCode(x));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const deb64u=t=>{t=String(t).replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';return Uint8Array.from(atob(t),c=>c.charCodeAt(0))};
async function pourProf(code,ek){
  const pub=await crypto.subtle.importKey('raw',deb64u(ek),{name:'ECDH',namedCurve:'P-256'},false,[]);
  const eph=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveKey']);
  const k=await crypto.subtle.deriveKey({name:'ECDH',public:pub},eph.privateKey,{name:'AES-GCM',length:256},false,['encrypt']);
  const iv=crypto.getRandomValues(new Uint8Array(12));
  return {e:b64u(await crypto.subtle.exportKey('raw',eph.publicKey)),i:b64u(iv),d:b64u(await crypto.subtle.encrypt({name:'AES-GCM',iv},k,enc.encode(PREF+'|'+code)))};
}
let CODE=null;
async function proteger(){
  try{
    if(!S||!ACTIF||!CODE||(typeof DEMO!=='undefined'&&DEMO))return;
    const g=ROOT.groupes[ACTIF],c=ROOT.classes[S.classe]||{},ek=(S.cfg&&S.cfg.ek)||c.ek;
    if(!g||!ek||(g.oc&&g.oek===ek))return;
    g.oc=await pourProf(CODE,ek);g.oek=ek;ecrireRoot();
  }catch(e){}
}
const _recevoirClasse=recevoirClasse;
recevoirClasse=function(o){
  const r=_recevoirClasse(o);
  try{if(o&&o.ek&&ROOT.classes[o.c]){ROOT.classes[o.c].ek=o.ek;if(S&&S.cfg&&S.classe===o.c)S.cfg.ek=o.ek;ecrireRoot();proteger()}}catch(e){}
  return r;
};
const _ouvrir=ouvrir,_nouveauGroupe=nouveauGroupe,_verrouiller=verrouiller;
ouvrir=async function(id,code){await _ouvrir(id,code);CODE=code;await proteger()};
nouveauGroupe=async function(classe,code){await _nouveauGroupe(classe,code);CODE=code;await proteger()};
verrouiller=async function(){CODE=null;return _verrouiller()};
/* « Code oublié ? » : QR pour le professeur si le carnet est protégé, sinon message habituel d'app.js */
document.addEventListener('click',async ev=>{
  const b=ev.target.closest('[data-act="codeoubli"]');if(!b)return;
  const id=(typeof CODE_CB!=='undefined'&&CODE_CB&&CODE_CB.id)||null,g=id&&ROOT.groupes[id];
  if(!g||!g.oc)return;
  ev.stopImmediatePropagation();ev.preventDefault();
  let svg='';
  try{svg=TTQR.svgQR(await TTQR.encoder({a:APP,v:1,t:'O',c:g.classe||'',n:g.noms||[],o:g.oc}))}catch(e){svg='<p class="alerte">QR impossible sur cet appareil.</p>'}
  fen(`<h3>Code oublié</h3>
    <p>Montrez ce QR au professeur. Il le scanne avec son outil et lit votre code sur son écran. Rien n’est perdu.</p>
    <div style="background:#fff!important;padding:10px;border-radius:12px;max-width:320px;margin:auto">${svg}</div>
    <p class="small muted">Le QR est chiffré : seul l’outil du professeur peut le lire.</p>
    <div class="rangee" style="justify-content:space-between;margin-top:10px"><button class="bt" type="button" data-act="fermer">Fermer</button></div>`);
},true);
})();
