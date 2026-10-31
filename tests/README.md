# Tests automatiques

À relancer avant chaque mise en ligne. Il faut Node.js et Playwright (`npm i playwright`, puis `npx playwright install chromium`).

Depuis le dossier qui contient les dépôts `cross-training-eleves` et `cross-training-prof` côte à côte :

```
node cross-training-eleves/tests/eleve.test.js
node cross-training-prof/tests/prof.test.js
```

Chaque test démarre son propre petit serveur local, affiche ✓ ou ✗ pour chaque vérification et se termine par le nombre de réussites et d'échecs.

`eleve.test.js` vérifie :
- les règles de l'épreuve dans l'éditeur ;
- le suivi de la décision de régulation ;
- les courbes de progrès ;
- le QR découpé en parties ;
- la sauvegarde chiffrée (nom de fichier, aucun nom en clair, reprise avec le code) ;
- la réception des parties par l'outil prof.
