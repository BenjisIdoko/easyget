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
  /** Optional photo URL (testing: Unsplash). Emoji is the fallback. */
  imageUrl?: string;
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

// "Budget + List" grocery concierge: the customer sends a shopping list and
// a budget, pays a deposit for that budget, and a shopper buys the items at
// a real supermarket. Reconciliation against the till receipt happens on
// delivery, not in this app.
export interface GroceryConciergeRequest {
  customer: CustomerDetails;
  shoppingList: string[];
  budgetNaira: number;
  preferredStore?: string;
}

// Bulk & event catering: no fixed catalog price, so this produces a
// WhatsApp-ready quote request instead of a checkout.
export interface CateringRequest {
  fullName: string;
  phone: string;
  eventDate: string;
  guestCount: number;
  menuNotes: string;
  budgetRangeNaira?: number;
}
