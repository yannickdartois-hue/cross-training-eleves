/* Tests de l'appli élève (et de la réception côté prof).
   Lancer depuis le dossier qui contient les dépôts cross-training-eleves et cross-training-prof :
     node cross-training-eleves/tests/eleve.test.js
   Il faut Node et Playwright (npm i playwright). Les serveurs locaux sont démarrés par le test. */
const {chromium}=require('playwright');const {spawn}=require('child_process');const path=require('path');const fs=require('fs');
const RACINE=path.resolve(__dirname,'..'),PROF=path.resolve(RACINE,'../cross-training-prof');
let ok=0,ko=0;
/* Un bouton par format (replié sous « Autres formats » s'il n'est pas prévu ce jour), puis la version dans l'éditeur */
const choisir=async(p,id)=>{const fm=await p.evaluate(id=>{document.querySelectorAll('details.autres-formats').forEach(d=>d.open=true);return CTL.PRESETS.find(x=>x.id===id).f},id);
  await p.click(`[data-act=fmt][data-v=${fm}] >> visible=true`);
  if(await p.evaluate(id=>ED.W.preset!==id,id))await p.click(`[data-act=evar][data-v=${id}]`)};
const verif=(c,t)=>{if(c){ok++;console.log('  ✓ '+t)}else{ko++;console.log('  ✗ '+t)}};
const serveur=(dir,port)=>spawn('python3',['-m','http.server',String(port)],{cwd:dir,stdio:'ignore'});
(async()=>{
 const S=[serveur(RACINE,8781)];if(fs.existsSync(PROF))S.push(serveur(PROF,8782));await new Promise(r=>setTimeout(r,800));
 const b=await chromium.launch();const errs=[];
 try{
 const ctx=await b.newContext({viewport:{width:1024,height:900},acceptDownloads:true});const p=await ctx.newPage();
 p.on('pageerror',e=>errs.push(e.message));await p.clock.install();
 await p.goto('http://localhost:8781/index.html');await p.waitForTimeout(300);
 await p.click('[data-act=demo]');await p.waitForTimeout(2500);
 console.log('Fonctions communes');
 const u=await p.evaluate(()=>({c:CTL.critDecode(CTL.critCode([0,1,null])),o:CTL.critDecode(13),f:[CTL.nomFichier('1G5','Léa MARTIN',1),CTL.nomFichier('1G5','Louis MARTIN',1)]}));
 verif(JSON.stringify(u.c)==='[0,1,null]','critère non observé transmis comme « non observé » (pas comme raté)');
 verif(JSON.stringify(u.o)==='[1,0,1]','ancien codage des critères toujours lu');
 verif(u.f[0]!==u.f[1],'deux élèves de même nom : fichiers différents ('+u.f.join(', ')+')');
 console.log('Conception vérifiée dans l’éditeur');
 await p.selectOption('#mob','mod');await p.waitForTimeout(100);
 await p.click('[data-act=wadd]');await choisir(p,'em8');
 await p.click('[data-act=eadd][data-v=chaise]');await p.click('[data-act=eadd][data-v=squat]');
 let L=await p.$$eval('.ctrl.live li',x=>x.map(e=>e.className+' '+e.textContent));
 verif(L.some(t=>/^ko .*3 à 4 exercices/.test(t)),'EMOM à 2 exercices signalé');
 verif(L.some(t=>/^ko .*niveau 2/.test(t)),'exercice de niveau 1 signalé en EMOM modéré');
 verif(L.some(t=>/il manque/.test(t)),'zones manquantes indiquées');
 await p.click('[data-act=fermer]');
 console.log('Décision appliquée');
 const lancer=async(rpe,regle,ver)=>{await p.click('[data-act=wadd]');await choisir(p,'am6');await p.click('[data-act=eadd][data-v=squat]');await p.click('[data-act=eadd][data-v=pompe]');
   if(ver)await p.click('[data-act=ever][data-k="0"][data-v="-1"]');await p.click('[data-act=esave]');
   const go=await p.$$('[data-act=go]');await go[go.length-1].click();await p.click('[data-ch2=go]');await p.clock.runFor(8000);await p.click('[data-ch=amok]');
   await p.click('[data-ch=stop]');await p.click('[data-ch=stop]');await p.fill('#ch-fc','172');await p.dispatchEvent('#ch-fc','input');
   await p.click(`[data-ch=rpe][data-v="${rpe}"]`);await p.click(`[data-ch=regle][data-v=${regle}]`);await p.click('[data-ch=enreg]');await p.waitForTimeout(150);
   if(await p.$('[data-act=tour]'))await p.click('[data-act=tour] >> nth=-1')};
 await lancer(9,'baisse',false);await lancer(6,'garde',true);
 await p.click('[data-act=go] >> nth=0');await p.click('[data-ch2=go]');await p.clock.runFor(5000);await p.click('[data-ch=stop]');await p.click('[data-ch=stop]');
 await p.fill('#ch-fc','400');await p.dispatchEvent('#ch-fc','input');verif(/FC possible/.test(await p.textContent('.ch-indic')),'FC impossible (400) refusée');
 await p.click('[data-ch=annuler]');await p.click('[data-ch=annuler]');
 const cartes=await p.$$eval('.wod',x=>x.map(e=>e.innerText));
 verif(/Décision d’avant .*baisser.*✓ appliquée/s.test(cartes[cartes.length-1]),'« je baisse » puis version − : appliquée');
 const ex=await p.evaluate(()=>exportEleve(elv(),S.seance).wods.pop().suiviDecision);verif(ex&&ex.resultat==='oui','suiviDecision exporté');
 console.log('Chrono : écran stable');
 {const go=await p.$$('[data-act=go]');await go[0].click();await p.click('[data-ch2=go]');await p.clock.runFor(4000);
  const b1=await p.$('[data-ch=amok],[data-ch=plus],[data-ch=seqok]');await p.clock.runFor(3000);verif(b1&&await b1.evaluate(e=>e.isConnected),'les boutons du chrono ne sont pas redessinés chaque seconde (aucun appui perdu)');
  await p.click('[data-ch=stop]');await p.click('[data-ch=stop]');await p.click('[data-ch=annuler]');await p.click('[data-ch=annuler]')}
 console.log('Courbes de progrès');
 await p.click('[data-act=tab][data-v=progres]');verif(await p.$$eval('.courbe .cb-p',x=>x.length)>=2,'courbe de FC dessinée');
 verif(!!await p.$('.cb-barres'),'barres du test AMRAP');
 console.log('QR découpé');
 await p.evaluate(()=>{const r=rec(elv().id,S.seance);const al=n=>Array.from({length:n},()=>'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random()*26)]).join('');for(let k=0;k<7;k++){const W=JSON.parse(JSON.stringify(r.wods[r.wods.length-1]));W.id=uid();W.fc=150+k;W.com=al(70);W.conseil=al(60);r.wods.push(W)}});
 await p.click('[data-act=tab][data-v=envoi]');await p.click('[data-act=qr]');await p.waitForTimeout(800);
 const Q=await p.evaluate(()=>QRS.map(x=>({t:x.titre,n:x.txt.length,txt:x.txt})));
 verif(Q.some(q=>/partie 1\/\d/.test(q.t)),'séance chargée découpée en parties ('+Q.map(q=>q.n).join(', ')+' car.)');
 verif(Q.every(q=>q.n<=760),'chaque QR reste sous le seuil');
 console.log('Sauvegarde chiffrée automatique');
 const dl=p.waitForEvent('download');for(let k=0;k<Q.length-1;k++)await p.click('[data-act=qrnav] >> nth=-1');await p.click('[data-act=qrfin]');
 const d=await dl;const f=path.join(__dirname,'sauvegarde-test.json');await d.saveAs(f);const txt=fs.readFileSync(f,'utf8');
 verif(/^CT_carnet_DEMO_AD-BD_/.test(d.suggestedFilename()),'nom de fichier sans nom complet : '+d.suggestedFilename());
 verif(!/DÉMO|Alice|Bruno/.test(txt.replace(/"noms":\[[^\]]*\]/,'')),'aucun nom en clair hors prénoms de l’accueil');
 const nbWod=await p.evaluate(()=>rec(elv().id,S.seance).wods.length);
 await p.evaluate(()=>{const id=ACTIF;S=null;ACTIF=null;CLEF=null;delete ROOT.groupes[id];ecrireRoot();rendre()});
 verif(!!await p.$('#reprise'),'« Reprendre un carnet » sur l’accueil (tablette vidée)');await p.setInputFiles('#reprise',f);
 await p.waitForTimeout(400);const id=JSON.parse(txt).id;
 verif(await p.evaluate(id=>!!ROOT.groupes[id],id),'carnet repris depuis le fichier');
 await p.evaluate(async id=>{await ouvrir(id,'0000');rendre()},id);verif(await p.evaluate(()=>rec(elv().id,S.seance).wods.length)===nbWod,'contenu intact après reprise (code 0000)');
 fs.unlinkSync(f);
 if(fs.existsSync(PROF)){console.log('Réception par l’outil prof');
  const q=await b.newPage();q.on('pageerror',e=>errs.push(e.message));await q.goto('http://localhost:8782/index.html');await q.waitForTimeout(300);await q.click('[data-act=tab][data-v=recevoir]');
  const A=Q.filter(x=>x.t.startsWith('A'));const msg=[];for(const x of A.reverse()){await q.fill('#qrtxt',x.txt);await q.click('[data-act=qrtxt]');await q.waitForTimeout(150);msg.push(await q.textContent('.toast'))}
  verif(/il manque la partie/.test(msg[0]),'première partie gardée en attente');verif(/Reçu.*\(\d QR\)/.test(msg[msg.length-1]),'séance recollée : '+msg[msg.length-1]);
  const n=await q.evaluate(()=>Object.values(DB.rec).find(r=>/Alice/.test(r.eleve)).wods.length);verif(n===nbWod,'tous les WOD reçus ('+n+')')}
 }catch(e){ko++;console.log('ERREUR '+e.message.split('\n')[0])}
 verif(!errs.length,'aucune erreur JavaScript'+(errs.length?' : '+errs.join(' | '):''));
 await b.close();S.forEach(s=>s.kill());console.log(`\n${ok} réussis, ${ko} échoués`);process.exit(ko?1:0)})();
