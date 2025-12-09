# Yum-me Restaurant App - Complete Documentation

## 🏗️ Architecture Overview

```
Frontend (Vue) → Pinia Store → Composable → API Call → Server Endpoint → Service Layer → Data Source
```

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
  id: string;                    
  name: string;                   
  cuisine: string;               
  rating: number;               
  priceRange: '$' | '$$' | '$$$' | '$$$$';  
  address: string;               
  city: string;                  
  state: string;               
  zipCode: string;             
  phone: string;                 
  image: string;                
  description: string;           
  dietaryOptions: ('halal' | 'vegan' | 'vegetarian' | ...)[]; 
  hours: {                        
    open: string;
    close: string;
  };
  coordinates: {                 
    lat: number;
    lng: number;
  };
}
```


### 2. Mock Data (`server/data/mockRestaurants.ts`) ⚠️ **FOR DEVELOPMENT ONLY**

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
  // ... 
}
```

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

**Current Implementation**: Uses mock data from `mockRestaurants.ts`

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

**Example Request**:
- `GET /api/restaurants/1` - Get restaurant with ID "1"

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
