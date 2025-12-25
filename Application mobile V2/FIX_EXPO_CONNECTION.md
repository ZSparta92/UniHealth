# 🔧 Réparation connexion Expo Go

## Problème identifié

Si ça ne fonctionne pas sur plusieurs téléphones alors que ça marchait hier, le problème vient du PC/serveur Expo.

## ✅ Actions effectuées

1. ✅ Arrêt de tous les processus Node.js/Expo
2. ✅ Nettoyage complet des caches (.expo et node_modules)
3. ✅ Redémarrage d'Expo avec `--reset-cache`

## 📋 Vérifications à faire

### 1. Vérifier que le serveur démarre correctement

Dans le terminal, vous devriez voir :
- `Metro waiting on exp://...`
- Un QR code
- Pas d'erreurs rouges

### 2. Si des erreurs apparaissent

Si vous voyez des erreurs, notez-les et on les corrigera.

### 3. Essayer différents modes

#### Mode Tunnel (recommandé) :
```bash
npx expo start --tunnel --reset-cache
```

#### Mode LAN :
```bash
npx expo start --lan --reset-cache
```

### 4. Vérifier le pare-feu Windows

1. Ouvrez "Pare-feu Windows Defender"
2. "Autoriser une application via le pare-feu"
3. Vérifiez que Node.js est autorisé (ports 8081, 19000-19001)
4. Si Node.js n'est pas là, cliquez "Autoriser une autre application" → Ajoutez Node.js

### 5. Redémarrer le routeur Wi-Fi

Parfois, le routeur bloque les connexions. Essayez de le redémarrer.

## 🔍 Diagnostic avancé

### Vérifier que le port 8081 est accessible

Dans un nouveau terminal PowerShell :

```powershell
Test-NetConnection -ComputerName localhost -Port 8081
```

Si ça dit "TcpTestSucceeded : True", le port est ouvert.

### Vérifier l'IP de votre PC

```powershell
ipconfig | findstr /i "IPv4"
```

Assurez-vous que c'est la même IP que celle dans l'URL Expo.

## 💡 Solution alternative : Expo Dev Client

Si Expo Go continue à poser problème, on peut créer un build de développement :

```bash
npx expo install expo-dev-client
npx expo run:android  # ou run:ios
```

Mais cela nécessite Android Studio / Xcode.

## 🆘 Si rien ne fonctionne

1. Redémarrer complètement le PC
2. Vérifier les mises à jour Windows
3. Réinstaller Expo CLI : `npm install -g expo-cli@latest`
4. Réinstaller les dépendances : `npm install`
