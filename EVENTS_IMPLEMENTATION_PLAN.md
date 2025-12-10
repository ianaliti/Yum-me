# Plan d'implémentation - Page Événements

## 🎯 Objectif
Créer une page "Ensemble" (events) permettant aux utilisateurs de voir leurs amis et leurs groupes d'événements récents (ex: Secret Santa).

---

## 📋 Analyse de la maquette

### Structure de la page
1. **Header personnalisé**
   - Avatar de l'utilisateur (à gauche)
   - Message de salutation : "Salut, {prénom}"
   - Icône de notification (à droite, avec badge si nécessaire)

2. **Section "Tous vos amis"**
   - Titre : "Tous vos amis"
   - Icône flèche pour voir tous
   - Liste horizontale scrollable d'avatars d'amis
   - Chaque ami : avatar + prénom

3. **Section "Vos récents groupe"**
   - Titre : "Vos récents groupe"
   - Liste verticale de cartes de groupes
   - Chaque carte contient :
     - Couleur de fond distinctive (rouge, bleu, etc.)
     - Titre du groupe
     - Description courte
     - Code du groupe (ex: F6555) avec icône cadeau
     - Avatars des participants (+X si plus de 3)

4. **Bouton flottant "+"**
   - Position : centre-bas (au-dessus de la navbar)
   - Couleur : jaune/doré
   - Action : créer un nouveau groupe

---

## 🗂️ Structure des fichiers à créer

### 1. Types TypeScript
```
app/types/event.ts
```
- Type `Friend` : id, name, avatar
- Type `EventGroup` : id, title, description, code, color, participants, createdAt
- Type `User` : id, name, avatar

### 2. Composants
```
app/components/events/
├── EventsHeader.vue              # Header avec avatar + salutation + notif
├── EventsFriendsSection.vue      # Section "Tous vos amis"
├── EventsFriendAvatar.vue        # Avatar d'un ami avec prénom
├── EventsGroupsSection.vue       # Section "Vos récents groupe"
├── EventsGroupCard.vue           # Carte d'un groupe
└── EventsCreateButton.vue        # Bouton flottant "+"
```

### 3. Composables
```
app/composables/useEvents.ts      # Gestion des événements/groupes
app/composables/useFriends.ts     # Gestion des amis
```

### 4. Store
```
app/stores/eventStore.ts          # Store Pinia pour les événements
app/stores/friendStore.ts         # Store Pinia pour les amis
```

### 5. API Mock
```
server/api/events/index.get.ts    # GET /api/events - Liste des groupes
server/api/friends/index.get.ts   # GET /api/friends - Liste des amis
server/data/mockEvents.ts         # Données mock des événements
server/data/mockFriends.ts        # Données mock des amis
```

---

## 📝 Étapes d'implémentation

### Phase 1 : Types et données mock
- [ ] Créer `app/types/event.ts` avec les interfaces
- [ ] Créer `server/data/mockFriends.ts` avec 10-15 amis fictifs
- [ ] Créer `server/data/mockEvents.ts` avec 3-5 groupes d'événements
- [ ] Créer les endpoints API : `server/api/friends/index.get.ts` et `server/api/events/index.get.ts`

### Phase 2 : Stores Pinia
- [ ] Créer `app/stores/friendStore.ts`
  - State : friends[], loading, error
  - Actions : fetchFriends()
  - Pas de cache pour le moment (ajouter plus tard si nécessaire)

- [ ] Créer `app/stores/eventStore.ts`
  - State : events[], loading, error
  - Actions : fetchEvents()
  - Pas de cache pour le moment

### Phase 3 : Composables
- [ ] Créer `app/composables/useFriends.ts`
  - Wrapper autour du friendStore
  - Export : friends, loading, fetchFriends()

- [ ] Créer `app/composables/useEvents.ts`
  - Wrapper autour du eventStore
  - Export : events, loading, fetchEvents()

### Phase 4 : Composants de base
- [ ] Créer `EventsFriendAvatar.vue`
  - Props : friend (Friend)
  - Template : avatar circulaire + prénom en dessous

- [ ] Créer `EventsGroupCard.vue`
  - Props : group (EventGroup)
  - Template : carte colorée avec toutes les infos
  - Avatars des participants avec overflow "+X"

### Phase 5 : Sections principales
- [ ] Créer `EventsHeader.vue`
  - Récupérer les infos utilisateur (store ou props)
  - Avatar + "Salut, {prénom}" + icône notif

- [ ] Créer `EventsFriendsSection.vue`
  - Utiliser useFriends()
  - Liste horizontale scrollable avec EventsFriendAvatar
  - Titre + icône flèche

- [ ] Créer `EventsGroupsSection.vue`
  - Utiliser useEvents()
  - Liste verticale avec EventsGroupCard
  - Titre

- [ ] Créer `EventsCreateButton.vue`
  - Bouton flottant "+" avec position fixed
  - Couleur jaune/doré
  - Pour l'instant : console.log au clic

### Phase 6 : Page principale
- [ ] Modifier `app/pages/events.vue`
  - Layout : "app"
  - Utiliser tous les composants créés
  - Structure : Header → Friends → Groups → Create Button
  - Charger les données au montage (onMounted)

### Phase 7 : Styles et responsive
- [ ] S'assurer que le scroll horizontal fonctionne pour les amis
- [ ] Vérifier l'espacement entre les sections
- [ ] Tester le responsive mobile
- [ ] Ajouter les transitions/animations si nécessaire

### Phase 8 : Navigation
- [ ] Mettre à jour la navigation pour pointer vers /events
- [ ] Changer l'icône et le label dans NavigationBottomNavigation.vue
- [ ] Tester la navigation entre les pages

---

## 🎨 Design tokens à utiliser

### Couleurs des cartes de groupe
- Rouge : `bg-red-600`
- Bleu : `bg-blue-500`
- Vert : `bg-green-600`
- Violet : `bg-purple-600`
- Orange : `bg-orange-500`

### Espacements
- Entre sections : `space-y-6` ou `gap-6`
- Padding général : `px-4 py-4`
- Padding des cartes : `p-6`

### Avatars
- Taille amis : `w-16 h-16` ou `w-20 h-20`
- Taille header : `w-12 h-12`
- Taille dans cartes : `w-10 h-10`

---

## 📦 Dépendances nécessaires
- Lucide icons pour : Bell (notification), ChevronRight (flèche), Plus (bouton créer), Gift (icône cadeau)
- Composant Badge (déjà existant probablement)

---

## 🚀 Ordre d'exécution recommandé

1. Types → Mock data → API endpoints
2. Stores → Composables
3. Composants atomiques (Avatar, Card)
4. Composants sections (Friends, Groups)
5. Header + Create Button
6. Page principale
7. Styles finaux + Navigation

---

## ⚠️ Points d'attention

- **Scroll horizontal** : Utiliser `overflow-x-auto` avec `flex` ou `grid`
- **Avatars participants** : Limiter à 3 visibles + "+X" pour le reste
- **Colors** : Stocker la couleur dans les données du groupe
- **User context** : Créer un store user ou récupérer depuis le store auth
- **Notifications** : Badge sur l'icône si notifications non lues (mock : hasUnreadNotifications)

---

## 🎯 Livrables

✅ Page /events fonctionnelle avec données mockées
✅ Composants réutilisables et propres
✅ Types TypeScript stricts
✅ Store Pinia pour la gestion d'état
✅ API mockée côté serveur
✅ Design fidèle à la maquette
✅ Responsive mobile-first
