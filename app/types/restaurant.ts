export type DietaryOption = 'halal' | 'vegan' | 'vegetarian' | 'gluten-free' | 'kosher' | 'dairy-free' | 'nut-free';

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
  dietaryOptions: DietaryOption[];
  specialties: string[];
  hours: {
    open: string;
    close: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const dietaryOptionLabels: Record<DietaryOption, string> = {
  'halal': 'Halal',
  'vegan': 'Végétalien',
  'vegetarian': 'Végétarien',
  'gluten-free': 'Sans gluten',
  'kosher': 'Kasher',
  'dairy-free': 'Sans lactose',
  'nut-free': 'Sans fruits à coque',
};

