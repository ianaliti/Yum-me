# Yum'me - Memo Technique MVP

## 🎯 Contexte du projet

**Yum'me** est une webapp développée en **1 semaine** dans le cadre du challenge Lean Startup. Il s'agit d'un **MVP (Minimum Viable Product)** permettant de valider le concept auprès des utilisateurs.

> **Note** : La webapp finale (sur 2 ans) sera développée en React Native pour iOS et Android. Ce MVP en Nuxt permet de tester rapidement l'idée avec de vraies fonctionnalités.

---

## 🛠️ Stack Technique

### Frontend

- **Nuxt 4** - Framework Vue.js full-stack (mode SPA, SSR désactivé)
- **Vue 3** - Framework JavaScript réactif avec Composition API
- **Pinia** - Gestion d'état moderne pour Vue (alternative à Vuex)
- **Tailwind CSS 4** - Framework CSS utility-first pour un design rapide
- **Shadcn/UI** - Bibliothèque de composants UI accessibles (basée sur Reka UI)

### Cartographie & Géolocalisation

- **Mapbox GL JS** - Moteur de cartographie interactif
- **Nuxt Mapbox Module** - Intégration simplifiée de Mapbox dans Nuxt
- **Mapbox Directions API** - Calcul d'itinéraires vers les restaurants
- **Style personnalisé** - Map avec design custom adapté à la charte Yum'me

### Temps Réel

- **WebSockets (Nitro)** - Communication bidirectionnelle pour les événements en temps réel
- Gestion de rooms pour les événements de groupe

### Backend

- **Nitro** - Serveur backend de Nuxt (API routes + WebSocket)
- **Données mockées** - Pour le MVP, toutes les données (restaurants, amis, événements) sont simulées côté serveur

---

## 🎨 Pourquoi ces choix technologiques ?

### Nuxt + Vue

- **Rapidité de développement** : Conventions claires, routing automatique, structure organisée
- **Écosystème riche** : Modules, composables, middlewares
- **Migration facilitée** : Logique métier réutilisable lors du passage à React Native

### Tailwind CSS

- **Productivité** : Pas besoin d'écrire du CSS custom, classes utilitaires directes
- **Cohérence** : Design system unifié (espacements, couleurs, typographie)
- **Responsive** : Mobile-first par défaut

### Shadcn/UI

- **Accessibilité** : Composants conformes WAI-ARIA
- **Personnalisable** : Code source disponible, pas de dépendance NPM lourde
- **Design moderne** : Bottom sheets, dialogs, forms prêts à l'emploi

### Mapbox (vs Google Maps)

- **Personnalisation** : Styles de map 100% customisables (couleurs, POI, labels)
- **Performance** : Meilleure gestion de la 3D et des animations
- **Pricing** : Plan gratuit plus généreux (50k chargements/mois)
- **GL-based** : Rendu GPU, animations fluides

### WebSockets Nitro

- **Natif** : Pas besoin de Socket.IO, intégré directement dans Nitro
- **Léger** : Moins de dépendances, performances optimales
- **Simple** : API claire pour créer/rejoindre des rooms

---

## ✅ MVP Réalisé - Fonctionnalités

### 1. Onboarding (5 étapes)

**Page** : `/` (index.vue)

Un parcours guidé pour comprendre les besoins de l'utilisateur :

1. **Welcome** : Écran d'accueil animé
2. **Nom & Prénom** : Collecte des informations de base
3. **Préférences alimentaires** : Sélection de tags (vegan, halal, sans gluten, etc.)
4. **Besoins spéciaux** : Accessibilité PMR, parking, terrasse, etc.
5. **Géolocalisation** : Activation de la position pour trouver des restaurants proches

**Données** : Stockées dans le store Pinia (`useOnboarding`) puis utilisées pour personnaliser l'expérience.

---

### 2. Page d'accueil

**Page** : `/accueil`

- Affichage de **restaurants recommandés** (données mockées)
- Sections : "Proches de toi", "Tendances", "Nouveautés"
- Cards cliquables avec photo, nom, note, tags
- Navigation vers la map ou détails du restaurant

**Données** : Mock de 20+ restaurants avec coordonnées, photos, cuisines, tags dietétiques.

---

### 3. Carte interactive & Recherche

**Page** : `/restaurants`

#### Fonctionnalités Map

- **Map Mapbox GL** avec style personnalisé
- **Markers custom** : Pin Yum'me pour chaque restaurant
- **Géolocalisation** : Bouton pour recentrer sur la position de l'utilisateur
- **Zoom animé** : Flyto smooth lors des interactions

