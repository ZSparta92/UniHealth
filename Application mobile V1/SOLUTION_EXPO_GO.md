# Solution pour Expo Go sur téléphone

## ✅ Diagnostic

L'app fonctionne sur le **web** → Le serveur Expo fonctionne correctement
L'app **ne fonctionne pas** sur Expo Go → Problème de connexion réseau

## 🎯 Solution 1 : Utiliser l'URL manuellement dans Expo Go

### Étape 1 : Trouver l'URL Expo

Quand Expo démarre, vous verrez dans le terminal quelque chose comme :

```
Metro waiting on exp://192.168.1.xxx:8081
```

ou

```
exp://exp.host/@username/project-name
```

### Étape 2 : Dans Expo Go sur votre téléphone

1. **Ouvrez Expo Go**
2. Appuyez sur le **menu** (3 lignes ☰) en haut à gauche
3. Sélectionnez **"Enter URL manually"**
4. **Copiez-collez l'URL** que vous voyez dans le terminal
   - Format attendu : `exp://192.168.x.x:8081` ou `exp://exp.host/...`
5. Appuyez sur **"Connect"**

## 🎯 Solution 2 : Mode Tunnel (le plus fiable)

Le mode tunnel utilise les serveurs Expo Cloud et fonctionne même si le téléphone et PC ne sont pas sur le même réseau.

### Dans le terminal :

```bash
cd "c:\Data\Ecole\Master 2 HSIM\Cours\Design interface\Application mobile"
npx expo start --tunnel --clear
```

**OU** double-cliquez sur `start-expo-tunnel.bat`

### Puis :

1. Attendez que le QR code apparaisse (peut prendre 30-60 secondes)
2. L'URL sera du type : `exp://exp.host/@username/xxxxx`
3. Scannez le QR code OU entrez l'URL manuellement dans Expo Go

## 🎯 Solution 3 : Mode LAN (même réseau Wi-Fi requis)

### Vérifier que téléphone et PC sont sur le même Wi-Fi

1. **Sur votre PC** : Ouvrez PowerShell et tapez :
   ```powershell
   ipconfig | findstr /i "IPv4"
   ```
   Notez l'adresse IP (ex: 192.168.1.100)

2. **Sur votre téléphone** : 
   - Allez dans Paramètres → Wi-Fi
   - Appuyez sur votre réseau Wi-Fi
   - Vérifiez l'adresse IP (doit commencer par le même préfixe, ex: 192.168.1.xxx)

### Lancer Expo en mode LAN :

```bash
npx expo start --lan --clear
```

**OU** double-cliquez sur `start-expo-lan.bat`

## 🎯 Solution 4 : Utiliser le QR code du navigateur web

Quand Expo démarre dans le terminal, il affiche aussi une URL web. Parfois le QR code est visible dans le navigateur :

1. Ouvrez `http://localhost:8081` dans votre navigateur
2. Le QR code devrait s'afficher
3. Scannez-le avec Expo Go

## 🔧 Vérifications supplémentaires

### Sur le téléphone :

1. **Fermez complètement Expo Go** (pas juste minimiser)
   - Android : Menu récent → Glisser Expo Go vers le haut
   - iOS : Glisser vers le haut depuis le bas
2. **Rouvrez Expo Go**
3. **Vérifiez que Expo Go est à jour** (Play Store / App Store)

### Sur le PC :

1. **Désactivez temporairement le pare-feu Windows**
   - Recherchez "Pare-feu Windows Defender" dans le menu Démarrer
   - Désactivez temporairement pour tester
   - Si ça fonctionne, ajoutez une exception pour Node.js

2. **Désactivez le VPN** si vous en avez un

3. **Vérifiez les ports**
   - Expo utilise les ports 8081, 8082, 19000, 19001
   - Assurez-vous qu'ils ne sont pas bloqués

## 📱 Instructions détaillées : Entrer URL manuellement

1. **Ouvrez Expo Go** sur votre téléphone
2. **Appuyez sur le menu** (☰) en haut à gauche
3. **Sélectionnez "Enter URL manually"**
4. **Dans le terminal sur votre PC**, cherchez une ligne qui commence par :
   - `exp://192.168.x.x:8081` (mode LAN)
   - `exp://exp.host/...` (mode tunnel)
   - `exp://localhost:8081` (ne fonctionnera pas, utilisez l'IP à la place)
5. **Copiez cette URL complète**
6. **Collez-la dans Expo Go**
7. **Appuyez sur "Connect"**

## ⚠️ Erreurs communes

### "The request timed out"
- Le téléphone ne peut pas atteindre le PC
- Solution : Utilisez le mode tunnel (`--tunnel`)

### "Unable to connect"
- Vérifiez que téléphone et PC sont sur le même Wi-Fi (mode LAN)
- Ou utilisez le mode tunnel

### QR code ne scanne pas
- Utilisez "Enter URL manually" à la place
- Vérifiez que la caméra d'Expo Go a les permissions

## 🆘 Si rien ne fonctionne

1. Redémarrez votre routeur Wi-Fi
2. Redémarrez votre téléphone
3. Utilisez les données mobiles + mode tunnel
4. Essayez sur un autre téléphone pour isoler le problème
