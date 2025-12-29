import { Product } from '../types';

const CATEGORIES = ['Mobiles', 'Electronics', 'Fashion', 'Home', 'Appliances'];
const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'Realme', 'Nike', 'Adidas', 'Sony', 'Dell'];

const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }).map((_, index) => {
    const category = CATEGORIES[index % CATEGORIES.length];
    const price = Math.floor(Math.random() * 50000) + 500;
    const discount = Math.floor(Math.random() * 40) + 5;
    const originalPrice = Math.floor(price * (100 / (100 - discount)));
    
    return {
      id: index + 1,
      title: `${BRANDS[index % BRANDS.length]} Product ${index + 1} - ${category} Special Edition`,
      description: `Experience the best quality with our new ${category} item. High durability, premium finish, and excellent performance guaranteed.`,
      price,
      originalPrice,
      discount,
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
      reviewCount: Math.floor(Math.random() * 5000),
      category,
      brand: BRANDS[index % BRANDS.length],
      image: `https://picsum.photos/seed/${index + 1}/300/300`,
      images: [
        `https://picsum.photos/seed/${index + 1}/600/600`,
        `https://picsum.photos/seed/${index + 100}/600/600`,
        `https://picsum.photos/seed/${index + 200}/600/600`,
        `https://picsum.photos/seed/${index + 300}/600/600`,
      ],
      isAssured: Math.random() > 0.3,
    };
  });
};

export const products: Product[] = generateProducts(50);

export const categories = [
  { name: 'Top Offers', img: 'https://picsum.photos/seed/offers/64/64' },
  { name: 'Mobiles', img: 'https://picsum.photos/seed/mobile/64/64' },
  { name: 'Electronics', img: 'https://picsum.photos/seed/electronics/64/64' },
  { name: 'Fashion', img: 'https://picsum.photos/seed/fashion/64/64' },
  { name: 'Home', img: 'https://picsum.photos/seed/home/64/64' },
  { name: 'Appliances', img: 'https://picsum.photos/seed/appliance/64/64' },
  { name: 'Travel', img: 'https://picsum.photos/seed/travel/64/64' },
  { name: 'Beauty', img: 'https://picsum.photos/seed/beauty/64/64' },
];

export const getProductById = (id: number) => products.find((p) => p.id === id);
