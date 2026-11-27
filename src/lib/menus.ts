import type { Product, Vendor } from "./types";
import nightOrchard from "@/data/menus/night_orchard_easyget_menu.json";
import kennek from "@/data/menus/kennek_bites_easyget_menu.json";
import deCravings from "@/data/menus/de_cravings_easyget_menu.json";
import amalaEmpire from "@/data/menus/amala_empire_easyget_menu.json";
import maximfood from "@/data/menus/maximfood_easyget_menu.json";
import cilias from "@/data/menus/cilias_delish_easyget_menu.json";

type RawMenu = {
  vendor: string;
  categories: { category: string; items: { name: string; price: number }[] }[];
};

/** Our shared food categories; each vendor's own headings map onto these. */
const SECTION: Record<string, string> = {
  "Breakfast Menu": "Breakfast",
  "Night Buka Dishes": "Rice & Pasta",
  "Rice, Pasta & Beans": "Rice & Pasta",
  "Food Menu": "Rice & Pasta",
  "Main Dishes": "Rice & Pasta",
  Rice: "Rice & Pasta",
  Proteins: "Proteins",
  "Proteins & Grills": "Proteins",
  Protein: "Proteins",
  Soups: "Soups",
  Soup: "Soups",
  "Pepper Soups": "Soups",
  "Pepper Soup": "Soups",
  Swallows: "Swallows",
  "Swallows (Per Wrap)": "Swallows",
  "Yam, Sides & Sauces": "Sides",
  Salad: "Sides",
  "Fast Food, Shawarma & Pizza": "Fast Food",
  Chops: "Fast Food",
  Shawarma: "Fast Food",
  "Bakery, Pastries & Snacks": "Bakery & Snacks",
  Drink: "Drinks",
  "Drinks & Parfait": "Drinks",
  "Soft Drinks": "Drinks",
  "Frosty Frutty": "Drinks",
  "Packaging & Extras": "Extras",
  "Protein Menu": "Proteins",
  "Main Dish": "Rice & Pasta",
  Swallow: "Swallows",
  Sides: "Sides",
  "Snacks Menu": "Bakery & Snacks",
  "Alacarte Menu": "Fast Food",
};

// Items whose vendor heading doesn't match where shoppers expect them.
const SECTION_BY_NAME: Record<string, string> = {
  // Cilia's "Alacarte Menu" mixes soups, noodles and sides.
  "Catfish Pepper Soup": "Soups",
  "Goat Meat Pepper Soup": "Soups",
  "Cilia's Special Stir Fry Noodles": "Rice & Pasta",
  "Yam and Egg Sauce": "Sides",
  "Porridge Yam": "Sides",
  "Porridge Beans with Plantain": "Sides",
  Zobo: "Drinks",
};

// Maximfood lists swallows under "Soup".
const SWALLOW_NAMES = new Set(["Semo", "Garri", "Poundo"]);

// Not listed for delivery until we decide our alcohol policy.
const ALCOHOL = new Set(["Heineken", "Desperados", "Double Black", "M/Stout"]);

const EMOJI: [RegExp, string][] = [
  [/shawarma/i, "🌯"],
  [/pizza/i, "🍕"],
  [/burger/i, "🍔"],
  [/salad/i, "🥗"],
  [/fries|chips|chip\b/i, "🍟"],
  [/doughnut|puff puff/i, "🍩"],
  [/noodle/i, "🍜"],
  [/coleslaw/i, "🥗"],
  [/gizzard/i, "🍗"],
  [/pepper soup|soup|egusi|ogbono|afang|oha|ofe/i, "🍲"],
  [/spaghetti|pasta|indomie/i, "🍝"],
  [/rice|coconut/i, "🍚"],
  [/chicken|turkey|wings|lap\b|asun/i, "🍗"],
  [/fish|catfish|mackerel|croaker|titus/i, "🐟"],
  [/snail/i, "🐌"],
  [/egg/i, "🥚"],
  [/beef|goat|kpomo|cow|assorted|meat/i, "🥩"],
  [/yam|potato/i, "🍠"],
  [/plantain/i, "🍌"],
  [/beans|moi/i, "🫘"],
  [/tea|coffee/i, "☕"],
  [/bread|bun|pie|roll|cupcake|chin chin|popcorn|peanut/i, "🥐"],
  [/pap|fufu|semo|amala|garri|poundo|semolina|pounded|\beba\b|starch/i, "🥣"],
  [/smoothie|milkshake|parfait|yoghurt|juice|zobo|tiger|chapman|malt|drink|cola|fanta|schweppes|fayrouz|chivita|exotic|shot|ginger|crush|blast|twist|amber/i, "🥤"],
];

const emojiFor = (name: string) => EMOJI.find(([re]) => re.test(name))?.[1] ?? "🍽️";

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const sources: { id: string; menu: RawMenu }[] = [
  { id: "night-orchard", menu: nightOrchard },
  { id: "kennek-bites", menu: kennek },
  { id: "de-cravings", menu: deCravings },
  { id: "amala-empire", menu: amalaEmpire },
  { id: "maximfood", menu: maximfood },
  { id: "cilias-delish", menu: cilias },
];

export const vendors: Vendor[] = sources.map(({ id, menu }) => ({ id, name: menu.vendor }));

export function getVendor(id: string | undefined) {
  return vendors.find((v) => v.id === id);
}

const seen = new Set<string>();

export const menuProducts: Product[] = sources.flatMap(({ id, menu }) =>
  menu.categories.flatMap((cat) =>
    cat.items
      .filter((item) => !ALCOHOL.has(item.name))
      .map((item): Product => {
        const base = `${id}-${slugify(item.name)}`;
        let slug = base;
        for (let n = 2; seen.has(slug); n++) slug = `${base}-${n}`;
        seen.add(slug);

        const subcategory = SWALLOW_NAMES.has(item.name)
          ? "Swallows"
          : (SECTION_BY_NAME[item.name] ?? SECTION[cat.category] ?? cat.category);

        return {
          id: slug,
          slug,
          name: item.name,
          category: "food",
          vendorId: id,
          subcategory,
          priceNaira: item.price,
          description: `${item.name} from ${menu.vendor}.`,
          unit: cat.category.includes("Per Wrap") ? "per wrap" : "per serving",
          imageEmoji: emojiFor(item.name),
          tags: [subcategory.toLowerCase(), menu.vendor.toLowerCase()],
          inStock: true,
        };
      })
  )
);
