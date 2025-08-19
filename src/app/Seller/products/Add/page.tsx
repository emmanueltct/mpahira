

import Layout from "@/components/Layout";
import {ProductEntryForm} from "@/components/seller/ProductEntryForm";

export default function ProductEntryPage() {
  return (
    <Layout>
    <main className="py-10">
      <ProductEntryForm />
    </main>
    </Layout>
  );
}
