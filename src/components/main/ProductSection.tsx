
import { fetchProductListServer, ProductKind } from '@/lib/server/products.server';
import ProductSlider from './ProductSlider.client';
import type { ProductListParams } from '@/types/product';

export default async function ProductSectionServer({
  title,
  description,
  kind = 'all',
  params = { page: 0, size: 12, sort: 'newest' },
}: {
  title: string;
  description?: string;
  kind?: ProductKind;
  params?: ProductListParams;
}) {
  // 서비스 호출
  const data = await fetchProductListServer(kind, params);
  const empty = data.products.length === 0;

  return (
    <section className="w-full pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-0">
        <div className="mx-auto mb-7 flex items-center">
          <h3 className="pr-5 text-[20px] font-bold">{title}</h3>
          {description && <span className="text-[16px] text-gray-400">{description}</span>}
        </div>

        {empty ? (
          <div className="flex items-center justify-center rounded-xl bg-tertiary-20 py-14 text-center text-gray-500">
            아직 등록된 상품이 없습니다.
          </div>
        ) : (
          <ProductSlider items={data.products} />
        )}
      </div>
    </section>
  );
}


export const NewProductsSection = async (
  props: Omit<Parameters<typeof ProductSectionServer>[0], 'kind'>
) => <ProductSectionServer kind="new" {...props} />;

export const OnSaleProductsSection = async (
  props: Omit<Parameters<typeof ProductSectionServer>[0], 'kind'>
) => <ProductSectionServer kind="onsale" {...props} />;

export const RestockProductsSection = async (
  props: Omit<Parameters<typeof ProductSectionServer>[0], 'kind'>
) => <ProductSectionServer kind="restock" {...props} />;

export const LowStockProductsSection = async (
  props: Omit<Parameters<typeof ProductSectionServer>[0], 'kind'>
) => <ProductSectionServer kind="low-stock" {...props} />;

export const PlannedProductsSection = async (
  props: Omit<Parameters<typeof ProductSectionServer>[0], 'kind'>
) => <ProductSectionServer kind="planned" {...props} />;

export const UpcomingProductsSection = async (
  props: Omit<Parameters<typeof ProductSectionServer>[0], 'kind'>
) => <ProductSectionServer kind="upcoming" {...props} />;
