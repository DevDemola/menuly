/** Shared data shapes. Safe to import from client and server code. */

export type AddOn = { id: string; name: string; price: number };

export type Category = { id: string; name: string };

export type Item = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  /** Remote URL, /public path, or a compressed data: URL from an upload. */
  photo: string | null;
  available: boolean;
  tag?: string;
  addOns: AddOn[];
};

export type Business = {
  slug: string;
  name: string;
  type: string;
  area: string;
  /** WhatsApp number in international format, digits only, e.g. 2348031234567 */
  whatsapp: string;
  logo: string | null;
  cover: string | null;
  accent: string;
  /** Short status line shown under the name, e.g. "Open · closes 10pm" */
  hours: string;
  pickup: boolean;
  delivery: boolean;
  categories: Category[];
  items: Item[];
  /** True for the built-in demo menu. */
  demo?: boolean;
  createdAt: string;
  updatedAt: string;
};

/** What the customer's browser sends at checkout. Prices are re-checked on the server. */
export type CartLine = {
  itemId: string;
  qty: number;
  addOnIds: string[];
  note?: string;
};

export type OrderMode = "pickup" | "delivery";

export type CustomerDetails = {
  name: string;
  phone: string;
  mode: OrderMode;
  address?: string;
  note?: string;
};

export type OrderLine = {
  name: string;
  qty: number;
  unitPrice: number;
  addOns: { name: string; price: number }[];
  note?: string;
  lineTotal: number;
};

export type Order = {
  id: string;
  slug: string;
  createdAt: string;
  customer: CustomerDetails;
  lines: OrderLine[];
  total: number;
};
