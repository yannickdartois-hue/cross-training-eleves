/* =====================================================================
   logique.js — calculs sans affichage (WOD, analyse, fichiers, QR)
   Cross training · appli élève et outil prof · Lycée Georges Pompidou
   Fichier COMMUN : garder la même version dans cross-training-eleves et cross-training-prof.
   ===================================================================== */
(function(root){
'use strict';
const VERSION_DONNEES=1;

/* Parcours du cycle (cross-training-donnees.js) selon le niveau de la classe et la démarche choisie par le prof */
function parcours(niv,dem){return niv==='t'?(dem==='g'?'h':'t'):(dem==='g'?'g':'p')}
const NOM_NIV={p:'Première',t:'Terminale'},NOM_DEM={p:'progressive',g:'GAREEPS'};

/* ---------- Formats et réglages tout prêts (référentiel du lycée) ---------- */
// f : tabata | emom | amrap | fortime | emom1 ; p : paramètres ; nb : nombre d'exercices conseillé ; mob : mobile ; ep : format de l'épreuve
const PRESETS=[
 {id:'tm1',nom:'TABATA modéré N1',f:'tabata',p:{e:30,r:30,n:8},nb:4,ordre:'v',mob:'mod',ep:1,aide:'2 × 4 exercices, 3 N2 + 1 N1 · 8 min'},
 {id:'tm2',nom:'TABATA modéré N2',f:'tabata',p:{e:30,r:20,n:10},nb:5,ordre:'v',mob:'mod',ep:1,aide:'2 × 5 exercices, 3 N2 + 2 N1 · 8 min 20'},
 {id:'tm3',nom:'TABATA modéré N3',f:'tabata',p:{e:25,r:15,n:12},nb:4,ordre:'v',mob:'mod',ep:1,aide:'3 × 4 exercices, 3 N2 + 1 N1 · 8 min'},
 {id:'em8',nom:'EMOM modéré 8 min',f:'emom',p:{min:8},nb:3,mob:'mod',ep:1,aide:'3 à 4 exercices enchaînés, 7 répétitions minimum'},
 {id:'te1',nom:'TABATA élevé N1',f:'tabata',p:{e:20,r:20,n:8},nb:4,ordre:'v',mob:'elev',ep:1,aide:'2 × 4 exercices · 5 min 20'},
 {id:'te2',nom:'TABATA élevé N2',f:'tabata',p:{e:25,r:15,n:8},nb:2,ordre:'v',mob:'elev',ep:1,aide:'4 × 2 exercices · 5 min 20'},
 {id:'te3',nom:'TABATA élevé N3',f:'tabata',p:{e:20,r:10,n:10},nb:5,ordre:'v',mob:'elev',ep:1,aide:'2 × 5 exercices · 5 min'},
 {id:'ts',nom:'TABATA spécial (une zone)',f:'tabata',p:{e:20,r:10,n:10},nb:5,ordre:'v',mob:'elev',ep:1,special:1,aide:'une seule zone : INF, SUP, TRONC ou CARDIO'},
 {id:'em5',nom:'EMOM élevé 5 min',f:'emom',p:{min:5},nb:3,mob:'elev',ep:1,aide:'3 à 4 exercices de niveau 3'},
 {id:'t0',nom:'TABATA découverte 20/10 × 8',f:'tabata',p:{e:20,r:10,n:8},nb:2,ordre:'v',libre:1,aide:'le Tabata d’origine · 4 min'},
 {id:'tl',nom:'TABATA à régler',f:'tabata',p:{e:30,r:10,n:8},nb:4,ordre:'v',libre:1,aide:'effort/repos au choix (20/10, 30/10, 40/20, 45/15…) et 1 à 40 cycles'},
 {id:'t20',nom:'TABATA 20/20 × 8',f:'tabata',p:{e:20,r:20,n:8},nb:4,ordre:'v',libre:1,aide:'5 min 20'},
 {id:'em6',nom:'EMOM 6 min',f:'emom',p:{min:6},nb:2,aide:'au top de chaque minute'},
 {id:'am6',nom:'AMRAP 6 min',f:'amrap',p:{min:6},nb:3,aide:'le plus de tours possible'},
 {id:'am8',nom:'AMRAP 8 min',f:'amrap',p:{min:8},nb:3,aide:'le plus de tours possible'},
 {id:'fp1',nom:'FOR TIME paliers N1 (6 → 1)',f:'fortime',p:{pal:[6,5,4,3,2,1],cap:0},nb:3,aide:'6 rép. de chaque exercice, puis 5, 4… jusqu’à 1 · 21 rép. par exercice'},
 {id:'fp2',nom:'FOR TIME paliers N2 (8 → 1)',f:'fortime',p:{pal:[8,7,6,5,4,3,2,1],cap:0},nb:3,aide:'8, 7, 6… jusqu’à 1 · 36 rép. par exercice'},
 {id:'fp3',nom:'FOR TIME paliers N3 (10 → 1)',f:'fortime',p:{pal:[10,9,8,7,6,5,4,3,2,1],cap:0},nb:3,aide:'10, 9, 8… jusqu’à 1 · 55 rép. par exercice'},
 {id:'ft',nom:'FOR TIME 3 tours',f:'fortime',p:{tours:3,cap:6},nb:3,aide:'le plus vite possible, 6 min maximum'},
 {id:'e1',nom:'EMOM+1',f:'emom1',p:{min:10,dep:6},nb:1,aide:'une répétition de plus chaque minute'}
];
// Réglages repris de l'appli chrono « cross-training-pompidou »
const NIV_REPS=[4,6,8,10,12]; // N0 à N4 : répétitions par exercice (AMRAP, EMOM) ou au départ (EMOM+1)
const TABATA_REGLAGES=[[20,10],[30,10],[20,20],[40,20],[10,20],[30,30],[45,15]];
const somme=a=>(a||[]).reduce((x,y)=>x+y,0);
const NOM_F={tabata:'TABATA',emom:'EMOM',amrap:'AMRAP',fortime:'FOR TIME',emom1:'EMOM+1'};
function dureeS(W){const p=W.p||{};
  if(W.f==='tabata')return p.n*(p.e+p.r);
  if(W.f==='emom'||W.f==='emom1'||W.f==='amrap')return p.min*60;
  if(W.f==='fortime')return p.pal?(p.cap||0)*60:(p.cap||6)*60;
  return 0}
const mmss=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+' min'+(s%60?' '+String(s%60).padStart(2,'0'):'')};
function titreWod(W){const p=W.p||{};
  if(W.f==='tabata')return 'TABATA '+p.e+'/'+p.r+' × '+p.n;
  if(W.f==='emom')return 'EMOM '+p.min+' min';
  if(W.f==='emom1')return 'EMOM+1 '+p.min+' min (départ '+(p.dep||3)+')';
  if(W.f==='amrap')return 'AMRAP '+p.min+' min';
  if(W.f==='fortime')return p.pal?'FOR TIME '+p.pal[0]+' → '+p.pal[p.pal.length-1]+(p.cap?' (cap '+p.cap+' min)':''):'FOR TIME '+(p.tours||3)+' tours';
  return W.f}
// Exercice du round i d'un Tabata (vertical : 1,2,3,4,1,2… ; horizontal : 1,1,2,2…)
function exoDuRound(W,i){const k=(W.ex||[]).length||1;
  if(W.ordre==='h'){const par=Math.max(1,Math.round((W.p.n||8)/k));return Math.min(k-1,Math.floor(i/par))}
  return i%k}

/* ---------- Analyse d'un WOD ---------- */
const FOURCHETTE={mod:[140,160],elev:[160,180]};
function fcDans(fc,mob){if(!fc||!FOURCHETTE[mob])return null;const [a,b]=FOURCHETTE[mob];return fc<a?-1:fc>b?1:0}
// EMOM : niveau lu sur le temps restant moyen (N1 > 30 s, N2 20-30 s, N3 10-20 s ; < 10 s = trop dur)
function niveauEmom(rest){const L=(rest||[]).filter(x=>x!=null);if(!L.length)return null;
  const m=L.reduce((a,b)=>a+b,0)/L.length;return {moy:Math.round(m),niv:m>30?1:m>=20?2:m>=10?3:0,rate:L.filter(x=>x<=0).length}}
// Tabata : régularité des rounds (écart entre le meilleur et le moins bon)
function regularite(rounds){const L=(rounds||[]).filter(x=>x!=null);if(L.length<2)return null;return {min:Math.min(...L),max:Math.max(...L),ecart:Math.max(...L)-Math.min(...L),total:L.reduce((a,b)=>a+b,0)}}
function score(W){const r=W.res||{};
  if(W.f==='tabata'){const g=regularite(r.rounds);return g?g.total+' rép. ('+g.min+' à '+g.max+' par round)':''}
  if(W.f==='emom'){const n=niveauEmom(r.restants);return n?'repos moyen '+n.moy+' s'+(n.niv?' (N'+n.niv+')':' (trop dur)'):''}
  if(W.f==='emom1')return r.derniere?'dernière minute réussie : '+r.derniere+' ('+((W.p.dep||3)+r.derniere-1)+' rép.)':'';
  if(W.f==='amrap')return r.tours!=null?r.tours+' tours + '+(r.plus||0):'';
  if(W.f==='fortime'){const nb=W.p&&W.p.pal?W.p.pal.length:(W.p&&W.p.tours)||3;
    if(r.temps&&(r.tours==null||r.tours>=nb))return mmss(r.temps)+(r.norep?' + '+r.norep*5+' s de no rep':'');
    if(r.tours!=null)return (W.p&&W.p.pal?'paliers':'tours')+' faits : '+r.tours+' / '+nb+(W.p&&W.p.cap&&r.temps?' (cap atteint)':'');
    return ''}
  return ''}

/* ---------- Contrôle du projet de l'épreuve (référentiel) ---------- */
function controleEpreuve(wods,mob,MOUV){
  const W=(wods||[]).filter(w=>w.ex&&w.ex.length),L=[],ids=new Set(),zones=new Set();
  W.forEach(w=>w.ex.forEach(e=>{ids.add(e.m);const m=MOUV.find(x=>x.id===e.m);if(m)zones.add(m.z)}));
  const ta=W.filter(w=>w.f==='tabata'),em=W.filter(w=>w.f==='emom');
  if(mob==='mod'){
    L.push([ta.length===1&&em.length===1,'1 TABATA et 1 EMOM ('+ta.length+' TABATA, '+em.length+' EMOM)']);
    L.push([ids.size>=6&&ids.size<=8,'6 à 8 exercices différents ('+ids.size+')']);
    L.push([zones.size===4,'les 4 zones : INF, SUP, TRONC, CARDIO ('+[...zones].join(', ')+')']);
    L.push([em.every(w=>(w.reps||7)>=7),'EMOM : 7 répétitions minimum']);
  }else if(mob==='elev'){
    L.push([ta.length===2&&em.length===1,'2 TABATA et 1 EMOM ('+ta.length+' TABATA, '+em.length+' EMOM)']);
    L.push([ta.some(w=>w.special),'un des TABATA est « le spécial » (une seule zone)']);
    L.push([ids.size>=8&&ids.size<=10,'8 à 10 exercices différents ('+ids.size+')']);
    const n3=W.reduce((a,w)=>a+w.ex.filter(e=>{const m=MOUV.find(x=>x.id===e.m);return m&&m.n===3}).length,0);
    L.push([n3>=4,'exercices de niveau 3 ('+n3+')']);
  }else L.push([false,'choisis d’abord ton mobile']);
  const sp=ta.find(w=>w.special);
  if(sp){const z=new Set(sp.ex.map(e=>{const m=MOUV.find(x=>x.id===e.m);return m&&m.z}));L.push([z.size===1,'le spécial n’a qu’une zone ('+[...z].join(', ')+')'])}
  return L;
}

/* ---------- Noms de fichiers ---------- */
function slug(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]+/g,'').slice(0,24)}
function nomFichier(classe,eleve,seance){
  const parts=String(eleve||'').trim().split(/\s+/),prenom=parts[0]||'',nom=parts.slice(1).join(' ');
  const who=slug(nom?nom:prenom)+(nom?slug(prenom).slice(0,1).toUpperCase():'');
  return 'CT_'+(slug(classe)||'Classe')+'_'+(who||'Eleve')+'_S'+seance+'.json';
}

