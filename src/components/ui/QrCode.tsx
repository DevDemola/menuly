import QRCode from "qrcode";

/**
 * A real, scannable QR code rendered as crisp SVG at build time.
 * Finder patterns are drawn as rounded squares for a softer, branded look.
 */
export function QrCode({
  value,
  className,
  fg = "var(--color-ink)",
  bg = "transparent",
  accent,
}: {
  value: string;
  className?: string;
  fg?: string;
  bg?: string;
  /** Optional colour for the three finder eyes. */
  accent?: string;
}) {
  const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const data = qr.modules.data;

  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);

  const cells: string[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x] && !inFinder(x, y)) {
        cells.push(`M${x + 0.1} ${y + 0.1}h0.8v0.8h-0.8z`);
      }
    }
  }

  const eyes = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];
  const eye = accent ?? fg;

  return (
    <svg
      viewBox={`-2 -2 ${size + 4} ${size + 4}`}
      className={className}
      role="img"
      aria-label={`QR code linking to ${value}`}
      shapeRendering="geometricPrecision"
    >
      <rect x="-2" y="-2" width={size + 4} height={size + 4} fill={bg} />
      <path d={cells.join("")} fill={fg} />
      {eyes.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 0.5} y={y + 0.5} width="6" height="6" rx="1.6" fill="none" stroke={eye} strokeWidth="1" />
          <rect x={x + 2} y={y + 2} width="3" height="3" rx="0.8" fill={eye} />
        </g>
      ))}
    </svg>
  );
}
