# Cross training · Élève

Appli élève hors ligne du lycée Georges Pompidou : carnet d'entraînement et chrono du cycle de cross training (CA5). Une tablette par binôme.

- **Séance** (n° 1 à 9) : ce que prévoit la séance du cycle (parcours choisi par le prof : Première ou Terminale, démarche progressive ou GAREEPS), mobile, WOD prévus et réalisés, rôle pour le binôme, étirements, bilan, « pour la prochaine fois ».
- **WOD** : formats de l'épreuve (TABATA modéré N1-N3, EMOM 8 min, TABATA élevé N1-N3, TABATA spécial, EMOM 5 min) et formats de découverte (AMRAP, for time, EMOM+1). Exercices de la banque du cycle, avec versions − / = / +.
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
