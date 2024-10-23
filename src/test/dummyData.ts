import { MysteryBox, Treasure } from '@/types/market';

export const dummyMysteryBoxes: MysteryBox[] = [
  {
    id: 1,
    name: 'Basic Box',
    price: 100,
    image_url: 'https://example.com/basic-box.jpg',
  },
  {
    id: 2,
    name: 'Premium Box',
    price: 250,
    image_url: 'https://example.com/premium-box.jpg',
  },
];

export const dummyTreasures: Treasure[] = [
  {
    id: 1,
    name: 'Golden Coin',
    description: 'A shiny golden coin',
    image_url: 'https://example.com/golden-coin.jpg',
    remaining_quantity: 50,
    initial_quantity: 100,
  },
  {
    id: 2,
    name: 'Silver Ring',
    description: 'A beautiful silver ring',
    image_url: 'https://example.com/silver-ring.jpg',
    remaining_quantity: 25,
    initial_quantity: 50,
  },
];
