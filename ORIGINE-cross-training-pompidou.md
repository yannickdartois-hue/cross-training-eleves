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

## 2. Ce qui est repris (31/10/2026 : « tout reprendre »)

**Appli élève (cross-training-eleves)**

| Élément d'origine | Dans l'appli élève |
|---|---|
| 48 exercices | Tous dans la banque, parfois sous un nom proche. Quand le nom diffère, le nom d'origine est affiché (« ancienne appli ») |
| 3 filières | Rattachées aux 2 mobiles du référentiel (outil du cycle) |
| Tabata : 7 réglages, 1 à 40 cycles, vertical / horizontal | Repris (« TABATA à régler », Tabata de découverte). Les Tabata de l'épreuve restent fixés par le référentiel |
| Score « plancher » du Tabata, détail cycle par cycle MIN / MAX | Repris : score « plancher X · total Y », barres par round dans le bilan |
| Niveaux N0 à N4 (4, 6, 8, 10, 12) | Repris en AMRAP, EMOM et EMOM+1. Chaque exercice reste réglable à part |
| Durée réglable | EMOM et EMOM+1 : 1 à 60 min. AMRAP : 1 à 30 min. Raccourcis 6 et 10 min |
| AMRAP séquentiel | Repris : exercice en cours, « ✓ Validé », « ↩ Annuler », tour partiel, temps de chaque tour, graphique (vert / rouge par rapport à la moyenne) |
| EMOM séquentiel | Repris : exercices validés un par un, « ✗ Non terminé » avec les répétitions faites, pastilles des minutes, temps de séquence et repos. Le repos de chaque minute sert toujours l'analyse du référentiel |
| EMOM+1 | Repris : mêmes règles, +1 répétition par minute, le WOD continue après une minute ratée |
| FOR TIME à paliers N1 / N2 / N3 | Repris : exercice par exercice, temps de chaque palier, arrêt automatique au dernier. Sans limite de temps par défaut, limite facultative de 6 à 15 min |
| Couleur de la minute (> 20 s, 10–20 s, < 10 s), « À venir » | Repris |
| Compte à rebours | 3 s, comme l'origine |
| Note d'exécution sur 4 | Reprise, puis précisée le 01/11/2026 : la note découle de 3 critères observables cochés par le coach (placement, respiration, amplitude), 1 + un point par critère réussi. En saisie complète, fenêtre après chaque exercice validé avec « Passer » ; en saisie légère, une seule fois en fin de WOD |
| Ressenti du WOD | Repris, puis remplacé le 01/11/2026 par l'effort perçu de 1 à 10 (échelle CR10) et une décision de régulation obligatoire (je baisse, je garde, je monte, j'allonge la récup). Le commentaire obligatoire reste en saisie complète |
| Ressenti de séance | Repris : étoiles 1 à 5 et fatigue 1 à 5, dans « Fin de séance » (saisie complète seulement). Le commentaire de séance est le « bilan » déjà présent |
| Charge en kg | Reprise pour les exercices avec kettlebell, haltère ou barre, proposée d'après « Mes charges » |
| Binôme : « À qui le tour ? » | Repris après chaque WOD : passer au partenaire (qui devient coach) ou rester. Le nom du coach et son conseil sont gardés avec le WOD : ils servent de preuve du rôle (AFL3) |
| Reprise après veille ou rechargement | Reprise : l'état du WOD est gardé chaque seconde (sans aucun nom, seulement des identifiants). À la réouverture du carnet, un bandeau propose « Reprendre » ; le temps passé est compté, les rounds de Tabata manqués comptent 0 |
| Écran allumé, avertissement si la tablette ne sait pas le garder | Repris |
| Son / vibreur / muet | Repris, même clé `eps_sound_mode` |
| Thème sombre | Repris en option (bouton 🌙, clé `eps_theme`). Clair par défaut, comme le demande la charte |
| Lecture facilitée | Déjà dans le mode d'emploi commun |
| Bouton DEMO | Repris : « Ouvrir la démo » (binôme fictif, code 0000) |
| Bilan de séance imprimable / PDF et CSV | Repris dans l'onglet Envoyer |
| Historique sur la tablette | Onglet Progrès (toutes les séances du binôme) |

**Outil prof (cross-training-prof)**

| Élément d'origine | Dans l'outil prof |
|---|---|
| Scan en direct | Déjà présent (lecture continue) |
| Photo du QR (iPad) | Reprise : « Lire une photo de QR » |
| Texte collé | Repris |
| Lecture du format `NOM;PRÉNOM;CLASSE;SCORE…` | Reprise : les QR de l'ancienne appli sont lus et rangés à part, avec recherche, suppression et export CSV / JSON |
| Recherche d'un élève | Reprise dans l'Appel |
| Doublons | Le plus récent est gardé (même élève, même séance) ; pour l'ancienne appli, même élève et même jour = remplacé |
| Exports CSV, PDF, JSON | Repris (Exporter) |

## 3. Ce qui reste différent

1. Un seul compteur « +1 » par round en Tabata, au lieu d'un compteur par carte d'exercice : un seul exercice est actif à la fois.
2. Les QR de l'ancienne appli n'ont pas de numéro de séance : ils ne remplissent ni l'appel ni la grille, ils restent dans leur liste.
3. Les séances enregistrées avant le 31/10/2026 gardent leur ancienne échelle (note sur 5, ressenti sur 4), et celles du 31/10 le ressenti sur 5 ; l'échelle est signalée à l'affichage. L'indice de la grille ramène les notes sur 4.
4. La grille d'évaluation du référentiel, l'étoile GAREEPS, le jour J et le carnet chiffré n'existaient pas dans l'appli d'origine. Ils sont propres à cette appli.

## 4. Où sont les reprises dans le code

- `chrono.js` : tout le chrono (décompte 3 s, validations exercice par exercice, notes /4, bilans détaillés, ressenti 5 + commentaire, état pour la reprise, son / vibreur / muet, couleurs de minute).
- `logique.js` : `NIV_REPS`, `TABATA_REGLAGES`, `NOTE4`, `RESS5`, `ETOILES`, `FATIGUE`, presets `tl`, `e1`, `fp1` à `fp3`, scores (plancher, tours et temps par tour, minutes validées, paliers), QR (charge, échelle, commentaire, ressenti de séance).
- `app.js` : éditeur (réglages, niveaux, charges en kg), reprise du WOD (`cte-wod-en-cours`), « À qui le tour ? », ressenti de séance, démo, thème, impression et CSV.
- `cross-training-prof/prof.js` : `lireAncien`, `lireTexte`, `lirePhoto`, liste de l'ancienne appli, recherche, impression, JSON.
