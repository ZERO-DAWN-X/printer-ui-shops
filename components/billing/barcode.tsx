import { receiptBarcodeCaptionClass } from "@/components/billing/receipt-typography";

type BarcodeProps = {
  code: string;
};

const bars = [
  2, 1, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 2, 1, 1, 1, 3, 1, 2, 1, 1, 3, 2, 1,
  1, 2, 1, 1, 3, 2, 1, 1, 2, 2, 1, 1, 1, 3, 1,
];

export const Barcode = ({ code }: BarcodeProps) => {
  const totalWidth = bars.reduce((a, b) => a + b, 0);
  const positionedBars = bars.reduce<{ width: number; x: number }[]>(
    (acc, width) => {
      const previous = acc[acc.length - 1];
      const nextX = previous ? previous.x + previous.width : 0;
      acc.push({ width, x: nextX });
      return acc;
    },
    [],
  );

  return (
    <div className="mt-4 flex flex-col items-center">
      <svg
        width="85%"
        height="35"
        viewBox={`0 0 ${totalWidth} 40`}
        preserveAspectRatio="none"
      >
        {positionedBars.map((bar, i) => {
          const isBlack = i % 2 === 0;
          return isBlack ? (
            <rect key={i} x={bar.x} y="0" width={bar.width} height="40" fill="black" />
          ) : null;
        })}
      </svg>
      <div className={receiptBarcodeCaptionClass}>{code}</div>
    </div>
  );
};
