/**
 * Every photo on the site comes from this file.
 * They are Unsplash placeholders — swap any URL for your own food
 * photography (e.g. "/photos/jollof.jpg" in /public) and the whole
 * site updates. If an image fails to load, <Photo> falls back to a
 * warm, on-brand placeholder so layouts never break.
 */
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const photos = {
  heroTable: u("photo-1504674900247-0877df9cc836", 1600),
  jollof: u("photo-1512058564366-18510be2db19", 900),
  suya: u("photo-1555939594-58d7cb561ad1", 900),
  plantain: u("photo-1546069901-ba9599a7e63c", 900),
  pepperSoup: u("photo-1547592166-23ac45744acd", 900),
  smallChops: u("photo-1529042410759-befb1204b468", 900),
  chapman: u("photo-1514362545857-3bc16c4c7d1b", 900),
  zobo: u("photo-1556679343-c7306c1976bc", 900),
  puffPuff: u("photo-1551024601-bec78aea704b", 900),
  ofada: u("photo-1565299624946-b28f40a0ae38", 900),
  grill: u("photo-1544025162-d76694265947", 1400),
  spread: u("photo-1476224203421-9ac39bcb3327", 1600),
  restaurant: u("photo-1517248135467-4c7edcad34c4", 1600),
  counter: u("photo-1559339352-11d035aa65de", 1600),
  bakery: u("photo-1509440159596-0249088772ff", 1200),
  coffee: u("photo-1495474472287-4d71bcdd2085", 1200),
  cover: u("photo-1414235077428-338989a2e8c0", 1400),
} as const;

export type PhotoKey = keyof typeof photos;
