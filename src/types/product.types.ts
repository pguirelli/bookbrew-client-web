export interface Brand {
  id?: number;
  description: string;
  status?: boolean;
}

export interface CategoryProd {
  id?: number;
  description: string;
  status?: boolean;
}

export interface Product {
  id?: number;
  code: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  minimumStock: number;
  status?: boolean;
  weight: number;
  height: number;
  width: number;
  length: number;
  salesQuantity?: number;
  category: CategoryProd;
  brand: Brand;
  productImages?: ProductImage[];
  creationDate?: string;
  updateDate?: string;
  discountPercentage?: number;
}

export interface ProductImage {
  id?: number;
  description: string;
  imageData: string;
}

export interface ProductImageDTO {
  id?: number;
  description: string;
  image: File;
  productId: number;
}

export interface ProductImagesSearchDTO {
  id: number;
  description: string;
  image: string;
  productId: number;
}
