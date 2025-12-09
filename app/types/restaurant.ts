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
  dietaryOptions: ('halal' | 'vegan' | 'vegetarian' | 'gluten-free' | 'kosher' | 'dairy-free' | 'nut-free')[];
  hours: {
    open: string;
    close: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

