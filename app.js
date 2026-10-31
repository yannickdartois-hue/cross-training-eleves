/* =====================================================================
   app.js — Cross training · appli élève (carnet d'entraînement + chrono)
   Lycée Georges Pompidou · une tablette par binôme
   Données gardées sur la tablette uniquement, carnet chiffré par le code du binôme.
   ===================================================================== */
'use strict';
/* Envoi en ligne : lien de dépôt du Nuage (« Demande de fichier – Téléversement seulement »).
   Le lien arrive avec le QR de la classe (outil prof). Celui-ci sert de secours ; vide = pas d'envoi en ligne, le QR suffit. */
const DEPOT_DEFAUT='';
const lienEnvoi=()=>(S.cfg&&S.cfg.lien)||DEPOT_DEFAUT;
const CLE='cte-v1',NB_SEANCES=9,VERSION=1;
const SCE={g:[2,5,8],h:[2,5,8]};

const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const prenom=n=>String(n||'').split(/\s+/)[0]||n;

/* ---------- État ---------- */
/* ROOT = {v:1, groupes:{id:{classe,noms,sel,iv,data,vu,nonEnv}}, classes:{classe:{classe,eleves,lien,niv,dem}}}
   S = carnet du binôme ouvert (en mémoire seulement), CLEF = sa clé de chiffrement. */
function vide(){return {v:VERSION,classe:'',eleves:[],cfg:null,cur:0,seance:1,tab:'seance',d:{},t:{},jj:{},envoi:{},mod:{},jours:{}}}
function charger(){let o=null;try{o=JSON.parse(localStorage.getItem(CLE))}catch(e){}
  const R={v:1,groupes:{},classes:{}};return o&&o.v===1&&o.groupes?Object.assign(R,o):R}
let ROOT=charger(),S=null,ACTIF=null,CLEF=null;
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
function ecrireRoot(){try{localStorage.setItem(CLE,JSON.stringify(ROOT))}catch(e){toast('Mémoire pleine : envoie tes séances puis supprime les anciens binômes.')}}
const b64=u=>{let x='';new Uint8Array(u).forEach(c=>x+=String.fromCharCode(c));return btoa(x)};
const deb64=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
async function deriver(code,sel){
  const base=await crypto.subtle.importKey('raw',new TextEncoder().encode('cte|'+code),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt:sel,iterations:150000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
let tSauve=null;
function sauver(){clearTimeout(tSauve);tSauve=setTimeout(enregistrer,200)}
async function enregistrer(){
  clearTimeout(tSauve);
  if(!S||!ACTIF||!CLEF){ecrireRoot();return}
  const g=ROOT.groupes[ACTIF]||(ROOT.groupes[ACTIF]={});
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},CLEF,new TextEncoder().encode(JSON.stringify(S)));
  Object.assign(g,{classe:S.classe,noms:S.eleves.map(e=>prenom(e.nom)),iv:b64(iv),data:b64(ct),vu:Date.now(),nonEnv:nonEnvoyees()});delete g.clair;
  ecrireRoot();
}
async function ouvrir(id,code){
  const g=ROOT.groupes[id];
  if(g.clair){const sel=crypto.getRandomValues(new Uint8Array(16));g.sel=b64(sel);CLEF=await deriver(code,sel);S=Object.assign(vide(),g.clair)}
  else{
    // Anti-essais : après 5 codes faux, attente qui double (30 s, 1 min… plafond 5 min).
    const E=g.essais||{n:0,t:0};
    if(E.t>Date.now())throw new Error('Trop d’essais. Réessayez dans '+Math.ceil((E.t-Date.now())/1000)+' s.');
    const k=await deriver(code,deb64(g.sel));
    let txt;try{txt=new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:deb64(g.iv)},k,deb64(g.data)))}
    catch(e){E.n++;const att=Math.min(300,30*2**(E.n-5));if(E.n>=5)E.t=Date.now()+att*1000;g.essais=E;ecrireRoot();
      throw new Error(E.n>=5?'Code faux. Trop d’essais : attendez '+(att<60?att+' s':att/60+' min')+'.':'Code faux ('+(5-E.n)+' essai'+(5-E.n>1?'s':'')+' avant attente).')}
    delete g.essais;CLEF=k;S=Object.assign(vide(),JSON.parse(txt))}
  ACTIF=id;
  if(S.classe&&ROOT.classes[S.classe])S.cfg=JSON.parse(JSON.stringify(ROOT.classes[S.classe]));
  S.tab=S.eleves.length?'seance':'groupe';S.cur=0;seanceDuJour();
  await enregistrer();
}
function seanceDuJour(){
  const t=today();S.jours=S.jours||{};
  if(S.jours[t]){S.seance=S.jours[t];return}
  let der=0,dd='';
  S.eleves.forEach(e=>Object.entries(S.d[e.id]||{}).forEach(([n,r])=>{if(r.date&&+n>der){der=+n;dd=r.date}}));
  if(der&&dd!==t){S.seance=Math.min(NB_SEANCES,der+1);setTimeout(()=>toast('Séance '+S.seance+' aujourd’hui (touche un autre numéro si besoin).'),400)}
  S.jours[t]=S.seance;
}
async function verrouiller(){await enregistrer();S=null;ACTIF=null;CLEF=null}
async function nouveauGroupe(classe,code){
  const id=uid(),sel=crypto.getRandomValues(new Uint8Array(16));
  ROOT.groupes[id]={classe:classe||'',noms:[],sel:b64(sel)};
  CLEF=await deriver(code,sel);ACTIF=id;S=vide();
  const C=classe&&ROOT.classes[classe];if(C){S.cfg=JSON.parse(JSON.stringify(C));S.classe=classe}
  S.tab='groupe';await enregistrer();
}
let tInactif=null;
function reveil(){clearTimeout(tInactif);if(S)tInactif=setTimeout(async()=>{if(S&&!document.documentElement.classList.contains('chrono-ouvert')){await verrouiller();fermer();rendre();toast('Carnet verrouillé (10 min sans activité).')}},10*60*1000)}
['click','input','touchstart'].forEach(e=>document.addEventListener(e,reveil,{passive:true}));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S)enregistrer()});
let CODE_CB=null;
function demanderCode(titre,texte,cb,creer){
  CODE_CB={cb,creer,premier:null};
  fen(`<h3>${esc(titre)}</h3><p class="small muted">${esc(texte)}</p>
    <input id="code" class="code" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" aria-label="Code à 4 chiffres">
    <p id="code-msg" class="small" style="min-height:1.4em;font-weight:700;color:var(--alerte)"></p>
    <div class="rangee" style="justify-content:space-between"><button class="bt" type="button" data-act="fermer">Annuler</button><button class="bt noir" type="button" data-act="codeok">Valider</button></div>
    ${creer?'':'<p class="small" style="margin-top:12px"><button class="lien" type="button" data-act="codeoubli">Code oublié ?</button></p>'}`);
  setTimeout(()=>{const i=$('#code');if(i)i.focus()},50);
}
async function validerCode(){
  const i=$('#code'),m=$('#code-msg'),c=(i.value||'').trim();
  if(!/^\d{4}$/.test(c)){m.textContent='4 chiffres.';return}
  const st=CODE_CB;
  if(st.creer&&!st.premier){st.premier=c;i.value='';m.textContent='Retape le même code pour confirmer.';i.focus();return}
  if(st.creer&&st.premier!==c){st.premier=null;i.value='';m.textContent='Les deux codes sont différents : recommence.';return}
  m.textContent='Ouverture…';
  try{await st.cb(c);CODE_CB=null;fermer();rendre();window.scrollTo(0,0)}catch(e){i.value='';m.textContent=e.message||'Erreur';i.focus()}
}