#### Recherche intelligente

- **Autocomplete** : Tape "pizza" → affiche tous les restaurants avec pizzas
- **Recherche par plat ou type de cuisine** : "sushi", "burger", "vegan"
- **Recherche par ville** : Utilise l'API Geocoding de Mapbox
- **Debounce** : Évite les appels API à chaque frappe (300ms)

#### Itinéraires

- **Calcul de trajet** : Depuis la position utilisateur vers le restaurant
- **Mapbox Directions API** : Itinéraire optimisé à pied/voiture/vélo
- **Badge distance/durée** : "1.2 km • 15 min" affiché sur la carte
- **Tracé sur la map** : Ligne bleue montrant le chemin

#### Bottom Sheet Restaurant

- **Détails complets** : Photo, nom, note, cuisine, adresse
- **Tags filtrés** : Affiche uniquement les tags correspondant aux préférences de l'utilisateur
- **Bouton "Itinéraire"** : Lance le calcul et affiche le trajet
- **Swipe to dismiss** : Fermeture naturelle

---

### 4. Événements (Rooms temps réel)

**Page** : `/events`

Une fonctionnalité clé pour **organiser des sorties de groupe**.

#### Création de room

- **Formulaire** : Titre, description, sélection de ses préférences
- **Génération de code** : Code unique à 6 caractères (ex: `ABC123`)
- **WebSocket** : Création de la room côté serveur
- **Partage** : Le créateur partage le code avec ses amis

#### Rejoindre une room

- **Input code** : Saisie du code à 6 chiffres
- **Validation** : Vérification côté serveur que la room existe
- **Synchronisation** : Rejoindre la room via WebSocket

#### Interface Room

- **Liste des participants** : Avatars, noms, préférences alimentaires
- **Mise à jour temps réel** : Quand quelqu'un rejoint/quitte → tous les clients sont notifiés
- **Tags combinés** : Affichage des préférences de tout le groupe
- **Proposition de restaurants** : (Fonctionnalité prévue mais non développée dans le MVP)

---

## 🔧 Aspects Techniques Avancés

### Géolocalisation avec Mapbox

