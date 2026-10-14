export type ProductCategory = "pharmacy" | "food";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  priceNaira: number;
  compareAtNaira?: number;
  description: string;
  requiresPrescription?: boolean;
  unit: string;
  imageEmoji: string;
  tags: string[];
  inStock: boolean;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  reference: string;
  lines: CartLine[];
  customer: CustomerDetails;
  totalNaira: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  createdAt: string;
}
