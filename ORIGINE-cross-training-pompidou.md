# Origine : l'appli « Cross Training Pompidou »

L'appli élève de ce dépôt reprend une partie du travail de Yannick Dartois dans son appli **Cross Training Pompidou** (dépôt `cross-training-pompidou`, un seul fichier `index.html`). Ce fichier garde la trace de ce travail.

**Le dépôt d'origine n'a pas été modifié.** Il reste en ligne et utilisable tel quel. Les applis du cycle ne renvoient plus vers lui, pour que les élèves n'aient qu'un seul chrono.

Lecture complète du code d'origine faite le 31/10/2026, sur l'état publié du dépôt :

- environ 6 150 lignes de JavaScript applicatif ;
- le HTML et le mode d'emploi intégré ;
- le module « Reprise après rechargement ».

## 1. Ce que fait l'appli d'origine

### Mode élève

- **Profils**
  - Élève A, élève B (facultatif, binôme), classe et coach.
  - En binôme, le coach de A est B, et inversement. Une fenêtre « À qui le tour ? » apparaît entre deux WOD : passer à l'autre, rester, ou terminer la séance des deux.
  - Le profil est figé après le premier WOD.
- **5 modes, avec leurs réglages**
  - **AMRAP** : durée de 1 à 30 min (6 min par défaut). Niveau N0 à N4, soit 4, 6, 8, 10 ou 12 répétitions par exercice et par tour. Déroulé séquentiel : la carte montre l'exercice en cours et sa cible, on touche « ✓ Validé », un tour est compté quand tous les exercices sont validés. On peut annuler le dernier. Tour partiel et temps de chaque tour sont gardés.
  - **FOR TIME à paliers dégressifs** : N1 6→1 (21 rép.), N2 8→1 (36), N3 10→1 (55). Le chrono monte, sans limite de temps. On valide exercice par exercice dans chaque palier, et le temps de chaque palier est noté. Le chrono s'arrête au dernier palier. Arrêt manuel = « CAP ».
  - **TABATA** : 7 réglages (20/10, 30/10, 20/20, 40/20, 10/20, 30/30, 45/15) et 1 à 40 cycles.
    - Rotation verticale (A→B→C) ou horizontale (AAA→BBB). En horizontal, le nombre de cycles est arrondi automatiquement au multiple du nombre d'exercices.
    - Compteur de répétitions par exercice et par cycle. Le score est le « plancher » : le plus petit nombre de répétitions sur un cycle, plus le total.
    - Fond vert à l'effort, rouge au repos. Bandeau « À venir » pendant le repos.
  - **EMOM** : durée de 1 à 60 min. Niveau global N0 à N4 (4 à 12 rép.), puis répétitions réglables exercice par exercice.
    - Chaque minute, les exercices s'enchaînent et sont validés un par un. On note le temps de la séquence et le repos restant.
    - « Non terminé » : on saisit les répétitions faites sur l'exercice où l'élève s'est arrêté.
    - Pastilles des minutes en vert ou rouge, et temps moyen.
    - Couleur du chrono : plus de 20 s confort, 10 à 20 s alerte, moins de 10 s critique.
    - « À venir » pendant les 10 dernières secondes.
  - **EMOM+1** : même mécanique que l'EMOM, mais les répétitions augmentent de 1 à chaque minute (minute 1 = X, minute 2 = X+1…). Plusieurs exercices sont possibles. Une minute ratée n'arrête pas le WOD.
- **Cartes d'exercice** : niveau N1/N2/N3, **charge en kg**, répétitions cibles, compteur tactile de répétitions et note d'exécution sur 4.
- **Note d'exécution sur 4**, demandée dans une fenêtre après chaque exercice validé (1 Insuffisant, 2 Peut mieux faire, 3 Bien, 4 Excellent). On peut passer.
- **Ressenti du WOD**, obligatoire avant le bilan :
  - 5 niveaux : 😩 Épuisé, Très fatigué, Moyen, Léger, 😄 Top ;
  - commentaire écrit obligatoire (3 caractères minimum).
- **Séance de plusieurs WOD** :
  - bilan de chaque WOD, puis « WOD suivant » ou « Terminer ma séance » ;
  - ressenti de séance en étoiles (1 à 5), niveau de fatigue (1 à 5) et commentaire obligatoire ;
  - bilan final avec un QR code unique, impression ou PDF, et CSV.
- **Bilans détaillés**
  - Temps par tour en AMRAP, avec un petit graphique en barres (meilleur et moins bon tour).
  - Détail cycle par cycle en Tabata (MIN / MAX).
  - Détail minute par minute en EMOM.
  - Temps de chaque palier en FOR TIME.
- **Chrono**
  - Compte à rebours de 3 s, bips au changement de phase et fanfares de fin propres à chaque mode.
  - Son / vibreur / muet (clé `eps_sound_mode`).
  - Écran maintenu allumé, avec un avertissement sur iPad.
- **Reprise après veille ou rechargement**
  - L'état est sauvegardé chaque seconde (`eps_wod_en_cours`), et un bandeau « Reprendre » s'affiche au retour.
  - Le chrono compte le temps passé page fermée. En Tabata, les phases manquées sont rattrapées.
- **Divers** : historique des séances sur la tablette avec recherche, thème clair ou sombre, lecture facilitée, mode d'emploi, bouton DEMO.

### Mode prof (dans la même appli)

