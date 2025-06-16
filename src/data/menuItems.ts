export type MenuCategory = 'Burgers' | 'Sandwichs orientaux' | 'Accompagnements' | 'Desserts' | 'Boissons';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  image: string;
  prices: {
    normal?: number;
    xl?: number;
    xxl?: number;
  };
}

export const menuItems: MenuItem[] = [
  // --- BURGERS ---
  {
    id: 'pepper',
    name: 'Pepper',
    description: 'Steak haché, sauce au poivre',
    category: 'Burgers',
    image: '/src/assets/images/burgers/pepper.jpg',
    prices: { normal: 450, xl: 650, xxl: 950 },
  },
  {
    id: 'rossini',
    name: 'Rossini',
    description: 'Steak haché, tranche de foie grillé, sauce poivre ou sel',
    category: 'Burgers',
    image: '/src/assets/images/burgers/Rossini.jpg',
    prices: { normal: 800, xl: 950, xxl: 1200 },
  },
  {
    id: 'cheeseburger',
    name: 'Cheese Burger',
    description: 'Steak haché, salade, tomate, gouda, sauce',
    category: 'Burgers',
    image: '/src/assets/images/burgers/Cheese Burger.jpg',
    prices: { normal: 550, xl: 750, xxl: 850 },
  },
  {
    id: 'blue',
    name: 'Blue',
    description: 'Steak haché, sauce roquefort',
    category: 'Burgers',
    image: '/src/assets/images/burgers/Blue.jpg',
    prices: { normal: 650, xl: 950 },
  },
  {
    id: 'egg',
    name: 'Egg',
    description: 'Steak haché, œuf, salade, tomate, poivron, gouda, sauce',
    category: 'Burgers',
    image: '/src/assets/images/burgers/Egg.jpg',
    prices: { normal: 650, xl: 950 },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Steak haché, champignons, oignons caramélisés',
    category: 'Burgers',
    image: '/src/assets/images/burgers/Forest.jpg',
    prices: { normal: 650, xl: 950 },
  },
  {
    id: 'chicken-crispy',
    name: 'Chicken Crispy',
    description: 'Poulet pané, salade, tomate, gouda, sauce BBQ',
    category: 'Burgers',
    image: '/src/assets/images/burgers/Chicken Crispy.jpg',
    prices: { normal: 550 },
  },
  {
    id: 'pepper-smash',
    name: 'PEPPER SMASH',
    description: 'Double Smash Double Cheese House Sauce',
    category: 'Burgers',
    image: '/src/assets/images/burgers/Pepper Smash Burger.jpg',
    prices: { normal: 700, xl: 900, xxl: 1000 },
  },
  // --- SANDWICHS ---
  {
    id: 'nicois',
    name: 'Niçois',
    description: 'Poulet aux fines herbes grillé, salade, tomate, gouda, sauce maison',
    category: 'Sandwichs orientaux',
    image: '/src/assets/images/sandwichs/Niçois.jpg',
    prices: { normal: 500 },
  },
  {
    id: 'keftaji',
    name: 'Keftaji',
    description: 'Kefta, salade, tomate, gouda, sauce maison',
    category: 'Sandwichs orientaux',
    image: '/src/assets/images/sandwichs/Keftaji.jpg',
    prices: { normal: 550 },
  },
  {
    id: 'pondichery',
    name: 'Pondichery',
    description: 'Poulet au curry grillé, salade, tomate, gouda, sauce',
    category: 'Sandwichs orientaux',
    image: '/src/assets/images/sandwichs/Pondichery.jpg',
    prices: { normal: 500 },
  },
  {
    id: 'oriental-cheezy',
    name: 'Oriental Cheezy',
    description: 'Pain façon sandwich oriental, poulet haché, cheddar, fromage, crudités',
    category: 'Sandwichs orientaux',
    image: '/src/assets/images/sandwichs/Oriental Cheezy.jpg',
    prices: { normal: 500 },
  },
  {
    id: 'oriental-chicken',
    name: 'Oriental Chicken',
    description: 'Pain façon sandwich oriental, poulet haché, fromage, crudités',
    category: 'Sandwichs orientaux',
    image: '/src/assets/images/sandwichs/Oriental Chicken.jpg',
    prices: { normal: 500 },
  },
  // --- ACCOMPAGNEMENTS ---
  {
    id: 'frite',
    name: 'Frite',
    description: '',
    category: 'Accompagnements',
    image: '/src/assets/images/sides/Frite.jpg',
    prices: { normal: 200 },
  },
  {
    id: 'frite-xl',
    name: 'Frite XL',
    description: '',
    category: 'Accompagnements',
    image: '/src/assets/images/sides/Frite XL.jpg',
    prices: { normal: 300 },
  },
  {
    id: 'quiches',
    name: 'Quiches',
    description: 'Poulet, champignons ou viande hachée',
    category: 'Accompagnements',
    image: '/src/assets/images/sides/Quiche.jpg',
    prices: { normal: 250 },
  },
  {
    id: 'nuggets',
    name: 'Nuggets',
    description: '',
    category: 'Accompagnements',
    image: '/src/assets/images/sides/Nuggets.jpg',
    prices: { normal: 350 },
  },
  {
    id: 'salade-cesar',
    name: 'Salade César',
    description: '',
    category: 'Accompagnements',
    image: '/src/assets/images/sides/Salade César.jpg',
    prices: { normal: 400 },
  },
  // --- DESSERTS ---
  {
    id: 'fondant-chocolat',
    name: 'Fondant au chocolat',
    description: 'Nature / Cœur pistache / Caramel',
    category: 'Desserts',
    image: '/src/assets/images/desserts/Fondant Chocolat.jpg',
    prices: { normal: 400 },
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Nature / Pistache / Fraise / Citron',
    category: 'Desserts',
    image: '/src/assets/images/desserts/Tiramisu.jpg',
    prices: { normal: 400 },
  },
  // --- BOISSONS ---
  {
    id: 'jus-fruits',
    name: 'Jus de fruits',
    description: 'Fraise / Orange / Citron',
    category: 'Boissons',
    image: '/src/assets/images/boissons/Jus de Fruit Fraise.jpg',
    prices: { normal: 250 },
  },
];
