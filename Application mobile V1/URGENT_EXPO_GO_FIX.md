# 🚨 Solution Rapide - Expo Go sur Téléphone

## ✅ Votre situation

- ✅ **L'app fonctionne sur le web** → Le serveur Expo fonctionne !
- ❌ **L'app ne fonctionne pas sur Expo Go** → Problème de connexion réseau

## 🎯 SOLUTION SIMPLE : Entrer l'URL manuellement

### Étape 1 : Trouver l'URL dans le terminal

Quand Expo est lancé, dans le terminal vous devriez voir quelque chose comme :

```
Metro waiting on exp://172.17.84.78:8081
```

ou

```
exp://exp.host/@username/xxxxx
```

**NOTEZ CETTE URL COMPLÈTE** (commence par `exp://`)

### Étape 2 : Dans Expo Go sur votre téléphone

1. **Ouvrez Expo Go**
2. **Appuyez sur le menu** (☰ trois lignes) en haut à gauche
3. **Sélectionnez "Enter URL manually"** ou **"Entrer l'URL manuellement"**
4. **Copiez-collez l'URL** que vous avez notée dans l'étape 1
   - Exemple : `exp://172.17.84.78:8081`
   - OU : `exp://exp.host/@username/xxxxx` (si mode tunnel)
5. **Appuyez sur "Connect"** ou **"Se connecter"**

## 🔄 Si l'URL locale ne fonctionne pas : Utilisez le mode TUNNEL

Le mode tunnel fonctionne même si le téléphone et PC ne sont pas sur le même réseau.

### Relancer Expo en mode tunnel :

Dans le terminal où Expo est lancé, appuyez sur `Ctrl+C` pour arrêter, puis :

```bash
npx expo start --tunnel --clear
```

**OU** double-cliquez sur le fichier `start-expo-tunnel.bat`

Attendez 30-60 secondes qu'une URL du type `exp://exp.host/@username/xxxxx` apparaisse, puis utilisez cette URL dans Expo Go (étape 2 ci-dessus).

## 📱 Instructions détaillées Expo Go

### Pour Android :

1. Ouvrez l'app **Expo Go**
2. Appuyez sur les **trois lignes** (☰) en haut à gauche
3. Sélectionnez **"Enter URL manually"**
4. Collez l'URL : `exp://172.17.84.78:8081` (ou celle du terminal)
5. Appuyez sur **"Connect"**

### Pour iOS :

1. Ouvrez l'app **Expo Go**
2. Appuyez sur le **menu** (☰) en haut à gauche
3. Sélectionnez **"Enter URL manually"**
4. Collez l'URL : `exp://172.17.84.78:8081` (ou celle du terminal)
5. Appuyez sur **"Connect"**

## ⚡ Résumé rapide

**Dans Expo Go** → Menu (☰) → **"Enter URL manually"** → Coller l'URL du terminal → **Connect**

L'URL devrait être dans le format : `exp://172.17.84.78:8081` ou `exp://exp.host/...`