/* ---------- Accès aux données ---------- */
const elv=()=>S.eleves[S.cur]||S.eleves[0];
const cfg=()=>S.cfg||{niv:'p',dem:'p'};
const pk=()=>CTL.parcours(cfg().niv||'p',cfg().dem||'p');
const seanceCycle=n=>{const P=PARCOURS[pk()];return P&&P.L[n-1]};
const estTle=()=>cfg().niv==='t';
const estG=()=>cfg().dem==='g';
function rec(id,n,creer=true){S.d[id]=S.d[id]||{};let r=S.d[id][n];
  if(!r&&creer)r=S.d[id][n]={date:null,mobile:'',wods:[],etoile:null,axe:'',bilan:'',suite:'',etire:false,roles:{},disp:false};return r}
const tab=id=>S.t[id]||(S.t[id]={age:'',fcRepos:'',mobile:'',pourquoi:'',kb:'',dl:'',fs:'',pp:''});
const jj=id=>S.jj[id]||(S.jj[id]={rep:'',ech:['','','',''],ok:false});
function touche(r){if(!r.date)r.date=today();modif()}
function modif(n){if(!S)return;S.mod=S.mod||{};S.mod[n==null?S.seance:n]=Date.now()}
function nonEnvoyees(){if(!S||!S.mod)return [];return Object.keys(S.mod).map(Number).filter(n=>{const ev=(S.envoi||{})[n]||{};return S.mod[n]>Math.max(ev.qr||0,ev.fichier||0)&&fichiers(n).length}).sort((a,b)=>a-b)}
function mobileDe(id,n){const r=rec(id,n,false);return (r&&r.mobile)||tab(id).mobile||''}
const MVS=()=>MOUV.filter(m=>estTle()||!m.tle);

