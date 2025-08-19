export const useSellerStats = () => {
  return {
    products: { title: "Total Products", value: 120, data: generateMockData() },
    wishlist: { title: "Wishlist Items", value: 34, data: generateMockData() },
    cart: { title: "Cart Items", value: 17, data: generateMockData() },
    revenue: { title: "Total Revenue", value: 25800, data: generateMockData() },
    orders: { title: "Total Orders", value: 89, data: generateMockData() },
    customers: { title: "Customers", value: 43, data: generateMockData() },
  };
};

function generateMockData() {
  return Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 100),
  }));
}


export const useAdminStats = () => {
  return {
    users: { title: "Registered Users", value: 10, data: generateMockData() },
    products: { title: "Total Products", value: 120, data: generateMockData() },
    wishlist: { title: "Wishlist Items", value: 34, data: generateMockData() },
    cart: { title: "Cart Items", value: 17, data: generateMockData() },
    revenue: { title: "Total Revenue", value: 25800, data: generateMockData() },
    orders: { title: "Total Orders", value: 89, data: generateMockData() },
    customers: { title: "Customers", value: 43, data: generateMockData() },
  };
};


