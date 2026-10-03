import { photos } from "./images";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  photo: string;
  category: string;
  available: boolean;
  tag?: string;
  addOns?: { name: string; price: number }[];
};

/** A fictional demo business used across the marketing site. */
export const demoBusiness = {
  name: "Ofada House",
  slug: "ofada-house",
  area: "Lekki Phase 1, Lagos",
  hours: "Open · closes 10pm",
  link: "menuly.app/ofada-house",
};

export const categories = ["Popular", "Rice", "Grills", "Small chops", "Soups", "Drinks"];

export const menuItems: MenuItem[] = [
  {
    id: "jollof",
    name: "Party Jollof & Chicken",
    description: "Smoky firewood jollof, quarter chicken, fried plantain and coleslaw.",
    price: 4500,
    photo: photos.jollof,
    category: "Rice",
    available: true,
    tag: "Bestseller",
    addOns: [
      { name: "Extra plantain", price: 800 },
      { name: "Peppered turkey", price: 2500 },
      { name: "Moi moi", price: 700 },
    ],
  },
  {
    id: "ofada",
    name: "Ofada Rice & Ayamase",
    description: "Local ofada rice with green pepper sauce, assorted meat and boiled egg.",
    price: 5200,
    photo: photos.ofada,
    category: "Rice",
    available: true,
  },
  {
    id: "suya",
    name: "Beef Suya Platter",
    description: "Thin-sliced beef, yaji spice, onions, tomatoes, cabbage.",
    price: 6000,
    photo: photos.suya,
    category: "Grills",
    available: true,
    tag: "Spicy",
  },
  {
    id: "pepper-soup",
    name: "Catfish Pepper Soup",
    description: "Fresh point-and-kill catfish in a light, peppery broth.",
    price: 7500,
    photo: photos.pepperSoup,
    category: "Soups",
    available: false,
  },
  {
    id: "small-chops",
    name: "Small Chops Box",
    description: "Puff-puff, samosa, spring rolls, peppered gizzard. Serves 2.",
    price: 3800,
    photo: photos.smallChops,
    category: "Small chops",
    available: true,
  },
  {
    id: "chapman",
    name: "House Chapman",
    description: "Our take on the classic — citrus, cucumber, Angostura.",
    price: 2000,
    photo: photos.chapman,
    category: "Drinks",
    available: true,
  },
];

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
