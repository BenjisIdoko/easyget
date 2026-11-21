"use client";

import { createContext, useContext, useMemo } from "react";
import type { Product, Vendor } from "@/lib/types";

interface CatalogValue {
  products: Product[];
  vendors: Vendor[];
  getProduct: (id: string) => Product | undefined;
  getVendor: (id: string | undefined) => Vendor | undefined;
}

const CatalogContext = createContext<CatalogValue | null>(null);

/** Makes the server-loaded catalog available to client components (cart, cards). */
export function CatalogProvider({
  products,
  vendors,
  children,
}: {
  products: Product[];
  vendors: Vendor[];
  children: React.ReactNode;
}) {
  const value = useMemo<CatalogValue>(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    const vendorById = new Map(vendors.map((v) => [v.id, v]));
    return {
      products,
      vendors,
      getProduct: (id) => byId.get(id),
      getVendor: (id) => (id ? vendorById.get(id) : undefined),
    };
  }, [products, vendors]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within a CatalogProvider");
  return ctx;
}
