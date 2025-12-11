# 🔍 Debug Panel Géolocalisation

## Comment l'utiliser sur mobile

### 1. **Activer le panneau de debug**

Sur n'importe quelle page de l'app, tu verras un **bouton bleu avec 🔍** en haut à droite.

- **Clique dessus** pour ouvrir le panneau de debug
- Le panneau affiche :
  - ✅ Le contexte (HTTPS, navigateur, etc.)
  - 📝 Les logs en temps réel de la géolocalisation
  - ⚠️ Les erreurs détaillées

### 2. **Tester la géolocalisation**

1. **Avant de tester**, ouvre le panneau de debug (clique sur 🔍)
2. **Va dans l'onboarding** et fais tout le parcours jusqu'à "Activer la localisation"
3. **Clique sur "Activer la localisation"**
4. **Observe les logs** dans le panneau :
   - Tu verras chaque étape en temps réel
   - Les erreurs seront affichées en rouge avec des détails

### 3. **Comprendre les logs**

#### ✅ Succès
```
✅ Position obtenue avec précision < 50m
accuracy: 23.4m
```
→ Tout va bien !

#### ❌ Permission refusée
```
❌ Permission refusée par l'utilisateur
code: 1
type: permission_denied
```
→ L'utilisateur a cliqué "Refuser" ou Safari bloque

#### ❌ Contexte non sécurisé
```
❌ Contexte non sécurisé (HTTPS requis)
protocol: http:
```
→ Le site n'est pas en HTTPS (requis pour géolocalisation)

#### ⏱️ Timeout
```
⏱️ Timeout de géolocalisation
```
→ Le GPS n'a pas pu obtenir de position en 15 secondes

#### ❌ Position indisponible
```
❌ Position indisponible (GPS/réseau)
code: 2
```
→ Problème GPS ou réseau

### 4. **Partager les logs**

1. **Prends un screenshot** du panneau de debug avec les erreurs
2. **Ou copie les messages** pour me les envoyer
3. Je pourrai ainsi voir exactement ce qui bloque

### 5. **Ce qu'on cherche à voir**

Sur **Safari iOS**, on veut voir :

#### Cas 1 : Si le popup ne s'affiche PAS
Les logs devraient montrer :
```
🚀 Début completeOnboarding (click bouton Step 5)
📞 Appel getUserPosition(true) DEPUIS click handler
🔒 Contexte de sécurité
   isSecureContext: true
   protocol: https:
📍 Demande de nouvelle position...
🔄 Démarrage de watchPosition...
❌ [L'erreur qui bloque]
```

#### Cas 2 : Si le popup s'affiche mais position pas obtenue
```
🚀 Début completeOnboarding (click bouton Step 5)
...
📡 Position reçue
   accuracy: 500m (trop imprécis)
⏱️ Timeout de géolocalisation (après 15s)
```

#### Cas 3 : Si ça marche (ce qu'on veut)
```
🚀 Début completeOnboarding (click bouton Step 5)
...
📡 Position reçue
   accuracy: 23.4m
✨ Meilleure précision: 23.4m
✅ Position obtenue avec précision < 50m
✅ Onboarding terminé avec succès !
```

## Vérifications importantes

### Sur Safari iOS :

1. **Réglages > Safari > Localisation** → Autoriser
2. **Clear tout** (historique, cache, etc.)
3. **Supprimer les permissions** du site (Réglages > Safari > Confidentialité > Données de sites web)
4. **Relancer Safari**
5. **Tester avec le debug panel ouvert**

### Sur le site :

- Vérifier que l'URL commence bien par `https://`
- Le debug panel affichera un ❌ si ce n'est pas le cas

## Commandes utiles

### Effacer les logs
Clique sur "Effacer les logs" en bas du panneau

### Fermer le panneau
Clique sur "Fermer" en haut à droite

### Réouvrir le panneau
Le bouton 🔍 reste toujours visible

## Exemples de bugs connus Safari

### Bug 1 : Permission "prompt" mais erreur "denied"
Safari bug : `navigator.permissions.query()` retourne "prompt" mais `getCurrentPosition()` retourne "User denied"
→ Les logs montreront : `❌ Permission refusée par l'utilisateur`

### Bug 2 : Contexte non sécurisé en iframe
Si l'app est dans un iframe (Snapchat browser), le contexte peut ne pas être sécurisé
→ Les logs montreront : `❌ Contexte non sécurisé (HTTPS requis)`

### Bug 3 : Delay initial GPS
Sur iPhone, la première position est imprécise (triangulation GSM = 500-5000m)
→ Les logs montreront plusieurs `📡 Position reçue` avec amélioration progressive de l'accuracy

## Ce qui a été fait

✅ **watchPosition** au lieu de getCurrentPosition (meilleure précision iPhone)
✅ **15 secondes de timeout** (au lieu de 5s)
✅ **Résolution rapide** si précision < 50m
✅ **User gesture direct** : appel depuis le click handler (requis iOS/Safari)
✅ **Vérification HTTPS** (requis pour géolocalisation)
✅ **Logs détaillés** à chaque étape
✅ **Fallback Annecy** si échec

## Prochaines étapes si ça marche toujours pas

Si même avec le debug panel on voit que ça ne marche pas sur Safari :

1. **Partage les logs** → Je verrai l'erreur exacte
2. **Essaie sur un autre iPhone** → Peut-être un problème spécifique
3. **Teste en mode privé** → Élimine les problèmes de cache/permissions
4. **Vérifie les réglages iOS** → Localisation générale activée ?

Le but c'est qu'avec les logs détaillés, on puisse identifier EXACTEMENT où ça bloque ! 🎯
