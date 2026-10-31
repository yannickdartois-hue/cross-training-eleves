/* aide.js — mode d'emploi de l'appli élève cross training (lu par eps-aide.js) */
window.EPS_AIDE={appli:'Cross training · Élève',bouton:false,publics:[
{id:'eleve',titre:'Élève',chapitres:[
{t:'Commencer (premier cours)',html:`<ol>
<li><span class="bouton">Scanner le QR de la classe</span> : vise le QR que le professeur affiche.</li>
<li>Choisissez vos deux noms dans la liste (une tablette par binôme).</li>
<li>Choisissez un <b>code secret à 4 chiffres</b> et retenez-le : il ouvre votre carnet à chaque cours. Un autre binôme ne peut pas le lire.</li>
</ol><p class="astuce">Aux cours suivants : touche le nom de ton binôme sur l’accueil, puis le code.</p>`},
{t:'Pendant la séance',html:`<ul><li>La séance du jour s’ouvre toute seule (n° 1 à 9 en haut pour en changer). Le haut de l’écran rappelle ce qui est prévu.</li>
<li>En haut, <b>« Qui saisit ? »</b> : touche le prénom de celui qui travaille. Chacun a son carnet.</li>
<li><span class="bouton">+ Ajouter un WOD</span> : choisis le format (les formats de l’épreuve sont en premier), puis les exercices, leurs répétitions et leur version (−, =, +).</li>
<li><span class="bouton">▶ Lancer le chrono</span> : le partenaire tient la tablette. Il touche <b>+1</b> à chaque répétition, <b>No rep</b> si le mouvement n’est pas complet, <b>Fini !</b> à l’EMOM, et <b>−</b> / <b>+</b> pour noter une régulation.</li>
<li>À la fin : la <b>FC</b> (pouls 15 s × 4, tout de suite) et le <b>ressenti</b> de 1 à 4.</li></ul>`},
{t:'Mon tableau, le jour J',html:`<ul><li><b>Mon tableau</b> : âge, FC de repos, mobile et pourquoi, charges.</li>
<li><b>Jour J</b> : à la séance 8, prépare tes WOD de la séance 9 et vérifie la liste du référentiel (nombre d’exercices, zones, niveaux). Choisis ta répartition AFL2 / AFL3 et écris ton échauffement.</li>
<li><b>Démarche GAREEPS</b> : aux séances 2, 5 et 8, ton observateur coche les critères de ton <b>étoile</b> ; choisis ton axe prioritaire.</li></ul>`},
{t:'Les formats du chrono',html:`<ul><li><b>TABATA</b> : effort / repos, compte les répétitions de chaque round. Le « TABATA à régler » propose 20/10, 30/10, 20/20, 40/20, 10/20, 30/30, 45/15 et 1 à 40 cycles.</li>
<li><b>EMOM</b> : au début de chaque minute, enchaîne tes exercices ; touche <b>Fini !</b> dès que c’est fait, le reste de la minute est ton repos. Le fond passe du vert (plus de 20 s) à l’orange (10 à 20 s) puis au rouge (moins de 10 s).</li>
<li><b>EMOM+1</b> : tous les exercices chaque minute, avec <b>une répétition de plus</b> à chaque minute. Le partenaire touche <b>✓ Validé</b> après chaque exercice ; si l’élève n’y arrive pas, <b>✗ Non terminé</b> et il note les répétitions faites. Le WOD continue : on compte les minutes validées.</li>
<li><b>AMRAP</b> : le plus de tours possible ; niveau N0 à N4 = 4, 6, 8, 10 ou 12 répétitions par exercice.</li>
<li><b>FOR TIME à paliers</b> : N1 6 → 1, N2 8 → 1, N3 10 → 1 répétitions de chaque exercice, le plus vite possible ; touche <b>Palier terminé</b> à chaque palier.</li>
<li>Bouton 🔊 / 📳 / 🔇 : son, vibreur ou muet.</li></ul>`},
{t:'Envoyer en fin de séance',html:`<ol><li>Onglet <b>Envoyer</b> : montre les <b>QR codes</b> au professeur (un par élève), ou <span class="bouton">Envoyer ma séance du jour en ligne</span> quand le professeur l’a activé.</li>
<li>Un bandeau rouge « Séance non envoyée » reste tant que ce n’est pas fait.</li></ol>`},
{t:'Code oublié, changer de tablette',html:`<ul><li><b>Code oublié</b> : le carnet ne s’ouvre plus. Supprimez-le et créez un nouveau binôme ; vos séances déjà envoyées sont chez le professeur.</li>
<li><b>Changer de tablette</b> : Mon binôme → « Enregistrer le carnet », puis « Reprendre un carnet » sur l’autre tablette.</li>
<li>Le carnet se verrouille après 10 min sans activité (jamais pendant un chrono).</li></ul>`}]},
{id:'prof',titre:'Professeur',chapitres:[
{t:'Mettre en place',html:`<ol><li>Outil prof (cross-training-prof) → <b>Classes</b> : import Pronote, niveau (1re ou Tle), démarche (progressive ou GAREEPS), lien de dépôt du Nuage (facultatif).</li>
<li>Premier cours : <b>QR de démarrage</b> affiché, chaque tablette le scanne.</li></ol>`},
{t:'Origine du chrono',html:`<p>Les formats et réglages du chrono (Tabata à régler, niveaux N0 à N4, EMOM+1, FOR TIME à paliers dégressifs, son / vibreur / muet, couleurs de la minute) reprennent l’appli <b>Cross Training Pompidou</b> conçue par Yannick Dartois (dépôt « cross-training-pompidou »), qui reste disponible telle quelle. Le détail de ce qui a été repris ou adapté est dans le fichier ORIGINE-cross-training-pompidou.md du dépôt.</p>`},
{t:'Récupérer les séances',html:`<ul><li>QR scannés à la suite dans l’outil prof (Recevoir), ou fichiers .json déposés dans le Nuage.</li><li>Toutes les séances de chaque élève sont gardées.</li></ul>`}]}
]};
