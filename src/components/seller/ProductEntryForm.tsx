'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useCreateShopProduct } from '@/hooks/useSubmitProduct';
import { useProductsCategory } from '@/hooks/useProductsCategories';
import { useShops } from '@/hooks/useShops';
import { useUnitProducts } from '@/hooks/useUnitProduct';

// ✅ Schema
const formSchema = z.object({
  shopId: z.string().nonempty("Please select a shop"),
  productId: z.string().nonempty("Please select a product"),
  productUnit:z.string().nonempty("Please select a product"),
  productName: z.string().min(2, 'Name must be at least 2 characters'),
  kinyLabel:z.string().min(2, 'Kinyarwanda name must be at least 2 characters'),
  productDiscount:z.string().optional(),
  productPrice: z.string().min(1, 'Enter a price'),
  isExpires: z.boolean(),
  expireDate: z.string().optional(),
  isAvailable: z.boolean(),
  productDescription: z.string().min(20,"Enter atleast 20 characters"),
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
  const router=useRouter()
  const { data: shops, isLoading: shopsLoading } = useShops();
  const { data: products, isLoading: productsLoading } = useProductsCategory();
   const { data: units, isLoading: unitsLoading } = useUnitProducts();
  const createProduct = useCreateShopProduct();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopId: '',
      productId: '',
      productName: '',
      kinyLabel:'',
      productPrice: '',
      productUnit:'',
      productDiscount:'0',
      isExpires: true,
      expireDate: '',
      isAvailable: true,
      productDescription: '',
      productProfile: null,
    },
  });

  const isExpires = form.watch("isExpires");

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
        router.push("/seller/products")
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

          {/* Row 1: Shop + Category + Unit */}
          
          <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-1/2">
            <FormSelect
              label="Shop"
              error={form.formState.errors.shopId?.message}
              className="w-100"
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
              className="w-full"
              {...form.register("productId")}
            >
              <option value="">Select a category</option>
              {!productsLoading && products?.map((product: any) => (
                <option key={product.id} value={product.id}>{product.product}</option>
              ))}
            </FormSelect>
            </div></div>
           

          {/* Row 2: Product Name + Product Name (Kinyarwanda) */}
       
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

        <FormSelect
              label="Unit"
              error={form.formState.errors.unitId?.message}
              className="w-full"
              {...form.register("productUnit")}
            >
              <option value="">Select a unit</option>
              {!unitsLoading && units?.map((unit: any) => (
                <option key={unit.id} value={unit.id}>{unit.unitProduct}</option>
              ))}
          </FormSelect>

          {/* Row 3: Price + Discount */}

          <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-1/2">
            <FormInput
              label="Product Price"
              type="number"
              placeholder="Price"
              error={form.formState.errors.productPrice?.message}
              className="w-full"
              {...form.register("productPrice")}
            />
            </div>
             <div className="w-1/2">
            <FormInput
              label="Discount"
              type="number"
              placeholder="Discount %"
              className="w-full"
              {...form.register("productDiscount")}
            />
            </div>
          </div>

          {/* Product Description */}
          <FormTextarea
            label="Product Description"
            placeholder="Enter product description..."
            className="w-full"
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
              className="w-full"
              {...form.register("expireDate")}
            />
          )}

          {/* Product Image */}
          <FormFile
            label="Product Image"
            accept="image/*"
            className="w-full"
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