/* ---------- Affichage ---------- */
function vChoix(){
  const G=Object.entries(ROOT.groupes).sort((a,b)=>(a[1].classe||'').localeCompare(b[1].classe||'','fr')||(b[1].vu||0)-(a[1].vu||0));
  const nom=g=>g.noms&&g.noms.length?g.noms.map(esc).join(' · '):'Binôme à compléter';
  const parC={};G.forEach(([id,g])=>(parC[g.classe||'Sans classe']=parC[g.classe||'Sans classe']||[]).push([id,g]));
  const C=Object.keys(ROOT.classes).sort();
  return `<h2>Qui utilise la tablette ?</h2><p class="small muted">Chaque binôme ouvre son carnet avec son code secret.</p>
  ${G.length?Object.entries(parC).map(([c,L])=>`<section class="carte"><h3>${esc(c)}</h3><div class="choix">${L.map(([id,g])=>{const ne=g.nonEnv&&g.nonEnv.length;return `<button type="button" class="bt grp${ne?' nonenv':''}" data-act="choisir" data-v="${id}">🔒 ${nom(g)}<small>${ne?'⚠ Séance '+g.nonEnv.join(', ')+' non envoyée':'code secret du binôme'}</small></button>`}).join('')}</div></section>`).join(''):'<p class="muted">Aucun binôme sur cette tablette.</p>'}
  <section class="carte"><h3>Nouveau binôme</h3>
    ${C.length?`<p class="small muted">Classes déjà enregistrées sur la tablette :</p><div class="rangee">${C.map(c=>`<button type="button" class="bt" data-act="nouveau" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div><p class="small muted" style="margin-top:10px">Autre classe :</p>`:''}
    <button type="button" class="bt orange" data-act="nouveauqr">Scanner le QR de la classe</button></section>`;
}
function rendre(){
  document.querySelectorAll('.barre .bt[data-act]').forEach(x=>x.hidden=!S);
  if(!S){$('#sous').textContent='Choisis ton binôme';$('#seances').hidden=true;$('#qui').hidden=true;$('#onglets').hidden=true;$('#main').innerHTML=vChoix();return}
  const g=S.eleves.length>0;if(!g)S.tab='groupe';
  $('#sous').textContent=g?(S.classe?S.classe+' · ':'')+S.eleves.map(e=>prenom(e.nom)).join(', ')+' · '+CTL.NOM_NIV[cfg().niv||'p']+' '+CTL.NOM_DEM[cfg().dem||'p']:'Crée ton binôme pour commencer';
  const faites=new Set();S.eleves.forEach(e=>Object.entries(S.d[e.id]||{}).forEach(([n,r])=>{if(r.date)faites.add(+n)}));
  $('#seances').innerHTML=g?`<span class="lab">Séance</span><div class="strip">${[...Array(NB_SEANCES)].map((_,i)=>`<button type="button" data-act="seance" data-v="${i+1}" class="${S.seance===i+1?'ici':''} ${faites.has(i+1)?'fait':''}" aria-label="Séance ${i+1}">${i+1}</button>`).join('')}</div>`:'';
  $('#seances').hidden=!g;
  const parEleve=['seance','moi','jourj','progres'].includes(S.tab)&&S.eleves.length>1;
  $('#qui').hidden=!parEleve;
  $('#qui').innerHTML=parEleve?`<span class="small muted">Qui saisit ?</span>`+S.eleves.map((e,i)=>`<button type="button" data-act="qui" data-v="${i}" class="${S.cur===i?'ici':''}">${esc(prenom(e.nom))}</button>`).join(''):'';
  const O=[['seance','⏱','Séance'],['moi','👤','Mon tableau'],['jourj','🎯','Jour J'],['progres','📈','Progrès'],['envoi','📤','Envoyer']];
  const ne=nonEnvoyees();
  $('#onglets').innerHTML=O.map(o=>`<button type="button" data-act="tab" data-v="${o[0]}" class="${S.tab===o[0]?'ici':''}${o[0]==='envoi'&&ne.length?' alerte':''}"><i aria-hidden="true">${o[1]}</i><b>${o[2]}</b></button>`).join('');
  $('#onglets').hidden=!g;
  const V={groupe:vGroupe,seance:vSeance,moi:vMoi,jourj:vJourJ,progres:vProgres,envoi:vEnvoi};
  $('#main').innerHTML=(ne.length&&S.tab!=='envoi'&&S.tab!=='groupe'?`<button type="button" class="nonenvoye" data-act="tab" data-v="envoi">⚠ Séance ${ne.join(', ')} non envoyée au professeur : touche ici pour l’envoyer</button>`:'')+(V[S.tab]||vSeance)();
}

/* ----- Binôme ----- */
function vGroupe(){
  const L=S.eleves.length?S.eleves.slice():[];while(L.length<3)L.push({id:'',nom:''});
  const C=S.cfg;
  const choix=(e,i)=>{const pris=new Set(S.eleves.filter((x,j)=>j!==i).map(x=>x.nom));const hors=e.nom&&!C.eleves.includes(e.nom);
    return `<select id="g-e${i}" data-id="${esc(e.id)}"><option value="">${i===2?'— (seulement si vous êtes 3) —':'— Choisir —'}</option>${hors?`<option selected>${esc(e.nom)}</option>`:''}${C.eleves.filter(n=>!pris.has(n)||n===e.nom).map(n=>`<option${n===e.nom?' selected':''}>${esc(n)}</option>`).join('')}</select>`};
  return `<h2>Mon binôme</h2>
  ${C?`<div class="carte"><p style="margin:0"><b>Classe ${esc(C.classe)}</b> <span class="small muted">· ${C.eleves.length} élèves · ${esc(CTL.NOM_NIV[C.niv||'p'])}, démarche ${esc(CTL.NOM_DEM[C.dem||'p'])}</span></p>
      ${L.map((e,i)=>`<label class="ch" for="g-e${i}">Élève ${'ABC'[i]}</label>${choix(e,i)}`).join('')}
      <div class="rangee" style="margin-top:14px"><button class="bt orange" type="button" data-act="gvalider">Enregistrer le binôme</button><button class="bt mini" type="button" data-act="qrclasse">Nouvelle liste de classe (QR)</button></div></div>`
   :`<div class="carte"><h3>Scanner le QR de la classe</h3><p class="small muted">Le professeur l’affiche au premier cours : il donne la classe, la liste des élèves, le niveau et la démarche du cycle.</p>
      <button class="bt orange" type="button" data-act="qrclasse">Scanner le QR de la classe</button></div>`}
  <div class="carte"><h3>Changer de tablette</h3>
    <p class="small muted">Le carnet est gardé sur cette tablette. Pour continuer sur une autre, enregistre-le ici, puis reprends-le là-bas.</p>
    <div class="rangee"><button class="bt mini" type="button" data-act="sauvegarde">Enregistrer le carnet</button>
    <label class="bt mini" for="reprise">Reprendre un carnet</label><input id="reprise" type="file" accept=".json,application/json" hidden></div></div>
  <div class="carte"><button class="bt mini danger" type="button" data-act="toutEffacer">Supprimer ce binôme de la tablette</button></div>
  <p class="rgpd">Les données restent sur cette tablette. Elles partent seulement quand tu les envoies à ton professeur (QR code ou envoi en ligne).</p>`;
}

/* ----- Séance ----- */
function programme(n){
  const s=seanceCycle(n);if(!s)return '';
  const items=s.fiches.filter((f,i)=>!/^(Échauffement|Retour au calme|GAREEPS · bilan)/.test(f.cat)).map(f=>`<li><b>${esc(f.titre)}</b> <span class="muted">· ${f.duree} min</span></li>`).join('');
  return `<section class="carte prog-seance"><p class="small muted" style="margin:0">Séance ${n} · ${esc(PARCOURS[pk()].nom)}</p><h3 style="margin-top:4px">${esc(s.titre)}</h3><p class="small">${esc(s.obj)}</p><ul class="small">${items}</ul>
    ${s.mat?`<p class="small muted">Matériel : ${esc(s.mat)}</p>`:''}</section>`;
}
const pastFC=(fc,mob)=>{const d=CTL.fcDans(fc,mob);return fc?`<span class="fc ${d==null?'':d===0?'dans':d<0?'sous':'dessus'}">${fc}${d==null?'':d===0?' ✓':d<0?' ↓':' ↑'}</span>`:'<span class="muted">—</span>'};
function carteWod(W,i,mob){
  const ex=(W.ex||[]).map(e=>{const m=mvById(e.m)||{nom:e.m};return `<span class="wx">${esc(m.nom)}${boutonVideo(e.m,'mini')}${e.reps&&W.f!=='tabata'?' × '+e.reps:''}${e.v?`<em>${e.v<0?'−':'+'}</em>`:''}${W.fait&&e.note?` <small>exéc. ${e.note}/5</small>`:''}</span>`}).join('');
  const sc=W.fait?CTL.score(W):'';
  return `<article class="wod${W.fait?' fait':''}"><header><b>${esc(CTL.titreWod(W))}</b>${W.special?'<span class="pill">spécial</span>':''}<span class="pill">${W.fait?'fait':'prévu'}</span></header>
    <div class="wxs">${ex||'<span class="muted small">aucun exercice</span>'}</div>
    ${W.fait?`<p class="small">${esc(sc)} · FC ${pastFC(W.fc,mob)} · ressenti ${W.ress||'—'}/4${W.regul?' · '+W.regul+' régulation'+(W.regul>1?'s':''):''}${W.norep?' · '+W.norep+' no rep':''}</p>`:''}
    <div class="rangee">${(W.ex||[]).length?`<button class="bt ${W.fait?'mini':'orange'}" type="button" data-act="go" data-i="${i}">${W.fait?'Refaire':'▶ Lancer le chrono'}</button>`:''}<button class="bt mini" type="button" data-act="wmod" data-i="${i}">Modifier</button><button class="bt mini danger" type="button" data-act="wdel" data-i="${i}">Supprimer</button></div></article>`;
}
function vSeance(){
  const E=elv(),n=S.seance,r=rec(E.id,n),mob=r.mobile||tab(E.id).mobile||'';
  const sce=estG()&&(SCE[pk()]||[]).includes(n);
  let h=programme(n);
  h+=`<section class="carte"><label class="coche disp"><input type="checkbox" data-ch="disp" ${r.disp?'checked':''}> Aujourd’hui je suis dispensé(e) : je suis assistant et juge de mon binôme</label>
    <label class="ch" for="mob">Mon mobile</label><select id="mob" data-ch="mobile"><option value="">— pas encore choisi —</option>${Object.entries(MOBILES).filter(([k])=>k==='mod'||k==='elev').map(([k,M])=>`<option value="${k}"${mob===k?' selected':''}>${esc(M.nom)} · FC ${M.fc}</option>`).join('')}</select>
    ${mob?`<p class="small muted">${esc(MOBILES[mob].wod)}</p>`:''}</section>`;
  h+=`<h3>Mes WOD ${n===9?'du jour J':''}</h3>${r.wods.map((W,i)=>carteWod(W,i,mob)).join('')||'<p class="muted small">Aucun WOD pour l’instant.</p>'}
    <div class="rangee"><button class="bt orange" type="button" data-act="wadd">+ Ajouter un WOD</button>${n<9?`<button class="bt mini" type="button" data-act="wsuiv">Préparer la séance ${n+1}</button>`:''}</div>`;
  if(estG())h+=carteEtoile(r,sce);
  h+=`<section class="carte"><h3>Mon rôle pour ${esc(prenom((S.eleves[1-S.cur]||{}).nom||'mon binôme'))}</h3>
    ${[['supporter','Supporter : je l’ai encouragé pendant tout l’effort'],['assistant','Assistant : j’ai compté, chronométré, pris la FC, noté'],['coach','Coach : je lui ai conseillé une régulation ou un critère']].map(x=>`<label class="coche"><input type="checkbox" data-ch="role" data-k="${x[0]}" ${r.roles&&r.roles[x[0]]?'checked':''}> ${x[1]}</label>`).join('')}</section>
  <section class="carte"><h3>Fin de séance</h3><label class="coche"><input type="checkbox" data-ch="etire" ${r.etire?'checked':''}> J’ai fait mes étirements (muscles travaillés, 20 à 30 s, sans douleur)</label>
    <label class="ch" for="bilan">Mon bilan (ce que j’ai senti, ce qui a marché, ce que j’ai régulé)</label><textarea id="bilan" data-ch="bilan" rows="3">${esc(r.bilan)}</textarea>
    <label class="ch" for="suite">Pour la prochaine fois (ce que je change et pourquoi)</label><textarea id="suite" data-ch="suite" rows="2">${esc(r.suite)}</textarea></section>`;
  return h;
}
function carteEtoile(r,sce){
  const e=r.etoile||{},vals=GAREEPS.axes.map(a=>e[a.id]?e[a.id].length:0);
  const cols=['#dc2626','#facc15','#86efac','#15803d'];
  return `<${sce?'section':'details'} class="carte${sce?' sce':''}">${sce?'<h3>Mon étoile · SCE du jour</h3>':'<summary><b>Mon étoile</b>'+(r.axe?' · axe prioritaire : '+esc(GAREEPS.axes.find(a=>a.id===r.axe).nom):'')+'</summary>'}<p class="small muted">${sce?'Ton observateur coche ce qu’il a vu pendant tes WOD. Une case = un critère validé.':'À remplir surtout aux SCE (séances 2, 5 et 8). Garde un œil sur ton axe prioritaire.'}</p>
    <div class="etoile-g">${svgEtoile(vals.map(v=>Math.max(v,0.05)))}</div>
    ${GAREEPS.axes.map(a=>{const n=e[a.id]?e[a.id].length:0;return `<div class="axe-g"><b style="color:${a.c}">${esc(a.nom)}</b> <span class="niv-g" style="background:${n?cols[n-1]:'#e5e7eb'}">${n?'niveau '+n:'—'}</span>
      ${a.crit.map((c,i)=>`<label class="coche"><input type="checkbox" data-ch="crit" data-k="${a.id}" data-i="${i}" ${e[a.id]&&e[a.id].includes(i)?'checked':''}> ${esc(c)}</label>`).join('')}</div>`}).join('')}
    <label class="ch" for="axe">Mon axe prioritaire</label><select id="axe" data-ch="axe"><option value="">— choisir (la branche la plus courte) —</option>${GAREEPS.axes.map(a=>`<option value="${a.id}"${r.axe===a.id?' selected':''}>${esc(a.nom)}</option>`).join('')}</select>
    ${r.axe?`<p class="small">${esc(GAREEPS.axes.find(a=>a.id===r.axe).besoin)}</p>`:''}</${sce?'section':'details'}>`;
}

/* ----- Éditeur de WOD ----- */
let ED=null; // {i (index ou -1), W, zone}
function ouvrirEditeur(i){
  const E=elv(),r=rec(E.id,S.seance);
  ED={i,W:i>=0?JSON.parse(JSON.stringify(r.wods[i])):null,zone:''};
  if(ED.W)peindreEditeur();else peindrePresets();
}
function peindrePresets(){
  const E=elv(),mob=mobileDe(E.id,S.seance);
  const grp=[['Format de l’épreuve · '+(mob?MOBILES[mob].nom:'choisis ton mobile'),CTL.PRESETS.filter(p=>p.ep&&(!mob||p.mob===mob))],['Découvrir et se tester',CTL.PRESETS.filter(p=>!p.ep)]];
  if(!mob)grp[0][1]=CTL.PRESETS.filter(p=>p.ep);
  fen(`<h3>Nouveau WOD · séance ${S.seance}</h3>${grp.map(([t,L])=>`<p class="ch">${esc(t)}</p><div class="presets">${L.map(p=>`<button type="button" class="preset" data-act="preset" data-v="${p.id}"><b>${esc(p.nom)}</b><small>${esc(p.aide)}</small></button>`).join('')}</div>`).join('')}
    <div class="rangee" style="margin-top:12px"><button class="bt" type="button" data-act="fermer">Annuler</button></div>`,'large');
}
function peindreEditeur(){
  const W=ED.W,ps=CTL.PRESETS.find(p=>p.id===W.preset)||{};
  const L=MVS().filter(m=>!ED.zone||m.z===ED.zone);
  const reps=W.f!=='tabata'&&W.f!=='emom1'&&!(W.f==='fortime'&&W.p.pal);
  const nivActif=W.ex.length&&W.ex.every(e=>e.reps===W.ex[0].reps)?CTL.NIV_REPS.indexOf(W.ex[0].reps):-1;
  const boutonsNiv=(act,actif)=>`<span class="niv5">${CTL.NIV_REPS.map((r,n)=>`<button type="button" class="${actif===n?'on':''}" data-act="${act}" data-v="${n}">N${n}<small>${r} rép.</small></button>`).join('')}</span>`;
  const dur=CTL.dureeS(W);
  fen(`<h3>${esc(CTL.titreWod(W))}${W.special?' · spécial':''}</h3><p class="small muted">${esc(ps.aide||'')} · ${dur?esc(CTL.mmss(dur)):'sans limite de temps'}${ps.nb?' · '+ps.nb+' exercice'+(ps.nb>1?'s':'')+' conseillé'+(ps.nb>1?'s':''):''}</p>
    ${W.f==='tabata'?`<div class="rangee"><span class="small">Ordre</span><button type="button" class="bt mini ${W.ordre!=='h'?'noir':''}" data-act="ordre" data-v="v">Vertical 1-2-3-4-1…</button><button type="button" class="bt mini ${W.ordre==='h'?'noir':''}" data-act="ordre" data-v="h">Horizontal 1-1-2-2…</button></div>`:''}
    ${W.f==='tabata'&&ps.libre?`<div class="rangee"><span class="small">Effort / repos</span>${CTL.TABATA_REGLAGES.map(([e,r])=>`<button type="button" class="bt mini ${W.p.e===e&&W.p.r===r?'noir':''}" data-act="etr" data-v="${e}/${r}">${e}/${r}</button>`).join('')}</div>
    <div class="rangee"><span class="small">Cycles</span><button type="button" class="bt mini" data-act="ecyc" data-v="-1" aria-label="Un cycle de moins">−</button><b>${W.p.n}</b><button type="button" class="bt mini" data-act="ecyc" data-v="1" aria-label="Un cycle de plus">+</button>${W.ordre==='h'&&W.ex.length>1&&W.p.n%W.ex.length?`<span class="small avert">En horizontal, prends un nombre de cycles divisible par ${W.ex.length} (${W.ex.length} exercices).</span>`:''}</div>`:''}
    ${W.f==='emom'||W.f==='amrap'||W.f==='emom1'?`<div class="rangee"><label class="small" for="ed-min">Durée (min)</label><input id="ed-min" class="num" type="number" min="1" max="30" value="${W.p.min}" data-ed="min"><button type="button" class="bt mini ${W.p.min===6?'noir':''}" data-act="emin" data-v="6">6 min</button><button type="button" class="bt mini ${W.p.min===10?'noir':''}" data-act="emin" data-v="10">10 min</button></div>`:''}
    ${(W.f==='emom'||W.f==='amrap')&&W.ex.length?`<div class="rangee"><span class="small">Niveau (même nombre pour tous les exercices)</span>${boutonsNiv('eniv',nivActif)}</div>`:''}
    ${W.f==='emom1'?`<div class="rangee"><span class="small">Répétitions au départ</span>${boutonsNiv('edep',CTL.NIV_REPS.indexOf(W.p.dep))}</div>`:''}
    ${W.f==='fortime'&&W.p.pal?`<div class="rangee"><span class="small">Paliers</span>${[[6,'N1 · 6 → 1'],[8,'N2 · 8 → 1'],[10,'N3 · 10 → 1']].map(([n,l])=>`<button type="button" class="bt mini ${W.p.pal[0]===n?'noir':''}" data-act="epal" data-v="${n}">${l}</button>`).join('')}</div>
    <div class="rangee"><span class="small">Temps limite</span>${[0,6,8,10,12,15].map(c=>`<button type="button" class="bt mini ${(W.p.cap||0)===c?'noir':''}" data-act="ecap" data-v="${c}">${c?c+' min':'sans'}</button>`).join('')}</div>`:''}
    <ol class="ed-liste">${W.ex.map((e,k)=>{const m=mvById(e.m)||{nom:e.m};return `<li><span>${esc(m.nom)}${boutonVideo(e.m,'mini')} <small class="muted">${m.z||''} N${m.n||''}</small></span>${reps?`<input class="num" type="number" min="1" max="60" value="${e.reps||(W.f==='emom'?7:10)}" data-ed="reps" data-k="${k}" aria-label="Répétitions">`:''}
      <span class="ver"><button type="button" class="${e.v<0?'on':''}" data-act="ever" data-k="${k}" data-v="-1">−</button><button type="button" class="${!e.v?'on':''}" data-act="ever" data-k="${k}" data-v="0">=</button><button type="button" class="${e.v>0?'on':''}" data-act="ever" data-k="${k}" data-v="1">+</button></span>
      <button type="button" class="x" data-act="edel" data-k="${k}" aria-label="Retirer">✕</button></li>`}).join('')||'<li class="muted small">Touche les exercices ci-dessous pour les ajouter.</li>'}</ol>
    ${W.f==='emom1'?`<div class="rangee"><label class="small" for="ed-dep">ou nombre exact</label><input id="ed-dep" class="num" type="number" min="1" max="15" value="${W.p.dep||3}" data-ed="dep"></div>`:''}
    <div class="zones">${[['','Toutes']].concat(Object.keys(ZONES).map(z=>[z,ZONES[z].nom])).map(z=>`<button type="button" class="${ED.zone===z[0]?'on':''}" data-act="ezone" data-v="${z[0]}">${esc(z[1])}</button>`).join('')}</div>
    <div class="mvs">${L.map(m=>`<div class="mvc"><button type="button" class="mvb" data-act="eadd" data-v="${m.id}"><span class="mv-v">${mvVisuel(m)}</span><b>${esc(m.nom)}</b>${m.aussi?`<i>${esc(m.aussi)}</i>`:''}<small>${m.z} · N${m.n}${m.m!=='pdc'?' · '+MATERIEL[m.m].court:''}</small></button>${boutonVideo(m.id,'sur-img')}</div>`).join('')}</div>
    <div class="rangee" style="margin-top:12px;justify-content:space-between"><button class="bt" type="button" data-act="fermer">Annuler</button><button class="bt orange" type="button" data-act="esave">Enregistrer le WOD</button></div>`,'large');
}

/* ----- Mon tableau personnel ----- */
function vMoi(){
  const E=elv(),T=tab(E.id),fcmax=T.age?220-(+T.age):null;
  const am=n=>{const r=rec(E.id,n,false);const W=r&&r.wods.find(w=>w.f==='amrap'&&w.fait);return W?CTL.score(W):'—'};
  return `<h2>Mon tableau personnel · ${esc(prenom(E.nom))}</h2>
  <section class="carte"><div class="grille2"><div><label class="ch" for="t-age">Âge</label><input id="t-age" class="num" type="number" min="13" max="25" value="${esc(T.age)}" data-t="age"></div>
    <div><label class="ch" for="t-fcr">FC de repos (allongé, 30 s × 2)</label><input id="t-fcr" class="num" type="number" min="35" max="120" value="${esc(T.fcRepos)}" data-t="fcRepos"></div></div>
    <p class="small">FC maximale estimée : <b>${fcmax||'—'}</b> <span class="muted">(220 − âge, à ± 10 battements)</span></p>
    <table class="tab-mini"><tr><th>Mobile</th><th>FC visée (épreuve)</th></tr><tr><td>${esc(MOBILES.mod.nom)}</td><td>${MOBILES.mod.fc}</td></tr><tr><td>${esc(MOBILES.elev.nom)}</td><td>${MOBILES.elev.fc}</td></tr></table></section>
  <section class="carte"><h3>Mon mobile</h3><select data-t="mobile" aria-label="Mon mobile"><option value="">— pas encore choisi —</option><option value="mod"${T.mobile==='mod'?' selected':''}>${esc(MOBILES.mod.nom)} (${esc(MOBILES.mod.sous)})</option><option value="elev"${T.mobile==='elev'?' selected':''}>${esc(MOBILES.elev.nom)} (${esc(MOBILES.elev.sous)})</option></select>
    <label class="ch" for="t-pq">Pourquoi ce choix (FC, ressentis, envie)</label><textarea id="t-pq" rows="2" data-t="pourquoi">${esc(T.pourquoi)}</textarea></section>
  <section class="carte"><h3>Mes charges de travail</h3><div class="grille2"><div><label class="ch" for="t-kb">Kettlebell ou haltère (kg)</label><input id="t-kb" class="num" type="number" min="0" max="40" value="${esc(T.kb)}" data-t="kb"></div>
    ${estTle()?`<div><label class="ch" for="t-dl">Soulevé de terre barre (kg)</label><input id="t-dl" class="num" type="number" min="0" max="150" value="${esc(T.dl)}" data-t="dl"></div><div><label class="ch" for="t-fs">Front squat (kg)</label><input id="t-fs" class="num" type="number" min="0" max="120" value="${esc(T.fs)}" data-t="fs"></div><div><label class="ch" for="t-pp">Push press (kg)</label><input id="t-pp" class="num" type="number" min="0" max="100" value="${esc(T.pp)}" data-t="pp"></div>`:''}</div>
    <p class="small muted">${esc(estTle()?CHARGES.t:CHARGES.p)}</p></section>
  <section class="carte"><h3>Mes tests</h3><p class="small">AMRAP séance 1 : <b>${esc(am(1))}</b> · séance 7 : <b>${esc(am(7))}</b></p></section>`;
}

/* ----- Jour J ----- */
function vJourJ(){
  const E=elv(),J=jj(E.id),mob=mobileDe(E.id,9),r9=rec(E.id,9,false),W=r9?r9.wods:[];
  const C=CTL.controleEpreuve(W,mob,MOUV);
  return `<h2>Mon épreuve · ${esc(prenom(E.nom))}</h2>
  <section class="carte"><p class="small">Le référentiel demande que le travail du jour J soit <b>préparé à la séance précédente</b> (séance 8) : mobile, WOD, exercices, niveaux, versions − et +, échauffement.</p>
    <p>Mobile : <b>${mob?esc(MOBILES[mob].nom)+' · FC '+MOBILES[mob].fc:'pas encore choisi'}</b></p>
    <ul class="ctrl">${C.map(c=>`<li class="${c[0]?'ok':'ko'}">${c[0]?'✓':'✗'} ${esc(c[1])}</li>`).join('')}</ul>
    <button class="bt orange" type="button" data-act="versj">Préparer mes WOD du jour J (séance 9)</button></section>
  <section class="carte"><h3>Répartition des points AFL2 / AFL3</h3><p class="small muted">AFL2 : mon carnet d’entraînement. AFL3 : mes rôles pour mon binôme.</p>
    <div class="rangee">${['6/2','4/4','2/6'].map(x=>`<button type="button" class="bt ${J.rep===x?'noir':''}" data-act="rep" data-v="${x}">${x}</button>`).join('')}</div></section>
  <section class="carte"><h3>Mon échauffement (4 étapes)</h3>${['Température (3 min)','Articulations (3 min)','Activation des muscles de mes WOD (3 min)','AMRAP en relais de 3 min avec mon binôme'].map((t,i)=>`<label class="ch" for="j-e${i}">${i+1}. ${t}</label><input id="j-e${i}" type="text" data-j="${i}" value="${esc(J.ech[i]||'')}">`).join('')}</section>`;
}

/* ----- Progrès ----- */
function vProgres(){
  const E=elv(),T=tab(E.id);
  const lignes=[...Array(NB_SEANCES)].map((_,k)=>{const n=k+1,r=rec(E.id,n,false);if(!r||!r.date&&!r.wods.length)return `<tr class="vide"><th>S${n}</th><td colspan="4" class="muted">—</td></tr>`;
    const mob=r.mobile||T.mobile;const F=r.wods.filter(w=>w.fait);
    return `<tr><th>S${n}</th><td>${F.map(w=>esc(CTL.titreWod(w))).join('<br>')||'<span class="muted">rien de fait</span>'}</td><td>${F.map(w=>esc(CTL.score(w))).join('<br>')}</td><td>${F.map(w=>pastFC(w.fc,mob)).join('<br>')}</td><td>${F.map(w=>w.ress?w.ress+'/4':'—').join('<br>')}</td></tr>`}).join('');
  const et=[2,5,8].map(n=>{const r=rec(E.id,n,false);return r&&r.etoile?GAREEPS.axes.map(a=>(r.etoile[a.id]||[]).length):null});
  return `<h2>Mes progrès · ${esc(prenom(E.nom))}</h2><div class="defile"><table class="prog"><tr><th></th><th>WOD</th><th>Résultat</th><th>FC</th><th>Ressenti</th></tr>${lignes}</table></div>
    <p class="small muted">FC : ✓ dans la fourchette de ton mobile, ↓ en dessous, ↑ au-dessus.</p>
    ${estG()?`<section class="carte"><h3>Mes étoiles</h3><div class="etoiles">${et.map((v,i)=>`<div><b>SCE ${i+1} · S${[2,5,8][i]}</b>${v?svgEtoile(v.map(x=>Math.max(x,0.05))):'<p class="muted small">pas encore</p>'}</div>`).join('')}</div></section>`:''}`;
}

/* ----- Envoi ----- */
function exportEleve(E,n){
  const r=(S.d[E.id]||{})[n];if(!r||(!r.date&&!r.wods.length))return null;
  const T=tab(E.id),J=jj(E.id);
  return {app:'cross-training-eleves',version:VERSION,activite:'Cross training',classe:S.classe,eleve:E.nom,seance:n,date:r.date||today(),exportedAt:new Date().toISOString(),
    parcours:pk(),mobile:r.mobile||T.mobile||'',dispense:!!r.disp,
    wods:r.wods.map(W=>({format:W.f,p:W.p,ordre:W.ordre||'v',special:!!W.special,preset:W.preset||'',titre:CTL.titreWod(W),
      exercices:(W.ex||[]).map(e=>{const m=mvById(e.m)||{};return {id:e.m,nom:m.nom||e.m,zone:m.z||'',niveau:m.n||null,version:e.v||0,reps:e.reps||0,noteExecution:e.note||null}}),
      fait:!!W.fait,res:W.res||null,fc:W.fc||null,ressenti:W.ress||null,regulations:W.regul||0,noRep:W.norep||0,score:W.fait?CTL.score(W):''})),
    etoile:r.etoile?{conception:(r.etoile.conc||[]).length,production:(r.etoile.prod||[]).length,analyse:(r.etoile.ana||[]).length,criteres:r.etoile}:null,
    axePrioritaire:r.axe||'',bilan:r.bilan||'',suite:r.suite||'',etirements:!!r.etire,
    roles:{supporter:!!(r.roles||{}).supporter,assistant:!!(r.roles||{}).assistant,coach:!!(r.roles||{}).coach},
    tableau:{age:+T.age||null,fcRepos:+T.fcRepos||null,mobile:T.mobile||'',pourquoi:T.pourquoi||'',charges:+T.kb||null,amrap:null,barre:estTle()?{souleveDeTerre:+T.dl||null,frontSquat:+T.fs||null,pushPress:+T.pp||null}:undefined},
    jourJ:n>=8?{repartition:J.rep||'',echauffement:J.ech||[]}:null,groupe:S.eleves.map(e=>e.nom)};
}
function fichiers(n){const L=[];S.eleves.forEach(E=>{const o=exportEleve(E,n);if(o)L.push({nom:CTL.nomFichier(S.classe,E.nom,n),o})});return L}
function vEnvoi(){
  const n=S.seance,F=fichiers(n),ev=S.envoi[n]||{},LET='ABC';
  const lignes=S.eleves.map((E,k)=>{const o=exportEleve(E,n);const nb=o?o.wods.filter(w=>w.fait).length:0;
    return `<li class="${o?'':'manque'}"><span class="lettre">${LET[k]}</span><span><b>${esc(E.nom)}</b><small>${o?(o.dispense?'dispensé(e) · ':'')+nb+' WOD fait'+(nb>1?'s':'')+(o.bilan?' · bilan écrit':''):'rien de saisi'}</small></span>${o?'<em>✓</em>':''}</li>`}).join('');
  const heure=t=>new Date(t).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  return `<h2>Fin de séance ${n}</h2><section class="carte"><h3>Ma séance du jour</h3><ul class="envoi">${lignes}</ul></section>
  <div class="gros">
    <button class="bt orange" type="button" data-act="enligne" ${F.length?'':'disabled'}>Envoyer ma séance du jour en ligne</button>${ev.fichier?`<p class="ok small">✓ envoyée à ${heure(ev.fichier)}</p>`:''}
    <button class="bt noir" type="button" data-act="qr" ${F.length?'':'disabled'}>Montrer le QR code</button>${ev.qr?`<p class="ok small">✓ QR montré à ${heure(ev.qr)}</p>`:''}
  </div>`;
}
let QRS=null;
function qrSvg(txt){return TTQR.svgQR(txt)}
async function montrerQR(i){
  if(!QRS){const F=fichiers(S.seance);QRS=[];for(const f of F){const k=S.eleves.findIndex(E=>E.nom===f.o.eleve);QRS.push({titre:'ABC'[k]+' · '+f.o.eleve,txt:await CTL.chaineQR(CTL.versQR(f.o))})}}
  const k=Math.max(0,Math.min(i,QRS.length-1)),Q=QRS[k];
  let svg;try{svg=qrSvg(Q.txt)}catch(e){svg='<p class="avert">Trop de données pour un QR : utilise l’envoi en ligne.</p>'}
  fen(`<h3>${esc(Q.titre)} · séance ${S.seance}</h3><p class="small muted">QR ${k+1} sur ${QRS.length}</p><div class="qrbox">${svg}</div>
    <div class="rangee" style="margin-top:12px;justify-content:space-between"><button class="bt" type="button" data-act="qrnav" data-v="${k-1}" ${k?'':'disabled'}>← Précédent</button>
    ${k<QRS.length-1?`<button class="bt noir" type="button" data-act="qrnav" data-v="${k+1}">Suivant →</button>`:`<button class="bt orange" type="button" data-act="qrfin">Terminé</button>`}</div>`);
}
function telecharger(nom,texte){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([texte],{type:'application/json'}));a.download=nom;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
async function enregistrerFichiers(){
  const F=fichiers(S.seance);if(!F.length)return false;
  const files=F.map(f=>new File([JSON.stringify(f.o,null,1)],f.nom,{type:'application/json'}));
  let ok=false;
  try{if(navigator.canShare&&navigator.canShare({files})){await navigator.share({files,title:'Cross training · séance '+S.seance});ok=true}}catch(e){if(e&&e.name==='AbortError')return false}
  if(!ok)for(const f of F){telecharger(f.nom,JSON.stringify(f.o,null,1));await new Promise(r=>setTimeout(r,400))}
  S.envoi[S.seance]=Object.assign(S.envoi[S.seance]||{},{fichier:Date.now()});sauver();rendre();return true;
}
function recevoirClasse(o){
  if(o.t!=='C')throw new Error('Ce n’est pas le QR de la classe.');
  const c={classe:o.c,eleves:o.l||[],lien:o.u||'',niv:o.n||'p',dem:o.m||'p'};
  ROOT.classes[o.c]=c;ecrireRoot();
  if(!S||(S.eleves.length&&S.classe&&S.classe!==o.c)){setTimeout(()=>{if(S)verrouiller().then(rendre);demanderCode('Nouveau binôme · '+o.c,'Choisissez un code secret de 4 chiffres. Retenez-le : il sera demandé à chaque cours.',x=>nouveauGroupe(o.c,x),true)},300);return 'Classe '+o.c+' enregistrée.'}
  S.cfg=JSON.parse(JSON.stringify(c));S.classe=o.c;sauver();rendre();
  return 'Classe '+o.c+' : '+(o.l||[]).length+' élèves.';
}

/* ---------- Fenêtres ---------- */
function fen(html,cl){$('#modal').innerHTML=`<div class="voile" data-act="fermerVoile"><div class="fen ${cl||''}" role="dialog" aria-modal="true">${html}</div></div>`}
function fermer(){$('#modal').innerHTML='';QRS=null;ED=null}
let toastT;function toast(t){clearTimeout(toastT);let d=$('.toast');if(!d){d=document.createElement('div');d.className='toast';d.setAttribute('role','status');document.body.appendChild(d)}d.textContent=t;toastT=setTimeout(()=>d.remove(),2600)}

/* ---------- Chrono ---------- */
function lancerWod(i){
  const E=elv(),n=S.seance,r=rec(E.id,n),W=r.wods[i];
  CHRONO.lancer(W,{athlete:E.nom,titreWod:CTL.titreWod(W),mv:mvById,visuel:mvVisuel,
    onFin(x){W.fait=true;W.res=x.res;W.fc=x.fc;W.ress=x.ressenti;W.regul=x.regulations;W.norep=x.noRep;W.ex.forEach((e,k)=>{e.v=x.versions[k];if(x.notes&&x.notes[k])e.note=x.notes[k];else delete e.note});
      touche(r);sauver();rendre();const mob=mobileDe(E.id,n),d=CTL.fcDans(x.fc,mob);
      toast(x.fc&&d!=null?(d===0?'FC dans la fourchette de ton mobile.':d<0?'FC sous la fourchette : monte d’un niveau ou d’une version.':'FC au-dessus : version − ou récupération plus longue.'):'WOD enregistré.')},
    onAnnule(){}});
}

/* ---------- Évènements ---------- */
document.addEventListener('click',async ev=>{
  const b=ev.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act,v=b.dataset.v;
  if(a==='fermerVoile'){if(ev.target===b)fermer();return}
  if(a==='choisir'){const g=ROOT.groupes[v];
    if(g.clair)demanderCode('Protéger votre carnet','Choisissez un code secret de 4 chiffres pour votre binôme.',c=>ouvrir(v,c),true);
    else demanderCode('Code de '+(g.noms||[]).join(' · '),'Tapez votre code secret à 4 chiffres.',c=>ouvrir(v,c),false);
    CODE_CB.id=v;return}
  if(a==='nouveau'){demanderCode('Nouveau binôme · '+v,'Choisissez un code secret de 4 chiffres. Retenez-le : il sera demandé à chaque cours, et un autre binôme ne pourra pas ouvrir votre carnet.',c=>nouveauGroupe(v,c),true);return}
  if(a==='codeok'){await validerCode();return}
  if(a==='codeoubli'){const id=CODE_CB&&CODE_CB.id;if(!id)return;
    fen(`<h3>Code oublié</h3><p>Sans le code, ce carnet ne peut pas être ouvert, même par le professeur.</p><p class="small">Supprimez-le et créez un nouveau binôme. Vos séances déjà envoyées sont chez le professeur.</p>
      <div class="rangee" style="justify-content:space-between"><button class="bt" type="button" data-act="fermer">Annuler</button><button class="bt danger" type="button" data-act="suppridoublie" data-v="${id}">Supprimer ce carnet</button></div>`);return}
  if(a==='suppridoublie'){delete ROOT.groupes[v];ecrireRoot();fermer();rendre();toast('Carnet supprimé.');return}
  if(a==='nouveauqr'||(a==='qrclasse'&&!S)){TTQR.scanner(async t=>recevoirClasse(await TTQR.decoder(t)),{titre:'QR de la classe',aide:'Scanne le QR affiché par le professeur.'});return}
  if(a==='changer'){const ne=S?nonEnvoyees():[];
    if(ne.length&&S.tab!=='envoi'){fen(`<h3>⚠ Séance ${ne.join(', ')} non envoyée</h3><p>Envoie-la au professeur avant de fermer le carnet.</p><div class="rangee" style="justify-content:space-between"><button class="bt" type="button" data-act="changerQuandMeme">Fermer quand même</button><button class="bt orange" type="button" data-act="tab" data-v="envoi">Envoyer</button></div>`);return}
    fermer();await verrouiller();rendre();window.scrollTo(0,0);return}
  if(a==='changerQuandMeme'){fermer();await verrouiller();rendre();return}
  if(a==='fermer'){fermer();return}
  if(!S)return;
  const E=elv(),n=S.seance;
  switch(a){
    case 'tab':fermer();S.tab=v;break;
    case 'groupe':S.tab='groupe';break;
    case 'seance':S.seance=+v;QRS=null;S.jours=S.jours||{};S.jours[today()]=S.seance;break;
    case 'qui':S.cur=+v;break;
    case 'qrclasse':TTQR.scanner(async t=>recevoirClasse(await TTQR.decoder(t)),{titre:'QR de la classe',aide:'Scanne le QR affiché par le professeur.'});return;
    case 'gvalider':{const L=[];
      for(let i=0;i<3;i++){const inp=$('#g-e'+i),nom=(inp.value||'').trim().replace(/\s+/g,' ');if(nom)L.push({id:inp.dataset.id||uid(),nom})}
      if(!L.length){toast('Choisis au moins un élève.');return}
      S.eleves=L;S.cur=0;S.tab='seance';toast('Binôme enregistré.');break}
    case 'sauvegarde':telecharger('Carnet_CT_'+(CTL.slug(S.classe)||'binome')+'_'+today()+'.json',JSON.stringify(Object.assign({carnetCT:1},S)));return;
    case 'toutEffacer':fen(`<h3>Supprimer ce binôme ?</h3><p>Toutes ses séances seront effacées de la tablette. Envoie d’abord tes séances au professeur.</p><div class="rangee" style="justify-content:space-between"><button class="bt" type="button" data-act="fermer">Annuler</button><button class="bt danger" type="button" data-act="effacerOui">Supprimer</button></div>`);return;
    case 'effacerOui':delete ROOT.groupes[ACTIF];S=null;ACTIF=null;CLEF=null;ecrireRoot();fermer();rendre();return;
    /* WOD */
    case 'wadd':ouvrirEditeur(-1);return;
    case 'wmod':ouvrirEditeur(+b.dataset.i);return;
    case 'wdel':{const r=rec(E.id,n),W=r.wods[+b.dataset.i];
      fen(`<h3>Supprimer ce WOD ?</h3><p>${esc(CTL.titreWod(W))}${W.fait?' (déjà fait : son résultat sera perdu)':''}</p><div class="rangee" style="justify-content:space-between"><button class="bt" type="button" data-act="fermer">Annuler</button><button class="bt danger" type="button" data-act="wdelOui" data-i="${b.dataset.i}">Supprimer</button></div>`);return}
    case 'wdelOui':{const r=rec(E.id,n);r.wods.splice(+b.dataset.i,1);touche(r);fermer();break}
    case 'go':lancerWod(+b.dataset.i);return;
    case 'wsuiv':S.seance=n+1;toast('Séance '+(n+1)+' : ajoute les WOD que tu prévois.');break;
    case 'versj':S.seance=9;S.tab='seance';break;
    case 'preset':{const p=CTL.PRESETS.find(x=>x.id===v);ED.W={id:uid(),preset:p.id,f:p.f,p:JSON.parse(JSON.stringify(p.p)),ordre:p.ordre||'v',special:!!p.special,ex:[],fait:false};peindreEditeur();return}
    case 'ordre':ED.W.ordre=v;peindreEditeur();return;
    case 'ezone':ED.zone=v;peindreEditeur();return;
    case 'etr':{const [e,r]=v.split('/').map(Number);ED.W.p.e=e;ED.W.p.r=r;peindreEditeur();return}
    case 'ecyc':ED.W.p.n=Math.max(1,Math.min(40,ED.W.p.n+(+v)));peindreEditeur();return;
    case 'emin':ED.W.p.min=+v;peindreEditeur();return;
    case 'eniv':ED.W.niv=+v;ED.W.ex.forEach(e=>e.reps=CTL.NIV_REPS[+v]);peindreEditeur();return;
    case 'edep':ED.W.p.dep=CTL.NIV_REPS[+v];peindreEditeur();return;
    case 'epal':{const n=+v;ED.W.p.pal=Array.from({length:n},(_,i)=>n-i);ED.W.preset={6:'fp1',8:'fp2',10:'fp3'}[n];peindreEditeur();return}
    case 'ecap':ED.W.p.cap=+v;peindreEditeur();return;
    case 'eadd':{const lib=ED.W.f==='tabata'||ED.W.f==='emom1'||(ED.W.f==='fortime'&&ED.W.p.pal);ED.W.ex.push({m:v,v:0,reps:lib?0:ED.W.niv!=null?CTL.NIV_REPS[ED.W.niv]:ED.W.f==='emom'?7:10});if(ED.W.f==='emom1'&&ED.W.ex.length>1)ED.W.ex.shift();peindreEditeur();const l=document.querySelector('.ed-liste');if(l)l.scrollIntoView({block:'nearest'});return}
    case 'edel':ED.W.ex.splice(+b.dataset.k,1);peindreEditeur();return;
    case 'ever':ED.W.ex[+b.dataset.k].v=+v;peindreEditeur();return;
    case 'esave':{if(!ED.W.ex.length){toast('Ajoute au moins un exercice.');return}
      const r=rec(E.id,n);if(ED.i>=0){const old=r.wods[ED.i];if(old.fait&&JSON.stringify(old.ex.map(e=>e.m))!==JSON.stringify(ED.W.ex.map(e=>e.m)))ED.W.fait=false;r.wods[ED.i]=ED.W}else r.wods.push(ED.W);
      touche(r);fermer();toast('WOD enregistré.');break}
    case 'rep':jj(E.id).rep=v;modif(9);modif(8);break;
    case 'qr':QRS=null;await montrerQR(0);return;
    case 'qrnav':await montrerQR(+v);return;
    case 'qrfin':S.envoi[n]=Object.assign(S.envoi[n]||{},{qr:Date.now()});fermer();break;
    case 'enligne':{
      if(!lienEnvoi()){fen(`<h3>Envoi en ligne</h3><p>L’envoi en ligne n’est pas encore activé par le professeur.</p><p><b>Montre ton QR code</b> au professeur à la place.</p><div class="rangee" style="justify-content:space-between"><button class="bt" type="button" data-act="fermer">Fermer</button><button class="bt noir" type="button" data-act="qr">Montrer le QR code</button></div>`);return}
      const ok=await enregistrerFichiers();if(!ok)return;
      fen(`<h3>Dernière étape</h3><p>Les fichiers de la séance sont prêts. Touche « Déposer », puis choisis-les dans Téléchargements (ou Fichiers).</p><div class="rangee" style="justify-content:space-between"><button class="bt" type="button" data-act="fermer">Fermer</button><a class="bt orange" href="${esc(lienEnvoi())}" target="_blank" rel="noopener" data-act="fermer">Déposer</a></div>`);return}
    default:return;
  }
  sauver();rendre();
});
document.addEventListener('change',async ev=>{
  const t=ev.target;
  if(t.id==='reprise'&&t.files[0]){
    try{const o=JSON.parse(await t.files[0].text());if(!o.carnetCT||!o.v)throw 0;delete o.carnetCT;if(o.cfg)ROOT.classes[o.cfg.classe]=o.cfg;
      await verrouiller();const id=uid();ROOT.groupes[id]={classe:o.classe||'',noms:(o.eleves||[]).map(e=>prenom(e.nom)),clair:o};ecrireRoot();rendre();toast('Carnet repris : choisissez-le et donnez-lui un code.')}
    catch(e){toast('Ce fichier n’est pas un carnet de cross training.')}
    return}
  if(!S||!S.eleves.length)return;
  const E=elv(),n=S.seance;
  if(t.dataset.t){const T=tab(E.id);T[t.dataset.t]=t.value;modif();sauver();if(t.tagName==='SELECT')rendre();return}
  if(t.dataset.ed&&ED){const val=+t.value||0;if(t.dataset.ed==='reps')ED.W.ex[+t.dataset.k].reps=val;else if(t.dataset.ed==='min')ED.W.p.min=Math.max(1,val);else if(t.dataset.ed==='dep')ED.W.p.dep=Math.max(1,val);return}
  const c=t.dataset.ch;if(!c)return;
  const r=rec(E.id,n);
  switch(c){
    case 'disp':r.disp=t.checked;break;
    case 'mobile':r.mobile=t.value;if(!tab(E.id).mobile&&t.value)tab(E.id).mobile=t.value;break;
    case 'role':r.roles=r.roles||{};r.roles[t.dataset.k]=t.checked;break;
    case 'etire':r.etire=t.checked;break;
    case 'crit':{r.etoile=r.etoile||{};const L=r.etoile[t.dataset.k]||(r.etoile[t.dataset.k]=[]),i=+t.dataset.i;if(t.checked&&!L.includes(i))L.push(i);if(!t.checked)r.etoile[t.dataset.k]=L.filter(x=>x!==i);break}
    case 'axe':r.axe=t.value;break;
    default:return;
  }
  touche(r);sauver();rendre();
});
document.addEventListener('keydown',ev=>{if(ev.target&&ev.target.id==='code'&&ev.key==='Enter'){ev.preventDefault();validerCode()}});
document.addEventListener('input',ev=>{
  const t=ev.target;if(!S||!S.eleves.length)return;
  const E=elv(),n=S.seance;
  if(t.dataset.j!=null){const J=jj(E.id);J.ech[+t.dataset.j]=t.value;modif(9);sauver();return}
  if(t.dataset.t&&t.tagName!=='SELECT'){tab(E.id)[t.dataset.t]=t.value;modif();sauver();return}
  const c=t.dataset.ch;if(c!=='bilan'&&c!=='suite')return;
  const r=rec(E.id,n);r[c]=t.value;touche(r);sauver();
});
rendre();
