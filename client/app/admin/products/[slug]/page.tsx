import ProductEdit from "@/components/admin/ProductEdit";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductEdit slug={slug} />;
}