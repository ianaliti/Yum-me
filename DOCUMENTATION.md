# Yum-me Restaurant App - Complete Documentation

> 📝 **Quick Links:**
> - [Database Migration Guide](./DATABASE_MIGRATION.md) - Step-by-step guide for switching to database
> - Files marked with ⚠️ will need updates when using a database

## 🏗️ Architecture Overview

```
Frontend (Vue) → Pinia Store → Composable → API Call → Server Endpoint → Service Layer → Data Source
```

### Key Technologies:
- **Nuxt 3**: Full-stack Vue framework
- **Pinia**: Vue's official state management
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Styling
- **Shadcn Vue**: UI components

---

## 🔄 Data Flow

### Complete Request Flow:

1. **User Action**: User visits page or clicks "Fetch Restaurants" button
2. **Component**: `index.vue` calls `useRestaurants()` composable
3. **Composable**: Auto-fetches or provides `fetchRestaurants()` function
4. **Store**: Pinia store calls `$fetch('/api/restaurants')`
5. **API Endpoint**: Nuxt routes request to `server/api/restaurants.get.ts`
6. **Service Layer**: API calls `restaurantService.getAll(filters)`
7. **Data Source**: Service filters and returns mock data (or database queries)
8. **Response**: Data flows back through the chain
9. **UI Update**: Vue reactively updates the display

---

## 📁 File Structure

```
Yum-me/
├── app/
│   ├── types/
│   │   └── restaurant.ts          # TypeScript interface definition
│   ├── stores/
│   │   └── restaurantStore.ts     # Pinia state management
│   ├── composables/
│   │   └── useRestaurants.ts      # Vue composable wrapper
│   └── pages/
│       └── index.vue               # Main page component
├── server/
│   ├── data/
│   │   └── mockRestaurants.ts     # ⚠️ Mock data (delete when using database)
│   ├── services/
│   │   └── restaurantService.ts   # 🔄 Service layer (update for database)
│   └── api/
│       └── restaurants/
│           ├── restaurants.get.ts  # GET all restaurants
│           └── [id].get.ts        # GET single restaurant
└── nuxt.config.ts                  # Nuxt configuration
```

---

## 🔍 Detailed Component Breakdown

### 1. Type Definition (`app/types/restaurant.ts`)

**Purpose**: Defines the structure of a restaurant object

```typescript
export interface Restaurant {
  id: string;                    // Unique identifier
  name: string;                   // Restaurant name
  cuisine: string;                // Type of cuisine (Italian, Japanese, etc.)
  rating: number;                // Rating from 0-5
  priceRange: '$' | '$$' | '$$$' | '$$$$';  // Price level
  address: string;               // Street address
  city: string;                  // City name
  state: string;                 // State abbreviation
  zipCode: string;               // ZIP code
  phone: string;                 // Phone number
  image: string;                 // Image URL
  description: string;           // Restaurant description
  dietaryOptions: ('halal' | 'vegan' | 'vegetarian' | ...)[];  // Dietary accommodations
  hours: {                        // Operating hours
    open: string;
    close: string;
  };
  coordinates: {                  // GPS coordinates
    lat: number;
    lng: number;
  };
}
```

**Why it exists**: 
- Provides type safety across the entire application
- Ensures all restaurant data follows the same structure
- Used by both frontend and backend code

---

### 2. Mock Data (`server/data/mockRestaurants.ts`) ⚠️ **FOR DEVELOPMENT ONLY**

**Purpose**: Contains sample restaurant data for development

**⚠️ Database Migration Note**: This file will be deleted or used for seeding when switching to a database.

**Structure**:
- Exports an array of 6 `Restaurant` objects
- Each restaurant has complete information (name, cuisine, rating, dietary options, etc.)
- Currently includes: Italian, Japanese, American, Mexican, French, and Indian restaurants

**Example Restaurant**:
```typescript
{
  id: '1',
  name: 'The Golden Spoon',
  cuisine: 'Italian',
  rating: 4.5,
  priceRange: '$$',
  dietaryOptions: ['vegetarian', 'gluten-free'],
  // ... other fields
}
```

**Why it exists**:
- Allows development without a database
- Easy to test filtering and display logic
- Can be used for database seeding when migrating

**When switching to database**:
- Delete this file OR keep it for initial data seeding
- Update `restaurantService.ts` to use database queries instead

---

### 3. Service Layer (`server/services/restaurantService.ts`) 🔄 **UPDATE FOR DATABASE**

**Purpose**: Business logic layer that handles data retrieval and filtering

**⚠️ Database Migration Note**: This is the **ONLY file** that needs to be updated when switching to a database. All other files stay the same!

