import Link from "next/link";
import { YearStamp } from "@/components/year-stamp";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-brand-dark">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white">
              EG
            </span>
            EasyGet
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Pharmacy and food delivery for your neighbourhood — verified
            medication and fresh meals, fast.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/pharmacy" className="hover:text-brand">Pharmacy</Link></li>
            <li><Link href="/food-market" className="hover:text-brand">Food Market</Link></li>
            <li><Link href="/cart" className="hover:text-brand">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Support</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand"
              >
                WhatsApp Business
              </a>
            </li>
            <li>24/7 pharmacist on standby</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted">
        © <YearStamp /> EasyGet Emporium. All rights reserved.
      </div>
    </footer>
  );
}
