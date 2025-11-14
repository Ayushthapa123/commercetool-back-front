import { LinkCard } from "@/components/linkCard";
import { PaginationButton } from "@/components/paginationButton";
import { getProducts } from "@/lib/bff/product";
import baseUrl from "@/lib/i18n/navigation";

export default async function Products({
  params,
  searchParams,
}: {
  params: Promise<{ segment: string }>;
  searchParams: Promise<{ offset?: string }>;
}) {
  const awaitedParams = await params;
  const { segment } = awaitedParams;

  const limit = 20;
  const offset = parseInt((await searchParams).offset || "0", 10);
  const products = await getProducts(offset, limit);
  const url = await baseUrl();

  return (
    <div>
      <h1 className="text-3xl">Products</h1>
      <div>
        <PaginationButton
          offset={offset}
          limit={limit}
          url={`${url}/${segment}/products`}
        />
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => {
          return (
            product.price && (
              <li key={product.id}>
                <LinkCard
                  product={product}
                  rank={(index + 1).toString()}
                  clickType="product list"
                  urlBase={url}
                />
              </li>
            )
          );
        })}
      </ul>
      <div>
        <PaginationButton
          offset={offset}
          limit={limit}
          url={`${url}/${segment}/products`}
        />
      </div>
    </div>
  );
}
