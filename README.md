# Yum-me

Application de découverte de restaurants avec carte interactive.

## Stack

- Nuxt 4
- Mapbox GL JS
- Tailwind CSS
- Shadcn Vue

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` avec vos tokens Mapbox :

```env
NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.votre_token
NUXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/username/style-id
```

## Développement

```bash
npm run dev
```

## Fonctionnalités

- Carte interactive Mapbox avec style custom
- Géolocalisation automatique
- Contrôles de navigation (zoom, rotation)
- Design mobile-first
