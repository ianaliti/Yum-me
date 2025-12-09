/**
 * ⚠️ MOCK DATA - FOR DEVELOPMENT ONLY
 * 
 * This file contains mock restaurant data for development and testing.
 * 
 * 🔄 WHEN SWITCHING TO DATABASE:
 * - This file can be DELETED or kept for seeding/initial data
 * - Replace all imports of `mockRestaurants` with database queries
 * - Update `server/services/restaurantService.ts` to use database instead
 * 
 * 📝 Current Usage:
 * - Used by: server/services/restaurantService.ts
 * - Will be replaced by: Database queries (Prisma, Drizzle, etc.)
 */

import type { Restaurant } from '../../app/types/restaurant';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Golden Spoon',
    cuisine: 'Italian',
    rating: 4.5,
    priceRange: '$$',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    phone: '(415) 555-0101',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    description: 'Authentic Italian cuisine with a modern twist. Family-owned since 1985.',
    dietaryOptions: ['vegetarian', 'gluten-free'],
    hours: {
      open: '11:00 AM',
      close: '10:00 PM',
    },
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    id: '2',
    name: 'Sakura Sushi Bar',
    cuisine: 'Japanese',
    rating: 4.8,
    priceRange: '$$$',
    address: '456 Oak Avenue',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    phone: '(415) 555-0102',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    description: 'Fresh sushi and traditional Japanese dishes in an elegant setting.',
    dietaryOptions: ['vegetarian', 'gluten-free', 'dairy-free'],
    hours: {
      open: '5:00 PM',
      close: '11:00 PM',
    },
    coordinates: {
      lat: 37.7849,
      lng: -122.4094,
    },
  },
  {
    id: '3',
    name: 'Burger Paradise',
    cuisine: 'American',
    rating: 4.3,
    priceRange: '$',
    address: '789 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94104',
    phone: '(415) 555-0103',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    description: 'Gourmet burgers made with locally sourced ingredients. A local favorite!',
    dietaryOptions: ['vegan', 'vegetarian', 'gluten-free'],
    hours: {
      open: '11:00 AM',
      close: '9:00 PM',
    },
    coordinates: {
      lat: 37.7949,
      lng: -122.3994,
    },
  },
  {
    id: '4',
    name: 'La Cocina Mexicana',
    cuisine: 'Mexican',
    rating: 4.6,
    priceRange: '$$',
    address: '321 Mission Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    phone: '(415) 555-0104',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    description: 'Traditional Mexican flavors with a contemporary presentation.',
    dietaryOptions: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
    hours: {
      open: '12:00 PM',
      close: '10:00 PM',
    },
    coordinates: {
      lat: 37.8049,
      lng: -122.3894,
    },
  },
  {
    id: '5',
    name: 'Le Bistro Français',
    cuisine: 'French',
    rating: 4.7,
    priceRange: '$$$',
    address: '654 Union Square',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94108',
    phone: '(415) 555-0105',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    description: 'Classic French bistro serving authentic Parisian cuisine.',
    dietaryOptions: ['vegetarian', 'gluten-free'],
    hours: {
      open: '5:30 PM',
      close: '11:30 PM',
    },
    coordinates: {
      lat: 37.8149,
      lng: -122.3794,
    },
  },
  {
    id: '6',
    name: 'Spice Garden',
    cuisine: 'Indian',
    rating: 4.4,
    priceRange: '$$',
    address: '987 Castro Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94114',
    phone: '(415) 555-0106',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
    description: 'Aromatic Indian curries and tandoori specialties in a warm atmosphere.',
    dietaryOptions: ['halal', 'vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free'],
    hours: {
      open: '11:30 AM',
      close: '10:00 PM',
    },
    coordinates: {
      lat: 37.8249,
      lng: -122.3694,
    },
  },
];

