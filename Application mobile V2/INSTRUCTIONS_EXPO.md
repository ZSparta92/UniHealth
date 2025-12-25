# Instructions pour lancer Expo

## 🚀 Serveurs relancés

J'ai arrêté tous les processus Node.js et relancé Expo avec nettoyage du cache.

## 📱 Options de démarrage

J'ai créé 3 fichiers batch pour vous permettre de choisir le mode :

### 1. `start-expo-tunnel.bat` (Recommandé si problème réseau)
- Double-cliquez sur ce fichier
- **Avantage** : Fonctionne même si téléphone et PC ne sont pas sur le même Wi-Fi
- **Utilise** : Les serveurs Expo Cloud (plus lent mais plus fiable)

### 2. `start-expo-lan.bat` (Recommandé si même réseau Wi-Fi)
- Double-cliquez sur ce fichier
- **Prérequis** : Téléphone et PC sur le **même réseau Wi-Fi**
- **Avantage** : Plus rapide, connexion directe

### 3. `start-expo-normal.bat` (Mode par défaut)
- Double-cliquez sur ce fichier
- Mode standard d'Expo

## 🔧 Ce qui a été fait

✅ Arrêt de tous les processus Node.js/Expo
✅ Nettoyage du cache Expo
✅ Relance avec `--clear --tunnel`

## 📲 Sur votre téléphone

1. **Ouvrez Expo Go**
2. **Fermez complètement l'app** (pas juste minimiser)
3. **Rouvrez Expo Go**
4. **Scannez le nouveau QR code** qui apparaît dans le terminal

## ⚠️ Si ça ne fonctionne toujours pas

### Option A : Vérifier le réseau Wi-Fi
- Téléphone et PC doivent être sur **exactement le même réseau Wi-Fi**
- Désactiver le VPN si activé
- Désactiver temporairement le pare-feu Windows

### Option B : Entrer l'URL manuellement
1. Dans Expo Go : Menu (3 lignes) → **"Enter URL manually"**
2. Regardez dans le terminal, vous verrez une URL comme :
   - `exp://192.168.x.x:8081` (mode LAN)
   - `exp://exp.host:xxxxx` (mode tunnel)
3. Copiez cette URL et collez-la dans Expo Go

### Option C : Vérifier la version d'Expo Go
- Mettez à jour Expo Go depuis le Play Store / App Store

### Option D : Redémarrer le téléphone
- Parfois les caches réseau causent des problèmes

## 🆘 Dernière solution

Si rien ne fonctionne, essayez :
```bash
npm install -g expo-cli@latest
npx expo start --clear
```

Puis utilisez l'option "Enter URL manually" dans Expo Go avec l'URL qui s'affiche.
