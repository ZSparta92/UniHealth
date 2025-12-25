# Instructions de nettoyage complet des caches - Windows

## PART A - HARD CACHE RESET + REBUILD

### Étape 1 : Arrêter Metro complètement
1. Fermez tous les terminaux qui exécutent `expo start` ou `npm start`
2. Appuyez sur `Ctrl+C` dans chaque terminal pour arrêter les processus
3. Vérifiez le Gestionnaire des tâches (Task Manager) et tuez tous les processus `node.exe` liés à Metro/Expo

### Étape 2 : Nettoyer Watchman (si installé)
```cmd
watchman watch-del-all
```

### Étape 3 : Supprimer tous les caches et dépendances
Ouvrez PowerShell ou CMD dans le dossier du projet et exécutez :

```cmd
cd "c:\Data\Ecole\Master 2 HSIM\Cours\Design interface\Application mobile V2"

REM Supprimer node_modules
rmdir /s /q node_modules

REM Supprimer package-lock.json (si présent)
if exist package-lock.json del package-lock.json

REM Supprimer yarn.lock (si présent)
if exist yarn.lock del yarn.lock

REM Supprimer le cache Expo
rmdir /s /q .expo

REM Supprimer le cache Metro (Windows)
rmdir /s /q %TEMP%\metro-*
rmdir /s /q %TEMP%\haste-map-*
rmdir /s /q %TEMP%\react-*

REM Supprimer le cache npm
npm cache clean --force

REM Supprimer le cache Expo CLI
npx expo install --fix
```

### Étape 4 : Vérifier app.json pour jsEngine
Le fichier `app.json` contient `"jsEngine": "jsc"` pour iOS (ligne 18).
Cela signifie que JSC (JavaScriptCore) est utilisé au lieu d'Hermes.
Pour forcer une reconstruction complète, vous pouvez temporairement changer cette valeur puis la remettre.

### Étape 5 : Réinstaller les dépendances
```cmd
npm install
```

### Étape 6 : Démarrer avec cache clear
```cmd
npx expo start -c
```

Le flag `-c` force le nettoyage du cache Metro.

### Étape 7 : Rebuild complet (si nécessaire)
Si vous utilisez un build natif (pas Expo Go) :
```cmd
npx expo prebuild --clean
```

## PART B - Capturer la stack trace exacte

Après avoir exécuté les étapes ci-dessus :

1. **Lancez l'app** avec `npx expo start -c`
2. **Observez l'écran** - si l'erreur se produit, un écran rouge avec la stack trace complète devrait s'afficher
3. **Copiez la stack trace complète** affichée à l'écran
4. **Vérifiez aussi la console** - la stack trace sera aussi loggée avec `=== GLOBAL_ERROR ===`
5. **Identifiez le fichier et la ligne exacte** dans la stack trace (cherchez des patterns comme `at Object.functionName (file:///path/to/file.tsx:123:45)`)

## Notes importantes

- Le handler d'erreur global est maintenant actif dans `App.tsx`
- L'écran d'erreur s'affichera automatiquement si une erreur se produit
- La stack trace complète sera visible à l'écran ET dans la console
- Une fois le fichier/ligne identifié, on pourra corriger uniquement ce problème spécifique

