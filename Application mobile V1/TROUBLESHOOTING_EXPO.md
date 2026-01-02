# Dépannage Expo Go - Problème de connexion

## ❌ Erreur : "The request timed out"

### ✅ Solution 1 : Mode Tunnel (recommandé)
Le serveur Expo a été redémarré en mode tunnel :
```bash
npx expo start --tunnel
```

**Avantages :**
- Fonctionne même si téléphone et PC ne sont pas sur le même Wi-Fi
- Traverse les pare-feu automatiquement
- Utilise les serveurs Expo Cloud

**Comment utiliser :**
1. Attendez que le QR code s'affiche dans le terminal
2. Scannez-le avec Expo Go (caméra native ou app Expo Go)

---

### ✅ Solution 2 : Même réseau Wi-Fi

Si le mode tunnel ne fonctionne pas, essayez le mode LAN :

```bash
npx expo start --lan
```

**Prérequis :**
- Le téléphone et l'ordinateur doivent être sur le **même réseau Wi-Fi**
- Désactiver le VPN si activé sur l'un ou l'autre

**Vérifier l'IP :**
- Windows : `ipconfig` (cherchez "IPv4 Address" sous votre adaptateur Wi-Fi)
- L'URL dans Expo doit correspondre à cette IP

---

### ✅ Solution 3 : Redémarrer Expo complètement

Si rien ne fonctionne :

1. **Arrêter Expo** : `Ctrl+C` dans le terminal
2. **Nettoyer le cache** :
   ```bash
   npx expo start --clear
   ```
3. **Redémarrer** :
   ```bash
   npx expo start
   ```

---

### ✅ Solution 4 : Vérifier le pare-feu Windows

1. Ouvrir "Pare-feu Windows Defender"
2. Cliquer sur "Autoriser une application via le pare-feu"
3. Vérifier que Node.js est autorisé (ports 8081, 8082, 19000, 19001)
4. Si nécessaire, autoriser Node.js pour les réseaux privés et publics

---

### ✅ Solution 5 : Utiliser l'adresse IP manuellement

Si vous voyez une URL comme `exp://172.17.84.78:8082` :

1. Vérifier que cette IP correspond à votre PC (commande `ipconfig`)
2. Si l'IP a changé, Expo Go essaie peut-être de se connecter à une ancienne IP
3. Redémarrer Expo pour obtenir une nouvelle URL
4. Rescanner le nouveau QR code

---

### ✅ Solution 6 : Désactiver temporairement l'antivirus/pare-feu

Parfois, les antivirus bloquent les connexions réseau :
- Désactiver temporairement l'antivirus
- Tester la connexion
- Si ça fonctionne, ajouter une exception pour Node.js/Expo

---

## 🔍 Diagnostic rapide

**Vérifier que le serveur fonctionne :**
```bash
# Dans un autre terminal, vérifier que le port est ouvert
netstat -ano | findstr :8082
```

**Tester la connexion :**
1. Vérifier que le téléphone et PC sont sur le même Wi-Fi (mode LAN)
2. Essayer le mode tunnel (fonctionne partout)
3. Redémarrer Expo avec `--clear`
4. Redémarrer le téléphone (parfois les caches réseau posent problème)

---

## 📱 Sur le téléphone

1. **Forcer la fermeture d'Expo Go** : Fermer complètement l'app et la rouvrir
2. **Réessayer le scan** : Scanner à nouveau le QR code
3. **Entrer l'URL manuellement** : Dans Expo Go, menu → "Enter URL manually" → Coller l'URL exp://...

---

## 💡 Mode tunnel vs LAN

| Mode | Quand l'utiliser | Avantages | Inconvénients |
|------|------------------|-----------|---------------|
| **Tunnel** | Toujours, si possible | Fonctionne partout, traverse pare-feu | Plus lent, nécessite connexion internet |
| **LAN** | Même réseau Wi-Fi | Plus rapide, direct | Nécessite même réseau, peut être bloqué par pare-feu |

---

## 🆘 Si rien ne fonctionne

1. Vérifier que Node.js et npm sont à jour
2. Réinstaller Expo CLI : `npm install -g expo-cli`
3. Vérifier la version d'Expo Go sur le téléphone (mettre à jour si nécessaire)
4. Essayer sur un autre appareil pour isoler le problème
