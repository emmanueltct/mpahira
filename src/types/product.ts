export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface ProductUnity {
  id: string;
  unitPrice: number;
  minPrice: number;
  maxPrice: number;
  subUnit?: {
    subUnit: string;
  };
}

export interface SingleProduct {
  id: string;
  engLabel: string;
  productProfile: string;
  productDescription?: string;
  productReview: Review[];
  productUnities: ProductUnity[];
  productName?: {
    product: string;
  };
  shopName?: {
    brandName: string;
    market?: {
      marketName: string;
      province?: string;
      district?: string;
      sector?: string;
    };
  };
}
