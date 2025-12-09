# Optimisation des performances Mapbox

## Problèmes identifiés

### Nuxt Devtools + Mapbox
**Problème connu** : Les Nuxt devtools causent des ralentissements importants avec le module Nuxt-Mapbox.

**Solution** : Désactiver les devtools en développement
```ts
// nuxt.config.ts
devtools: { enabled: false }
```

## Optimisations appliquées

### 1. SSR désactivé
```ts
ssr: false
```
Évite les problèmes d'hydratation et améliore les performances côté client.

### 2. Navigation optimisée
- Utilisation de `NuxtLink` au lieu de `navigateTo()`
- Prefetching automatique des pages
- Transitions côté client instantanées

### 3. Map simplifiée
- Chargement direct sans géolocalisation (pour tests)
- Position par défaut : Annecy
- Pas de loader inutile

## Optimisations supplémentaires possibles

### Lazy loading du composant Map
```vue
<template>
  <LazyMapboxMap
    map-id="mainMap"
    :options="mapOptions"
  >
    <!-- ... -->
  </LazyMapboxMap>
</template>
```

### Optimisations Mapbox officielles

1. **Vector tiles optimisés**
   - Plus petits et plus rapides
   - Chargent seulement les features visibles

2. **Expressions simples**
   ```js
   // Rapide ✅
   ["==", ["get", "foo"], "bar"]

   // Plus lent ❌
   ["match", ["get", "foo"], ...]
   ```

3. **Filtres de zoom**
   ```js
   {
     minzoom: 10,
     maxzoom: 14
   }
   ```

4. **Vector tilesets vs GeoJSON**
   - Préférer vector tilesets
   - GL JS charge seulement les features visibles

## Sources

- [Performance issues with Nuxt devtools](https://github.com/AlexLavoie42/Nuxt-Mapbox/issues/92)
- [Mapbox GL JS Performance Guide](https://docs.mapbox.com/help/troubleshooting/mapbox-gl-js-performance/)
- [Nuxt Performance Best Practices](https://nuxt.com/docs/4.x/guide/best-practices/performance)
- [Lazy Loading in Nuxt](https://masteringnuxt.com/2025/lessons/optimize-performance-by-lazy-loading-components-in-nuxt)

## Métriques de performance

Avec les optimisations actuelles :
- ✅ SSR désactivé
- ✅ Devtools désactivés
- ✅ Navigation avec NuxtLink
- ✅ Map simplifiée

Si les performances restent un problème :
1. Implémenter le lazy loading
2. Optimiser les layers Mapbox
3. Utiliser vector tilesets
