'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useCreateShopProduct } from '@/hooks/useSubmitProduct';
import { useProductsCategory } from '@/hooks/useProductsCategories';
import { useShops } from '@/hooks/useShops';
import { useSubCategories } from '@/hooks/useSubCategories';

 // ✅ custom hook for subcategories

// ✅ Schema
const formSchema = z.object({
  shopId: z.string().nonempty("Please select a shop"),
  productId: z.string().nonempty("Please select a category"),
  subCategoryId: z.string().nonempty("Please select a subcategory"),
  productName: z.string().min(2, 'Name must be at least 2 characters'),
  kinyLabel: z.string().min(2, 'Kinyarwanda name must be at least 2 characters'),
  isExpires: z.boolean(),
  expireDate: z.string().optional(),
  isAvailable: z.boolean(),
  productDescription: z.string().min(20, "Enter at least 20 characters"),
  productProfile: z.any(),
});

type FormData = z.infer<typeof formSchema>;

// ✅ Reusable Components
function FormInput({ label, error, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className="w-full border rounded-md p-2" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function FormSelect({ label, error, children, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select {...props} className="w-full border rounded-md p-2">
        {children}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function FormTextarea({ label, error, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea {...props} className="w-full border rounded-md p-2" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function FormCheckbox({ label, ...props }: any) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}

function FormFile({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type="file" {...props} className="w-full border rounded-md p-2" />
    </div>
  );
}

// ✅ Main Form
export function ProductEntryForm() {
  const router = useRouter();
  const { data: shops, isLoading: shopsLoading } = useShops();
  const { data: categories, isLoading: categoriesLoading } = useProductsCategory();
  const { data: subCategories, isLoading: subCategoriesLoading } = useSubCategories();

  const createProduct = useCreateShopProduct();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopId: '',
      productId: '',
      subCategoryId: '',
      productName: '',
      kinyLabel: '',
      isExpires: true,
      expireDate: '',
      isAvailable: true,
      productDescription: '',
      productProfile: null,
    },
  });

  const isExpires = form.watch("isExpires");
  const selectedCategory = form.watch("productId");

  // ✅ Filter subcategories by selected category
  const filteredSubCategories = subCategories?.filter(
    (sub: any) => sub.categoryId === selectedCategory
  );

  const onSubmit = (values: FormData) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'productProfile' && value?.[0]) {
        formData.append('productProfile', value[0]);
      } else if (key === 'isExpires' || key === 'isAvailable') {
        formData.append(key, value ? 'true' : 'false');
      } else if (key === 'expireDate' && !value) {
        return;
      } else {
        formData.append(key, String(value));
      }
    });

    createProduct.mutate(formData, {
      onSuccess: () => {
        toast.success("✅ Product submitted successfully!");
        form.reset();
        router.push("/seller/products");
      },
      onError: () => {
        toast.error("❌ Something went wrong while submitting the product.");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Add a New Product</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">

        {/* Row 1: Shop + Category */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-1/2">
            <FormSelect
              label="Shop"
              error={form.formState.errors.shopId?.message}
              {...form.register("shopId")}
            >
              <option value="">Select a shop</option>
              {!shopsLoading && shops?.map((shop: any) => (
                <option key={shop.id} value={shop.id}>{shop.brandName}</option>
              ))}
            </FormSelect>
          </div>
          <div className="w-1/2">
            <FormSelect
              label="Category"
              error={form.formState.errors.productId?.message}
              {...form.register("productId")}
            >
              <option value="">Select a category</option>
              {!categoriesLoading && categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.product}</option>
              ))}
            </FormSelect>
          </div>
        </div>

        {/* Row 2: SubCategory */}
        <FormSelect
          label="SubCategory"
          error={form.formState.errors.subCategoryId?.message}
          {...form.register("subCategoryId")}
        >
          <option value="">Select a subcategory</option>
          {!subCategoriesLoading && filteredSubCategories?.map((sub: any) => (
            <option key={sub.id} value={sub.id}>{sub.subCategoryEng}</option>
          ))}
        </FormSelect>

        {/* Product Name + Kinyarwanda Name */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-1/2">
            <FormInput
              label="Product Name"
              placeholder="Product name"
              error={form.formState.errors.productName?.message}
              {...form.register("productName")}
            />
          </div>
          <div className="w-1/2">
            <FormInput
              label="Product Name (Kinyarwanda)"
              placeholder="Izina ry'igicuruzwa"
              {...form.register("kinyLabel")}
            />
          </div>
        </div>

        {/* Product Description */}
        <FormTextarea
          label="Product Description"
          placeholder="Enter product description..."
          {...form.register("productDescription")}
        />

        {/* Toggles */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-1/2">
            <FormCheckbox label="Has Expiry" {...form.register("isExpires")} />
          </div>
          <div className="w-1/2">
            <FormCheckbox label="Available" {...form.register("isAvailable")} />
          </div>
        </div>

        {/* Expire Date */}
        {isExpires && (
          <FormInput
            label="Expire Date"
            type="date"
            {...form.register("expireDate")}
          />
        )}

        {/* Product Image */}
        <FormFile
          label="Product Image"
          accept="image/*"
          {...form.register("productProfile")}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createProduct.isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {createProduct.isPending ? 'Submitting...' : 'Submit Product'}
        </button>
      </form>
    </div>
  );
}
