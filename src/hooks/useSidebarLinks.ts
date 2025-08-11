export const useSidebarLinks = () => {
  return [
    { label: 'Dashboard', href: '/seller/dashboard' },
    {
      label: 'Products',
      dropdown: [
        { label: 'Product List', href: '/seller/products/list' },
        { label: 'Add Product', href: '/seller/products/add' },
      ],
    },
    { label: 'Orders', href: '/seller/orders' },
    { label: 'Settings', href: '/seller/settings' },
  ];
};
