'use client';

import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,

} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateShopProduct } from '@/hooks/useSubmitProduct';
import { useProductsCategory } from '@/hooks/useProductsCategories';
import { useShops } from '@/hooks/useShops';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  shopId: z.string(),
  productId: z.string(),
  productName: z.string().min(2, 'Name must be at least 2 characters'),
  productPrice: z.string().min(1, 'Enter a price'),
  isExpires: z.boolean(),
  expireDate: z.string().optional(),
  isAvailable: z.boolean(),
  productDescription: z.string().optional(),
  productProfile: z.any(),
});

export function ProductEntryForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopId: '',
      productId: '',
      productName: '',
      productPrice: '',
      isExpires: true,
      expireDate: '',
      isAvailable: true,
      productDescription: '',
      productProfile: null,
    },
  });

  const { data: shops, isLoading: shopsLoading } = useShops();
  const { data: products, isLoading: productsLoading } = useProductsCategory();
  const createProduct = useCreateShopProduct();

//   const onSubmit = (values: any) => {
//   const formData = new FormData();

//   Object.entries(values).forEach(([key, value]) => {
//     if (key === 'productProfile' && value?.[0]) {
//       const file = value[0];
//       console.log("Uploading file:", file);
//       formData.append('productProfile', file);
//     } else {
//       formData.append(key, String(value));
//     }
//   });

//   createProduct.mutate(formData);
// };


const onSubmit = (values: any) => {
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
    onSuccess: (data) => {
      console.log("0000000000000000000000000000000000000000000000000000000000",data.message)
      //toast.success("✅ Product Submitted: Your product was submitted successfully.");
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}
          >
            <div className="flex-1 w-0">
              <p className="text-sm font-medium text-gray-900">Product Submitted</p>
              <p className="mt-1 text-sm text-gray-500">Your product was submitted successfully.</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✖
              </button>
            </div>
          </div>
        ));
      form.reset(); // optionally reset the form
    },
    onError: (error: any) => {
  const backendErrors = error?.response?.data?.errors;

  if (backendErrors) {
    Object.entries(backendErrors).forEach(([field, err]: any) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-red-50 border-l-4 border-red-500 text-red-700 shadow-lg rounded-md p-4 flex items-start space-x-4`}
        >
          <div className="flex-1">
            <p className="text-sm font-bold">❌ Validation Error: <span className="capitalize">{field}</span></p>
            <p className="text-sm mt-1">{err._errors?.[0] ?? 'Invalid field.'}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-red-500 hover:text-red-700 text-lg font-bold"
          >
            ✖
          </button>
        </div>
      ));
    });
  } else {
    toast.error("Something went wrong while submitting the product.");
  }
    }
  });
};

  const isExpires = form.watch('isExpires');

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          Add a New Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {shopsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <FormField
                control={form.control}
                name="shopId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shop" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shops?.map((shop: any) => (
                          <SelectItem key={shop.id} value={shop.id}>
                            {shop.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {productsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products?.map((product: any) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Product name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="Price" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter product description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isExpires"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel>Has Expiry</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel>Available</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {isExpires && (
              <FormField
                control={form.control}
                name="expireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expire Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="productProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createProduct.isPending} className="w-full">
              {createProduct.isPending ? 'Submitting...' : 'Submit Product'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