#### Interface Definition:
```typescript
export interface RestaurantFilters {
  cuisine?: string;           // Filter by cuisine type
  dietaryOption?: string;     // Filter by dietary option (halal, vegan, etc.)
  priceRange?: '$' | '$$' | '$$$' | '$$$$';  // Filter by price
  minRating?: number;         // Minimum rating (0-5)
  city?: string;              // Filter by city
  limit?: number;             // Limit number of results
}
```

#### Methods:

**1. `getAll(filters?)`** - Get all restaurants with optional filtering
- Simulates network delay (300ms)
- Starts with all mock restaurants
- Applies filters sequentially:
  - **Cuisine**: Case-insensitive match
  - **Dietary Option**: Checks if restaurant includes the option
  - **Price Range**: Exact match
  - **Min Rating**: Filters restaurants with rating >= minRating
  - **City**: Case-insensitive match
  - **Limit**: Returns only first N restaurants
- Returns filtered array

**2. `getById(id)`** - Get single restaurant by ID
- Simulates network delay (200ms)
- Uses `Array.find()` to locate restaurant
- Returns `null` if not found

**3. `getTotalCount()`** - Get total number of restaurants
- Returns length of mock data array

**Why it exists**:
- Separates data access from API logic
- Makes it easy to switch from mock data to database
- Centralizes filtering logic
- Can be replaced with database queries without changing API endpoints

**Current Implementation**: Uses mock data from `mockRestaurants.ts`

**Database Implementation**: Replace methods with database queries (Prisma, Drizzle, etc.)
- See `DATABASE_MIGRATION.md` for detailed migration guide

---

### 4. API Endpoints

#### A. Get All Restaurants (`server/api/restaurants.get.ts`)

**Route**: `GET /api/restaurants`

**Query Parameters** (all optional):
- `?cuisine=Italian` - Filter by cuisine
- `?dietaryOption=vegan` - Filter by dietary option
- `?priceRange=$$` - Filter by price range
- `?minRating=4.5` - Minimum rating
- `?city=San Francisco` - Filter by city
- `?limit=5` - Limit results

**How it works**:
1. Receives HTTP request with optional query parameters
2. Extracts and validates query parameters
3. Builds `filters` object from valid parameters
4. Calls `restaurantService.getAll(filters)`
5. Gets total count from service
6. Returns JSON response:
```json
{
  "success": true,
  "data": [...restaurants],
  "count": 6,
  "total": 6
}
```

**Example Requests**:
- `GET /api/restaurants` - All restaurants
- `GET /api/restaurants?cuisine=Italian` - Only Italian restaurants
- `GET /api/restaurants?dietaryOption=vegan&minRating=4.5` - Vegan restaurants with 4.5+ rating

#### B. Get Single Restaurant (`server/api/restaurants/[id].get.ts`)

**Route**: `GET /api/restaurants/:id`

**How it works**:
1. Extracts `id` from URL parameter using `getRouterParam()`
2. Calls `restaurantService.getById(id)`
3. If restaurant found, returns it
4. If not found, throws 404 error

**Example Request**:
- `GET /api/restaurants/1` - Get restaurant with ID "1"

**Response**:
```json
{
  "success": true,
  "data": { ...restaurant object }
}
```

**Error Response** (404):
```json
{
  "statusCode": 404,
  "statusMessage": "Restaurant not found"
}
```

---

### 5. Pinia Store (`app/stores/restaurantStore.ts`)

