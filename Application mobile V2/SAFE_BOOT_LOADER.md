# Safe Boot Loader - Instructions

## Objectif

Le Safe Boot Loader identifie le module exact qui cause le crash `ReferenceError: Property 'colors' doesn't exist` avant le premier render React.

## Comment ça fonctionne

1. **App.tsx minimal** : Ne fait AUCUN import top-level de navigation/theme
2. **Chargement dynamique** : Charge les modules un par un après le premier render
3. **Affichage en temps réel** : Montre chaque étape de chargement à l'écran
4. **Capture d'erreurs** : Affiche la stack trace complète si un module échoue

## Utilisation

### 1. Lancer l'app

```cmd
npx expo start -c
```

### 2. Observer l'écran de diagnostic

L'écran affichera :
- **Étape actuelle** : Quel module est en cours de chargement
- **Modules chargés** : Liste des modules chargés avec succès (✅) ou en attente (⏳)
- **Log de boot** : Historique complet des étapes

### 3. Si une erreur se produit

L'écran passera automatiquement en mode erreur et affichera :
- **Message d'erreur** : Le message exact de l'erreur
- **Stack trace complète** : Le fichier et la ligne exacts où l'erreur se produit
- **Modules chargés** : Quels modules ont réussi à se charger avant l'erreur
- **Log complet** : Historique de toutes les étapes

### 4. Identifier le module problématique

Regardez la stack trace pour trouver :
```
at Object.<anonymous> (file:///path/to/file.tsx:123:45)
```

Le fichier et la ligne indiqués sont le module exact qui cause le crash.

## Séquence de chargement

Le loader charge les modules dans cet ordre :

1. ✅ `ThemeContext` - `src/context/ThemeContext.tsx`
2. ✅ `AuthContext` - `src/context/AuthContext.tsx`
3. ✅ `SafeAreaProvider` - `react-native-safe-area-context`
4. ✅ `NavigationContainer` - `@react-navigation/native`
5. ⚠️ `AppNavigator` - `src/navigation/AppNavigator.tsx` (peut déclencher des imports de screens)

## Si le crash est dans AppNavigator

Si l'erreur se produit lors du chargement de `AppNavigator`, cela signifie qu'un des imports de screens cause le problème.

### Prochaines étapes (si nécessaire)

Si le crash est dans `AppNavigator`, il faudra :
1. Modifier `AppNavigator.tsx` pour charger les screens de manière lazy
2. Charger chaque screen un par un pour identifier lequel cause le crash
3. Corriger le screen problématique

## Après identification du problème

1. **Notez le fichier et la ligne exacts** de la stack trace
2. **Corrigez uniquement ce fichier**
3. **Relancez l'app** pour vérifier que le problème est résolu
4. **Une fois résolu**, restaurez `App.tsx` normal (sans le boot loader)

## Restauration de App.tsx normal

Une fois le problème identifié et corrigé, remplacez `App.tsx` par :

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

## Notes importantes

- ⚠️ Ce boot loader est **temporaire** - uniquement pour le diagnostic
- ⚠️ Ne modifiez **PAS** les autres fichiers pendant le diagnostic
- ⚠️ Une fois le problème identifié, corrigez **UNIQUEMENT** le fichier problématique
- ⚠️ Restaurez `App.tsx` normal après correction

