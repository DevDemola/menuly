/** Small helpers shared by client and server. */

export const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "my-business";

export const uid = (len = 8) => {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

/**
 * Normalise a phone number into WhatsApp's international format (digits only).
 * Nigerian local numbers like 0803 123 4567 become 2348031234567.
 * Returns "" if the result doesn't look like a real number.
 */
export function toWhatsAppNumber(input: string, defaultCountry = "234") {
  let d = (input || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 11) d = defaultCountry + d.slice(1);
  if (d.length === 10 && !d.startsWith("0") && defaultCountry === "234") d = defaultCountry + d;
  return d.length >= 10 && d.length <= 15 ? d : "";
}

/** Pretty-print an international number for display: +234 803 123 4567 */
export function formatPhone(intl: string) {
  if (!intl) return "";
  if (intl.startsWith("234") && intl.length === 13) {
    return `+234 ${intl.slice(3, 6)} ${intl.slice(6, 9)} ${intl.slice(9)}`;
  }
  return `+${intl}`;
}
