/* donnees.js — copie de cycle-cross-training/cross-training-donnees.js, enfermée dans une fonction.
   Ne pas modifier ici : modifier le cycle, puis relancer emballer.py. */
(function(){
/* Données du cycle de cross training CA5 (Lycée G. Pompidou) : mouvements, formats, mobiles, référentiel,
   séances de Première et de Terminale en deux démarches (progressive, GAREEPS), banque, échauffements, schémas.
   Partagées par l'écran de cours (index.html) et l'outil complet (outils.html). */
/* ================== DONNÉES DU CYCLE CROSS TRAINING CA5 ================== */
const DUREE = 75;

/* ---------- Matériel ----------
   En Première : poids de corps, banc, box, kettlebell ou haltère léger. En Terminale : on ajoute la barre. */
const MATERIEL = {
  pdc:{nom:"Poids de corps", court:"PDC"},
  banc:{nom:"Banc", court:"Banc"},
  box:{nom:"Box", court:"Box"},
  kb:{nom:"Kettlebell", court:"KB"},
  halt:{nom:"Haltères", court:"Halt."},
  barre:{nom:"Barre", court:"Barre"},
  elast:{nom:"Élastique", court:"Élast."},
  fixe:{nom:"Barre de traction", court:"Traction"}
};
const CHARGES = {
  p:"Première · kettlebell ou haltère : 4 à 8 kg (filles), 8 à 12 kg (garçons) pour le goblet squat, le soulevé de terre et le swing russe. On commence toujours plus léger que ce que l’élève croit pouvoir faire.",
  t:"Terminale · barre seule (10 à 15 kg) tant que la technique n’est pas validée par le professeur ; ensuite 15 à 25 kg (filles), 20 à 35 kg (garçons) au soulevé de terre et au front squat, plus léger au push press et au thruster."
};

/* ---------- Zones corporelles et niveaux (référentiel du lycée) ---------- */
const ZONES = {
  INF:{nom:"Membres inférieurs", court:"INF", c:"#0e7490"},
  SUP:{nom:"Membres supérieurs", court:"SUP", c:"#7c3aed"},
  TRONC:{nom:"Tronc", court:"TRONC", c:"#b45309"},
  CARDIO:{nom:"Cardio / global", court:"CARDIO", c:"#be123c"}
};
const NIVEAUX = {
  1:{nom:"N1", def:"Exercices de gainage, statiques ou cardio faciles."},
  2:{nom:"N2", def:"Exercices dynamiques d’intensité modérée."},
  3:{nom:"N3", def:"Exercices à dominante cardio et technique, avec impulsions."}
};

/* ---------- Les mouvements ----------
   z : zone · n : niveau (1 à 3) · m : matériel · tle : réservé à la Terminale
   img : photo (img/mv/…) ou fig : dessin · c : critères [placement, respiration, amplitude] · err : erreur fréquente */
const MOUV = [
 /* ----- Membres inférieurs ----- */
 {id:"squat", nom:"Squat", z:"INF", n:2, m:"pdc", img:"squat", c:["Pieds largeur d’épaules, pointes légèrement ouvertes, talons au sol ; genoux dans l’axe des pieds.","Inspire en descendant, souffle en remontant.","Hanches sous la ligne des genoux (ou cuisse parallèle au sol), dos plat, poitrine haute."], err:"Les genoux rentrent vers l’intérieur, les talons décollent.", moins:"Squat sur un banc (on touche le banc, on remonte).", plus:"Jump squat."},
 {id:"chaise", nom:"Chaise contre le mur", z:"INF", n:1, m:"pdc", img:"chaise", c:["Dos collé au mur, cuisses parallèles au sol, genoux au-dessus des chevilles.","Respiration lente et régulière, on ne bloque jamais.","Angle de 90° tenu, sans s’aider des mains sur les cuisses."], err:"Les mains poussent sur les cuisses ; on remonte sans s’en rendre compte.", moins:"Angle plus ouvert (120°).", plus:"Sur une jambe, ou avec une kettlebell sur les cuisses."},
 {id:"fente-genou", nom:"Fente avant", z:"INF", n:2, m:"pdc", img:"fente-genou", c:["Grand pas, genou avant au-dessus de la cheville, buste droit.","Inspire en descendant, souffle en poussant sur le talon avant.","Le genou arrière frôle le sol sans le taper."], err:"Le genou avant dépasse largement la pointe du pied ; le buste plonge.", moins:"Fente statique en tenant le mur.", plus:"Fentes sautées."},
 {id:"fentes-alternees", nom:"Fentes alternées avant-arrière", z:"INF", n:2, m:"pdc", img:"fentes-alternees", c:["On revient pieds joints entre chaque fente, bassin face à l’avant.","Souffle à chaque remontée.","Genou arrière à 2 cm du sol."], err:"Pas trop court : le genou avant part loin devant.", moins:"Une seule direction (fente arrière, plus facile pour les genoux).", plus:"Fentes sautées."},
 {id:"fentes-halteres", nom:"Fentes avec haltères", z:"INF", n:2, m:"halt", img:"fentes-halteres", c:["Haltères le long du corps, épaules basses, buste droit.","Inspire en descendant, souffle en remontant.","Genou arrière près du sol, genou avant au-dessus de la cheville."], err:"Le buste se penche vers l’avant sous le poids des haltères.", moins:"Sans charge.", plus:"Fentes marchées sur 10 m."},
 {id:"jump-squat", nom:"Jump squat", z:"INF", n:3, m:"pdc", img:"jump-squat", c:["Départ en squat, bras qui accompagnent l’impulsion ; réception sur l’avant des pieds.","Souffle à l’impulsion.","Extension complète en l’air, réception amortie, genoux dans l’axe."], err:"Réception jambes tendues et bruyante.", moins:"Squat avec montée sur la pointe des pieds.", plus:"Squat 180°."},
 {id:"squat-180", nom:"Squat 180°", z:"INF", n:3, m:"pdc", img:"squat-180", c:["Squat, saut avec demi-tour, réception en squat face à l’autre côté.","Souffle à l’impulsion.","Réception stable, sans pas de rattrapage."], err:"On tourne avant d’avoir sauté (on vrille sur les genoux).", moins:"Jump squat sans rotation.", plus:"Enchaîner sans pause, toujours dans le même sens puis dans l’autre."},
 {id:"fente-sautee", nom:"Fentes sautées", z:"INF", n:3, m:"pdc", img:"fente-sautee", c:["On change de jambe en l’air ; buste droit.","Souffle à chaque saut.","Réception en fente amortie, genou arrière près du sol."], err:"Les fentes deviennent minuscules avec la fatigue.", moins:"Fentes alternées sans saut.", plus:"Deux changements de jambe par minute de plus, ou bras au-dessus de la tête."},
 {id:"genoux-debout", nom:"Genoux vers debout", z:"INF", n:3, m:"pdc", img:"genoux-debout", c:["À genoux, bras en arrière ; on saute pour arriver en squat.","Souffle à l’impulsion.","Réception pieds à plat, en squat stable."], err:"On pose un pied puis l’autre au lieu de sauter.", moins:"Se relever en posant un pied puis l’autre, vite.", plus:"Enchaîner avec un jump squat."},
 {id:"hip-thrust", nom:"Hip thrust (relevé de bassin)", z:"INF", n:2, m:"pdc", img:"hip-thrust", c:["Dos au sol (ou épaules sur le banc), pieds à plat sous les genoux.","Souffle en montant le bassin.","Hanches dans l’alignement épaules-genoux, fessiers serrés en haut."], err:"On cambre le bas du dos au lieu de serrer les fessiers.", moins:"Amplitude réduite, au sol.", plus:"Sur une jambe, ou épaules sur le banc."},
 {id:"hip-thrust-1j", nom:"Hip thrust sur une jambe", z:"INF", n:2, m:"pdc", img:"hip-thrust-1j", c:["Une jambe tendue dans l’axe de la cuisse, bassin horizontal.","Souffle en montant.","Le bassin ne bascule pas d’un côté."], err:"Le bassin tourne vers la jambe libre.", moins:"Hip thrust deux jambes.", plus:"Épaules sur le banc."},
 {id:"mollets-step", nom:"Mollets sur marche", z:"INF", n:1, m:"box", img:"mollets-step", c:["Avant du pied sur le bord, talons dans le vide, corps droit.","Souffle en montant.","Talons sous la marche puis pointe des pieds au maximum."], err:"On rebondit sans contrôler la descente.", moins:"Au sol.", plus:"Haltères dans les mains, ou sur un pied."},
 {id:"saut-lateral-banc", nom:"Sauts latéraux par-dessus le banc", z:"INF", n:3, m:"banc", img:"saut-lateral-banc", c:["Pieds joints ou mains sur le banc, regard devant.","Souffle à chaque passage.","Réception amortie de l’autre côté, sans toucher le banc."], err:"On s’accroche au banc et on tire sur les bras.", moins:"Mains sur le banc, pieds qui passent.", plus:"Sans les mains, pieds joints."},
 {id:"goblet-squat", nom:"Goblet squat", z:"INF", n:2, m:"kb", fig:"goblet", c:["Kettlebell tenue contre la poitrine par les cornes, coudes vers le bas.","Inspire en descendant, souffle en remontant.","Coudes entre les genoux en bas, dos plat, talons au sol."], err:"La charge s’éloigne du corps : le dos s’arrondit.", moins:"Sans charge, ou sur un banc.", plus:"Pause de 2 s en bas."},
 {id:"kb-deadlift", nom:"Soulevé de terre kettlebell", z:"INF", n:2, m:"kb", fig:"kbdl", c:["Kettlebell entre les pieds ; on recule les fesses (charnière de hanche), dos plat, bras tendus.","Inspire avant de tirer, souffle debout.","Debout complet : hanches tendues, fessiers serrés, sans se pencher en arrière."], err:"On tire avec le dos rond ou on plie les bras.", moins:"Bâton dans le dos (3 contacts : tête, dos, bassin), sans charge.", plus:"Swing russe."},
 {id:"step-up", nom:"Montée sur box", z:"INF", n:2, m:"box", fig:"stepup", c:["Pied entier sur la box, genou au-dessus du pied ; on pousse avec la jambe du haut.","Souffle en montant.","Debout complet sur la box, puis on redescend en contrôlant, on alterne."], err:"On pousse avec la jambe du bas (on saute).", moins:"Box basse ou banc.", plus:"Haltères le long du corps, ou genou haut en arrivant."},
 {id:"box-jump", nom:"Saut sur box", z:"INF", n:3, m:"box", fig:"boxjump", c:["Bras en arrière, impulsion à deux pieds, réception en squat sur toute la box.","Souffle à l’impulsion.","Debout complet sur la box ; on redescend en marchant, jamais en sautant en arrière."], err:"Réception sur le bord de la box ; redescente en sautant.", moins:"Box basse, ou montée sur box.", plus:"Box plus haute (validée par le professeur)."},
 {id:"deadlift", nom:"Soulevé de terre à la barre", z:"INF", n:2, m:"barre", tle:true, fig:"deadlift", c:["Barre au-dessus du milieu du pied, contre les tibias ; dos plat, épaules au-dessus de la barre.","Inspire et gaine avant de tirer ; souffle debout.","La barre frôle les jambes ; debout complet, sans se cambrer."], err:"Dos rond au départ, barre qui s’éloigne des jambes.", moins:"Barre seule, ou soulevé de terre kettlebell.", plus:"Charge augmentée par paliers de 2,5 kg, validée par le partenaire."},
 {id:"front-squat", nom:"Front squat", z:"INF", n:2, m:"barre", tle:true, fig:"frontsquat", c:["Barre posée sur l’avant des épaules, coudes hauts vers l’avant.","Inspire en descendant, souffle en remontant.","Cuisse parallèle au sol ou plus bas, buste vertical, coudes qui restent hauts."], err:"Les coudes tombent : la barre roule vers l’avant.", moins:"Goblet squat.", plus:"Thruster."},
 {id:"thruster", nom:"Thruster", z:"CARDIO", n:3, m:"barre", tle:true, fig:"thruster", c:["Front squat puis, en remontant, la barre part au-dessus de la tête dans le même élan.","Souffle en poussant la barre.","Bras tendus au-dessus de la tête, oreilles entre les bras, puis retour aux épaules en amortissant."], err:"On s’arrête debout avant de pousser : on perd l’élan des jambes.", moins:"Haltères légers (thruster haltères).", plus:"Charge plus lourde, rythme imposé à l’EMOM."},
 /* ----- Membres supérieurs ----- */
 {id:"pompe-mur", nom:"Pompes au mur", z:"SUP", n:1, m:"pdc", img:"pompe-mur", c:["Mains au mur à hauteur d’épaules, corps gainé en planche inclinée.","Inspire en descendant, souffle en poussant.","Le nez frôle le mur, bras tendus en fin de poussée."], err:"Les fesses reculent : le corps se casse.", moins:"Plus près du mur.", plus:"Pompes sur banc."},
 {id:"pompe-genoux", nom:"Pompes sur les genoux", z:"SUP", n:1, m:"pdc", img:"pompe-genoux", c:["Genoux au sol, ligne épaules-bassin-genoux droite, mains sous les épaules.","Inspire en descendant, souffle en poussant.","La poitrine frôle le sol."], err:"Les fesses restent en l’air.", moins:"Pompes sur banc ou au mur.", plus:"Pompes."},
 {id:"pompe", nom:"Pompes", z:"SUP", n:2, m:"pdc", img:"pompe", c:["Mains un peu plus larges que les épaules, corps gainé de la tête aux talons.","Inspire en descendant, souffle en poussant.","Poitrine à 5 cm du sol, bras tendus en haut."], err:"Le bassin s’affaisse (dos creux) ou monte.", moins:"Pompes sur les genoux.", plus:"Pompes claquées."},
 {id:"pompe-claquee", nom:"Pompes claquées", z:"SUP", n:3, m:"pdc", img:"pompe-claquee", c:["Pompe explosive : les mains quittent le sol et claquent.","Souffle à la poussée.","Réception bras légèrement fléchis, corps toujours gainé."], err:"Le corps se casse à la réception.", moins:"Pompes explosives sans claquer (mains qui décollent).", plus:"Deux claquements."},
 {id:"planche-pompe", nom:"Planche-pompe (up-down)", z:"SUP", n:2, m:"pdc", img:"planche-pompe", c:["Planche sur les avant-bras, puis main après main en planche bras tendus, et retour.","Respiration régulière, on ne bloque pas.","Le bassin ne se balance pas d’un côté à l’autre."], err:"Le bassin tourne à chaque changement de main.", moins:"Sur les genoux.", plus:"Ajouter une pompe en haut."},
 {id:"dips-sol", nom:"Dips au sol", z:"SUP", n:1, m:"pdc", img:"dips-sol", c:["Assis, mains derrière les fesses doigts vers l’avant, fesses décollées.","Inspire en fléchissant, souffle en poussant.","Coudes vers l’arrière, jusqu’à 90°."], err:"Les coudes s’ouvrent sur les côtés.", moins:"Amplitude réduite.", plus:"Dips sur banc."},
 {id:"dips-banc", nom:"Dips sur banc", z:"SUP", n:2, m:"banc", img:"dips-banc", c:["Mains sur le bord du banc, dos qui frôle le banc, pieds à plat.","Inspire en descendant, souffle en poussant.","Coudes à 90° vers l’arrière, bras tendus en haut."], err:"Le dos s’éloigne du banc : les épaules souffrent.", moins:"Dips au sol.", plus:"Dips jambes tendues."},
 {id:"dips-jambes-tendues", nom:"Dips jambes tendues", z:"SUP", n:2, m:"banc", img:"dips-jambes-tendues", c:["Comme les dips sur banc, jambes tendues talons au sol.","Inspire en descendant, souffle en poussant.","Coudes à 90°, épaules basses."], err:"Les épaules montent vers les oreilles.", moins:"Genoux fléchis.", plus:"Pieds sur un second banc."},
 {id:"arlaud", nom:"Arlaud (relevé des bras allongé)", z:"SUP", n:1, m:"pdc", img:"arlaud", c:["Allongé sur le ventre, bras en croix, front à 2 cm du sol.","Respiration calme.","On décolle les bras et on les amène devant, puis le long du corps, sans les reposer."], err:"On relève la tête et on cambre.", moins:"Bras en croix seulement.", plus:"Petites bouteilles d’eau dans les mains."},
 {id:"pompe-rotation-haltere", nom:"Pompe et rotation (haltères)", z:"SUP", n:2, m:"halt", img:"pompe-rotation-haltere", c:["Mains sur les haltères ; une pompe puis on ouvre en planche latérale, bras vers le ciel.","Souffle en tournant.","Corps aligné en planche latérale, regard vers la main."], err:"Le bassin tombe pendant la rotation.", moins:"Sans haltères, sur les genoux.", plus:"Haltères plus lourds."},
 {id:"elevations-laterales", nom:"Élévations latérales", z:"SUP", n:2, m:"halt", img:"elevations-laterales", c:["Debout, genoux souples, haltères légers, coudes très légèrement fléchis.","Souffle en montant.","Bras à hauteur d’épaules, pas plus haut ; descente lente."], err:"On balance le buste pour monter les haltères.", moins:"Bouteilles d’eau.", plus:"Tempo lent (3 s pour descendre)."},
 {id:"developpe-halteres", nom:"Développé haltères au-dessus de la tête", z:"SUP", n:2, m:"halt", img:"developpe-halteres-assis", c:["Assis ou debout gainé, haltères à hauteur d’épaules.","Souffle en poussant.","Bras tendus au-dessus de la tête, sans cambrer."], err:"Le bas du dos se creuse.", moins:"Assis dos contre le mur.", plus:"Debout, en alternant les bras."},
 {id:"push-press", nom:"Push press", z:"SUP", n:3, m:"barre", tle:true, img:"push-press", c:["Barre sur l’avant des épaules ; petite flexion des genoux puis on pousse la barre avec l’élan des jambes.","Souffle à la poussée.","Bras tendus au-dessus de la tête, la tête passe « dans la fenêtre »."], err:"On fléchit trop les jambes (ça devient un squat).", moins:"Développé haltères.", plus:"Thruster."},
 {id:"developpe-militaire", nom:"Développé militaire à la barre", z:"SUP", n:2, m:"barre", tle:true, img:"developpe-militaire", c:["Debout, barre sur l’avant des épaules, fessiers et abdos serrés.","Souffle en poussant.","Bras tendus au-dessus de la tête sans s’aider des jambes."], err:"On se cambre pour finir la poussée.", moins:"Développé haltères.", plus:"Push press."},
 {id:"rowing-menton", nom:"Tirage menton", z:"SUP", n:2, m:"barre", tle:true, img:"rowing-menton", c:["Barre ou kettlebell près du corps, mains écartées largeur d’épaules.","Souffle en tirant.","Coudes à hauteur d’épaules au maximum, la charge frôle le buste."], err:"Mains trop serrées : douleur aux épaules.", moins:"Kettlebell légère tenue à deux mains.", plus:"Enchaîner avec un soulevé de terre."},
 /* ----- Tronc ----- */
 {id:"planche", nom:"Planche (gainage ventral)", z:"TRONC", n:1, m:"pdc", img:"planche", c:["Avant-bras sous les épaules, corps droit de la tête aux talons.","Respiration régulière, on ne bloque pas.","On pousse le sol avec les avant-bras, nombril rentré."], err:"Le bassin s’affaisse ou monte en pont.", moins:"Sur les genoux.", plus:"Planche jack, planche commando."},
 {id:"gainage-lateral", nom:"Gainage latéral", z:"TRONC", n:1, m:"pdc", img:"gainage-lateral", c:["Coude sous l’épaule, corps aligné, bassin haut.","Respiration régulière.","Le bassin ne descend pas avec la fatigue."], err:"Le bassin recule et descend.", moins:"Genou du bas au sol.", plus:"Jambe du haut levée."},
 {id:"planche-jack", nom:"Planche jack", z:"TRONC", n:2, m:"pdc", img:"planche-jack", c:["Planche, on écarte et on resserre les pieds en sautillant.","Respiration régulière.","Le bassin reste fixe et bas."], err:"Les fesses montent à chaque saut.", moins:"Pas sur le côté, un pied après l’autre.", plus:"Bras tendus."},
 {id:"planche-commando", nom:"Planche commando", z:"TRONC", n:2, m:"pdc", img:"planche-commando", c:["Passer des avant-bras aux mains, puis revenir, en alternant la main de départ.","Souffle à chaque montée.","Pieds écartés pour que le bassin ne tourne pas."], err:"Le bassin se balance.", moins:"Sur les genoux.", plus:"Pieds serrés."},
 {id:"planche-rotation", nom:"Planche avec rotation", z:"TRONC", n:2, m:"pdc", img:"planche-rotation", c:["Planche bras tendus, on ouvre en planche latérale bras vers le ciel, on revient.","Souffle en ouvrant.","Corps aligné à chaque ouverture."], err:"Le bassin tombe en ouvrant.", moins:"Sur les avant-bras.", plus:"Avec haltère léger."},
 {id:"genou-coude", nom:"Planche genou-coude croisé", z:"TRONC", n:2, m:"pdc", img:"genou-coude", c:["Planche bras tendus ; le genou vient vers le coude opposé.","Souffle quand le genou arrive.","Le dos reste plat, le bassin bas."], err:"Les fesses montent.", moins:"Lentement, pied qui revient au sol.", plus:"Mountain climber croisé."},
 {id:"kb-passage", nom:"Passage de kettlebell en planche", z:"TRONC", n:2, m:"kb", img:"kb-passage-planche", c:["Planche bras tendus, pieds écartés ; une main attrape la kettlebell et la fait passer de l’autre côté.","Respiration régulière.","Le bassin ne tourne pas."], err:"Le bassin pivote quand la main quitte le sol.", moins:"Sur les genoux.", plus:"Pieds serrés, kettlebell plus lourde."},
 {id:"superman", nom:"Superman alterné", z:"TRONC", n:1, m:"pdc", img:"superman-alterne", c:["À quatre pattes, on tend un bras et la jambe opposée.","Souffle en tendant.","Bras et jambe dans le prolongement du dos, pas plus haut."], err:"On cambre en levant la jambe trop haut.", moins:"Bras seul, puis jambe seule.", plus:"Coude et genou qui se touchent sous le ventre entre deux."},
 {id:"extension-dos", nom:"Extensions du dos", z:"TRONC", n:1, m:"pdc", img:"extension-dos", c:["Allongé sur le ventre, mains aux tempes, pieds au sol.","Souffle en montant.","On décolle le buste de quelques centimètres, regard vers le sol."], err:"On relève la tête et on cambre trop.", moins:"Bras le long du corps.", plus:"Bras tendus devant."},
 {id:"crunch", nom:"Crunch", z:"TRONC", n:1, m:"pdc", img:"crunch", c:["Dos au sol, pieds à plat, mains aux tempes sans tirer la nuque.","Souffle en enroulant.","On décolle les omoplates, le bas du dos reste au sol."], err:"On tire sur la nuque avec les mains.", moins:"Bras tendus vers les genoux.", plus:"Bicycle crunch."},
 {id:"touche-talons", nom:"Touche-talons", z:"TRONC", n:1, m:"pdc", img:"touche-talons", c:["Dos au sol, omoplates décollées, pieds à plat.","Souffle à chaque touche.","La main glisse jusqu’au talon, de chaque côté."], err:"La tête retombe au sol.", moins:"Tête posée entre deux séries.", plus:"Tempo plus rapide."},
 {id:"ciseaux", nom:"Ciseaux (battements de jambes)", z:"TRONC", n:1, m:"pdc", img:"ciseaux", c:["Dos au sol, mains sous les fesses, jambes tendues.","Respiration régulière.","Le bas du dos reste collé au sol."], err:"Le dos se décolle et se creuse.", moins:"Jambes plus hautes.", plus:"Jambes plus près du sol."},
 {id:"bicycle-crunch", nom:"Bicycle crunch", z:"TRONC", n:2, m:"pdc", img:"bicycle-crunch", c:["Coude vers le genou opposé, l’autre jambe tendue.","Souffle à chaque rotation.","On tourne les épaules, pas seulement le coude."], err:"On tire sur la nuque.", moins:"Pieds au sol.", plus:"Ralentir (2 s par côté)."},
 {id:"rameur", nom:"Rameur (abdos)", z:"TRONC", n:2, m:"pdc", img:"rameur", c:["Assis en appui sur les mains, on rentre les genoux puis on tend les jambes sans poser les pieds.","Souffle en rentrant les genoux.","Jambes tendues en fin de mouvement, pieds en l’air."], err:"Les pieds touchent le sol à chaque répétition.", moins:"Talons qui touchent.", plus:"Bras décollés du sol."},
 {id:"sit-up", nom:"Sit-up", z:"TRONC", n:2, m:"pdc", img:"sit-up", c:["Dos au sol, pieds calés ; on s’assoit complètement.","Souffle en montant.","Mains qui touchent les pieds en haut, retour dos au sol."], err:"On se lance avec les bras.", moins:"Crunch.", plus:"V-up."},
 {id:"v-up", nom:"V-up", z:"TRONC", n:2, m:"pdc", img:"v-up", c:["Allongé bras au-dessus de la tête, on monte bras et jambes tendues en même temps.","Souffle en montant.","Les mains rejoignent les pieds au-dessus du bassin."], err:"Jambes pliées, dos qui claque au sol.", moins:"Une jambe après l’autre.", plus:"Tenir 1 s en haut."},
 {id:"russian-twist", nom:"Russian twist", z:"TRONC", n:2, m:"pdc", img:"russian-twist", c:["Assis, buste incliné en arrière, pieds décollés ou au sol.","Souffle à chaque rotation.","On touche le sol de chaque côté en tournant les épaules."], err:"On bouge les bras sans tourner le buste.", moins:"Pieds au sol.", plus:"Avec un haltère ou un disque."},
 {id:"releve-bassin", nom:"Relevé de bassin jambes tendues", z:"TRONC", n:2, m:"pdc", img:"releve-bassin", c:["Dos au sol, bras au sol, jambes tendues vers le ciel.","Souffle en décollant le bassin.","Le bassin décolle de quelques centimètres, les pieds montent vers le plafond."], err:"On balance les jambes au lieu de pousser vers le haut.", moins:"Genoux fléchis.", plus:"Descente lente des jambes entre deux."},
 /* ----- Cardio / global ----- */
 {id:"jumping-jack", nom:"Jumping jack", z:"CARDIO", n:1, m:"pdc", img:"jumping-jack", c:["Bras et jambes s’écartent et se resserrent en même temps.","Respiration régulière, bouche ouverte.","Mains qui se touchent au-dessus de la tête."], err:"Bras à mi-hauteur.", moins:"Pas sur le côté, sans sauter.", plus:"X jack."},
 {id:"montees-genoux", nom:"Montées de genoux", z:"CARDIO", n:2, m:"pdc", img:"montees-genoux", c:["Sur l’avant des pieds, buste droit, bras qui courent.","Respiration rapide et régulière.","Cuisse à l’horizontale à chaque pas."], err:"On se penche en arrière.", moins:"Marche genoux hauts.", plus:"Sprint sur place 10 s à la fin."},
 {id:"x-jack", nom:"X jack", z:"CARDIO", n:2, m:"pdc", img:"x-jack", c:["Jambes et bras en X en l’air, réception jambes serrées.","Souffle à chaque saut.","Corps en grand X."], err:"Petit saut, bras pliés.", moins:"Jumping jack.", plus:"Plyo jack."},
 {id:"plyo-jack", nom:"Plyo jack", z:"CARDIO", n:3, m:"pdc", img:"plyo-jack", c:["Départ accroupi mains au sol, saut en X, retour accroupi.","Souffle à l’impulsion.","Extension complète en l’air, réception amortie."], err:"On ne redescend plus jusqu’au sol avec la fatigue.", moins:"X jack.", plus:"Burpee."},
 {id:"mountain-climber", nom:"Mountain climber", z:"CARDIO", n:2, m:"pdc", img:"mountain-climber", c:["Planche bras tendus, les genoux montent vers la poitrine en alternance.","Respiration rapide et régulière.","Le bassin reste bas, épaules au-dessus des mains."], err:"Les fesses montent.", moins:"Lentement, pied posé à chaque fois.", plus:"Mountain climber croisé."},
 {id:"mountain-climber-croise", nom:"Mountain climber croisé", z:"CARDIO", n:2, m:"pdc", img:"mountain-climber-croise", c:["Le genou vient vers le coude opposé.","Respiration rapide.","Le bassin reste bas, les épaules ne bougent pas."], err:"On saute avec tout le corps.", moins:"Mountain climber.", plus:"Tempo plus rapide."},
 {id:"sprawl", nom:"Sprawl", z:"CARDIO", n:3, m:"pdc", img:"sprawl", c:["Mains au sol, on jette les pieds en arrière (corps à plat), on revient et on se relève.","Souffle en jetant les pieds.","Corps à plat au sol, puis debout complet."], err:"Le dos se creuse en arrivant au sol.", moins:"Un pied après l’autre, sans s’allonger.", plus:"Burpee."},
 {id:"burpee", nom:"Burpee", z:"CARDIO", n:3, m:"pdc", img:"burpee", c:["Accroupi, pieds en arrière, pompe (ou poitrine au sol), pieds aux mains, saut mains au-dessus de la tête.","Souffle au saut.","Poitrine au sol, debout complet et petit saut."], err:"Le dos se creuse en arrivant au sol ; pas de saut à la fin.", moins:"Sans pompe, en marchant les pieds.", plus:"Burpee saut sur box (Terminale)."},
 {id:"course", nom:"Course sur place / navette", z:"CARDIO", n:2, m:"pdc", img:"course", c:["Sur l’avant des pieds, bras qui accompagnent.","Respiration régulière.","Navette de 5 m : on touche la ligne à chaque fois."], err:"On ralentit sans s’en rendre compte.", moins:"Marche rapide.", plus:"Sprint sur 10 s."},
 {id:"swing", nom:"Swing russe", z:"CARDIO", n:3, m:"kb", fig:"swing", c:["Charnière de hanche : la kettlebell passe entre les cuisses, dos plat ; le coup de bassin la propulse.","Souffle quand la kettlebell monte.","La kettlebell monte à hauteur des yeux bras tendus ; ce sont les hanches qui la font monter, pas les bras."], err:"On squatte au lieu de se pencher ; on tire avec les bras ; le dos s’arrondit.", moins:"Soulevé de terre kettlebell.", plus:"Kettlebell plus lourde, validée par le professeur."},
 /* ----- Exercices repris de l'appli chrono Cross Training Pompidou ----- */
 {id:"demi-squat", nom:"Demi-squat", z:"INF", n:1, m:"pdc", c:["Pieds largeur d’épaules, poids sur les talons, bras devant.","Inspire en descendant, souffle en remontant.","On descend jusqu’à 90° aux genoux, pas plus bas, dos plat."], err:"Les genoux avancent loin devant les pieds.", moins:"Mains sur un banc derrière soi.", plus:"Squat complet."},
 {id:"fente-laterale", nom:"Fentes latérales", z:"INF", n:2, m:"pdc", c:["Grand pas sur le côté, pied à plat, l’autre jambe tendue.","Inspire en descendant, souffle en revenant.","Fesses en arrière, genou fléchi au-dessus du pied, buste incliné dos plat."], err:"Le genou part vers l’intérieur ; le talon décolle.", moins:"Amplitude réduite, mains sur les hanches.", plus:"Kettlebell tenue contre la poitrine."},
 {id:"squat-bulgare", nom:"Squat bulgare", z:"INF", n:2, m:"banc", c:["Dessus du pied arrière posé sur le banc, pied avant à un grand pas devant.","Inspire en descendant, souffle en remontant.","Le genou arrière descend vers le sol, genou avant au-dessus de la cheville."], err:"Le pied avant est trop près du banc : le genou part loin devant.", moins:"Fente avant sans banc.", plus:"Haltères dans les mains."},
 {id:"sauts-groupes-banc", nom:"Sauts groupés sur le banc", z:"INF", n:3, m:"banc", c:["Face au banc, bras en arrière, on saute genoux vers la poitrine.","Souffle à l’impulsion.","Réception pieds à plat sur le banc, debout complet, on redescend en marchant."], err:"Réception sur le bord du banc.", moins:"Montée sur le banc.", plus:"Box plus haute (validée par le professeur)."},
 {id:"accroupi-genoux", nom:"Accroupi-genoux, 2 rebonds", z:"INF", n:3, m:"pdc", c:["Accroupi, on pose un genou puis l’autre, on revient accroupi, puis 2 petits rebonds.","Respiration rapide et régulière.","Accroupi complet, talons au sol si possible, dos droit."], err:"On tombe sur les genoux.", moins:"Sans les rebonds.", plus:"Les rebonds deviennent un jump squat."},
 {id:"pompe-surelevee", nom:"Pompes pieds surélevés", z:"SUP", n:2, m:"banc", c:["Pieds sur le banc, mains au sol, corps gainé.","Inspire en descendant, souffle en poussant.","Le front frôle le sol, bras tendus en haut."], err:"Le bassin s’affaisse.", moins:"Pompes au sol.", plus:"Pompes claquées."},
 {id:"pompe-diamant", nom:"Pompes diamant", z:"SUP", n:3, m:"pdc", c:["Mains jointes sous la poitrine (pouces et index en losange), coudes près du corps.","Inspire en descendant, souffle en poussant.","La poitrine touche les mains, bras tendus en haut."], err:"Les coudes s’écartent sur les côtés.", moins:"Sur les genoux.", plus:"Tempo 3 s à la descente."},
 {id:"developpe-couche", nom:"Développé couché", z:"SUP", n:2, m:"barre", tle:true, img:"developpe-couche", c:["Allongé sur le banc, pieds au sol, barre au-dessus des épaules, un pareur derrière.","Inspire en descendant, souffle en poussant.","La barre descend jusqu’à la poitrine, bras tendus en haut sans verrouiller brutalement."], err:"On rebondit la barre sur la poitrine ; les fesses décollent.", moins:"Haltères légers, ou pompes.", plus:"Charge augmentée par paliers de 2,5 kg avec pareur."},
 {id:"rowing-haltere", nom:"Rowing haltère", z:"SUP", n:2, m:"halt", c:["Une main et un genou sur le banc, dos plat, haltère bras tendu.","Souffle en tirant.","Le coude monte le long du corps, l’haltère arrive à la hanche, omoplate serrée."], err:"On tourne le buste pour tirer.", moins:"Haltère plus léger.", plus:"Tempo 3 s à la descente."},
 {id:"tirage-menton-kb", nom:"Soulevé vertical chargé (tirage menton)", z:"SUP", n:2, m:"kb", c:["Debout, kettlebell tenue à deux mains devant les cuisses.","Souffle en tirant.","Les coudes montent jusqu’à hauteur d’épaules, la charge frôle le buste."], err:"On balance le buste.", moins:"Soulevé vertical à l’élastique.", plus:"Tirage menton à la barre (Terminale)."},
 {id:"souleve-elastique", nom:"Soulevé vertical à l’élastique", z:"SUP", n:1, m:"elast", c:["Pieds sur l’élastique, mains serrées devant les cuisses.","Souffle en tirant.","Coudes à hauteur d’épaules, descente lente."], err:"Mains trop serrées : douleur aux épaules.", moins:"Élastique plus souple.", plus:"Élastique plus dur, ou kettlebell."},
 {id:"traction-negative", nom:"Tractions négatives", z:"SUP", n:3, m:"fixe", c:["Menton au-dessus de la barre (aidé d’un banc), corps gainé.","Souffle en descendant.","Descente lente (3 à 5 s) jusqu’aux bras tendus."], err:"On se laisse tomber.", moins:"Suspension bras fléchis 10 s.", plus:"Descente en 8 s."},
 {id:"gainage-mains-cuisses", nom:"Gainage mains-cuisses", z:"TRONC", n:1, m:"pdc", c:["Dos au sol, jambes fléchies, on enroule le haut du corps et on pousse les mains contre les cuisses.","Respiration régulière, on ne bloque pas.","Omoplates décollées, bas du dos au sol, position tenue."], err:"On tire sur la nuque.", moins:"Tête posée entre deux séries.", plus:"Jambes levées à 90°."},
 {id:"hollow-hold", nom:"Hollow hold", z:"TRONC", n:2, m:"pdc", c:["Dos au sol, bras et jambes tendus décollés, le corps en « banane ».","Respiration courte et régulière.","Le bas du dos reste collé au sol."], err:"Le dos se creuse quand les jambes descendent.", moins:"Genoux fléchis, bras le long du corps.", plus:"Petits balancements (hollow rock)."},
 {id:"spiderman-planche", nom:"Spiderman planche", z:"TRONC", n:2, m:"pdc", c:["Planche bras tendus, le genou vient vers le coude du même côté, par l’extérieur.","Souffle quand le genou arrive.","Le bassin reste bas et ne tourne pas."], err:"Les fesses montent.", moins:"Sur les avant-bras, plus lentement.", plus:"Ajouter une pompe entre deux."},
 {id:"crunch-oblique", nom:"Crunch oblique", z:"TRONC", n:2, m:"pdc", c:["Dos au sol, une cheville sur le genou opposé ; le coude va vers le genou levé.","Souffle en enroulant.","L’épaule décolle et tourne ; le bas du dos reste au sol."], err:"On tire sur la nuque avec la main.", moins:"Amplitude réduite.", plus:"Bicycle crunch."},
 {id:"criss-cross", nom:"Criss-cross", z:"TRONC", n:2, m:"pdc", c:["Dos au sol, jambes tendues décollées, on croise les jambes l’une au-dessus de l’autre.","Respiration régulière.","Le bas du dos reste collé ; jambes tendues."], err:"Le dos se creuse.", moins:"Jambes plus hautes.", plus:"Jambes plus près du sol."},
 {id:"burpee-militaire", nom:"Burpee militaire", z:"CARDIO", n:3, m:"pdc", c:["Burpee avec 2 pompes et un saut genoux à la poitrine.","Souffle à chaque poussée et au saut.","Poitrine au sol à chaque pompe, extension complète au saut."], err:"Les pompes deviennent des demi-pompes.", moins:"Burpee.", plus:"Burpee militaire avec saut sur box (Terminale)."}

];
/* Noms de l'appli chrono élève, pour que les élèves retrouvent leurs exercices */
const NOMS_CHRONO = {"pompe-mur":"Pompes sur banc/mur","arlaud":"Arlaud relevé-mains","planche":"Planche coudes","ciseaux":"Ciseaux abdos","gainage-lateral":"Gainage oblique","sprawl":"Sprawls relevés","jumping-jack":"Jumping Jacks","hip-thrust":"Relevé de bassin dynamique","fentes-alternees":"Fentes avant/arrière","elevations-laterales":"Soulevé latéral","rameur":"Rameur abdos","burpee":"Burpees avec pompes","squat":"Air Squats","jump-squat":"Squat Jump","fente-genou":"Fentes sur 1 jambe","genoux-debout":"Genoux vers accroupis","step-up":"Montée sur box genou haut","pompe-claquee":"Pompes explo","mountain-climber":"Mountain climbers","v-up":"V-ups","montees-genoux":"Genoux Hauts","box-jump":"Impulsions sur box","saut-lateral-banc":"Sauts par-dessus banc","fente-sautee":"Fentes sautées"};
MOUV.forEach(m => { if(NOMS_CHRONO[m.id] && NOMS_CHRONO[m.id] !== m.nom) m.aussi = NOMS_CHRONO[m.id]; });
const mvById = id => MOUV.find(m => m.id === id);

/* ---------- Les formats de travail ----------
   ep : présent dans l’épreuve du lycée ? */
const FORMATS = [
 {id:"tabata", nom:"TABATA", ep:true, def:"Des intervalles très courts : un temps d’effort, un temps de repos, répétés. Le Tabata d’origine : 20 s d’effort, 10 s de repos, 8 fois, soit 4 min.",
  regle:"Pendant l’effort : le maximum de répétitions propres. Pendant le repos : on se place pour l’exercice suivant. Le partenaire compte les répétitions de chaque round.",
  vertical:"Vertical : on enchaîne les exercices 1, 2, 3, 4, puis on recommence (1, 2, 3, 4…).",
  horizontal:"Horizontal : on fait l’exercice 1 plusieurs fois de suite, puis le 2, etc.",
  piege:"Partir trop vite : on fait 15 répétitions au round 1 et 5 au round 8. Le bon Tabata a des rounds réguliers.", spec:"fmt:tabata:20:10:8"},
 {id:"emom", nom:"EMOM", ep:true, def:"Every Minute On the Minute : au début de chaque minute, on fait un nombre fixé de répétitions ; le temps qui reste dans la minute est le repos.",
  regle:"Dans l’épreuve : 3 à 4 exercices enchaînés dans la même minute (minimum 7 répétitions par exercice en intensité modérée). Le partenaire note le temps restant à chaque minute.",
  lire:"Temps restant sur 1 min : N1 plus de 30 s · N2 20 à 30 s · N3 10 à 20 s. S’il reste moins de 10 s, c’est trop dur : on régule. Plus de 30 s : trop facile, on monte.",
  piege:"Ne pas réguler : on finit à 0 s de repos dès la 3e minute et on rate les dernières.", spec:"fmt:emom:6"},
 {id:"amrap", nom:"AMRAP", ep:false, def:"As Many Rounds As Possible : en un temps donné, le plus de tours possible d’un circuit fixé.",
  regle:"Le partenaire compte les tours terminés et les répétitions du tour en cours. On note le score : 5 tours + 8 répétitions.",
  lire:"Utile pour se tester et comparer d’une séance à l’autre (même AMRAP en S2 et en S7).",
  piege:"Sacrifier l’amplitude pour faire plus de tours : le juge annonce « no rep ».", spec:"fmt:amrap:8"},
 {id:"fortime", nom:"FOR TIME", ep:false, def:"Un travail fixé (par exemple 3 tours de 10 squats, 10 pompes, 10 sit-ups) à faire le plus vite possible.",
  regle:"Chronomètre qui monte ; temps limite annoncé (time cap). Le score est le temps.",
  lire:"Bon format de défi en fin de séance, mais il pousse à bâcler : on ne l’utilise qu’avec un juge.",
  piege:"Mouvements incomplets pour gagner du temps.", spec:"fmt:fortime"},
 {id:"emom1", nom:"EMOM+1", ep:false, def:"EMOM où l’on ajoute une répétition à chaque minute (5, puis 6, puis 7…) jusqu’à ne plus tenir la minute.",
  regle:"On note la dernière minute réussie. Réservé à la Terminale, en défi.",
  lire:"Montre très bien la limite : le temps de repos fond minute après minute.",
  piege:"Partir avec un nombre de départ trop haut.", spec:"fmt:emom1:6"}
];

/* ---------- Les deux mobiles de l'épreuve (référentiel du lycée) ---------- */
const MOBILES = {
 mod:{nom:"Intensité modérée", sous:"tonification, endurance", fc:"140 à 160", c:"#0e7490",
  wod:"2 WOD de 8 min : 1 TABATA (4 à 5 exercices enchaînés) et 1 EMOM (3 à 4 exercices enchaînés, minimum 7 répétitions), dans l’ordre choisi, avec 5 min de récupération entre les deux.",
  exos:"6 à 8 exercices différents ; les 4 zones (INF, SUP, TRONC, CARDIO/GLOBAL) dans les 2 WOD ; EMOM : 3 à 4 exercices de niveau 2.",
  tabata:[["N1","30 s / 30 s","2 × 4 exercices = 8 rounds (8 min)","3 N2 + 1 N1","Le référentiel écrit « 3 × 4 = 8 rounds » : 3 × 4 font 12 rounds, soit 12 min. Avec 8 min, c’est 2 × 4."],
          ["N2","30 s / 20 s","2 × 5 exercices = 10 rounds (8 min 20)","3 N2 + 2 N1",""],
          ["N3","25 s / 15 s","3 × 4 exercices = 12 rounds (8 min)","3 N2 + 1 N1",""]],
  effets:"Chaleur, transpiration, muscles qui « brûlent » sans tétaniser ; on peut parler par phrases courtes. Récupération rapide (FC sous 120 en 2 min).",
  filieres:["Gainage-Tonification","Endurance Force"], duree:21},
 elev:{nom:"Intensité élevée", sous:"cardio-sportif", fc:"160 à 180", c:"#be123c",
  wod:"3 WOD de 5 min : 2 TABATA et 1 EMOM, avec 3 min de récupération entre chaque. Un des deux TABATA est « le spécial » : une seule zone (INF, SUP, TRONC ou GLOBAL/CARDIO).",
  exos:"8 à 10 exercices différents, de niveau 3 ; EMOM : 3 à 4 exercices de niveau 3.",
  tabata:[["N1","20 s / 20 s","2 × 4 exercices = 8 rounds (5 min 20)","5 N3 (1 N2 possible)","Incohérent : 5 N3 sur 4 exercices. À lire : 3 N3 + 1 N2 ?"],
          ["N2","25 s / 15 s","4 × 2 exercices = 8 rounds (5 min 20)","4 N3",""],
          ["N3","20 s / 10 s","2 × 5 exercices = 10 rounds (5 min)","3 N2 + 1 N1","Contradiction : le niveau le plus haut demande des N2 et un N1, alors que le mobile exige du niveau 3."]],
  effets:"Essoufflement fort, on ne peut plus parler ; jambes lourdes ; FC qui monte au-dessus de 160 dès le 2e round.",
  filieres:["Intensif Cardio"], duree:21},
 emom:"EMOM (les deux mobiles) : 1) nombre de régulations des répétitions (N1 plus de 2, N2 1 à 2, N3 aucune) ; 2) temps de récupération restant sur 1 min (N1 plus de 30 s, N2 20 à 30 s, N3 10 à 20 s) ; 3) niveau des exercices (3 à 4 exercices de niveau 2 en modéré, de niveau 3 en élevé)."
};
/* Correspondance avec les 3 filières de l'appli chrono élève */
const FILIERES_APPLI = [
 ["Gainage – Tonification (violet)","Intensité modérée","Exercices surtout N1 et N2 : bonne base pour le TABATA modéré ; ajouter du N2 dynamique pour monter la FC à 140."],
 ["Endurance Force (bleu)","Intensité modérée","Le cœur du mobile modéré : EMOM à 7 répétitions et plus, N2."],
 ["Intensif Cardio (orange)","Intensité élevée","Exercices N3 avec impulsions : TABATA courts et EMOM élevé."]
];
const LIEN_CHRONO = "https://yannickdartois-hue.github.io/cross-training-pompidou/";

/* ---------- Fréquence cardiaque ---------- */
const FC = {
  prise:"Prendre son pouls au cou (carotide) ou au poignet avec 2 doigts, jamais le pouce. Compter 15 s et multiplier par 4, dans les 10 s qui suivent la fin de l’effort (la FC redescend vite).",
  repos:"FC de repos : allongé 2 min, compter 30 s, multiplier par 2. À noter dans le tableau personnel en S1.",
  max:"FC maximale estimée : 220 − âge (estimation à ± 10 battements : elle sert de repère, pas de vérité).",
  karvonen:"Pour comprendre (en classe, pas pour l’épreuve) : FC visée = FC repos + (FC max − FC repos) × % d’intensité. Deux élèves qui ont 160 au cou ne travaillent pas forcément à la même intensité.",
  epreuve:"Le jour de l’épreuve, les fourchettes sont fixées par le référentiel : 140 à 160 (modéré), 160 à 180 (élevé). Le rythme est noté sur « ma FC de fin de cycle »."
};
const RESSENTIS = [
  [1,"Facile","Je peux parler normalement ; je pourrais continuer longtemps."],
  [2,"Moyen","Je parle par phrases courtes ; muscles chauds."],
  [3,"Difficile","Je dis quelques mots ; muscles qui brûlent ; je dois me concentrer pour garder les postures."],
  [4,"Très difficile","Je ne peux plus parler ; je ralentis malgré moi ; postures qui se dégradent."]
];

/* ---------- Le référentiel du lycée (CA5, cross training) ---------- */
const REF = {
  afl:"Savoir s’entraîner, individuellement, pour développer ses ressources et s’entretenir en fonction des effets recherchés, en planifiant un travail puis en s’engageant pour obtenir les effets recherchés selon son projet personnel, en faisant des choix de paramètres d’entraînement cohérents avec le thème retenu, tout en coopérant avec les autres pour s’aider à fonctionner en toute sécurité.",
  epreuve:["Par deux : l’un travaille, l’autre observe et renseigne ; puis on inverse.","4 temps : conception 15 min · échauffement 15 min · circuits 16 à 20 min · bilan 10 min.","Le travail du jour J est planifié à la leçon précédente sur la fiche d’évaluation individuelle, en s’appuyant sur le carnet.","Pour chaque exercice, l’élève prévoit deux niveaux (+ / −) pour réguler selon ses ressentis à chaque tour.","Pour chaque circuit, un observateur contrôle la qualité de réalisation."],
  afl1a:{titre:"AFL1 · Produire, le jour J (7 points, 7 × 1 point)", items:["Échauffement et récupération autoréférencés","Rythme = ma FC de fin de cycle","Postures","Amplitude","Respiration","Étirements","Nombre de cycles réalisés"],
   degres:[["Échauffement et récupération inexistants ; rythme limité ; postures dangereuses ; amplitude limitée ; respiration non perceptible ; étirements inexistants ; aucun cycle réalisé en totalité.","0 à 0,25 par item"],
           ["Échauffement plus ou moins adapté ; rythme inadapté au mobile ; postures respectées sur 4 exercices par cycle ; amplitude complète sur 4 exercices ; respiration anarchique ; étirements anarchiques ; 1 cycle complet.","0,26 à 0,5"],
           ["Échauffement adapté et complet ; rythme adapté au mobile sur au moins 2 cycles ; postures sur 6 ateliers ; amplitude sur 6 exercices ; respiration en phase la plupart du temps ; étirements précis sur la plupart des muscles ; 2 cycles complets.","0,6 à 0,75"],
           ["Échauffement personnalisé ; rythme adapté sur 3 cycles ; postures et amplitude sur tous les exercices ; respiration en phase, expiration face à la gravité ; étirements précis et systématiques ; 3 cycles complets.","0,76 à 1"]]},
  afl1b:{titre:"AFL1 · Analyser, le jour J (5 points, 5 × 1 point)", items:["Données personnelles : choix du type de travail, échauffement, séance","Bilan de chaque cycle","Justification des choix","Bilan de la séance et travail visé à la prochaine","Analyse comme source de conception future (trame fictive du prochain cours)"],
   degres:[["Données anecdotiques ; aucun ressenti identifié ; pas de justification ; pas de bilan ; pas de conception future.","0 à 0,25"],["Données incomplètes ; ressentis limités ; justifications imprécises ; bilan vague ; peu de liens avec la suite.","0,26 à 0,5"],["Données sommaires ; ressentis et smiley ; justifications simples de tous les choix ; bilan simple ; quelques liens avec la suite.","0,6 à 0,75"],["Données en lien avec le carnet ; ressentis précis ; justifications multiples ; bilan lucide ; trame du prochain cours construite sur l’analyse.","0,76 à 1"]]},
  afl2:{titre:"AFL2 · Le carnet d’entraînement (2, 4 ou 6 points)", items:["Mon tableau personnel","Mon entraînement personnel","Mes séances préparées et réalisées","Mes ressentis à chaque séance et les perspectives pour la leçon suivante"],
   degres:["Entraînement anarchique : élève « zappeur », choix non référencés et potentiellement dangereux, carnet non exploité.","Entraînement sommaire : consommateur passif, projet reproduit de façon stéréotypée, carnet peu renseigné.","Entraînement adapté : élève acteur, séquences cohérentes à partir de paramètres simples, carnet utilisé.","Entraînement optimisé : élève auteur, conçoit, régule et justifie ; le carnet est le support prioritaire."],
   baremes:[["6 points","0 à 1,5","1,5 à 3","3 à 4,5","4,5 à 6"],["4 points","0 à 1","1 à 2","2 à 3","3 à 4"],["2 points","0 à 0,5","0,5 à 1","1 à 1,5","1,5 à 2"]]},
  afl3:{titre:"AFL3 · Rôles sociaux (2, 4 ou 6 points)", items:["Le supporter : motiver et soutenir","L’assistant : aider et recueillir les informations (données, chrono, matériel)","Le coach : conseiller, orienter le travail"],
   degres:["Rôles non pourvus : « solitaire », passif, recueil peu fiable, incapable de conseiller.","Rôles subis : bienveillant, encouragements timides, aide avec des erreurs, conseils vagues.","Rôles préférentiels : encourage souvent, aide souvent, conseille parfois.","Rôles au service du collectif : encourage tout le temps, aide toujours de façon fiable, conseille et oriente."],
   note:"Chaque degré est divisé en 3 niveaux ; le niveau global est la moyenne des 3 rôles."},
  choix:["AFL1 : choix des paramètres pour construire et enchaîner ses WOD.","AFL2 : choix du mobile ; répartition des points AFL2 / AFL3 (6/2, 4/4 ou 2/6) ; modalités d’aide du partenaire.","AFL3 : choix du camarade qui accompagne (aide, sécurité, conseils)."],
  axes:"Les 3 axes du projet Pompidou : SE SITUER (analyser), SIGNIFIER (réaliser), INTÉGRER (rôles).",
  /* incohérences relevées : à faire corriger par l'équipe */
  erreurs:[
   "Tabata modéré N1 : « 30 s / 30 s, 3 × 4 exercices = 8 rounds ». 3 × 4 = 12 rounds, soit 12 min pour un WOD de 8 min. Lire 2 × 4.",
   "Le mobile élevé exige des exercices de niveau 3, mais le Tabata N3 demande « 3 N2 + 1 N1 » et le Tabata N1 « 5 N3 » sur 4 exercices.",
   "AFL1, item « nombre de cycles » : le degré 4 exige 3 cycles. En intensité modérée il n’y a que 2 WOD : un élève qui choisit le mobile modéré ne peut pas avoir le degré 4 sur cet item.",
   "AFL2, barème sur 6 points, degré 4 : « de 3 à 6 points ». À lire « de 4,5 à 6 ».",
   "Temps : 2 passages de 21 min (WOD + récupérations) + conception 15 + échauffement 15 + bilan 10 = 82 min, pour 75 min de pratique. Les circuits annoncés « 16 à 20 min » ne comptent pas les récupérations. Dans l’appli, la conception est faite en S8 et relue 5 min le jour J."
  ]
};

/* ---------- Démarche GAREEPS ---------- */
const GAREEPS = {
  principe:"Une situation complexe d’évaluation (SCE) fait apparaître les besoins de chaque élève sur 3 axes. L’élève se positionne sur une étoile, choisit avec le professeur son axe prioritaire, puis travaille dans des situations de résolution de problème (SRP) et de transformation de l’organisation motrice (STOM) ciblées. On revient à la SCE pour vérifier les progrès (S2, S5, S8).",
  axes:[
   {id:"conc", nom:"Conception", c:"#0e7490", crit:["Choix des exercices et des niveaux cohérents avec le mobile","Paramètres (temps, rounds, répétitions, récupérations) justes","Zones corporelles réparties","Échauffement prévu adapté"], besoin:"L’élève se trompe dans les paramètres : FC visée, exercices, temps de récupération, ordre."},
   {id:"prod", nom:"Production", c:"#b45309", crit:["Placement (postures)","Respiration placée","Amplitude complète","Rythme régulier sur tous les rounds"], besoin:"L’élève ne fait pas ce qu’il a prévu, ou le fait avec des postures, une respiration, une amplitude fautives."},
   {id:"ana", nom:"Analyse", c:"#7c3aed", crit:["FC prise et notée juste","Ressentis précis (musculaire, respiratoire, mental)","Lien FC / ressenti / mobile","Régulation proposée pour la suite"], besoin:"L’élève ne sait pas dire ce qu’il ressent ou ne relie pas ses ressentis à ses choix."}
  ],
  score:"Score parlant par axe (1 critère validé = 1 point, 2 = 10, 3 = 100, 4 = 1 000). Un score de 1 101 se lit tout de suite : 4 critères validés sur un exercice, 3 sur un autre, 0 sur le troisième, 1 sur le dernier.",
  srp:[
   {axe:"conc", nom:"Le Rubik’s Cube des paramètres", dispo:"Au tableau : des cartes « temps d’effort », « temps de repos », « rounds », « exercices N1/N2/N3 », « récupération », « FC visée », mélangées.", but:"Reconstituer un WOD cohérent avec son mobile en 3 min, le faire valider, puis le réaliser.", variable:"Le professeur impose une contrainte (une zone, un temps, un niveau) et l’élève justifie le reste."},
   {axe:"prod", nom:"Le Tabata filmé", dispo:"Binôme, tablette sur trépied ou tenue par le partenaire. Un seul critère observé : placement OU respiration OU amplitude.", but:"Faire un Tabata, regarder la vidéo (ralenti), puis refaire le même en corrigeant ce seul critère.", variable:"Exercice rendu plus facile (−) pour libérer l’attention sur le critère."},
   {axe:"ana", nom:"Deux intensités, deux ressentis", dispo:"Binôme. Le partenaire gère le chrono, annonce les exercices, prend le pouls : l’élève ne pense qu’à ses sensations.", but:"Même Tabata à intensité modérée puis élevée (reprise quand la FC revient entre 110 et 120). Le partenaire questionne : muscles, souffle, mental.", variable:"Comparer les deux colonnes du carnet et dire lequel correspond à son mobile."}
  ],
  stom:[
   ["Conception","Appropriation des données : avant chaque poste, choisir le mobile et la méthode, écrire les paramètres en 2 min, faire valider avant de pratiquer."],
   ["Production","Une seule variable : refaire le même WOD en ne changeant qu’un critère (l’expiration à l’effort, la descente sous la ligne des genoux…), vérifié par le partenaire."],
   ["Analyse","Associer les cartes-symboles (essoufflement, brûlure, lourdeur, transpiration) au mobile visé, puis vérifier sur soi pendant le WOD."]
  ]
};
const ROLES = [
  ["Athlète","Réalise le WOD prévu, au meilleur de ses ressources, en respectant les critères."],
  ["Coach (assistant)","Chronomètre, compte les répétitions et les « no rep », note la FC et le temps restant, annonce l’exercice suivant."],
  ["Juge","Regarde un critère à la fois (placement, amplitude, respiration) et dit « rep » ou « no rep »."],
  ["Supporter","Encourage pendant l’effort, rappelle le critère du jour, aide à remettre le matériel."]
];

/* ---------- Échauffements ---------- */
const ECHAUFF = {
  guide:{titre:"Échauffement guidé (S1 à S4)", duree:12, etapes:[
   ["Monter la température · 3 min","Course légère autour du tatami, puis talons-fesses, montées de genoux, pas chassés ; on finit par 3 accélérations."],
   ["Mobiliser les articulations · 3 min","De haut en bas : cou, épaules (grands cercles), poignets (on va mettre du poids dessus), hanches, genoux, chevilles."],
   ["Activer les muscles · 3 min","10 squats lents, 10 fentes, 10 pompes sur les genoux, 20 s de planche, 10 ponts fessiers, 10 soulevés de terre « à vide » (bâton dans le dos)."],
   ["Monter l’intensité · 3 min","2 × 20 s de jumping jacks, puis 2 × 20 s de mountain climbers, 10 s de repos entre. Prise de FC : elle doit être au-dessus de 120."]]},
  specifique:{titre:"Échauffement spécifique en relais (référentiel)", duree:3, texte:"Par deux, AMRAP de 3 min en relais : 2 exercices, 3 à 5 répétitions chacun ; l’un travaille, l’autre récupère, on se tape dans la main. On compte les tours."},
  autonome:{titre:"Échauffement autonome du binôme (S5 à S9)", etapes:[
   "Le binôme écrit son échauffement dans le carnet AVANT la séance : 4 étapes (température, articulations, activation des muscles du WOD, montée d’intensité).",
   "Il choisit les exercices d’activation en fonction des zones de son WOD (si le WOD est surtout INF : squats lents, fentes, ponts fessiers).",
   "Il finit par l’AMRAP en relais de 3 min et prend sa FC : au-dessus de 120, il est prêt.",
   "Le professeur valide d’un coup d’œil : 4 étapes présentes, rien d’explosif à froid, durée tenue."],
   criteres:["4 étapes dans l’ordre","Activation des zones du WOD","Montée progressive (rien d’explosif dans les 5 premières minutes)","FC prise à la fin"]},
  carte:"Règle du coach : si le binôme réussit 7 à 10 répétitions propres sur 10, il passe à l’exercice suivant ; 0 à 3, il revient à l’exercice précédent (plus facile)."
};
const ETIREMENTS = [
  ["Quadriceps","Debout, talon vers la fesse, genoux serrés, bassin en avant. 20 s par jambe."],
  ["Ischio-jambiers","Assis jambe tendue, on avance le buste dos plat vers le pied. 20 s."],
  ["Fessiers","Allongé, cheville sur le genou opposé, on tire la cuisse vers soi. 20 s par côté."],
  ["Mollets","Mains au mur, jambe arrière tendue talon au sol. 20 s par jambe."],
  ["Pectoraux","Avant-bras contre un montant, on tourne doucement le buste à l’opposé. 20 s."],
  ["Triceps et épaules","Main dans le dos par-dessus l’épaule, l’autre main tire le coude. 20 s."],
  ["Dos","À quatre pattes, dos rond puis dos creux lentement (chat), puis assis sur les talons bras devant. 30 s."],
  ["Psoas","Fente genou au sol, bassin poussé vers l’avant, buste droit. 20 s par côté."]
];
const ETIRE_REGLE = "Après l’effort : étirements doux, 20 à 30 s, sans douleur, en soufflant. On étire en priorité les muscles qu’on vient de faire travailler (c’est noté dans l’AFL1 : « étirements précis, adaptés et systématiques »).";

/* ---------- Banque de situations (4 par catégorie) ---------- */
const BANQUE = [
 {cat:"Apprendre un mouvement", items:[
  {t:"Le miroir du coach", n:"N1", rem:"Remplace : atelier technique en S1 ou S3", d:"A fait 5 répétitions lentes ; B, face à lui, montre avec ses mains ce qui ne va pas (genoux, dos, amplitude). On inverse.", r:"5 répétitions validées par le coach sur les 3 critères."},
  {t:"Le bâton dans le dos", n:"N1", rem:"Remplace : charnière de hanche (soulevé de terre, swing)", d:"Bâton tenu dans le dos : tête, haut du dos et bassin restent collés au bâton pendant la descente.", r:"10 descentes sans perdre un des 3 contacts."},
  {t:"Tempo 3-1-1", n:"N2", rem:"Remplace : n’importe quel mouvement mal maîtrisé", d:"3 s pour descendre, 1 s en bas, 1 s pour remonter. La lenteur montre les défauts.", r:"6 répétitions au tempo, sans perdre la posture."},
  {t:"La vidéo d’une seule question", n:"N2", rem:"Remplace : Tabata filmé (GAREEPS)", d:"Le partenaire filme 20 s. On regarde avec une seule question : « Mes hanches passent-elles sous mes genoux ? » (ou une autre, choisie avant).", r:"Au 2e essai, le critère est vu 4 fois sur 5."}]},
 {cat:"Comprendre les formats", items:[
  {t:"Tabata à deux voix", n:"N1", rem:"Remplace : découverte du Tabata", d:"Le partenaire annonce « 3, 2, 1, go » et « stop » sans montre ; l’autre compte les rounds. On compare avec le vrai chrono.", r:"Le binôme sait dire combien dure un Tabata 20/10 × 8 (4 min) et pourquoi."},
  {t:"EMOM au temps restant", n:"N2", rem:"Remplace : EMOM découverte", d:"EMOM de 6 min, 2 exercices, 8 répétitions. Le partenaire note le temps restant à chaque minute sur une ardoise.", r:"La colonne des temps restants est remplie ; l’élève dit s’il est N1, N2 ou N3."},
  {t:"AMRAP miroir", n:"N2", rem:"Remplace : AMRAP test", d:"Le même AMRAP de 6 min en début et en fin de cycle ; on compare les tours.", r:"Le score est noté dans le carnet aux deux dates."},
  {t:"For time à juge", n:"N3", rem:"Remplace : défi de fin de séance", d:"3 tours de 10-10-10 ; le juge compte les « no rep » qui s’ajoutent en secondes (5 s chacun).", r:"Le temps final tient compte des no rep."}]},
 {cat:"Régler l’intensité", items:[
  {t:"Le ticket de FC", n:"N1", rem:"Remplace : prise de FC", d:"Après chaque WOD, FC prise en 15 s × 4 et notée sur un ticket ; on la compare à la fourchette de son mobile.", r:"3 prises justes (le professeur vérifie une fois)."},
  {t:"Plus ou moins", n:"N2", rem:"Remplace : régulation", d:"Chaque exercice a sa version − et +. Au round suivant, le coach dit « monte » ou « descends » selon la FC et la posture.", r:"Au moins une régulation justifiée par WOD."},
  {t:"Deux intensités", n:"N2", rem:"Remplace : choix du mobile", d:"Même Tabata à 70 % puis à fond (reprise quand la FC revient à 110-120). On compare les ressentis.", r:"L’élève décrit 2 ressentis différents et choisit son mobile."},
  {t:"Le spécial", n:"N3", rem:"Remplace : Tabata élevé", d:"Tabata sur une seule zone (INF, SUP, TRONC ou CARDIO) : 4 exercices différents de la même zone.", r:"Rounds réguliers : écart de moins de 3 répétitions entre le meilleur et le moins bon round."}]},
 {cat:"Coacher, juger, aider", items:[
  {t:"Rep / no rep", n:"N1", rem:"Remplace : rôle de juge", d:"Le juge a un seul critère (par exemple « poitrine au sol ») et dit à voix haute « rep » ou « no rep ».", r:"Le juge et le professeur sont d’accord sur 4 répétitions sur 5."},
  {t:"Le coach muet", n:"N2", rem:"Remplace : coaching", d:"Le coach n’a pas le droit de parler : il montre le temps restant et l’exercice suivant avec les doigts et une ardoise.", r:"L’athlète n’a jamais à demander où il en est."},
  {t:"Le carnet à deux mains", n:"N2", rem:"Remplace : bilan", d:"Le partenaire remplit la colonne « observé » du carnet, l’athlète la colonne « ressenti » ; on compare.", r:"Au moins une différence discutée."},
  {t:"Le coach qui ajuste", n:"N3", rem:"Remplace : SRP analyse", d:"Le coach décide seul de la régulation (+ / −) au round suivant, puis la justifie à l’athlète.", r:"La régulation est cohérente avec la FC et la posture."}]}
];

/* ---------- Différenciation ---------- */
const DIFF = [
  ["Élève qui découvre (aucune pratique)","Version − de chaque exercice, Tabata N1, binôme avec un élève à l’aise. Rien d’explosif avant S3."],
  ["Élève très à l’aise (club, salle)","Rôle de coach-ressource : il valide les mouvements d’un autre binôme. Versions + et charges un cran au-dessus, sur validation du professeur."],
  ["Douleur au genou","Pas de sauts ni de fentes sautées : montées sur box basse, chaise, hip thrust. On garde la même structure de WOD."],
  ["Douleur au dos","Pas de charge, pas de swing ; gainage (planche, superman), hip thrust ; soulevé de terre seulement au bâton."],
  ["Douleur aux poignets","Pompes sur les poings ou sur le banc, planches sur les avant-bras, pas de burpees."],
  ["Inaptitude partielle (certificat)","Exercices compatibles listés avec le certificat ; rôles d’assistant et de juge renforcés ; même carnet."],
  ["Inaptitude totale le jour même","Assistant d’un binôme : chrono, comptage, FC, carnet. Il note aussi les « no rep »."]
];

/* ---------- Sources ---------- */
const SOURCES = [
  ["Référentiel du lycée Georges Pompidou, CA5 cross training (0341921D-LGT-5009).",""],
  ["A. Boissière et J. Sacquépée (GAREEPS), « Savoir s’entraîner dans le CA5 en lycée professionnel : une illustration en cross training ».",""],
  ["J. Sacquépée et O. Prado, « Enseigner par compétences : apprendre à concevoir », Revue EP&S n° 388, 2020 (musculation, démarche GAREEPS).",""],
  ["J. Courtois, scénario pédagogique enrichi par le numérique « Optimisation des observables », Cercle Num-EPS de l’académie de Montpellier.",""],
  ["GAREEPS, académie de Montpellier : démarche SCE, SRP, STOM.","https://disciplines.ac-montpellier.fr/eps/gareeps"],
  ["I. Tabata et coll. (1996), « Effects of moderate-intensity endurance and high-intensity intermittent training on anaerobic capacity and VO2max », Med Sci Sports Exerc 28(10).",""],
  ["Fiches d’évaluation de l’équipe EPS de Pompidou (2021 à 2025) et travaux de T. L., G. G., V. C.",""],
  ["Appli chrono élève Cross Training Pompidou.", "https://yannickdartois-hue.github.io/cross-training-pompidou/"]
];

/* ================== FICHES (réutilisées d'une séance à l'autre) ==================
   Une fiche = une situation. Sa durée est celle du déroulé de la séance (F(fiche, durée)). */
const F = (o, d) => Object.assign({}, o, {duree:d});
const MOB_RAPPEL = "Modéré : FC visée 140 à 160. Élevé : 160 à 180.";

const FI = {
 /* ----- Échauffements ----- */
 echG:{titre:"Échauffement guidé en 4 étapes", cat:"Échauffement", dispo:"Toute la classe autour du tatami, puis chacun à sa place face au professeur. Le binôme côte à côte.",
  roles:"Tous pratiquent. Le partenaire vérifie une seule chose à l’activation : les genoux dans l’axe des pieds au squat.",
  deroul:["Monter la température (3 min) : course autour du tatami, talons-fesses, montées de genoux, pas chassés, 3 accélérations.","Mobiliser (3 min) : cou, épaules, poignets, hanches, genoux, chevilles.","Activer (3 min) : 10 squats lents, 10 fentes, 10 pompes sur les genoux, 20 s de planche, 10 ponts fessiers.","Monter l’intensité (3 min) : 2 × 20 s de jumping jacks, 2 × 20 s de mountain climbers, puis prise de FC (au-dessus de 120)."],
  crit:"Progressif : rien d’explosif dans les 5 premières minutes. Les 4 étapes sont toujours dans le même ordre : c’est ce que l’élève devra reproduire seul à partir de S5.",
  reussite:"Chaque élève a une FC au-dessus de 120 à la fin et sait nommer les 4 étapes.",
  moins:"Étape 4 en marchant (pas de sauts).", plus:"Étape 4 : 2 × 20 s de burpees.", schema:"echauff"},
 echGHanche:{titre:"Échauffement guidé et charnière de hanche", cat:"Échauffement", dispo:"Autour du tatami puis à sa place. Un bâton (ou un manche) par binôme.",
  roles:"Tous pratiquent ; à l’activation, le partenaire vérifie les 3 contacts du bâton (tête, dos, bassin).",
  deroul:["Température (3 min) : course, talons-fesses, montées de genoux, pas chassés.","Mobilisation (3 min) : épaules, poignets, hanches (grands cercles), chevilles.","Activation (3 min) : 10 soulevés de terre au bâton dans le dos, 10 squats lents, 10 ponts fessiers, 20 s de planche.","Intensité (3 min) : 2 × 20 s de jumping jacks, 2 × 20 s de squats rapides ; FC au-dessus de 120."],
  crit:"Charnière de hanche : on recule les fesses comme pour fermer une porte avec elles ; le bâton ne quitte ni la tête, ni le dos, ni le bassin.",
  reussite:"10 soulevés de terre au bâton sans perdre un contact.",
  moins:"Mains sur les hanches au lieu du bâton.", plus:"Une jambe (soulevé de terre unipodal, bras écartés).", schema:"mv:kb-deadlift,squat"},
 echA:{titre:"Échauffement autonome du binôme", cat:"Échauffement", dispo:"Chaque binôme dans son espace avec le matériel de son WOD. L’échauffement est écrit dans le carnet avant de commencer.",
  roles:"Les deux s’échauffent ensemble ; l’un lit les étapes du carnet, l’autre chronomètre. Le professeur passe valider 4 binômes.",
  deroul:["Température (3 min) puis mobilisation (3 min), comme en S1 à S4.","Activation (3 min) : les muscles du WOD du jour, mouvements lents (si le WOD est surtout INF : squats lents, fentes, ponts fessiers).","AMRAP en relais de 3 min : 2 exercices, 3 à 5 répétitions chacun ; on se tape dans la main pour changer. On compte les tours.","Prise de FC : au-dessus de 120, on est prêt."],
  crit:"4 étapes présentes, dans l’ordre ; activation des zones du WOD ; rien d’explosif à froid.",
  reussite:"Le professeur valide l’échauffement écrit et réalisé ; FC au-dessus de 120.",
  moins:"Le binôme reprend l’échauffement guidé affiché.", plus:"Le binôme ajoute une étape de technique à charge légère (5 répétitions du mouvement chargé du WOD).", schema:"echauff"},

 /* ----- Mouvements ----- */
 fondamentaux:{titre:"Les six mouvements de base", cat:"Technique", dispo:"Par deux sur le tatami. 6 mouvements affichés : squat, fente, pompe, planche, hip thrust, burpee (décomposé).",
  roles:"A fait 5 répétitions lentes ; B, à 2 m de profil, regarde les 3 critères (placement, respiration, amplitude) et dit ce qui est validé. On inverse à chaque mouvement.",
  deroul:["Le professeur montre le squat et ses 3 critères ; les binômes font 2 × 5 répétitions chacun (2 min).","Même chose pour la fente et la pompe (version sur les genoux possible).","Planche (20 s) et hip thrust (8 répétitions).","Burpee décomposé : accroupi, pieds en arrière, poitrine au sol, pieds aux mains, saut. 5 lents, puis 5 enchaînés."],
  crit:"Placement : genoux dans l’axe, dos plat, corps gainé. Respiration : on souffle dans l’effort (en remontant, en poussant). Amplitude : hanches sous les genoux au squat, poitrine à 5 cm du sol à la pompe.",
  reussite:"Chaque élève a au moins 4 mouvements sur 6 validés sur les 3 critères par son partenaire.",
  moins:"Squat sur banc, pompes sur les genoux, burpee sans pompe.", plus:"Tempo 3 s pour descendre sur chaque mouvement.", schema:"mv:squat,fente-genou,pompe,planche,hip-thrust,burpee"},
 zonesNiveaux:{titre:"Zones et niveaux : essayer pour comprendre", cat:"Technique", dispo:"Par deux. Planche des exercices affichée : 4 zones (INF, SUP, TRONC, CARDIO) et 3 niveaux (N1, N2, N3).",
  roles:"A essaie, B chronomètre 20 s et compte ; on inverse à chaque zone. B note la FC de A après le N1 puis après le N3.",
  deroul:["INF : chaise (N1), squat (N2), jump squat (N3) : 20 s chacun, 10 s pour changer.","SUP : pompes au mur (N1), pompes (N2), pompes claquées ou planche-pompe (N3).","TRONC : planche (N1), planche jack (N2), mountain climber croisé (N2+).","CARDIO : jumping jack (N1), X jack (N2), burpee (N3). Prise de FC après le N1 et après le N3 : on compare."],
  crit:"N1 : statique ou facile. N2 : dynamique, intensité modérée. N3 : cardio et technique, avec impulsion. Le N3 n’est valable que si la posture tient.",
  reussite:"L’élève classe 4 exercices qu’il n’a pas faits dans la bonne zone et le bon niveau (planche à l’appui).",
  moins:"N1 et N2 seulement.", plus:"Ajouter une version chargée en N2 (kettlebell).", schema:"mv:chaise,squat,jump-squat,pompe-mur,pompe,burpee"},
 charniere:{titre:"Du bâton à la kettlebell : soulevé de terre et goblet squat", cat:"Technique · petit matériel", dispo:"Par deux, une kettlebell (ou un haltère) par binôme : 4 à 8 kg (filles), 8 à 12 kg (garçons). Bâtons.",
  roles:"A travaille ; B est juge du dos : il dit « plat » ou « rond » à chaque répétition. On inverse toutes les 2 séries.",
  deroul:["Bâton dans le dos : 2 × 8 charnières de hanche (3 contacts).","Soulevé de terre kettlebell : 3 × 8. Kettlebell entre les pieds, on recule les fesses, dos plat, on se relève en serrant les fessiers.","Goblet squat : 3 × 8. Kettlebell contre la poitrine, coudes entre les genoux en bas.","Chacun choisit sa charge : 10 répétitions propres en gardant 2 répétitions « en réserve »."],
  crit:"Soulevé de terre : ce sont les hanches qui bougent, pas les genoux. Goblet squat : on s’assoit entre ses talons, buste haut. Jamais de dos rond sous charge.",
  reussite:"3 séries de 8 sans aucun « rond » annoncé par le juge.",
  moins:"Sans charge, au bâton.", plus:"Pause de 2 s en bas du goblet squat.", schema:"mv:kb-deadlift,goblet-squat"},
 boxBanc:{titre:"Box et banc : monter, sauter, pousser", cat:"Technique · petit matériel", dispo:"Postes de 4 : une box basse et un banc par poste ; 2 binômes par poste. Tapis sous la box.",
  roles:"Un binôme travaille, l’autre est pareur et juge (réception sur toute la box, redescente en marchant). On change toutes les 2 min.",
  deroul:["Montée sur box : 2 × 10 en alternant la jambe qui pousse.","Saut sur box basse : 2 × 5. Bras en arrière, impulsion à deux pieds, réception en squat, on redescend en marchant.","Dips sur banc : 2 × 10, dos qui frôle le banc.","Sauts latéraux par-dessus le banc : 2 × 10 (mains sur le banc pour la version −)."],
  crit:"Box : pied entier posé, jamais le bord. On ne redescend jamais en sautant en arrière. Banc : bien calé, pas au bord du tatami.",
  reussite:"5 sauts sur box réceptionnés en squat stable, sans toucher le bord.",
  moins:"Montée sur box à la place du saut.", plus:"Box plus haute, validée par le professeur.", schema:"mv:step-up,box-jump,dips-banc,saut-lateral-banc"},
 swing:{titre:"Le swing russe en 3 étapes", cat:"Technique · petit matériel", dispo:"Une kettlebell par binôme, 2 m libres devant et derrière chaque élève. Personne dans l’axe du swing.",
  roles:"A travaille ; B se place de profil à 3 m (jamais devant) et regarde : dos plat, kettlebell à hauteur des yeux maximum. On inverse toutes les séries.",
  deroul:["Soulevé de terre kettlebell : 1 × 8 (rappel S3).","« Passe » (hike) : kettlebell posée devant les pieds, on la lance entre les cuisses comme un ballon de rugby et on la repose, 2 × 5.","Swing : on enchaîne la passe et le coup de bassin ; la kettlebell monte à hauteur de poitrine puis des yeux. 3 × 10.","Arrêt : on ralentit sur 2 swings et on repose la kettlebell entre les pieds, dos plat."],
  crit:"Ce sont les hanches qui propulsent la kettlebell, les bras ne tirent pas. On souffle quand elle monte. Charnière de hanche, pas squat.",
  reussite:"10 swings de suite, kettlebell à hauteur des yeux, dos plat (validé par B).",
  moins:"Soulevé de terre kettlebell.", plus:"Kettlebell plus lourde (validée par le professeur).", schema:"mv:swing,kb-deadlift"},
 barreDL:{titre:"Soulevé de terre à la barre", cat:"Technique · barre", dispo:"Une barre par groupe de 4 (2 binômes), barre seule au début. Disques posés à côté, colliers obligatoires.",
  roles:"A soulève ; B, de profil, est juge du dos ; l’autre binôme charge et vérifie les colliers. On tourne toutes les 2 séries.",
  deroul:["Rappel au bâton : 2 × 8 charnières de hanche.","Barre seule : 3 × 6. Barre au-dessus du milieu du pied, tibias contre la barre, épaules au-dessus de la barre, on inspire et on gaine, on pousse le sol.","Si le juge et le professeur valident : +2,5 kg par côté, 2 × 6.","Chacun note sa charge de travail : 8 répétitions propres avec 2 en réserve."],
  crit:"Dos plat du début à la fin. La barre frôle les jambes. Debout complet sans se cambrer. On redescend en reculant les fesses d’abord.",
  reussite:"6 répétitions validées par le juge à la charge choisie.",
  moins:"Soulevé de terre kettlebell.", plus:"Tempo 3 s à la descente.", schema:"mv:deadlift,kb-deadlift"},
 barreFSPP:{titre:"Front squat et push press", cat:"Technique · barre", dispo:"Une barre par groupe de 4, barre seule. Espace de 2 m autour de chaque barre.",
  roles:"A travaille ; B de profil juge les coudes (front squat) ou la tête « dans la fenêtre » (push press). L’autre binôme pare et charge.",
  deroul:["Position de rack : barre sur l’avant des épaules, coudes hauts, 3 × 20 s de maintien.","Front squat : 3 × 6, buste vertical, coudes qui restent hauts.","Push press : 3 × 6. Petite flexion des genoux, poussée des jambes, bras tendus au-dessus de la tête.","Chacun choisit une charge pour 8 répétitions propres avec 2 en réserve."],
  crit:"Front squat : si les coudes tombent, la barre roule vers l’avant : on arrête la série. Push press : petite flexion, pas un squat ; oreilles entre les bras en haut.",
  reussite:"6 front squats et 6 push press validés par le juge.",
  moins:"Goblet squat et développé haltères.", plus:"Thruster (S3).", schema:"mv:front-squat,push-press"},
 thruster:{titre:"Le thruster", cat:"Technique · barre", dispo:"Une barre (ou 2 haltères légers) par binôme. Espace de 2 m.",
  roles:"A travaille ; B juge : debout complet avant que la barre ne parte, bras tendus en haut.",
  deroul:["Front squat : 1 × 6 (rappel).","Front squat puis push press séparés : 3 × 3.","Thruster : on enchaîne sans s’arrêter debout, 3 × 6.","Thruster au rythme : 5 thrusters en 20 s, 2 fois."],
  crit:"L’élan des jambes fait partir la barre ; on souffle en poussant ; retour aux épaules en amortissant avec les jambes.",
  reussite:"6 thrusters de suite validés par le juge.",
  moins:"Thruster aux haltères légers.", plus:"Charge augmentée de 2,5 kg par côté.", schema:"mv:thruster,front-squat"},
 juge:{titre:"Rep ou no rep : apprendre à juger", cat:"Rôles", dispo:"Par deux, puis par 4 (2 binômes) pour confronter les jugements. Planche des critères affichée.",
  roles:"A travaille ; B juge à voix haute « rep » ou « no rep » sur UN critère choisi avant ; l’autre binôme juge en silence le même critère. On compare.",
  deroul:["Squat : critère « hanches sous les genoux ». 10 répétitions, dont A rate volontairement 3.","Pompe : critère « poitrine à 5 cm du sol ». 10 répétitions.","Burpee : critère « poitrine au sol et saut ». 6 répétitions.","Les deux juges comparent leurs no rep ; on discute les désaccords."],
  crit:"Le juge regarde de profil, à 2 m. Il annonce tout de suite. Il juge ce qu’il voit, pas l’élève.",
  reussite:"Les deux juges sont d’accord sur au moins 8 répétitions sur 10.",
  moins:"Le juge a le droit de regarder de face.", plus:"Deux critères en même temps.", schema:"org:juge"},

 /* ----- Formats ----- */
 premierTabata:{titre:"Mon premier Tabata (20 s / 10 s × 8)", cat:"Format · Tabata", dispo:"Par deux, chacun dans son espace. Le professeur donne le chrono pour toute la classe.",
  roles:"A fait le Tabata ; B compte les répétitions de chaque round à voix haute et les note, puis prend la FC de A. On inverse.",
  deroul:["Explication : 8 rounds de 20 s d’effort et 10 s de repos = 4 min. Vertical : squat, pompe, squat, pompe…","A fait le Tabata (4 min) ; B note les 8 scores et la FC.","On inverse (4 min).","On compare : le round 1 et le round 8 ont-ils le même score ?"],
  crit:"Des rounds réguliers : on ne part pas à fond. Pendant les 10 s de repos, on se met déjà en place pour l’exercice suivant.",
  reussite:"Moins de 4 répétitions d’écart entre le meilleur et le moins bon round, sans perdre la posture.",
  moins:"Pompes sur les genoux, squat sur banc.", plus:"Jump squat à la place du squat.", schema:"fmt:tabata:20:10:8"},
 tabataChoisi:{titre:"Mon Tabata à 4 exercices", cat:"Format · Tabata", dispo:"Par deux. Chaque élève choisit 4 des 6 mouvements de base, un par zone (INF, SUP, TRONC, CARDIO).",
  roles:"A travaille ; B annonce l’exercice suivant pendant le repos, compte, note, prend la FC et demande le ressenti (1 à 4). On inverse.",
  deroul:["A écrit ses 4 exercices dans le carnet (1 min).","Tabata 20 s / 20 s × 8, vertical : 1, 2, 3, 4, 1, 2, 3, 4 (5 min 20).","FC dans les 10 s et ressenti de 1 à 4 notés par B.","On inverse."],
  crit:"Les 4 zones sont présentes. La FC est prise dans les 10 s. Le ressenti est expliqué en un mot (essoufflé, brûlure, facile…).",
  reussite:"Carnet rempli : 4 exercices, 8 scores, FC, ressenti.",
  moins:"Versions − des exercices.", plus:"20 s / 10 s.", schema:"fmt:tabata:20:20:8"},
 vertHoriz:{titre:"Vertical ou horizontal ?", cat:"Format · Tabata", dispo:"Par deux. Les 4 mêmes exercices pour les deux élèves.",
  roles:"A fait le Tabata vertical, B compte ; puis B fait le Tabata horizontal, A compte.",
  deroul:["Vertical (A) : 1, 2, 3, 4, 1, 2, 3, 4 ; 20 s / 20 s (5 min 20).","Horizontal (B) : 1, 1, 2, 2, 3, 3, 4, 4.","Chacun note sa FC et son ressenti.","On compare : lequel fait le plus « brûler » ? Lequel fait le plus monter la FC ?"],
  crit:"Horizontal : la même zone travaille 2 rounds de suite, les muscles brûlent plus. Vertical : on récupère d’une zone pendant qu’une autre travaille.",
  reussite:"Le binôme explique la différence avec ses propres mesures.",
  moins:"Versions −.", plus:"Exercices N3.", schema:"fmt:tabata:20:20:8"},
 tabataMod:{titre:"Le Tabata du mobile modéré (30 s / 30 s)", cat:"Format · Tabata modéré", dispo:"Par deux, chacun son espace. Format de l’épreuve en intensité modérée, niveau N1.",
  roles:"A travaille ; B annonce, compte, note la FC à la fin. On inverse.",
  deroul:["A choisit 4 exercices : les 4 zones, 3 N2 et 1 N1.","Tabata 30 s / 30 s, 2 × 4 exercices = 8 rounds (8 min).","FC dans les 10 s : est-elle entre 140 et 160 ?","On inverse."],
  crit:"Rythme régulier pendant 8 min. Si la FC dépasse 160, on choisit un exercice plus facile au prochain essai ; sous 140, un plus dynamique.",
  reussite:"FC entre 140 et 160 à la fin, postures tenues sur au moins 6 rounds sur 8.",
  moins:"2 N1 + 2 N2.", plus:"Tabata modéré N2 : 30 s / 20 s, 2 × 5 exercices.", schema:"fmt:tabata:30:30:8"},
 emomDecouverte:{titre:"EMOM au temps restant", cat:"Format · EMOM", dispo:"Par deux. Une ardoise ou le carnet. Le professeur donne le top de chaque minute.",
  roles:"A travaille ; B regarde le chrono et note le temps restant à la fin des répétitions de chaque minute. On inverse.",
  deroul:["Explication : au top, 8 goblet squats + 8 pompes ; le temps qui reste dans la minute, c’est le repos.","EMOM de 6 min pour A ; B note 6 temps restants.","On inverse.","Lecture : plus de 30 s de repos = N1 ; 20 à 30 s = N2 ; 10 à 20 s = N3 ; moins de 10 s : trop dur, il faut réguler."],
  crit:"On ne part pas avant le top. Les répétitions sont complètes même si on est pressé.",
  reussite:"Les 6 temps restants sont notés et l’élève dit à quel niveau il était.",
  moins:"6 + 6 répétitions.", plus:"10 + 10, ou 3 exercices.", schema:"fmt:emom:6"},
 emomMod:{titre:"EMOM de 8 min, 3 exercices", cat:"Format · EMOM", dispo:"Par deux, avec le matériel choisi. Format de l’épreuve (modéré) : 3 exercices enchaînés dans la minute, minimum 7 répétitions.",
  roles:"A travaille ; B note le temps restant et les régulations (« je passe à 6 », « je passe en − »). On inverse.",
  deroul:["A choisit 3 exercices dans 3 zones différentes, niveau N2, et ses répétitions (7 minimum).","EMOM 8 min.","B note : temps restant à chaque minute, nombre de régulations.","On inverse."],
  crit:"Temps restant stable d’une minute à l’autre. Une régulation se décide avant la minute, pas au milieu.",
  reussite:"8 minutes terminées, temps restant jamais sous 10 s, au plus 2 régulations.",
  moins:"6 répétitions, versions −.", plus:"4 exercices, ou temps restant visé 10 à 20 s (N3).", schema:"fmt:emom:8"},
 emomBarre:{titre:"EMOM à la barre", cat:"Format · EMOM", dispo:"Groupes de 4 autour d’une barre chargée légèrement. Deux athlètes en même temps sur deux barres si possible.",
  roles:"A travaille ; B note le temps restant ; l’autre binôme juge les no rep. On tourne.",
  deroul:["EMOM 6 min : 5 front squats + 5 push press (charge de S2).","B note le temps restant ; le juge note les no rep.","On inverse.","Régler la charge : moins de 10 s de repos = trop lourd ; plus de 35 s = un peu plus lourd la prochaine fois."],
  crit:"Les critères du front squat et du push press restent valables à la 6e minute.",
  reussite:"6 minutes avec au plus 2 no rep.",
  moins:"Haltères.", plus:"6 + 6 répétitions.", schema:"fmt:emom:6"},
 emomPlus1:{titre:"Défi EMOM+1", cat:"Format · défi", dispo:"Par deux. Thrusters légers (ou burpees pour qui n’a pas validé la barre).",
  roles:"A travaille ; B annonce le nombre de la minute et compte. On inverse.",
  deroul:["Minute 1 : 3 répétitions ; minute 2 : 4 ; minute 3 : 5… on ajoute 1 à chaque minute.","On s’arrête quand on ne termine pas dans la minute.","Score : dernière minute réussie.","On inverse."],
  crit:"Les répétitions restent complètes : un no rep ne compte pas.",
  reussite:"L’élève note son score et décrit ce qu’il a senti quand le repos a disparu.",
  moins:"Départ à 2 répétitions.", plus:"Départ à 5.", schema:"fmt:emom1:6"},
 forTime:{titre:"For time à juge", cat:"Format · défi", dispo:"Groupes de 4 : un athlète, un juge, un chrono, un supporter. Puis on tourne.",
  roles:"Athlète, juge (no rep = +5 s), chrono (temps), supporter (annonce les répétitions restantes).",
  deroul:["3 tours de : 10 squats (ou thrusters légers), 10 pompes, 10 sit-ups.","Temps limite : 6 min.","Le temps final = temps chronométré + 5 s par no rep.","On tourne les rôles."],
  crit:"Vite, mais propre : un no rep coûte plus cher qu’une répétition lente.",
  reussite:"Moins de 3 no rep.",
  moins:"2 tours.", plus:"Thrusters à la barre.", schema:"fmt:fortime"},
 amrapTest:{titre:"AMRAP test de 6 min", cat:"Format · test", dispo:"Par deux. Le même AMRAP servira à mesurer les progrès en fin de cycle.",
  roles:"A travaille ; B compte les tours et les répétitions, juge les no rep. On inverse.",
  deroul:["Circuit : 5 burpees, 10 squats (ou 10 thrusters légers en Terminale), 15 sit-ups.","6 min, le plus de tours possible.","Score : tours + répétitions (par exemple 4 tours + 12) ; FC à la fin.","On inverse ; score noté dans le carnet."],
  crit:"Pas de score sans répétitions complètes.",
  reussite:"Score et FC notés dans le carnet.",
  moins:"3 burpees sans pompe.", plus:"Burpee avec saut sur box.", schema:"fmt:amrap:6"},

 /* ----- Intensité et mobile ----- */
 deuxIntensites:{titre:"Deux intensités, deux ressentis", cat:"Intensité · choix du mobile", dispo:"Toute la classe en même temps, chacun son espace ; le professeur donne le chrono. Carnet ouvert à côté.",
  roles:"Tous pratiquent. Le partenaire prend la FC de l’autre à chaque arrêt et la note.",
  deroul:["Tabata 20 s / 10 s × 8 (4 min) au rythme d’une conversation : squat, planche jack, jumping jack, crunch.","Récupération jusqu’à ce que la FC revienne entre 110 et 120 (2 à 3 min). FC et ressenti notés.","Même Tabata, à fond.","FC et ressenti : on compare les deux colonnes ; chacun choisit son mobile."],
  crit:"Ressenti de 1 à 4 : 1 je parle normalement, 2 phrases courtes, 3 quelques mots, 4 je ne peux plus parler.",
  reussite:"L’élève écrit 2 ressentis différents et justifie son choix de mobile avec sa FC.",
  moins:"Versions − partout.", plus:"Version N3 pour le deuxième Tabata.", schema:"fmt:tabata:20:10:8"},
 plusMoins:{titre:"Plus ou moins : réguler au round suivant", cat:"Intensité · régulation", dispo:"Par deux. Chaque exercice du Tabata a une version − et une version + écrites dans le carnet.",
  roles:"A travaille ; B est coach : après chaque round, il dit « monte », « garde » ou « descends » selon la posture et le souffle.",
  deroul:["A prépare 4 exercices avec leurs versions − et + (2 min).","Tabata 20 s / 20 s × 8 ; B décide les régulations.","FC et ressenti ; B justifie chaque régulation.","On inverse."],
  crit:"On descend si la posture se dégrade ; on monte si la FC est sous la fourchette du mobile et que la posture tient.",
  reussite:"Au moins une régulation justifiée par élève.",
  moins:"Le professeur donne les versions − et +.", plus:"20 s / 10 s.", schema:"mv:pompe-genoux,pompe,pompe-claquee"},
 chargeJuste:{titre:"La charge juste", cat:"Intensité · charge", dispo:"Groupes de 4 autour d’une barre. Disques de 1,25 à 5 kg.",
  roles:"Un athlète, un juge, deux qui chargent et vérifient les colliers. On tourne.",
  deroul:["Soulevé de terre : séries de 5, +2,5 kg par côté tant que le juge valide.","On s’arrête à la dernière charge où les 5 répétitions sont parfaites ; charge de travail = cette charge moins 10 kg.","Même chose au front squat (paliers plus petits).","Chacun écrit ses charges de travail dans son tableau personnel."],
  crit:"On ne cherche pas son maximum : on cherche la charge avec laquelle 8 à 10 répétitions restent parfaites.",
  reussite:"Deux charges de travail notées et validées par le juge.",
  moins:"Kettlebell.", plus:"Ajouter le push press.", schema:"mv:deadlift,front-squat"},

 /* ----- Situations finales : WOD ----- */
 wodMobile:{titre:"Premier WOD de mon mobile", cat:"Situation finale · WOD", dispo:"Par deux. Chaque élève fait UN WOD de son mobile, environ 8 min.",
  roles:"A travaille ; B annonce, compte, note la FC et le ressenti ; puis on inverse.",
  deroul:["Modéré : Tabata 30 s / 30 s, 2 × 4 exercices (8 min) : les 4 zones, 3 N2 + 1 N1.","Élevé : Tabata 20 s / 20 s, 2 × 4 exercices (5 min 20), puis 3 min de récupération avec prise de FC.","FC dans les 10 s : dans la fourchette ? ("+"140-160 / 160-180).","On inverse."],
  crit:MOB_RAPPEL+" Postures et amplitude avant la vitesse.",
  reussite:"FC dans la fourchette de son mobile ; carnet rempli.",
  moins:"Versions −.", plus:"Niveau de Tabata au-dessus.", schema:"fmt:tabata:30:30:8"},
 wod2:{titre:"Le deuxième WOD de mon mobile", cat:"Situation finale · WOD", dispo:"Par deux, environ 8 min de travail par élève.",
  roles:"A travaille ; B est coach (temps restant, régulations, FC). On inverse.",
  deroul:["Modéré : EMOM 8 min, 3 à 4 exercices enchaînés, 7 répétitions minimum.","Élevé : Tabata « spécial » sur une seule zone (20 s / 10 s, 2 × 5 = 10 rounds, 5 min), puis 3 min de récupération et FC.","B note le temps restant (EMOM) ou les scores des rounds (Tabata).","On inverse ; chacun écrit ce qu’il garde et ce qu’il change pour l’épreuve."],
  crit:MOB_RAPPEL+" EMOM : temps restant stable. Tabata spécial : les 4 exercices de la même zone sont différents.",
  reussite:"WOD terminé, FC dans la fourchette, au plus 2 régulations.",
  moins:"Versions −.", plus:"Niveau au-dessus.", schema:"fmt:emom:8"},
 wodComplet:{titre:"WOD complet au format de l’épreuve", cat:"Situation finale · épreuve", dispo:"Par deux : l’un travaille (21 min), l’autre observe avec la fiche d’évaluation. Matériel préparé avant le top.",
  roles:"Athlète : réalise ses WOD prévus. Observateur : chrono, répétitions par round, temps restant à l’EMOM, no rep, FC après chaque WOD, cases postures, amplitude, respiration.",
  deroul:["Modéré : Tabata 8 min, 5 min de récupération (étirements légers, FC), EMOM 8 min.","Élevé : Tabata 5 min, 3 min, Tabata spécial 5 min, 3 min, EMOM 5 min.","Après chaque WOD : FC dans les 10 s, ressenti de 1 à 4.","Le professeur observe 4 ou 5 athlètes avec la grille de l’AFL1."],
  crit:MOB_RAPPEL+" Le rythme doit tenir jusqu’au dernier WOD : c’est l’item « nombre de cycles réalisés ».",
  reussite:"Tous les WOD prévus terminés ; FC dans la fourchette sur au moins 2 WOD.",
  moins:"Un WOD de moins (l’élève note ce qu’il n’a pas fait).", plus:"Niveau de Tabata au-dessus.", schema:"wod"},
 wodCoache:{titre:"Le WOD 1 de mon épreuve, coaché", cat:"Situation finale · épreuve", dispo:"Par deux. Chacun fait le premier WOD de l’épreuve qu’il vient d’écrire.",
  roles:"Le partenaire est coach : il annonce, compte, juge un critère, prend la FC, conseille une régulation. Le professeur évalue le coach (AFL3).",
  deroul:["Modéré : le Tabata de 8 min prévu.","Élevé : le premier Tabata de 5 min prévu, puis 3 min de récupération.","FC, ressenti, conseil du coach notés.","On inverse ; chacun corrige sa fiche de l’épreuve si besoin."],
  crit:"Le coach parle pendant le repos, pas pendant l’effort (sauf pour encourager).",
  reussite:"Le coach a donné au moins un conseil précis que l’athlète a utilisé.",
  moins:"Le professeur fournit la grille du coach.", plus:"Le coach décide seul des régulations.", schema:"org:binome"},
 conception:{titre:"Concevoir mon épreuve", cat:"Conception", dispo:"Chacun avec son carnet et la fiche d’évaluation individuelle. Planche des exercices et tableau des niveaux affichés.",
  roles:"Seul, puis le partenaire relit avec la liste de contrôle ; le professeur valide 6 à 8 fiches.",
  deroul:["Choisir son mobile et sa répartition AFL2 / AFL3 (6/2, 4/4, 2/6).","Écrire ses WOD : format, niveau (N1 à N3), exercices, ordre, répétitions, versions − et +.","Écrire son échauffement en 4 étapes et ses étirements.","Liste de contrôle du partenaire : nombre d’exercices différents (6 à 8 / 8 à 10), 4 zones, niveaux, récupérations, FC visée."],
  crit:"Chaque choix a une raison écrite (« je mets le burpee en dernier parce que… »).",
  reussite:"Fiche complète validée par le partenaire et le professeur.",
  moins:"Fiche pré-remplie à trous.", plus:"Trame fictive de la séance suivante.", schema:"wod"},

 /* ----- GAREEPS ----- */
 sceConstruire:{titre:"Construire son WOD diagnostic", cat:"GAREEPS · SCE", dispo:"Chacun avec son carnet. Planche des exercices affichée.",
  roles:"Seul, puis le partenaire relit. Le professeur ne corrige pas : c’est un diagnostic.",
  deroul:["Choisir 4 exercices (un par zone) et un niveau de Tabata (20 s / 20 s ou 20 s / 10 s).","Choisir 3 exercices pour un EMOM de 6 min et un nombre de répétitions (7 minimum).","Écrire la FC visée et le ressenti attendu.","Préparer le matériel."],
  crit:"Les choix sont écrits AVANT de pratiquer : c’est ce qui permettra de mesurer l’axe conception.",
  reussite:"Le WOD est écrit en entier.",
  moins:"Exercices pris dans les 6 de base.", plus:"Ajouter les versions − et +.", schema:"etoile"},
 sce1:{titre:"SCE 1 : le WOD diagnostic", cat:"GAREEPS · SCE", dispo:"Par deux : un athlète, un observateur avec la grille des 3 axes (conception, production, analyse).",
  roles:"Athlète : réalise son WOD. Observateur : coche les critères de production (placement, respiration, amplitude, rythme), note répétitions, temps restant, FC ; demande les ressentis à la fin.",
  deroul:["Tabata 20 s / 20 s × 8 (5 min 20).","2 min de récupération, FC.","EMOM 6 min, 3 exercices.","FC, ressentis (muscles, souffle, mental) ; l’observateur remplit la grille."],
  crit:"L’observateur juge ce qu’il voit, critère par critère ; il ne donne pas de conseil pendant la SCE.",
  reussite:"Grille complète sur les 3 axes.",
  moins:"EMOM de 4 min.", plus:"Tabata 20 s / 10 s.", schema:"etoile"},
 sceComplet:{titre:"SCE au format de l’épreuve", cat:"GAREEPS · SCE", dispo:"Par deux : athlète et observateur avec la grille des 3 axes et la fiche d’évaluation.",
  roles:"Athlète : réalise ses WOD complets. Observateur : grille des 3 axes, score parlant, FC après chaque WOD, temps restant à l’EMOM.",
  deroul:["Modéré : Tabata 8 min, 5 min, EMOM 8 min.","Élevé : Tabata 5 min, 3 min, Tabata spécial 5 min, 3 min, EMOM 5 min.","FC et ressenti après chaque WOD.","L’observateur calcule le score parlant de chaque axe."],
  crit:MOB_RAPPEL+" Score parlant : 1 critère = 1, 2 = 10, 3 = 100, 4 = 1 000.",
  reussite:"Les 3 scores (conception, production, analyse) sont calculés.",
  moins:"Un WOD de moins.", plus:"Niveau au-dessus.", schema:"etoile"},
 srp:{titre:"SRP : je travaille mon axe prioritaire", cat:"GAREEPS · SRP", dispo:"3 ateliers dans le gymnase, un par axe. Chaque élève va à l’atelier de son axe prioritaire (choisi avec le professeur après la SCE).",
  roles:"Conception : seul puis validation. Production : binôme avec tablette. Analyse : binôme, le partenaire gère tout (chrono, annonce, pouls).",
  deroul:["Conception, le Rubik’s Cube : reconstituer en 3 min un WOD cohérent avec son mobile à partir des cartes, le faire valider, le réaliser.","Production, le Tabata filmé : un Tabata, la vidéo au ralenti, puis le même en corrigeant UN critère.","Analyse, deux intensités : même Tabata modéré puis à fond (reprise à FC 110-120) ; le partenaire questionne sur les ressentis.","Chaque élève note dans son carnet ce qui a changé."],
  crit:"On ne travaille qu’une chose à la fois. Le professeur reste surtout à l’atelier analyse (le plus difficile à guider).",
  reussite:"Conception : WOD validé du premier coup. Production : le critère passe de « non » à « oui » sur la vidéo. Analyse : 2 ressentis différents et justifiés.",
  moins:"Le professeur impose une partie des paramètres.", plus:"Deux critères ou deux contraintes.", schema:"srp"},
 srp2:{titre:"SRP 2 : mon axe, un cran plus loin", cat:"GAREEPS · SRP", dispo:"Mêmes 3 ateliers ; l’élève garde son axe s’il n’est pas validé, ou passe au suivant.",
  roles:"Comme en SRP 1 ; un élève qui a validé son axe devient coach-ressource à l’atelier correspondant.",
  deroul:["Conception : construire le WOD complet de son épreuve à partir des cartes, avec une contrainte tirée au sort (une zone imposée, un temps imposé).","Production : WOD filmé avec la charge ou le niveau N3 ; critère choisi par l’élève.","Analyse : le partenaire ne dit plus rien pendant le WOD ; l’élève prévoit son ressenti avant, puis le compare après.","Mise à jour de l’étoile."],
  crit:"Le coach-ressource ne fait pas à la place : il pose des questions.",
  reussite:"L’axe passe au niveau supérieur sur l’étoile.",
  moins:"SRP 1.", plus:"Contrainte double.", schema:"srp"},
 stom:{titre:"STOM : une seule variable", cat:"GAREEPS · STOM", dispo:"Par deux. Chaque élève reprend le WOD de sa SCE et ne change qu’une variable liée à son axe.",
  roles:"A travaille ; B vérifie uniquement la variable travaillée et la note sur 4 rounds.",
  deroul:["Conception : avant chaque round, A annonce le paramètre (temps, niveau, répétitions) ; B vérifie qu’il est cohérent avec le mobile.","Production : une seule consigne (« je souffle en remontant », « hanches sous les genoux »), vérifiée round par round.","Analyse : A associe des cartes-symboles (essoufflement, brûlure, lourdeur, transpiration) à ce qu’il ressent après chaque round.","On inverse."],
  crit:"Une variable, pas deux. Elle est écrite dans le carnet avant de commencer.",
  reussite:"La variable est validée sur 3 rounds sur 4.",
  moins:"2 rounds sur 4.", plus:"Ajouter une deuxième variable au 2e passage.", schema:"etoile"},

 /* ----- Évaluation (S9) ----- */
 evalRelire:{titre:"Relire et ajuster son projet", cat:"Évaluation · conception", dispo:"Chacun avec sa fiche d’évaluation remplie en S8 et son carnet.",
  roles:"Seul ; le partenaire vérifie que la fiche est complète. Le professeur ramasse les répartitions AFL2 / AFL3.",
  deroul:["Relire ses WOD, ses versions − et +, sa FC visée.","Ajuster si besoin (forme du jour), en écrivant pourquoi.","Préparer son matériel et celui de son WOD.","Placer la fiche à côté de l’espace de travail."],
  crit:"Un changement de dernière minute est permis s’il est justifié par écrit.",
  reussite:"Fiche complète, matériel prêt.",
  moins:"", plus:"", schema:"wod"},
 evalPassage:{titre:"Passage évalué", cat:"Évaluation", dispo:"Par deux : l’athlète réalise ses WOD, l’observateur remplit la fiche. Le professeur évalue l’AFL1 (produire) et l’AFL3 (rôles).",
  roles:"Athlète : ses WOD, ses régulations. Observateur : chrono, répétitions, no rep, temps restant, FC après chaque WOD. Le professeur circule avec la grille.",
  deroul:["Modéré : Tabata 8 min, 5 min de récupération, EMOM 8 min.","Élevé : Tabata 5 min, 3 min, Tabata spécial 5 min, 3 min, EMOM 5 min.","FC et ressenti après chaque WOD.","Étirements de l’athlète pendant que l’observateur termine la fiche."],
  crit:MOB_RAPPEL+" Le professeur note postures, amplitude, respiration, rythme (FC), échauffement, étirements, nombre de cycles.",
  reussite:"Tous les WOD prévus réalisés ; fiche remplie par l’observateur.",
  moins:"", plus:"", schema:"wod"},
 evalAnalyse:{titre:"Étirements et analyse de ma séance", cat:"Évaluation · analyse", dispo:"Chacun avec sa fiche et son carnet.",
  roles:"Seul pour l’analyse ; le partenaire écrit aussi l’analyse du binôme.",
  deroul:["Étirements précis des muscles travaillés (3 min).","Bilan de chaque cycle : FC, ressenti, régulations.","Justification des choix et bilan de la séance.","Trame fictive du prochain cours : ce que je changerais et pourquoi."],
  crit:"C’est l’AFL1 « analyser » : 5 points.",
  reussite:"Fiche rendue complète.",
  moins:"", plus:"", schema:"wod"}
};
/* Bilan de fin de séance : étirements + une rubrique du carnet */
const BIL = (rub, extra) => ({titre:"Étirements et carnet", cat:"Retour au calme", dispo:"Chacun à sa place, carnet ouvert. Planche des étirements affichée.",
  roles:"Chacun s’étire ; le partenaire vérifie la position une fois (20 s, sans douleur).",
  deroul:["Étirements des muscles travaillés aujourd’hui (4 à 5 min, 20 à 30 s chacun, en soufflant).","Carnet : "+rub+".", extra||"Bilan collectif : une chose réussie, une chose à travailler la prochaine fois."],
  crit:ETIRE_REGLE, reussite:"Carnet rempli avant de partir.", moins:"", plus:"", schema:"etire"});
const BIL_ETOILE = (n) => ({titre:"Étoile d’auto-positionnement "+n, cat:"GAREEPS · bilan", dispo:"Chacun avec sa grille d’observation et son carnet ; l’étoile à 3 branches (conception, production, analyse) dans le carnet.",
  roles:"Seul, puis entretien rapide avec le professeur pour 6 à 8 élèves.",
  deroul:["Étirements des muscles travaillés (4 min).","Chacun place son score sur chaque branche de l’étoile (couleurs des niveaux : rouge, jaune, vert clair, vert foncé).","Il choisit son axe prioritaire (la branche la plus courte) et l’écrit.","Le professeur valide les axes et forme les groupes de besoin pour la séance suivante."],
  crit:"On choisit UN axe. L’étoile compare l’élève à lui-même, pas aux autres.",
  reussite:"Étoile remplie, axe choisi et validé.", moins:"", plus:"", schema:"etoile"});

/* ================== LES SÉANCES ================== */
const TL = (a, b, c, d) => [["Installation",4,"inst"],["Échauffement",12,"ech"],[a||"Exercice 1",15,"ex"],[b||"Exercice 2",15,"ex"],[c||"Situation finale",19,"sf"],[d||"Étirements, carnet",10,"bil"]];
const TL_WOD = (a, b, d) => [["Installation",3,"inst"],["Échauffement autonome",12,"ech"],[a||"Passage A",22,"sf"],[b||"Passage B",22,"sf"],[d||"Étirements, carnet",16,"bil"]];
const TL_SCE1 = [["Installation",3,"inst"],["Échauffement",12,"ech"],["Construire son WOD",12,"ex"],["SCE · passage A",17,"sf"],["SCE · passage B",17,"sf"],["Étoile, bilan",14,"bil"]];
const TL_EVAL = [["Installation",3,"inst"],["Relire son projet",5,"ex"],["Échauffement autonome",12,"ech"],["Passage A",22,"sf"],["Passage B",22,"sf"],["Étirements, analyse",11,"bil"]];
/* une séance : les fiches suivent l'ordre du déroulé (hors installation) */
const S = (o, fiches) => { const d = o.tl.filter(t => t[2] !== "inst" && t[2] !== "acc").map(t => t[1]); return Object.assign(o, {fiches:fiches.map((f, i) => F(f, d[i]))}); };

const INSTALL = {
  s1:"Tatami libre, chaussures propres ou pieds nus (pas de chaussettes seules). Binômes choisis par les élèves : ils restent les mêmes jusqu’à l’évaluation (c’est un choix de l’AFL3). Carnet distribué. Prise de la FC de repos : assis 2 min, compter 30 s × 2.",
  mat:"Matériel sorti par les binômes avant le début, rangé le long du mur : on ne marche jamais entre les kettlebells. Une kettlebell n’est jamais posée sur le tatami en équilibre.",
  barre:"Barres et disques sortis par groupes de 4 ; colliers obligatoires ; 2 m libres autour de chaque barre ; on ne lâche jamais une barre au-dessus de la tête, on la redescend aux épaules.",
  wod:"Chaque binôme installe son espace et son matériel ; fiche d’observation et carnet à côté. Les athlètes A passent en premier.",
  sce:"Grilles d’observation des 3 axes distribuées ; chaque binôme installe son espace. Le professeur rappelle : pendant une SCE, l’observateur ne conseille pas, il note."
};

/* ---------- Première · démarche progressive ---------- */
const P_S1 = S({id:"S1", titre:"Les mouvements de base et le premier Tabata", mat:"poids de corps",
  obj:"Apprendre les 6 mouvements de base avec leurs 3 critères (placement, respiration, amplitude), découvrir le Tabata et noter ses premières données : FC de repos, FC d’effort, ressenti.",
  tl:TL("Six mouvements de base","Premier Tabata","Mon Tabata à 4 exercices"), install:INSTALL.s1,
  prepare:["AFL1 · Postures, amplitude, respiration : les 3 critères de tous les mouvements.","AFL1 · Rythme : première FC d’effort, à comparer aux fourchettes de l’épreuve.","AFL2 · Le carnet commence : tableau personnel (FC de repos), première séance notée.","AFL3 · Choix du partenaire et premier rôle d’assistant (compter, noter)."]},
  [FI.echG, FI.fondamentaux, FI.premierTabata, FI.tabataChoisi, BIL("FC de repos, FC de fin de Tabata, ressenti de 1 à 4, les 2 mouvements à revoir")]);
const P = [
 P_S1,
 S({id:"S2", titre:"Zones, niveaux et Tabata modéré", mat:"poids de corps",
  obj:"Classer les exercices par zone (INF, SUP, TRONC, CARDIO) et par niveau (N1 à N3), comparer Tabata vertical et horizontal, puis réaliser le Tabata du mobile modéré.",
  tl:TL("Zones et niveaux","Vertical ou horizontal","Tabata modéré 30/30"), install:"Mêmes binômes qu’en S1. Planche des exercices affichée (4 zones, 3 niveaux). Carnet ouvert à la page « tableau personnel ».",
  prepare:["AFL1 · Choisir des exercices de niveau adapté (référentiel : N1, N2, N3).","AFL1 · Rythme : la fourchette 140-160 du mobile modéré.","AFL2 · Tableau personnel : mes exercices par zone et par niveau."]},
  [FI.echG, FI.zonesNiveaux, FI.vertHoriz, FI.tabataMod, BIL("les exercices que je sais faire en N2 et en N3, par zone")]),
 S({id:"S3", titre:"L’EMOM et la charnière de hanche", mat:"poids de corps, kettlebell",
  obj:"Apprendre la charnière de hanche (soulevé de terre et goblet squat à la kettlebell légère), comprendre l’EMOM et lire son niveau grâce au temps restant.",
  tl:TL("Bâton puis kettlebell","EMOM au temps restant","EMOM de 8 min"), install:INSTALL.mat,
  prepare:["AFL1 · EMOM de l’épreuve : temps restant (N1 plus de 30 s, N2 20 à 30 s, N3 10 à 20 s) et nombre de régulations.","AFL1 · Postures sous charge : dos plat.","AFL3 · L’assistant note le temps restant de chaque minute."]},
  [FI.echGHanche, FI.charniere, FI.emomDecouverte, FI.emomMod, BIL("charge choisie, temps restant de mes 8 minutes, régulations")]),
 S({id:"S4", titre:"Choisir son mobile", mat:"poids de corps, box, banc",
  obj:"Ajouter la box et le banc, ressentir la différence entre les deux intensités et choisir son mobile en s’appuyant sur sa FC et ses ressentis.",
  tl:TL("Box et banc","Deux intensités","Premier WOD de mon mobile"), install:INSTALL.mat+" Box contre un tapis, jamais au bord du tatami.",
  prepare:["AFL2 · Choix du mobile (modéré ou élevé), justifié par les données.","AFL1 · Analyser : relier FC et ressenti.","AFL1 · Rythme : fourchette du mobile choisi."]},
  [FI.echG, FI.boxBanc, FI.deuxIntensites, FI.wodMobile, BIL("mon mobile, ma FC dans les deux intensités, pourquoi ce choix")]),
 S({id:"S5", titre:"Premier WOD complet, format de l’épreuve", mat:"selon le WOD",
  obj:"Réaliser pour la première fois tous les WOD de son mobile, enchaînés comme le jour J, observé par son partenaire avec la fiche d’évaluation.",
  tl:TL_WOD("Passage A","Passage B","Étirements, bilan de chaque WOD"), install:INSTALL.wod,
  prepare:["AFL1 · Forme exacte de l’épreuve : 2 WOD de 8 min (modéré) ou 3 WOD de 5 min (élevé), 21 min avec les récupérations.","AFL1 · Nombre de cycles réalisés.","AFL3 · L’observateur remplit la vraie fiche de l’épreuve.","Échauffement : premier échauffement autonome."]},
  [FI.echA, FI.wodComplet, FI.wodComplet, BIL("bilan de chaque WOD, ce que je garde, ce que je change ; répartition AFL2 / AFL3 envisagée","Le professeur montre 2 fiches d’observation bien remplies.")]),
 S({id:"S6", titre:"Réguler : plus ou moins, et le swing", mat:"poids de corps, kettlebell, box",
  obj:"Apprendre le swing russe, prévoir une version − et + pour chaque exercice et réguler au round suivant sur l’avis de son coach.",
  tl:TL("Le swing russe","Plus ou moins","Le deuxième WOD de mon mobile"), install:INSTALL.mat+" Swing : 2 m libres devant et derrière, personne dans l’axe.",
  prepare:["Référentiel · « Pour chaque exercice, l’élève prévoit deux niveaux (+ / −) pour réguler à chaque tour. »","AFL1 · EMOM : nombre de régulations.","AFL3 · Le coach décide et justifie une régulation."]},
  [FI.echA, FI.swing, FI.plusMoins, FI.wod2, BIL("mes versions − et + pour chaque exercice")]),
 S({id:"S7", titre:"Le binôme et la conception de l’épreuve", mat:"selon le WOD",
  obj:"Apprendre à juger (rep / no rep), écrire la fiche de son épreuve puis réaliser son premier WOD coaché par son partenaire.",
  tl:TL("Rep ou no rep","Concevoir mon épreuve","WOD 1 coaché"), install:"Fiches d’évaluation individuelles distribuées. "+INSTALL.mat,
  prepare:["AFL1 · Conception : la fiche de l’épreuve est écrite.","AFL3 · Les 3 rôles : supporter, assistant, coach.","AFL2 · Mon entraînement personnel et mes séances préparées."]},
  [FI.echA, FI.juge, FI.conception, FI.wodCoache, BIL("ce que mon coach m’a conseillé et ce que je modifie dans ma fiche")]),
 S({id:"S8", titre:"Épreuve à blanc et préparation du jour J", mat:"selon le WOD",
  obj:"Faire l’épreuve en entier dans les conditions du jour J, puis remplir la fiche d’évaluation de la S9 (le référentiel demande que la conception soit faite à la leçon précédente).",
  tl:TL_WOD("Épreuve à blanc A","Épreuve à blanc B","Étirements, fiche du jour J"), install:INSTALL.wod,
  prepare:["Épreuve complète : tous les éléments de l’AFL1 (produire et analyser).","Conception du jour J faite aujourd’hui, comme le demande le référentiel.","AFL2 / AFL3 : répartition des points choisie et écrite."]},
  [FI.echA, FI.wodComplet, FI.wodComplet, BIL("fiche d’évaluation du jour J remplie : mobile, WOD, exercices, niveaux, − et +, échauffement, FC visée, répartition AFL2 / AFL3","Le professeur relit les fiches et signale ce qui ne respecte pas le référentiel.")])
];
const S9 = (niv) => S({id:"S9", titre:niv==="t"?"Épreuve certificative":"Évaluation de fin de cycle", mat:"selon le WOD", status:"eval",
  obj:"Réaliser son épreuve : relire et ajuster son projet, s’échauffer seul, enchaîner ses WOD en régulant, observer son partenaire, puis analyser sa séance.",
  tl:TL_EVAL, install:"Matériel de chaque binôme installé avant le top. Fiches d’évaluation remplies en S8 posées à côté. Ordre de passage : A puis B. Le professeur a sa grille (AFL1 produire, AFL3).",
  prepare:["AFL1 · Produire (/7) et analyser (/5).","AFL2 · Carnet ramassé en fin de séance (/2, /4 ou /6).","AFL3 · Rôles observés pendant le passage du partenaire (/2, /4 ou /6).","Organisation : 2 passages de 21 min ; la conception de 15 min du référentiel a été faite en S8 (5 min de relecture aujourd’hui)."]},
  [FI.evalRelire, FI.echA, FI.evalPassage, FI.evalPassage, FI.evalAnalyse]);
P.push(S9("p"));

/* ---------- Première · démarche GAREEPS ---------- */
const PG = [
 P_S1,
 S({id:"S2", titre:"SCE 1 : le WOD diagnostic", mat:"poids de corps",
  obj:"Construire puis réaliser un WOD diagnostic observé sur les 3 axes (conception, production, analyse) et se positionner sur l’étoile pour choisir son axe prioritaire.",
  tl:TL_SCE1, install:INSTALL.sce,
  prepare:["AFL1 · Les 3 axes de l’épreuve : produire (production), analyser (analyse), et les choix de paramètres (conception).","AFL3 · Observer sans conseiller : recueillir des données fiables.","AFL2 · L’étoile est le premier repère du carnet."]},
  [FI.echG, FI.sceConstruire, FI.sce1, FI.sce1, BIL_ETOILE(1)]),
 S({id:"S3", titre:"SRP par axe et charnière de hanche", mat:"poids de corps, kettlebell",
  obj:"Apprendre la charnière de hanche à la kettlebell, puis travailler son axe prioritaire dans un atelier de résolution de problème ; découvrir l’EMOM.",
  tl:TL("Bâton puis kettlebell","SRP selon mon axe","EMOM au temps restant"), install:INSTALL.mat+" 3 ateliers SRP installés : cartes (conception), tablettes (production), espace calme (analyse).",
  prepare:["AFL1 · Selon l’axe : paramètres, postures, ou lien FC-ressenti.","AFL1 · EMOM : temps restant et régulations.","AFL3 · Le partenaire gère chrono et pouls à l’atelier analyse."]},
  [FI.echGHanche, FI.charniere, FI.srp, F(FI.emomDecouverte,19), BIL("ce qui a changé dans mon axe prioritaire, mes temps restants")]),
 S({id:"S4", titre:"STOM et choix du mobile", mat:"poids de corps, box, banc",
  obj:"Ajouter la box et le banc, travailler une seule variable de son axe (STOM), puis choisir son mobile à partir de deux intensités ressenties.",
  tl:TL("Box et banc","STOM : une variable","Deux intensités"), install:INSTALL.mat+" Box contre un tapis.",
  prepare:["AFL2 · Choix du mobile justifié.","AFL1 · Analyser : relier FC et ressenti.","Axe prioritaire : une variable validée sur 3 rounds sur 4."]},
  [FI.echG, FI.boxBanc, FI.stom, F(FI.deuxIntensites,19), BIL("mon mobile et pourquoi ; ma variable validée ou non")]),
 S({id:"S5", titre:"SCE 2 au format de l’épreuve", mat:"selon le WOD",
  obj:"Réaliser les WOD complets de son mobile en SCE, calculer les 3 scores parlants et mettre à jour son étoile.",
  tl:TL_WOD("SCE · passage A","SCE · passage B","Étoile, bilan"), install:INSTALL.sce,
  prepare:["AFL1 · Forme exacte de l’épreuve : 21 min de WOD et de récupérations.","AFL3 · Observation fiable avec la grille et le score parlant.","AFL2 · Étoile 2 : progrès depuis la SCE 1."]},
  [FI.echA, FI.sceComplet, FI.sceComplet, BIL_ETOILE(2)]),
 S({id:"S6", titre:"SRP 2 et swing russe", mat:"poids de corps, kettlebell, box",
  obj:"Apprendre le swing russe, retravailler son axe un cran plus loin, puis réaliser le deuxième WOD de son mobile avec ses régulations.",
  tl:TL("Le swing russe","SRP 2 selon mon axe","Le deuxième WOD de mon mobile"), install:INSTALL.mat+" Swing : 2 m libres, personne dans l’axe.",
  prepare:["Référentiel · versions − et + de chaque exercice.","AFL1 · Selon l’axe.","AFL3 · Coach-ressource pour les élèves qui ont validé leur axe."]},
  [FI.echA, FI.swing, FI.srp2, FI.wod2, BIL("mes versions − et + ; mon axe sur l’étoile")]),
 S({id:"S7", titre:"STOM, conception et coaching", mat:"selon le WOD",
  obj:"Fixer une dernière variable de son axe, écrire la fiche de son épreuve et réaliser son premier WOD coaché.",
  tl:TL("STOM : une variable","Concevoir mon épreuve","WOD 1 coaché"), install:"Fiches d’évaluation individuelles distribuées. "+INSTALL.mat,
  prepare:["AFL1 · Conception : fiche de l’épreuve écrite.","AFL3 · Les 3 rôles.","AFL2 · Mon entraînement personnel."]},
  [FI.echA, FI.stom, FI.conception, FI.wodCoache, BIL("conseil reçu et modification de ma fiche")]),
 S({id:"S8", titre:"SCE 3 : épreuve à blanc et jour J", mat:"selon le WOD",
  obj:"Faire l’épreuve en entier en SCE, mettre à jour l’étoile une dernière fois et remplir la fiche d’évaluation de la S9.",
  tl:TL_WOD("SCE 3 · passage A","SCE 3 · passage B","Étoile 3, fiche du jour J"), install:INSTALL.sce,
  prepare:["Épreuve complète.","Conception du jour J faite aujourd’hui.","AFL2 / AFL3 : répartition choisie."]},
  [FI.echA, FI.sceComplet, FI.sceComplet, Object.assign(BIL_ETOILE(3), {deroul:["Étirements (3 min).","Étoile 3 : chacun compare ses 3 étoiles.","Fiche d’évaluation du jour J : mobile, WOD, exercices, niveaux, − et +, échauffement, FC visée, répartition AFL2 / AFL3.","Le professeur relit les fiches."]})]),
 S9("p")
];

/* ---------- Terminale · démarche progressive ---------- */
const T_S1 = S({id:"S1", titre:"Reprise : test et soulevé de terre à la barre", mat:"poids de corps, barre",
  obj:"Retrouver les mouvements et les formats de Première, mesurer son point de départ (AMRAP test de 6 min, FC de repos) et apprendre le soulevé de terre à la barre.",
  tl:TL("Rappel des bases","Soulevé de terre barre","AMRAP test 6 min"), install:INSTALL.s1+" "+INSTALL.barre,
  prepare:["AFL2 · Tableau personnel mis à jour : FC de repos, score de l’AMRAP test (refait en S7).","AFL1 · Postures sous charge.","Rappel des 2 mobiles et de la forme de l’épreuve dès la 1re séance."]},
  [FI.echGHanche, Object.assign({}, FI.fondamentaux, {titre:"Rappel des mouvements et des formats", deroul:["Les 6 mouvements de base, 5 répétitions chacun, validés par le partenaire.","Rappel des formats de l’épreuve : Tabata (vertical, horizontal) et EMOM (temps restant).","Rappel des 2 mobiles et de leurs fourchettes de FC.","Chacun écrit dans son carnet le mobile qu’il pense choisir."]}), FI.barreDL, FI.amrapTest, BIL("FC de repos, score de l’AMRAP test, charge de travail au soulevé de terre")]);
const T = [
 T_S1,
 S({id:"S2", titre:"Front squat, push press et EMOM à la barre", mat:"poids de corps, barre",
  obj:"Apprendre le front squat et le push press, les utiliser dans un EMOM, puis réaliser un Tabata de son mobile.",
  tl:TL("Front squat et push press","EMOM à la barre","Premier WOD de mon mobile"), install:INSTALL.barre,
  prepare:["AFL1 · EMOM : temps restant et régulations.","AFL1 · Postures sous charge.","AFL1 · Rythme dans la fourchette du mobile."]},
  [FI.echGHanche, FI.barreFSPP, FI.emomBarre, FI.wodMobile, BIL("charges de travail, temps restant de l’EMOM")]),
 S({id:"S3", titre:"Thruster, EMOM+1 et for time", mat:"poids de corps, barre, kettlebell",
  obj:"Apprendre le thruster et découvrir deux formats hors épreuve (EMOM+1, for time) pour mieux comprendre la gestion de l’effort.",
  tl:TL("Le thruster","Défi EMOM+1","For time à juge"), install:INSTALL.barre,
  prepare:["Culture de l’activité : formats hors épreuve.","AFL3 · Juge et supporter.","AFL1 · Comprendre sa limite pour régler son rythme."]},
  [FI.echGHanche, FI.thruster, FI.emomPlus1, FI.forTime, BIL("ce que l’EMOM+1 m’apprend sur mon rythme")]),
 S({id:"S4", titre:"Choisir son mobile et sa charge", mat:"poids de corps, barre, box",
  obj:"Ressentir les deux intensités, choisir son mobile, régler ses charges de travail et réaliser un WOD de son mobile.",
  tl:TL("Deux intensités","La charge juste","Premier WOD de mon mobile"), install:INSTALL.barre,
  prepare:["AFL2 · Choix du mobile justifié.","AFL1 · Choix des paramètres (charge, niveau).","AFL1 · Analyser : FC et ressenti."]},
  [FI.echG, F(FI.deuxIntensites,15), FI.chargeJuste, FI.wodMobile, BIL("mobile choisi, charges de travail")]),
 Object.assign({}, P[4], {fiches:P[4].fiches}),
 S({id:"S6", titre:"Réguler et puissance : swing et box jump", mat:"poids de corps, kettlebell, box",
  obj:"Retrouver le swing et le saut sur box, prévoir les versions − et + de chaque exercice et réaliser le deuxième WOD de son mobile.",
  tl:TL("Swing et box jump","Plus ou moins","Le deuxième WOD de mon mobile"), install:INSTALL.mat,
  prepare:["Référentiel · versions − et +.","AFL1 · Nombre de régulations à l’EMOM.","AFL3 · Le coach décide une régulation."]},
  [FI.echA, Object.assign({}, FI.swing, {titre:"Swing et saut sur box", deroul:["Rappel du swing : 2 × 10.","Saut sur box : 3 × 5, réception en squat, redescente en marchant.","Enchaînement : 5 swings + 3 sauts sur box, 3 fois.","Chacun écrit ses versions − et + de ces deux mouvements."], schema:"mv:swing,box-jump"}), FI.plusMoins, FI.wod2, BIL("mes versions − et +")]),
 S({id:"S7", titre:"Concevoir seul et mesurer ses progrès", mat:"selon le WOD",
  obj:"Écrire seul la fiche de son épreuve, apprendre à juger, puis refaire l’AMRAP test de la S1 pour mesurer ses progrès.",
  tl:TL("Rep ou no rep","Concevoir mon épreuve","AMRAP test 6 min (retest)"), install:"Fiches d’évaluation individuelles distribuées.",
  prepare:["AFL1 · Conception autonome et trame fictive du cours suivant.","AFL2 · Comparaison S1 / S7 dans le carnet.","AFL3 · Juge fiable."]},
  [FI.echA, FI.juge, Object.assign({}, FI.conception, {moins:"Fiche à trous.", plus:"Écrire aussi la trame fictive du cours suivant."}), FI.amrapTest, BIL("score S1, score S7, ce qui a changé et pourquoi")]),
 Object.assign({}, P[7], {fiches:P[7].fiches}),
 S9("t")
];

/* ---------- Terminale · démarche GAREEPS ---------- */
const TG = [
 T_S1,
 S({id:"S2", titre:"SCE 1 au format de l’épreuve", mat:"selon le WOD",
  obj:"En Terminale, la SCE se fait d’emblée au format de l’épreuve : réaliser les WOD de son mobile, calculer les 3 scores parlants et choisir son axe prioritaire.",
  tl:TL_WOD("SCE 1 · passage A","SCE 1 · passage B","Étoile 1, bilan"), install:INSTALL.sce,
  prepare:["AFL1 · Forme exacte de l’épreuve.","AFL3 · Observer sans conseiller.","AFL2 · Étoile de départ."]},
  [FI.echG, FI.sceComplet, FI.sceComplet, BIL_ETOILE(1)]),
 S({id:"S3", titre:"Front squat, push press et SRP", mat:"poids de corps, barre",
  obj:"Apprendre le front squat et le push press, puis travailler son axe prioritaire en SRP et l’EMOM à la barre.",
  tl:TL("Front squat et push press","SRP selon mon axe","EMOM à la barre"), install:INSTALL.barre+" 3 ateliers SRP installés.",
  prepare:["AFL1 · Selon l’axe.","AFL1 · EMOM : temps restant.","AFL3 · Partenaire guide à l’atelier analyse."]},
  [FI.echGHanche, FI.barreFSPP, FI.srp, F(FI.emomBarre,19), BIL("mon axe : ce qui a changé ; charges")]),
 S({id:"S4", titre:"Thruster, STOM et choix du mobile", mat:"poids de corps, barre",
  obj:"Apprendre le thruster, travailler une seule variable de son axe et confirmer son mobile par deux intensités ressenties.",
  tl:TL("Le thruster","STOM : une variable","Deux intensités"), install:INSTALL.barre,
  prepare:["AFL2 · Mobile confirmé et justifié.","Axe prioritaire : une variable validée.","AFL1 · FC et ressenti."]},
  [FI.echGHanche, FI.thruster, FI.stom, F(FI.deuxIntensites,19), BIL("mon mobile ; ma variable")]),
 S({id:"S5", titre:"SCE 2 au format de l’épreuve", mat:"selon le WOD",
  obj:"Refaire la SCE complète, calculer les scores parlants et mesurer le chemin parcouru depuis la SCE 1.",
  tl:TL_WOD("SCE 2 · passage A","SCE 2 · passage B","Étoile 2, bilan"), install:INSTALL.sce,
  prepare:["AFL1 · Épreuve complète.","AFL2 · Étoile 2.","AFL3 · Observation fiable."]},
  [FI.echA, FI.sceComplet, FI.sceComplet, BIL_ETOILE(2)]),
 S({id:"S6", titre:"SRP 2 : swing, box jump et régulation", mat:"poids de corps, kettlebell, box",
  obj:"Retrouver le swing et le saut sur box, retravailler son axe un cran plus loin et réaliser le deuxième WOD de son mobile.",
  tl:TL("Swing et box jump","SRP 2 selon mon axe","Le deuxième WOD de mon mobile"), install:INSTALL.mat,
  prepare:["Référentiel · versions − et +.","AFL1 · Selon l’axe.","AFL3 · Coach-ressource."]},
  [FI.echA, T[5].fiches[1], FI.srp2, FI.wod2, BIL("mes versions − et + ; mon axe")]),
 S({id:"S7", titre:"STOM, conception et retest", mat:"selon le WOD",
  obj:"Fixer une dernière variable, écrire seul la fiche de son épreuve et refaire l’AMRAP test de la S1.",
  tl:TL("STOM : une variable","Concevoir mon épreuve","AMRAP test 6 min (retest)"), install:"Fiches d’évaluation individuelles distribuées.",
  prepare:["AFL1 · Conception autonome.","AFL2 · Comparaison S1 / S7.","Axe prioritaire validé."]},
  [FI.echA, FI.stom, T[6].fiches[2], FI.amrapTest, BIL("score S1, score S7, mon étoile")]),
 Object.assign({}, PG[7], {fiches:PG[7].fiches}),
 S9("t")
];
/* recaler les durées des séances copiées et vérifier : la somme du déroulé = 75 min */
const PARCOURS = {p:{nom:"Première · progressive", L:P}, g:{nom:"Première · GAREEPS", L:PG}, t:{nom:"Terminale · progressive", L:T}, h:{nom:"Terminale · GAREEPS", L:TG}};

/* ================== SCHÉMAS ================== */
const escC = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const CT_C = {act:"#c2410c", eff:"#c2410c", rep:"#94a3b8", rec:"#0e7490", txt:"#1c2128", gris:"#5b6470", ligne:"#dde2e8"};

/* --- Dessins des mouvements absents des photos (vue de profil, sol à y=100) --- */
const POSES = {
 goblet:[{H:[60,18],N:[60,28],E:[69,42],W:[64,36],P:[60,58],K:[60,79],A:[60,100],T:[69,100],kb:[66,40]},
         {H:[52,36],N:[50,46],E:[64,58],W:[60,50],P:[44,74],K:[66,72],A:[60,100],T:[69,100],kb:[62,52]}],
 kbdl:[{H:[79,42],N:[70,49],E:[70,66],W:[70,82],P:[42,62],K:[55,77],A:[54,100],T:[63,100],kb:[70,90]},
       {H:[60,18],N:[60,28],E:[61,45],W:[62,61],P:[60,58],K:[60,79],A:[60,100],T:[69,100],kb:[62,69]}],
 swing:[{H:[74,39],N:[66,46],E:[60,61],W:[54,73],P:[40,62],K:[52,78],A:[54,100],T:[63,100],kb:[52,81]},
        {H:[58,18],N:[59,28],E:[74,30],W:[89,30],P:[60,58],K:[60,79],A:[60,100],T:[69,100],kb:[97,30]}],
 stepup:[{H:[52,12],N:[54,22],E:[50,38],W:[56,50],P:[54,50],K:[72,58],A:[72,76],T:[80,76],K2:[50,74],A2:[44,100],T2:[52,100],box:1},
         {H:[82,-8],N:[82,2],E:[81,18],W:[83,32],P:[82,32],K:[82,53],A:[82,76],T:[90,76],box:1}],
 boxjump:[{H:[62,36],N:[56,44],E:[44,54],W:[34,60],P:[40,68],K:[54,80],A:[44,100],T:[52,100],box:2},
          {H:[95,22],N:[91,32],E:[101,42],W:[110,40],P:[82,58],K:[100,62],A:[90,76],T:[98,76],box:2}],
 deadlift:[{H:[79,42],N:[70,49],E:[65,67],W:[60,86],P:[42,62],K:[55,76],A:[54,100],T:[63,100],bar:[58,90]},
           {H:[60,18],N:[60,28],E:[61,45],W:[62,61],P:[60,58],K:[60,79],A:[60,100],T:[69,100],bar:[63,62]}],
 frontsquat:[{H:[59,18],N:[59,28],E:[72,32],W:[66,30],P:[60,58],K:[60,79],A:[60,100],T:[69,100],bar:[64,29]},
             {H:[51,35],N:[50,45],E:[64,47],W:[58,45],P:[44,74],K:[66,72],A:[60,100],T:[69,100],bar:[57,45]}],
 thruster:[{H:[51,35],N:[50,45],E:[64,47],W:[58,45],P:[44,74],K:[66,72],A:[60,100],T:[69,100],bar:[57,45]},
           {H:[58,18],N:[60,28],E:[62,12],W:[63,-3],P:[60,58],K:[60,79],A:[60,100],T:[69,100],bar:[63,-3]}]
};
function figPose(p, dx, col){
  const L = (a, b, w) => `<line x1="${a[0]+dx}" y1="${a[1]}" x2="${b[0]+dx}" y2="${b[1]}" stroke="${col}" stroke-width="${w||5}" stroke-linecap="round"/>`;
  let s = "";
  if(p.box===1) s += `<rect x="${62+dx}" y="76" width="40" height="24" rx="2" fill="#e2e8f0" stroke="#94a3b8"/>`;
  if(p.box===2) s += `<rect x="${76+dx}" y="76" width="36" height="24" rx="2" fill="#e2e8f0" stroke="#94a3b8"/>`;
  if(p.K2) s += L(p.P, p.K2) + L(p.K2, p.A2) + L(p.A2, p.T2, 4);
  s += L(p.P, p.K) + L(p.K, p.A) + L(p.A, p.T, 4) + L(p.N, p.P, 6) + L(p.N, p.E, 4) + L(p.E, p.W, 4);
  s += `<circle cx="${p.H[0]+dx}" cy="${p.H[1]}" r="7" fill="${col}"/>`;
  if(p.kb) s += `<circle cx="${p.kb[0]+dx}" cy="${p.kb[1]+3}" r="5.5" fill="#334155"/><path d="M${p.kb[0]+dx-3.5} ${p.kb[1]-1}q3.5 -6 7 0" fill="none" stroke="#334155" stroke-width="2"/>`;
  if(p.bar) s += `<circle cx="${p.bar[0]+dx}" cy="${p.bar[1]}" r="10" fill="none" stroke="#334155" stroke-width="3.5"/><circle cx="${p.bar[0]+dx}" cy="${p.bar[1]}" r="2.5" fill="#334155"/>`;
  return s;
}
function svgFig(id){
  const P2 = POSES[id]; if(!P2) return "";
  return `<svg viewBox="0 -16 260 122" class="fig" role="img" aria-label="${escC(id)}"><line x1="2" y1="100" x2="258" y2="100" stroke="#cbd5e1" stroke-width="2"/>${figPose(P2[0], 0, "#94a3b8")}<path d="M124 50h12" stroke="${CT_C.act}" stroke-width="3" marker-end="url(#fl)"/>${figPose(P2[1], 130, CT_C.act)}<defs><marker id="fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${CT_C.act}"/></marker></defs></svg>`;
}
function mvVisuel(m){
  if(!m) return "";
  if(m.img) return `<img src="img/mv/${m.img}.webp" alt="${escC(m.nom)}" loading="lazy">`;
  if(m.fig) return svgFig(m.fig);
  return `<svg viewBox="0 0 120 80" class="fig sans" role="img" aria-label="${escC(m.nom)}"><rect x="2" y="2" width="116" height="76" rx="10" fill="#f1f5f9" stroke="#cbd5e1"/><text x="60" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#5b6470">${escC(m.z)} · N${m.n}</text><text x="60" y="56" text-anchor="middle" font-size="10" fill="#5b6470">image à venir</text></svg>`;
}
function mvCarte(m){
  if(!m) return "";
  return `<figure class="mv"><div class="mv-v">${mvVisuel(m)}</div><figcaption><b>${escC(m.nom)}</b><span class="mv-t z-${m.z}">${m.z}</span><span class="mv-t">N${m.n}</span>${m.m!=="pdc"?`<span class="mv-t mat">${MATERIEL[m.m].court}</span>`:""}</figcaption></figure>`;
}

/* --- Formats : frise des intervalles --- */
function svgFormat(spec){
  const a = spec.split(":"), f = a[0];
  const W = 340, H = 92, x0 = 8, w = W - 16;
  let s = "", leg = "";
  if(f === "tabata"){
    const e = +a[1], r = +a[2], n = +a[3], tot = n*(e + r), k = w/tot;
    for(let i = 0; i < n; i++){ const x = x0 + i*(e + r)*k;
      s += `<rect x="${x}" y="22" width="${e*k-1}" height="34" rx="3" fill="${CT_C.eff}"/><rect x="${x+e*k}" y="34" width="${r*k-1}" height="22" rx="3" fill="${CT_C.rep}"/>`;
      s += `<text x="${x+e*k/2}" y="44" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${i+1}</text>`; }
    const t = tot >= 60 ? `${Math.floor(tot/60)} min${tot%60?" "+(tot%60):""}` : tot+" s";
    s += `<text x="${x0}" y="14" font-size="12" fill="${CT_C.txt}" font-weight="700">TABATA ${e} s / ${r} s × ${n} = ${t}</text>`;
    leg = `<text x="${x0}" y="76" font-size="11" fill="${CT_C.gris}"><tspan fill="${CT_C.eff}" font-weight="700">■</tspan> effort  <tspan fill="${CT_C.rep}" font-weight="700">■</tspan> repos : on se place pour l’exercice suivant</text>`;
  } else if(f === "emom" || f === "emom1"){
    const n = +a[1], k = w/n;
    for(let i = 0; i < n; i++){ const x = x0 + i*k, frac = f === "emom1" ? Math.min(.95, .4 + i*.11) : .55 + (i%2 ? .05 : 0);
      s += `<rect x="${x}" y="22" width="${k*frac-1}" height="34" rx="3" fill="${CT_C.eff}"/><rect x="${x+k*frac}" y="34" width="${k*(1-frac)-2}" height="22" rx="3" fill="${CT_C.rep}"/>`;
      s += `<text x="${x+k*frac/2}" y="44" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${f==="emom1"?(3+i)+" rép.":"min "+(i+1)}</text>`; }
    s += `<text x="${x0}" y="14" font-size="12" fill="${CT_C.txt}" font-weight="700">${f==="emom1"?"EMOM+1 : une répétition de plus chaque minute":"EMOM "+n+" min : au top de chaque minute"}</text>`;
    leg = `<text x="${x0}" y="76" font-size="11" fill="${CT_C.gris}"><tspan fill="${CT_C.eff}" font-weight="700">■</tspan> répétitions  <tspan fill="${CT_C.rep}" font-weight="700">■</tspan> temps restant = repos (N1 &gt; 30 s · N2 20-30 s · N3 10-20 s)</text>`;
  } else if(f === "amrap"){
    const n = +a[1];
    s += `<text x="${x0}" y="14" font-size="12" fill="${CT_C.txt}" font-weight="700">AMRAP ${n} min : le plus de tours possible</text>`;
    const tours = 4.6, k = w/tours;
    for(let i = 0; i < 5; i++){ const ww = i < 4 ? k-3 : k*.6;
      s += `<rect x="${x0+i*k}" y="22" width="${ww}" height="34" rx="3" fill="${i<4?CT_C.eff:"#fdba74"}"/><text x="${x0+i*k+ww/2}" y="44" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${i<4?"tour "+(i+1):"+ 12 rép."}</text>`; }
    leg = `<text x="${x0}" y="76" font-size="11" fill="${CT_C.gris}">Score : 4 tours + 12 répétitions. Pas de repos imposé : c’est l’athlète qui gère.</text>`;
  } else if(f === "fortime"){
    s += `<text x="${x0}" y="14" font-size="12" fill="${CT_C.txt}" font-weight="700">FOR TIME : un travail fixé, le plus vite possible</text>`;
    for(let i = 0; i < 3; i++) s += `<rect x="${x0+i*92}" y="22" width="88" height="34" rx="3" fill="${CT_C.eff}"/><text x="${x0+i*92+44}" y="44" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">tour ${i+1}</text>`;
    s += `<line x1="${x0+282}" y1="18" x2="${x0+282}" y2="60" stroke="${CT_C.txt}" stroke-width="2" stroke-dasharray="3 3"/><text x="${x0+286}" y="44" font-size="11" fill="${CT_C.txt}">time cap</text>`;
    leg = `<text x="${x0}" y="76" font-size="11" fill="${CT_C.gris}">Score : le temps (+ 5 s par no rep).</text>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" class="fmt" role="img">${s}${leg}</svg>`;
}

/* --- L'épreuve : les deux mobiles sur 21 min --- */
function svgWod(){
  const W = 360, x0 = 70, w = 280, k = w/21;
  const ligne = (y, blocs) => { let x = x0, s = ""; blocs.forEach(b => { const ww = b[1]*k;
    s += `<rect x="${x}" y="${y}" width="${ww-1.5}" height="26" rx="4" fill="${b[2]}"/>`;
    if(ww > 26) s += `<text x="${x+ww/2}" y="${y+17}" text-anchor="middle" font-size="10.5" fill="${b[2]===CT_C.rep?"#1c2128":"#fff"}" font-weight="700">${b[0]}</text>`; x += ww; }); return s; };
  let s = `<text x="${x0}" y="12" font-size="11" fill="${CT_C.gris}">0</text><text x="${x0+w}" y="12" font-size="11" fill="${CT_C.gris}" text-anchor="end">21 min</text>`;
  s += `<text x="4" y="38" font-size="11" font-weight="700" fill="${MOBILES.mod.c}">Modéré</text><text x="4" y="51" font-size="10" fill="${CT_C.gris}">140-160</text>`;
  s += ligne(24, [["TABATA 8’",8,MOBILES.mod.c],["récup 5’",5,CT_C.rep],["EMOM 8’",8,MOBILES.mod.c]]);
  s += `<text x="4" y="80" font-size="11" font-weight="700" fill="${MOBILES.elev.c}">Élevé</text><text x="4" y="93" font-size="10" fill="${CT_C.gris}">160-180</text>`;
  s += ligne(66, [["TABATA 5’",5,MOBILES.elev.c],["3’",3,CT_C.rep],["SPÉCIAL 5’",5,MOBILES.elev.c],["3’",3,CT_C.rep],["EMOM 5’",5,MOBILES.elev.c]]);
  s += `<text x="4" y="118" font-size="10.5" fill="${CT_C.gris}">FC prise dans les 10 s après chaque WOD</text>`;
  return `<svg viewBox="0 0 ${W} 124" class="fmt" role="img">${s}</svg>`;
}

/* --- Étoile d'auto-positionnement GAREEPS (3 branches, 4 niveaux) --- */
function svgEtoile(vals){
  const v = vals || [3, 2, 1], cx = 120, cy = 104, R = 82, cols = ["#dc2626","#facc15","#86efac","#15803d"];
  const ang = i => -Math.PI/2 + i*2*Math.PI/3, pt = (i, r) => [cx + r*Math.cos(ang(i)), cy + r*Math.sin(ang(i))];
  let s = "";
  for(let n = 4; n >= 1; n--){ const p = [0,1,2].map(i => pt(i, R*n/4)); s += `<polygon points="${p.map(q => q.join(",")).join(" ")}" fill="${cols[n-1]}" fill-opacity=".35" stroke="${cols[n-1]}"/>`; }
  [0,1,2].forEach(i => { const e = pt(i, R); s += `<line x1="${cx}" y1="${cy}" x2="${e[0]}" y2="${e[1]}" stroke="#64748b"/>`; });
  const q = [0,1,2].map(i => pt(i, R*v[i]/4));
  s += `<polygon points="${q.map(z => z.join(",")).join(" ")}" fill="${CT_C.act}" fill-opacity=".25" stroke="${CT_C.act}" stroke-width="3"/>`;
  q.forEach(z => s += `<circle cx="${z[0]}" cy="${z[1]}" r="5" fill="${CT_C.act}"/>`);
  const lab = [["Conception", cx, 12, "middle"], ["Production", cx + 78, cy + 62, "start"], ["Analyse", cx - 78, cy + 62, "end"]];
  lab.forEach((l, i) => s += `<text x="${l[1]}" y="${l[2]}" text-anchor="${l[3]}" font-size="12" font-weight="700" fill="${GAREEPS.axes[i].c}">${l[0]}</text>`);
  return `<svg viewBox="-20 0 280 180" class="etoile" role="img" aria-label="Étoile d’auto-positionnement">${s}</svg>`;
}

/* --- Organisation : binôme, juge, ateliers SRP --- */
const pion = (x, y, c, t) => `<circle cx="${x}" cy="${y}" r="11" fill="${c}"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${t}</text>`;
function svgOrg(k){
  let s = `<rect x="4" y="4" width="312" height="132" rx="10" fill="#fef3e8" stroke="#fdba74"/>`;
  if(k === "juge"){
    s += pion(90, 70, CT_C.act, "A") + pion(170, 70, "#0e7490", "J") + pion(250, 40, "#64748b", "J2") + pion(250, 100, "#64748b", "C");
    s += `<path d="M157 70h-50" stroke="#0e7490" stroke-dasharray="4 3" stroke-width="2"/><text x="132" y="62" text-anchor="middle" font-size="10" fill="#0e7490">2 m, de profil</text><text x="160" y="128" text-anchor="middle" font-size="11" fill="${CT_C.txt}">A travaille · J dit « rep / no rep » · J2 juge en silence · C compte</text>`;
  } else if(k === "binome"){
    s += pion(110, 70, CT_C.act, "A") + pion(200, 70, "#0e7490", "B");
    s += `<rect x="226" y="58" width="44" height="24" rx="3" fill="#fff" stroke="#94a3b8"/><text x="248" y="74" text-anchor="middle" font-size="10">carnet</text>`;
    s += `<text x="160" y="128" text-anchor="middle" font-size="11" fill="${CT_C.txt}">A travaille · B annonce, compte, prend la FC, conseille pendant le repos</text>`;
  }
  return `<svg viewBox="0 0 320 140" class="org" role="img">${s}</svg>`;
}
function svgSrp(){
  const at = [["Conception","Rubik’s Cube","cartes",GAREEPS.axes[0].c],["Production","Tabata filmé","tablette",GAREEPS.axes[1].c],["Analyse","2 intensités","pouls",GAREEPS.axes[2].c]];
  let s = "";
  at.forEach((a, i) => { const x = 6 + i*112;
    s += `<rect x="${x}" y="8" width="104" height="96" rx="10" fill="${a[3]}" fill-opacity=".12" stroke="${a[3]}" stroke-width="2"/><text x="${x+52}" y="30" text-anchor="middle" font-size="12.5" font-weight="700" fill="${a[3]}">${a[0]}</text><text x="${x+52}" y="52" text-anchor="middle" font-size="11" fill="${CT_C.txt}">${a[1]}</text><text x="${x+52}" y="70" text-anchor="middle" font-size="10" fill="${CT_C.gris}">${a[2]}</text>`;
    s += pion(x+36, 88, CT_C.act, "") + pion(x+68, 88, "#0e7490", ""); });
  return `<svg viewBox="0 0 344 112" class="org" role="img">${s}</svg>`;
}
function svgEchauff(){
  const e = ECHAUFF.guide.etapes, cols = ["#fdba74","#fb923c","#ea580c","#c2410c"];
  let s = "";
  e.forEach((x, i) => { const y = 6 + i*30, w = 120 + i*55;
    s += `<rect x="4" y="${y}" width="${w}" height="24" rx="5" fill="${cols[i]}"/><text x="12" y="${y+16}" font-size="11.5" font-weight="700" fill="${i>1?"#fff":"#1c2128"}">${i+1}. ${escC(x[0].split(" · ")[0])}</text>`; });
  s += `<text x="4" y="134" font-size="10.5" fill="${CT_C.gris}">3 min chacune · la FC doit dépasser 120 à la fin</text>`;
  return `<svg viewBox="0 0 340 140" class="org" role="img">${s}</svg>`;
}
function etireHTML(){ return `<ul class="etire">${ETIREMENTS.map(e => `<li><b>${escC(e[0])}</b> ${escC(e[1])}</li>`).join("")}</ul>`; }

/* Point d'entrée : un schéma à partir de sa description */
function schema(spec){
  if(!spec) return "";
  if(spec.startsWith("mv:")) return `<div class="mv-grille">${spec.slice(3).split(",").map(id => mvCarte(mvById(id.trim()))).join("")}</div>`;
  if(spec.startsWith("fmt:")) return svgFormat(spec.slice(4));
  if(spec === "wod") return svgWod();
  if(spec === "etoile") return svgEtoile() + `<p class="cap">${escC(GAREEPS.score)}</p>`;
  if(spec === "srp") return svgSrp();
  if(spec.startsWith("org:")) return svgOrg(spec.slice(4));
  if(spec === "echauff") return svgEchauff();
  if(spec === "etire") return etireHTML();
  return "";
}

/* Vérification interne : chaque séance fait 75 min et a une fiche par bloc */
const CT_ERREURS = [];
Object.entries(PARCOURS).forEach(([k, pc]) => pc.L.forEach(s => {
  const tot = s.tl.reduce((a, t) => a + (+t[1]), 0);
  if(tot !== DUREE) CT_ERREURS.push(`${pc.nom} ${s.id} : ${tot} min`);
  const nb = s.tl.filter(t => t[2] !== "inst").length;
  if(nb !== s.fiches.length) CT_ERREURS.push(`${pc.nom} ${s.id} : ${nb} blocs, ${s.fiches.length} fiches`);
  s.tl.filter(t => t[2] !== "inst").forEach((t, i) => { if(s.fiches[i] && s.fiches[i].duree !== +t[1]) CT_ERREURS.push(`${pc.nom} ${s.id} : fiche ${i+1} ${s.fiches[i].duree} ≠ ${t[1]}`); });
}));

window.MOUV=MOUV;
window.mvById=mvById;
window.MATERIEL=MATERIEL;
window.ZONES=ZONES;
window.NIVEAUX=NIVEAUX;
window.MOBILES=MOBILES;
window.GAREEPS=GAREEPS;
window.PARCOURS=PARCOURS;
window.CHARGES=CHARGES;
window.REF=REF;
window.FORMATS=FORMATS;
window.FC=FC;
window.RESSENTIS=RESSENTIS;
window.ETIREMENTS=ETIREMENTS;
window.mvVisuel=mvVisuel;
window.svgEtoile=svgEtoile;
window.svgFig=svgFig;
window.schema=schema;
window.DUREE=DUREE;
})();
