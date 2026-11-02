# Cross training · Élève

Appli élève hors ligne du lycée Georges Pompidou : carnet d'entraînement et chrono du cycle de cross training (CA5). Une tablette par binôme.

- **Séance** (n° 1 à 9) : ce que prévoit la séance du cycle (parcours choisi par le prof : Première ou Terminale, démarche progressive ou GAREEPS), mobile, WOD prévus et réalisés, rôle pour le binôme, étirements, bilan, « pour la prochaine fois ».
- **WOD** : un bouton par format (TABATA, EMOM, AMRAP, FOR TIME, EMOM+1), réglé selon la séance du jour ; dans l'éditeur, version d'épreuve (TABATA modéré N1-N3, EMOM 8 min, TABATA élevé N1-N3, TABATA spécial, EMOM 5 min) ou d'entraînement réglable. Exercices de la banque du cycle, avec versions − / = / +.
- **Chrono plein écran** : le partenaire compte (+1 par répétition), note les no rep, le temps restant à l'EMOM et les régulations ; à la fin, FC et ressenti 1-4.
- **Mon tableau** (FC de repos, mobile et pourquoi, charges), **Jour J** (WOD de la S9 contrôlés selon le référentiel, répartition AFL2/AFL3, échauffement), **Progrès**, **étoile GAREEPS** (SCE en S2, S5, S8).
- **Envoyer** : un QR par élève, ou fichiers JSON à déposer dans le Nuage si le prof a mis un lien dans le QR de la classe.

## Données
Carnet chiffré par le code à 4 chiffres du binôme (AES-GCM, clé PBKDF2), comme en tennis de table. Rien ne part sans action de l'élève.
Fichiers : `CT_1G3_MartinL_S4.json`. QR : `CTE1:` + JSON compact compressé (`logique.js`, `versQR` / `depuisQR`).

## Fichiers communs
- `donnees.js` : fabriqué à partir de `cycle-cross-training/cross-training-donnees.js` (ne pas modifier ici).
- `logique.js`, `scan.js`, `qrcode.js`, `jsqr.js` : même version dans `cross-training-prof`.
- Après une modification : augmenter `VERSION` dans `sw.js`.

## Vidéos de démonstration

`videos.js` associe à 77 des 81 mouvements une vidéo YouTube courte (souvent moins d'une minute), surtout en français : 15-Minute Challenge, EPS Nancy-Metz, MUST COACH, WODMOOV, CrossFit… Le bouton ▶ sur l'image ouvre la vidéo en `youtube-nocookie`. Il faut internet pour la lire ; sans connexion, un message renvoie à la fiche. Les vidéos marquées `a:1` sont seulement proches du mouvement de la fiche, et c'est la fiche qui fait foi. Sans vidéo : arlaud, course, sauts-groupes-banc, gainage-mains-cuisses. Pour changer une vidéo, il suffit de remplacer son identifiant `y` dans `videos.js`. La source est `ct/src/videos.py`.

## Réglages repris de l’appli Cross Training Pompidou (Yannick Dartois, dépôt cross-training-pompidou, non modifié) — détail : ORIGINE-cross-training-pompidou.md

- TABATA « à régler » et découverte : effort/repos 20/10, 30/10, 20/20, 40/20, 10/20, 30/30, 45/15, de 1 à 40 cycles ; en ordre horizontal, l'appli prévient si le nombre de cycles n'est pas divisible par le nombre d'exercices.
- AMRAP et EMOM : niveau N0 à N4 (4, 6, 8, 10 ou 12 rép. pour tous les exercices, chacun reste réglable) ; durée libre de 1 à 30 min, raccourcis 6 et 10 min.
- Tout le chrono et le mode prof de l’appli d’origine ont été repris le 31/10/2026 : voir ORIGINE-cross-training-pompidou.md.
- FOR TIME à paliers dégressifs : N1 6→1 (21 rép.), N2 8→1 (36), N3 10→1 (55), sans limite de temps ou avec cap de 6 à 15 min. Le « FOR TIME 3 tours » reste disponible.
- Son / vibreur / muet dans le chrono, avec la même clé `eps_sound_mode` que l'ancienne appli : le réglage est conservé.

## Tests

Scripts dans `tests/` (Node + Playwright), à relancer avant chaque mise en ligne : voir `tests/README.md`.

## Formats proposés à chaque séance

« Nouveau WOD » affiche un seul bouton par format (TABATA, EMOM, AMRAP, FOR TIME, EMOM+1) : ceux prévus pour la séance du jour, les autres repliés sous « Autres formats ». Chaque bouton s’ouvre sur la version prévue par la séance (tableau `DU_JOUR` dans `logique.js`, une liste par parcours et par séance). Dans l’éditeur, la ligne « Version » permet de passer à une version d’épreuve (N1, N2, N3 du mobile) ou à une version d’entraînement réglable ; la durée, l’effort, le repos et les cycles se règlent comme avant. Le WOD garde l’identifiant de sa version : l’outil prof le lit sans changement.