- **Lecture des QR** : caméra en continu sur Android (BarcodeDetector), photo sur iPad (jsQR) ou texte collé.
- **Format du QR** : `NOM;PRÉNOM;CLASSE;SCORE…`, avec un segment par WOD (`T:`, `A:`, `E:`, `E+:`, `F:`) et les étiquettes `EX:`, `NE:`, `LV:`, `D:`, `RW:`, `R:`.
- **Liste de classe** : regroupement par élève, badge « complet » ou « WOD n/N », filtre par classe, recherche, doublons (remplacer ou garder).
- **Exports** : CSV par classe (nom de fichier proposé), PDF et JSON.

### Catalogue

- 48 exercices répartis en 3 filières (Gainage–Tonification, Endurance Force, Intensif Cardio).
- Chaque filière est divisée en 3 zones (haut du corps, tronc et abdos, bas du corps).
- Chaque exercice a une difficulté : vert, orange ou noir.

## 2. Ce qui est repris dans cross-training-eleves

| Élément d'origine | Dans l'appli élève |
|---|---|
| Les 48 exercices | Tous présents dans la banque, parfois sous un nom proche (« Chaise » → « Chaise contre le mur »). Quand le nom diffère, le nom d’origine est affiché sous celui du cycle (« ancienne appli ») |
| 3 filières | Rattachées aux 2 mobiles du référentiel (outil du cycle, onglet Mobiles et FC) |
| 7 réglages Tabata, 1 à 40 cycles | Repris (« TABATA à régler », Tabata de découverte). Les Tabata de l'épreuve restent fixés par le référentiel |
| Rotation verticale / horizontale | Reprise. En horizontal, l'appli prévient au lieu d'arrondir le nombre de cycles |
| Niveaux N0 à N4 (4, 6, 8, 10, 12) en AMRAP et EMOM | Repris. Chaque exercice reste réglable à part |
| Durée réglable, 6 min par défaut | Reprise : EMOM et EMOM+1 de 1 à 60 min, AMRAP de 1 à 30 min |
| **EMOM+1** | **Repris avec sa mécanique** : plusieurs exercices validés un par un, +1 répétition par minute, « Non terminé » avec les répétitions faites, le WOD continue, score en minutes validées (détail V/F), temps de séquence et repos de chaque minute |
| FOR TIME à paliers N1/N2/N3 | Repris. Sans limite de temps par défaut, avec une limite facultative de 6 à 15 min |
| Couleurs de la minute en EMOM (> 20 s, 10–20 s, < 10 s) | Reprises (vert, orange, rouge) en EMOM et EMOM+1 |
| Son / vibreur / muet | Repris, avec la même clé `eps_sound_mode` |
| Note d'exécution | Gardée, mais **sur 5** et saisie à la fin du WOD (voir les écarts ci-dessous) |

## 3. Ce qui est différent ou pas encore repris

Ces écarts sont connus. Chacun peut être repris si tu le décides.

1. **Charge en kg par exercice** : pas encore dans l'appli élève, alors qu'elle compte en Terminale.
2. **AMRAP séquentiel** : l'appli élève compte « +1 tour / +1 rép. ». Il n'y a ni validation exercice par exercice, ni temps par tour, ni graphique.
3. **FOR TIME** : l'appli élève valide palier par palier, pas exercice par exercice. Les temps de palier ne sont pas gardés.
4. **EMOM simple** : l'appli élève garde « Fini ! » une fois par minute, avec le repos restant, ce qui sert l'analyse du référentiel. La validation exercice par exercice n'existe qu'en EMOM+1.
5. **Note d'exécution** :
   - Sur 5 dans l'appli élève, contre 4 à l'origine. À trancher, pour que les deux échelles ne coexistent pas.
   - Saisie à la fin du WOD, et non après chaque exercice.
6. **Ressenti** :
   - L'appli élève a un ressenti du WOD de 1 à 4, sans commentaire obligatoire, et un bilan de séance écrit.
   - L'origine avait 5 niveaux avec commentaire obligatoire, plus un ressenti de séance en étoiles et une échelle de fatigue.
7. **Tabata** :
   - Le score « plancher » n'est pas affiché comme tel : l'appli élève montre le total et l'écart min–max.
   - Les répétitions se comptent sur un seul bouton +1 par round, au lieu d'un compteur par exercice.
8. **Reprise après veille ou rechargement en plein WOD** : pas dans l'appli élève, alors que l'appli d'origine sait le faire.
9. **Compte à rebours** : 10 s dans l'appli élève, contre 3 s à l'origine.
10. **Bilan imprimable et CSV côté élève** : ils sont passés dans l'outil prof (fichiers, QR, exports).
11. **Prof dans la même appli** : remplacé par l'outil prof séparé.
    - Le QR est compressé et contient tout le carnet.
    - Le format `NOM;PRÉNOM;…` de l'origine n'est pas lu par l'outil prof.

## 4. Où sont les reprises dans le code

- `logique.js` :
  - `NIV_REPS`, `TABATA_REGLAGES` ;
  - presets `tl` (Tabata à régler), `e1` (EMOM+1), `fp1` à `fp3` (paliers) ;
  - `score()` pour EMOM+1 (`res.minutes`) et paliers.
- `chrono.js` :
  - EMOM+1 (`seq`, `echec`, `R.minutes`, `repsE1`) ;
  - zones de couleur (`zone`) ;
  - son / vibreur / muet ;
  - paliers (`NBFT`).
- `app.js` (éditeur de WOD) :
  - boutons de réglage Tabata ;
  - niveaux N0 à N4 ;
  - paliers et limite de temps ;
  - durée.