**Purpose**: Global state management for restaurant data using Pinia (Vue's official state management)

#### Store Structure:
```typescript
export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    restaurants: [] as Restaurant[],
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    async fetchRestaurants() { ... }
  }
});
```

#### State Properties:
- `restaurants: Restaurant[]` - Array of restaurant objects
- `loading: boolean` - Whether data is being fetched
- `error: string | null` - Error message if fetch fails

#### Actions:

**`fetchRestaurants()`** - Fetches restaurants from API
1. Sets `this.loading = true`, clears any previous error
2. Makes API call to `/api/restaurants` using `$fetch()`
3. If successful:
   - Updates `this.restaurants` with response data
   - Sets `this.loading = false`
4. If error:
   - Sets `this.error` message
   - Sets `this.loading = false`

**How Pinia Works**:
- `defineStore()` creates a store with state and actions
- State is automatically reactive (no subscriptions needed)
- Actions can be async and directly modify state using `this`
- Components use `useRestaurantStore()` to access the store
- Store properties are automatically reactive in Vue components

**Why Pinia**:
- Vue's official state management library
- Native Vue reactivity (no wrappers needed)
- Excellent TypeScript support
- DevTools integration
- Simple and intuitive API
- Better performance than alternatives

---

### 6. Vue Composable (`app/composables/useRestaurants.ts`)

**Purpose**: Provides a clean API for components to use the Pinia store

#### How it works:

**1. Store Access**:
```typescript
const store = useRestaurantStore();
```
- Gets Pinia store instance using `useRestaurantStore()`
- Store is automatically reactive (no subscriptions needed)

**2. Lifecycle Hook**:
```typescript
onMounted(() => {
  if (store.restaurants.length === 0 && !store.loading) {
    store.fetchRestaurants();
  }
});
```
- Auto-fetches restaurants when component mounts
- Only fetches if store is empty and not already loading

**3. Return Value**:
```typescript
return {
  restaurants: computed(() => store.restaurants),  // Reactive computed
  loading: computed(() => store.loading),
  error: computed(() => store.error),
  fetchRestaurants: () => store.fetchRestaurants(),
};
```
- Returns computed properties that automatically update when store changes
- Provides `fetchRestaurants()` function for manual fetching
- All properties are reactive - components update automatically

**Why it exists**:
- Provides a clean, consistent API for components
- Handles auto-fetching logic
- Wraps store access in computed properties for optimal reactivity
- Can be extended with additional logic if needed

---

### 7. Page Component (`app/pages/index.vue`)

**Purpose**: Main UI that displays restaurants

#### Template Structure:

**1. Header & Button**:
```vue
<h1>Restaurants</h1>
<Button @click="fetchRestaurants" :disabled="loading">
  {{ loading ? 'Loading...' : 'Fetch Restaurants' }}
</Button>
```
- Title
- Button to manually fetch restaurants
- Disabled while loading

**2. Error Display**:
```vue
<div v-if="error" class="text-red-500">
  Error: {{ error }}
</div>
```
- Shows error message if fetch fails

**3. Loading State**:
```vue
<div v-if="loading && restaurants.length === 0">
  Loading restaurants...
</div>
```
- Shows loading message while fetching

**4. Restaurant Grid**:
```vue
<div v-else-if="restaurants.length > 0" class="grid ...">
  <div v-for="restaurant in restaurants" :key="restaurant.id">
    <!-- Restaurant card -->
  </div>
</div>
```
- Responsive grid (1 column mobile, 2 tablet, 3 desktop)
- Displays each restaurant in a card
- Shows: name, cuisine, price range, rating, address, description

#### Script:
```typescript
const { restaurants, loading, error, fetchRestaurants } = useRestaurants();
```
- Uses composable to get reactive data
- All data automatically updates when store changes

---

### 8. Nuxt Configuration (`nuxt.config.ts`)

**Purpose**: Configures Nuxt application

#### Key Settings:

**1. Tailwind CSS**:
```typescript
vite: {
  plugins: [tailwindcss()],
}
```
- Enables Tailwind CSS for styling

**2. Pinia**:
```typescript
modules: ["@pinia/nuxt", "shadcn-nuxt"],
```
- Adds Pinia state management module
- Auto-configures Pinia for Nuxt

**3. Shadcn Vue**:
```typescript
shadcn: {
  prefix: "",
  componentDir: "@/components/ui",
}
```
- Adds Shadcn Vue UI component library

**4. Route Rules (Caching)**:
```typescript
routeRules: {
  '/api/restaurants': { 
    cache: { maxAge: 60 * 5 }  // Cache for 5 minutes
  },
  '/api/restaurants/**': { 
    cache: { maxAge: 60 * 10 }  // Cache for 10 minutes
  },
}
```
- Caches API responses for better performance
- List endpoint: 5 minutes
- Individual restaurant: 10 minutes

---

## 🔗 How It All Works Together

### Complete Example: User Fetches Restaurants

1. **User visits page** (`/`)
   - Nuxt renders `app/pages/index.vue`

2. **Component mounts**
   - `index.vue` calls `useRestaurants()`
   - Composable checks if store has data
   - If empty, automatically calls `fetchRestaurants()`

3. **Store action executes**
   - `store.fetchRestaurants()` runs (Pinia action)
   - Sets `store.loading = true`
   - Makes HTTP request: `GET /api/restaurants`

4. **Nuxt routes request**
   - Request goes to `server/api/restaurants.get.ts`
   - Nuxt's Nitro server handles it

5. **API endpoint processes**
   - Extracts query parameters
   - Builds filters object
   - Calls `restaurantService.getAll(filters)`

6. **Service layer filters data**
   - Gets all mock restaurants
   - Applies filters (if any)
   - Returns filtered array

7. **Response flows back**
   - API returns JSON: `{ success: true, data: [...] }`
   - Store receives response
   - Updates Pinia state: `this.restaurants = response.data`, `this.loading = false`

8. **Vue updates UI**
   - Pinia store is automatically reactive
   - Computed properties in composable detect changes
   - Component reactively re-renders
   - Restaurant cards appear on screen

### Example with Filters:

**User requests**: `GET /api/restaurants?cuisine=Italian&minRating=4.0`

1. API receives query: `{ cuisine: 'Italian', minRating: '4.0' }`
2. Builds filters: `{ cuisine: 'Italian', minRating: 4.0 }`
3. Service filters:
   - Starts with all 6 restaurants
   - Filters by cuisine: keeps only Italian (1 restaurant)
   - Filters by rating: keeps only 4.0+ (that 1 restaurant has 4.5 ✓)
4. Returns: 1 Italian restaurant with rating >= 4.0

---

## 🗄️ Switching to Database

### Files That Need Changes:

#### ⚠️ **Files to Update:**
1. **`server/services/restaurantService.ts`** - Replace mock data with database queries
2. **`server/data/mockRestaurants.ts`** - Delete or keep for seeding

#### ✅ **Files That Stay the Same:**
- `server/api/restaurants.get.ts` - No changes needed
- `server/api/restaurants/[id].get.ts` - No changes needed
- `app/stores/restaurantStore.ts` - No changes needed
- `app/composables/useRestaurants.ts` - No changes needed
- `app/pages/index.vue` - No changes needed
- All other files - No changes needed

### Current Setup (Mock Data):
```typescript
// server/services/restaurantService.ts
export const restaurantService = {
  async getAll(filters?) {
    let restaurants = [...mockRestaurants];  // Uses mock data
    // ... filtering logic
    return restaurants;
  }
}
```

### Migration Steps:

**1. Install database library** (e.g., Prisma, Drizzle, or raw SQL):
```bash
npm install prisma @prisma/client
npx prisma init
```

**2. Update `server/services/restaurantService.ts`**:
```typescript
// Replace mock imports with database client
import { prisma } from '~/server/db';

export const restaurantService = {
  async getAll(filters?: RestaurantFilters): Promise<Restaurant[]> {
    const where: any = {};
    
    if (filters?.cuisine) {
      where.cuisine = { equals: filters.cuisine, mode: 'insensitive' };
    }
    
    if (filters?.dietaryOption) {
      where.dietaryOptions = { has: filters.dietaryOption };
    }
    
    if (filters?.priceRange) {
      where.priceRange = filters.priceRange;
    }
    
    if (filters?.minRating !== undefined) {
      where.rating = { gte: filters.minRating };
    }
    
    if (filters?.city) {
      where.city = { equals: filters.city, mode: 'insensitive' };
    }
    
    const restaurants = await prisma.restaurant.findMany({
      where,
      take: filters?.limit,
    });
    
    return restaurants;
  },

  async getById(id: string): Promise<Restaurant | null> {
    return await prisma.restaurant.findUnique({
      where: { id },
    });
  },

  async getTotalCount(): Promise<number> {
    return await prisma.restaurant.count();
  },
};
```

**3. (Optional) Delete mock data**:
```bash
rm server/data/mockRestaurants.ts
```

**4. That's it!**
- ✅ API endpoints work automatically
- ✅ Store works automatically
- ✅ Components work automatically
- ✅ Only 1-2 files changed!

**📝 See `DATABASE_MIGRATION.md` for detailed migration guide**

---

## 🎯 Key Concepts

### 1. Separation of Concerns
- **Frontend**: UI and user interaction
- **Store**: State management
- **API**: Request/response handling
- **Service**: Business logic
- **Data**: Data source (mock or database)

### 2. Reactivity Chain
```
Pinia Store → Composable Computed Properties → Component Template
```
(Pinia stores are natively reactive - no subscriptions needed!)

### 3. Type Safety
- TypeScript interfaces ensure data consistency
- `Restaurant` interface used everywhere
- Prevents bugs from incorrect data structures

### 4. Error Handling
- API endpoints catch errors and return proper status codes
- Store catches fetch errors and sets error state
- UI displays error messages to user

### 5. Performance
- Route rules cache API responses
- Service layer can be optimized with database indexes
- Vue's reactivity only updates changed parts

---

## 📝 Summary

This application demonstrates:
- ✅ Clean architecture with separation of concerns
- ✅ Type-safe TypeScript throughout
- ✅ Reactive state management with Pinia (Vue's official state management)
- ✅ Server-side API with filtering capabilities
- ✅ Easy transition from mock data to database (only 1-2 files need changes!)
- ✅ Modern Nuxt 3 full-stack patterns

### Key Features:
- **Simple**: Minimal code, easy to understand
- **Maintainable**: Clear separation of concerns
- **Scalable**: Ready for database integration
- **Type-Safe**: TypeScript throughout
- **Reactive**: Native Vue reactivity with Pinia

### Database Migration:
- **Only 1-2 files need changes** when switching to database
- All other files stay the same
- See `DATABASE_MIGRATION.md` for detailed guide

The code is simple, maintainable, and ready to scale when you add a real database!