/* ---------- QR : version compacte d'un fichier de séance ---------- */
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s};
const FCODE={tabata:'t',emom:'e',amrap:'a',fortime:'f',emom1:'p'},FDECODE={t:'tabata',e:'emom',a:'amrap',f:'fortime',p:'emom1'};
function versQR(o){
  const q={a:'CTE',v:1,c:o.classe,e:o.eleve,s:o.seance,d:o.date,ts:Math.round(Date.now()/1000),k:o.parcours||''};
  if(o.mobile)q.m=o.mobile;if(o.dispense)q.dp=1;
  q.w=(o.wods||[]).map(w=>[FCODE[w.format]||w.format,w.p,w.ordre==='h'?1:0,(w.exercices||[]).map(e=>[e.id,e.version||0,e.reps||0,e.noteExecution||0]),w.fait?1:0,w.res||0,w.fc||0,w.ressenti||0,w.regulations||0,w.noRep||0,w.special?1:0,w.preset||'']);
  if(o.etoile)q.et=[o.etoile.conception||0,o.etoile.production||0,o.etoile.analyse||0];
  if(o.axePrioritaire)q.ax=o.axePrioritaire;
  if(o.bilan)q.b=cut(o.bilan,160);if(o.suite)q.su=cut(o.suite,160);
  if(o.etirements)q.st=1;
  if(o.roles)q.r=[o.roles.supporter?1:0,o.roles.assistant?1:0,o.roles.coach?1:0];
  if(o.tableau){const t=o.tableau;q.tp=[t.age||0,t.fcRepos||0,t.mobile||'',cut(t.pourquoi,80),t.charges||0,t.amrap||0]}
  if(o.jourJ){const j=o.jourJ;q.jj=[j.repartition||'',(j.echauffement||[]).map(x=>cut(x,60))]}
  if(o.groupe&&o.groupe.length>1)q.gr=o.groupe.map(n=>cut(n,40));
  return q;
}
// Objet compact du QR → même forme que le fichier (pour l'outil prof)
function depuisQR(q){
  const o={app:'cross-training-eleves',classe:q.c,eleve:q.e,seance:q.s,date:q.d,ts:q.ts,parcours:q.k||'',mobile:q.m||'',dispense:!!q.dp,source:'qr',
    wods:(q.w||[]).map(a=>({format:FDECODE[a[0]]||a[0],p:a[1],ordre:a[2]?'h':'v',exercices:(a[3]||[]).map(e=>({id:e[0],version:e[1],reps:e[2],noteExecution:e[3]||null})),fait:!!a[4],res:a[5]||null,fc:a[6]||null,ressenti:a[7]||null,regulations:a[8]||0,noRep:a[9]||0,special:!!a[10],preset:a[11]||''})),
    etoile:q.et?{conception:q.et[0],production:q.et[1],analyse:q.et[2]}:null,axePrioritaire:q.ax||'',bilan:q.b||'',suite:q.su||'',etirements:!!q.st,
    roles:q.r?{supporter:!!q.r[0],assistant:!!q.r[1],coach:!!q.r[2]}:null,
    tableau:q.tp?{age:q.tp[0]||null,fcRepos:q.tp[1]||null,mobile:q.tp[2]||'',pourquoi:q.tp[3]||'',charges:q.tp[4]||null,amrap:q.tp[5]||null}:null,
    jourJ:q.jj?{repartition:q.jj[0]||'',echauffement:q.jj[1]||[]}:null,groupe:q.gr||[]};
  return o;
}
function b64url(bytes){let s='';for(let i=0;i<bytes.length;i++)s+=String.fromCharCode(bytes[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function chaineQR(q){
  const raw=new TextEncoder().encode(JSON.stringify(q));
  try{if(typeof CompressionStream==='function'){const buf=await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();return 'CTE1:'+b64url(new Uint8Array(buf))}}catch(e){}
  return 'CTE0:'+b64url(raw);
}

function decrireWod(w,MOUV){
  const W={f:w.format||w.f,p:w.p||{}},ps=PRESETS.find(x=>x.id===w.preset);
  const ex=(w.exercices||[]).map(e=>{const m=MOUV.find(x=>x.id===e.id)||{};return {nom:e.nom||m.nom||e.id,zone:e.zone||m.z||'',niveau:e.niveau||m.n||null,version:e.version||0,reps:e.reps||0,note:e.noteExecution||null}});
  return {titre:titreWod(W),format:ps?ps.nom:'',duree:dureeS(W),ex};
}
root.CTL={NIV_REPS,TABATA_REGLAGES,somme,decrireWod,VERSION_DONNEES,parcours,NOM_NIV,NOM_DEM,PRESETS,NOM_F,dureeS,mmss,titreWod,exoDuRound,FOURCHETTE,fcDans,niveauEmom,regularite,score,controleEpreuve,slug,nomFichier,versQR,depuisQR,chaineQR};
})(typeof window!=='undefined'?window:globalThis);