Pour afficher la carte interactive, nous utilisons Mapbox GL JS qui est un moteur de rendu de cartes basé sur WebGL. L'intégration se fait via le module Nuxt Mapbox qui simplifie la configuration. Dans notre fichier de configuration Nuxt, on active le module en lui passant notre token d'accès Mapbox (stocké dans les variables d'environnement pour la sécurité).

Nous avons créé un composable personnalisé `useGeolocation` qui centralise toute la logique de géolocalisation. Ce composable gère plusieurs choses : il détermine où centrer la carte au démarrage (position de l'utilisateur ou Annecy par défaut), il configure le niveau de zoom initial, et il applique notre style de carte personnalisé. Lorsque l'utilisateur arrive sur la page de recherche, le composable demande automatiquement l'accès à sa position GPS via l'API du navigateur. Une fois la position obtenue, elle est stockée dans le store Pinia pour être réutilisée partout dans l'application sans avoir à redemander. Cela permet par exemple de calculer les distances entre l'utilisateur et les restaurants, ou de centrer la carte sur sa position.

### Calcul d'itinéraires avec Mapbox Directions

Quand un utilisateur clique sur "Itinéraire" dans la fiche d'un restaurant, on utilise l'API Mapbox Directions qui calcule le chemin optimal entre deux points. Cette API fonctionne en envoyant une requête HTTP à Mapbox avec les coordonnées de départ (position de l'utilisateur) et d'arrivée (restaurant). L'API renvoie un objet JSON qui contient toutes les informations de l'itinéraire. Dans cet objet, il y a un tableau `routes` dont on récupère le premier élément (la meilleure route). À l'intérieur, on trouve deux propriétés clés : `distance` qui donne la distance totale en mètres (par exemple 1234 mètres), et `duration` qui indique le temps de trajet en secondes (par exemple 900 secondes pour 15 minutes). On récupère aussi la propriété `geometry` qui contient toutes les coordonnées GPS du tracé sous forme de GeoJSON.

Une fois ces données extraites de la réponse, on les exploite de deux façons. D'abord, on affiche le tracé directement sur la carte en ajoutant une "source" Mapbox (les données de geometry) puis un "layer" (la ligne bleue visible). Ensuite, on convertit les mètres en kilomètres et les secondes en minutes, puis on affiche un badge avec ces valeurs formatées de manière lisible (par exemple "1.2 km • 15 min"). Le tracé reste visible sur la carte jusqu'à ce que l'utilisateur le ferme manuellement ou sélectionne un autre restaurant. Cette fonctionnalité aide vraiment l'utilisateur à visualiser comment se rendre au restaurant choisi.

### WebSockets pour les événements temps réel

La fonctionnalité d'événements de groupe repose sur les WebSockets, une technologie qui permet une communication bidirectionnelle en temps réel entre le navigateur et le serveur. Contrairement aux requêtes HTTP classiques (où le client demande et le serveur répond), avec WebSocket la connexion reste ouverte en permanence et les deux parties peuvent s'envoyer des messages à tout moment.

Pour activer les WebSockets dans Nuxt, on ajoute simplement `websocket: true` dans la section expérimentale de Nitro (le serveur de Nuxt). Côté serveur, on crée un fichier spécial `_ws.ts` dans le dossier `server/routes` qui gère toutes les connexions WebSocket. Ce handler écoute trois événements principaux : quand un client se connecte, quand il envoie un message, et quand il se déconnecte.

Le système de rooms fonctionne avec un Room Manager qui garde en mémoire toutes les rooms actives. Quand quelqu'un crée une room, le serveur génère un code à 6 caractères, stocke la room, et "abonne" le créateur à un canal avec ce code. Quand quelqu'un rejoint la room avec le code, il est également abonné au canal, et le serveur diffuse un message à tous les abonnés pour leur dire qu'un nouveau participant est arrivé. Côté client, on a un composable `useRoom` qui gère la connexion WebSocket, envoie les messages au bon format JSON, et écoute les réponses du serveur pour mettre à jour l'interface en temps réel. Si la connexion se coupe, le composable tente automatiquement de se reconnecter.

### Données mockées pour le prototypage rapide

Vu qu'on avait seulement une semaine pour développer le MVP, on a fait le choix de ne pas implémenter une vraie base de données. À la place, toutes les données (restaurants, amis, événements) sont des "mocks", c'est-à-dire des fausses données écrites directement dans des fichiers TypeScript côté serveur. Ces fichiers exportent des tableaux d'objets avec toutes les informations nécessaires : noms, coordonnées GPS, cuisines, tags dietétiques, etc.

L'avantage de cette approche est qu'on peut se concentrer sur l'interface utilisateur et l'expérience sans perdre de temps sur l'infrastructure backend. Les données sont assez réalistes (restaurants avec de vraies coordonnées GPS à Annecy par exemple) pour tester l'application dans des conditions proches de la réalité. Côté architecture, on a quand même créé une couche de services qui filtrent et retournent ces données, exactement comme si elles venaient d'une base de données. Ça veut dire que le jour où on branche une vraie DB, il suffira de modifier les fichiers de service sans toucher au reste de l'application.

### Hébergement et déploiement

Pour le déploiement du MVP, on a d'abord testé sur Vercel qui est très pratique pour les applications Nuxt : connexion au repository Git, déploiement automatique à chaque push, configuration simple. Cependant, on a rapidement rencontré un problème : Vercel ne supporte pas les WebSockets natifs de Nitro, car leur infrastructure est basée sur des fonctions serverless qui n'acceptent que des requêtes HTTP classiques.

Pour contourner ce problème et pouvoir utiliser notre fonctionnalité d'événements en temps réel, on a migré vers Railway. Railway est une plateforme qui permet de déployer de vraies applications avec serveur persistant (pas de serverless), ce qui est exactement ce dont on a besoin pour les WebSockets. Le déploiement se fait aussi automatiquement depuis Git, et l'application tourne en continu, gardant les connexions WebSocket actives. Grâce à Railway, toutes nos fonctionnalités fonctionnent correctement en production, y compris la création et la synchronisation des rooms d'événements.

---

## 📝 Conclusion

Le MVP Yum'me a été développé en **1 semaine** avec une approche **pragmatique** : stack moderne et productive (Nuxt + Vue + Tailwind), fonctionnalités clés validées (onboarding, map, recherche, événements temps réel), données mockées pour accélérer le développement, et hébergement sur Railway pour supporter les WebSockets. Cette base solide permet maintenant de tester avec de vrais utilisateurs, collecter leurs retours, et itérer sur les fonctionnalités les plus demandées avant de migrer vers une application mobile native.
