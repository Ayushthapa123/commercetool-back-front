import { ProductModel } from "@/lib/models/productModel";
import Link from "next/link";

type Props = {
  parts: ProductModel[];
  segmentUrl: string;
  t: (key: string) => string;
};

export function TwoColumnRepairParts({
  parts,
  segmentUrl,
  t,
}: Readonly<Props>) {
  const midpoint = Math.ceil(parts.length / 2);
  const columns: [ProductModel[], ProductModel[]] = [
    parts.slice(0, midpoint),
    parts.slice(midpoint),
  ];

  return (
    <div className="border-neutral-black-10 mx-4 columns-1 gap-0 overflow-hidden rounded-lg border md:columns-2">
      {columns.map((columnParts, columnIndex) => (
        <div key={columnIndex} className="mb-4 break-inside-avoid">
          <table
            className={`text-neutral-black-70 w-full text-sm ${columnIndex === 0 ? "border-r" : ""}`}
          >
            <thead className="border-neutral-black-10 bg-neutral-black-3 border-b font-bold">
              <tr>
                <td className="px-4 py-2">{t("partNo")}</td>
                <td className="border-neutral-black-10 border-l px-4 py-2">
                  {t("description")}
                </td>
              </tr>
            </thead>
            <tbody>
              {columnParts.map((part, index) => (
                <tr
                  key={index}
                  className={
                    index !== columnParts.length - 1 ||
                    (columnIndex === 1 && columns[0].length > columns[1].length)
                      ? "border-neutral-black-10 border-b"
                      : ""
                  }
                >
                  <td className="px-4 py-2 text-left">
                    <Link
                      className="text-primary-blue"
                      href={`${segmentUrl}/product/${part.key}.html`}
                    >
                      {part.sku}
                    </Link>
                  </td>
                  <td className="border-neutral-black-10 border-l px-4 py-2 text-left">
                    Name
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
