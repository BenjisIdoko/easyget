import type { Product } from "./types";
import { menuProducts } from "./menus";

// imageUrl values are Unsplash photos used as testing-phase placeholders
// (generic shots, not the exact branded product). Swap for real photography later.
export const products: Product[] = [
  // Pharmacy
  {
    id: "ph-1",
    slug: "acycor-plus",
    name: "Acycor Plus (Aceclofenac & Paracetamol)",
    category: "pharmacy",
    subcategory: "Pain Relief",
    priceNaira: 2200,
    description:
      "Fast-acting relief for body pain, joint pain, and fever. 10x1x10 blister pack.",
    requiresPrescription: false,
    unit: "pack of 10",
    imageEmoji: "💊",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=70",
    tags: ["pain relief", "fever"],
    inStock: true,
  },
  {
    id: "ph-2",
    slug: "amoxicillin-500mg",
    name: "Amoxicillin 500mg Capsules",
    category: "pharmacy",
    subcategory: "Antibiotics",
    priceNaira: 3500,
    description: "Broad-spectrum antibiotic. Dispensed against a valid prescription only.",
    requiresPrescription: true,
    unit: "pack of 21",
    imageEmoji: "💊",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=70",
    tags: ["antibiotic", "prescription"],
    inStock: true,
  },
  {
    id: "ph-3",
    slug: "vitamin-c-1000",
    name: "Vitamin C 1000mg Effervescent",
    category: "pharmacy",
    subcategory: "Wellness & Supplements",
    priceNaira: 4800,
    description: "Daily immune support, orange flavour, 20 effervescent tablets.",
    unit: "tube of 20",
    imageEmoji: "🍊",
    imageUrl: "https://images.unsplash.com/photo-1707129785947-ddc627a8bab9?auto=format&fit=crop&w=800&q=70",
    tags: ["immunity", "supplement"],
    inStock: true,
  },
  {
    id: "ph-4",
    slug: "first-aid-kit-home",
    name: "Home First-Aid Kit",
    category: "pharmacy",
    subcategory: "First Aid",
    priceNaira: 9500,
    description: "Bandages, antiseptic, gloves, scissors and essentials for home emergencies.",
    unit: "1 kit",
    imageEmoji: "🩹",
    imageUrl: "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?auto=format&fit=crop&w=800&q=70",
    tags: ["first aid", "home"],
    inStock: true,
  },
  {
    id: "ph-5",
    slug: "digital-thermometer",
    name: "Digital Infrared Thermometer",
    category: "pharmacy",
    subcategory: "Devices",
    priceNaira: 12500,
    description: "No-touch forehead thermometer with fast, accurate readings.",
    unit: "1 unit",
    imageEmoji: "🌡️",
    imageUrl: "https://images.unsplash.com/photo-1594790628624-9e563bea851d?auto=format&fit=crop&w=800&q=70",
    tags: ["device", "fever"],
    inStock: true,
  },
  {
    id: "ph-6",
    slug: "oral-rehydration-salts",
    name: "Oral Rehydration Salts (ORS)",
    category: "pharmacy",
    subcategory: "Wellness & Supplements",
    priceNaira: 1200,
    description: "WHO-formula rehydration salts for dehydration and upset stomach.",
    unit: "sachet of 5",
    imageEmoji: "💧",
    imageUrl: "https://images.unsplash.com/photo-1588718889344-f7bd7a565d20?auto=format&fit=crop&w=800&q=70",
    tags: ["hydration", "stomach"],
    inStock: true,
  },
  {
    id: "ph-7",
    slug: "blood-pressure-monitor",
    name: "Automatic Blood Pressure Monitor",
    category: "pharmacy",
    subcategory: "Devices",
    priceNaira: 28500,
    description: "Upper-arm digital BP monitor with memory for two users.",
    unit: "1 unit",
    imageEmoji: "🩺",
    imageUrl: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=70",
    tags: ["device", "heart"],
    inStock: true,
  },
  {
    id: "ph-8",
    slug: "multivitamin-adult",
    name: "Daily Multivitamin (Adult)",
    category: "pharmacy",
    subcategory: "Wellness & Supplements",
    priceNaira: 6200,
    description: "Complete daily multivitamin with minerals, 30-day supply.",
    unit: "pack of 30",
    imageEmoji: "🌿",
    imageUrl: "https://images.unsplash.com/photo-1624362772755-4d5843e67047?auto=format&fit=crop&w=800&q=70",
    tags: ["supplement", "daily"],
    inStock: true,
  },

  // Food market: real vendor menus (see ./menus.ts)
  ...menuProducts,
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product["category"]) {
  return products.filter((p) => p.category === category);
}
