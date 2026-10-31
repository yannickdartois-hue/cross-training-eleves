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
<li>À la fin : la <b>FC</b> (pouls 15 s × 4, tout de suite), ton <b>effort perçu de 1 à 10</b> et <b>ta décision pour le prochain WOD</b> (je baisse, je garde, je monte, j’allonge la récup). L’appli conseille une décision d’après ta FC et ton effort ; au WOD suivant, elle te la rappelle.</li>
<li>Le <b>coach</b> (celui qui a regardé et compté) est noté avec le WOD : c’est la preuve de son rôle.</li>
<li><b>Saisie complète</b> (si le professeur l’a choisie) : en plus, les 3 critères après chaque exercice, où tu l’as senti (muscles, souffle, tête), le conseil du coach et un commentaire, puis l’étoile et la fatigue de la séance.</li></ul>`},
{t:'Mon tableau, le jour J',html:`<ul><li><b>Mon tableau</b> : âge, FC de repos, mobile et pourquoi, charges.</li>
<li><b>Jour J</b> : à la séance 8, prépare tes WOD de la séance 9 et vérifie la liste du référentiel (nombre d’exercices, zones, niveaux). Choisis ta répartition AFL2 / AFL3 et écris ton échauffement.</li>
<li><b>Démarche GAREEPS</b> : aux séances 2, 5 et 8, ton observateur coche les critères de ton <b>étoile</b> ; choisis ton axe prioritaire.</li></ul>`},
{t:'Les formats du chrono',html:`<ul><li><b>Départ</b> : décompte 3-2-1, puis GO. Bouton 🔊 / 📳 / 🔇 : son, vibreur ou muet.</li>
<li><b>TABATA</b> : touche <b>+1</b> à chaque répétition du round. Pendant le repos, donne la <b>note d’exécution</b> de l’exercice (1 à 4). Score : le <b>plancher</b> (le round le plus faible) et le total. Le « TABATA à régler » propose 20/10, 30/10, 20/20, 40/20, 10/20, 30/30, 45/15 et 1 à 40 cycles.</li>
<li><b>EMOM</b> : au début de chaque minute, enchaîne les exercices ; <b>✓ Validé</b> après chaque exercice, <b>✗ Non terminé</b> si l’élève n’y arrive pas. Le reste de la minute est ton repos. Le fond passe du vert (plus de 20 s) à l’orange (10 à 20 s) puis au rouge (moins de 10 s).</li>
<li><b>EMOM+1</b> : tous les exercices chaque minute, une répétition de plus à chaque minute. <b>✓ Validé</b> après chaque exercice ; <b>✗ Non terminé</b> si l’élève n’y arrive pas (note les répétitions faites). Le WOD continue : on compte les minutes validées.</li>
<li><b>AMRAP</b> : l’écran montre l’exercice en cours ; touche <b>✓ Validé</b> après chaque exercice. Un tour est compté quand tous les exercices sont validés ; le temps de chaque tour est gardé. Niveau N0 à N4 = 4, 6, 8, 10 ou 12 répétitions.</li>
<li><b>FOR TIME à paliers</b> : N1 6 → 1, N2 8 → 1, N3 10 → 1 répétitions de chaque exercice ; <b>✓ Validé</b> après chaque exercice, le temps de chaque palier est gardé.</li>
<li><b>Les 3 critères</b> : le coach regarde le <b>placement</b> (dos, genoux, gainage), la <b>respiration</b> (souffle régulier, pas d’apnée) et l’<b>amplitude</b> (mouvement complet). La <b>note d’exécution sur 4</b> en découle : 1 + un point par critère réussi. En saisie complète, il les coche après chaque exercice (« Passer » s’il n’a pas pu regarder) ; sinon, une seule fois en fin de WOD.</li>
<li><b>Fin du WOD</b> : le bilan détaillé s’affiche, puis FC, critères de chaque exercice, <b>effort perçu</b> de 1 (très facile) à 10 (maximal) et décision pour la suite. « Ne pas enregistrer » demande deux appuis.</li>
<li><b>Charges</b> : pour les exercices avec kettlebell, haltère ou barre, note la charge en kg dans le WOD (proposée d’après « Mes charges »).</li>
<li><b>Tablette en veille ou page rechargée</b> : rouvre le carnet, un bandeau propose <b>Reprendre</b> ; le chrono compte le temps passé.</li>
<li><b>Binôme</b> : après chaque WOD, « À qui le tour ? » passe au partenaire, qui devient le coach.</li></ul>`},
{t:'Démonstration',html:`<p>Sur l’écran d’accueil (bouton « Changer » si un carnet est ouvert), carte <b>Démonstration → Ouvrir la démo</b> : un binôme fictif « Alice · Bruno », code 0000, pour essayer sans classe.</p>`},
{t:'Envoyer en fin de séance',html:`<ol><li>Onglet <b>Envoyer</b> : montre les <b>QR codes</b> au professeur (un par élève), ou <span class="bouton">Envoyer ma séance du jour en ligne</span> quand le professeur l’a activé.</li>
<li>Un bandeau rouge « Séance non envoyée » reste tant que ce n’est pas fait.</li></ol>`},
{t:'Code oublié, changer de tablette',html:`<ul><li><b>Code oublié</b> : le carnet ne s’ouvre plus. Supprimez-le et créez un nouveau binôme ; vos séances déjà envoyées sont chez le professeur.</li>
<li><b>Changer de tablette</b> : Mon binôme → « Enregistrer le carnet », puis « Reprendre un carnet » sur l’autre tablette.</li>
<li>Le carnet se verrouille après 10 min sans activité (jamais pendant un chrono).</li></ul>`}]},
{id:'prof',titre:'Professeur',chapitres:[
{t:'Mettre en place',html:`<ol><li>Outil prof (cross-training-prof) → <b>Classes</b> : import Pronote, niveau (1re ou Tle), démarche (progressive ou GAREEPS), lien de dépôt du Nuage (facultatif).</li>
<li>Premier cours : <b>QR de démarrage</b> affiché, chaque tablette le scanne.</li></ol>`},
{t:'Origine du chrono',html:`<p>Les formats et réglages du chrono (Tabata à régler, niveaux N0 à N4, EMOM+1, FOR TIME à paliers dégressifs, son / vibreur / muet, couleurs de la minute) reprennent l’appli <b>Cross Training Pompidou</b> conçue par Yannick Dartois (dépôt « cross-training-pompidou »), qui reste disponible telle quelle. Le détail de ce qui a été repris ou adapté est dans le fichier ORIGINE-cross-training-pompidou.md du dépôt.</p>`},
{t:'Saisie légère ou complète',html:`<p>Outil prof → Classes → <b>Saisie des élèves</b>. <b>Légère</b> (par défaut) : FC, critères en fin de WOD, effort 1 à 10, décision. <b>Complète</b> : en plus, critères après chaque exercice, ressenti par zone, conseil du coach, commentaires, étoile et fatigue de séance. Le réglage passe par le QR de démarrage : refaites-le scanner après un changement.</p>`},
{t:'Récupérer les séances',html:`<ul><li>QR scannés à la suite dans l’outil prof (Recevoir), ou fichiers .json déposés dans le Nuage.</li><li>Toutes les séances de chaque élève sont gardées.</li></ul>`}]}
]};
