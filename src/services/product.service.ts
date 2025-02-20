import axios from "axios";
import {
  Brand,
  CategoryProd,
  Product,
  ProductImage,
  ProductImageDTO,
  ProductImagesSearchDTO,
} from "../types/product.types";
import { PromotionDTO } from "../types/order.types";

const API_URL = "http://localhost:8081/bff";

const API_URL_PRODUCTS = "http://localhost:8083/api/products";

export const productService = {
  getAllBrands: async (): Promise<Brand[]> => {
    const response = await axios.get(`${API_URL}/brands`);
    return response.data;
  },

  getBrandById: async (id: number): Promise<Brand> => {
    const response = await axios.get(`${API_URL}/brands/${id}`);
    return response.data;
  },

  createBrand: async (brand: Brand): Promise<Brand> => {
    const response = await axios.post(`${API_URL}/brands`, brand);
    return response.data;
  },

  updateBrand: async (id: number, brand: Brand): Promise<Brand> => {
    const response = await axios.put(`${API_URL}/brands/${id}`, brand);
    return response.data;
  },

  deleteBrand: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/brands/${id}`);
  },

  // Category endpoints
  getAllCategories: async (): Promise<CategoryProd[]> => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  getCategoryById: async (id: number): Promise<CategoryProd> => {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  },

  createCategory: async (category: CategoryProd): Promise<CategoryProd> => {
    const response = await axios.post(`${API_URL}/categories`, category);
    return response.data;
  },

  updateCategory: async (
    id: number,
    category: CategoryProd
  ): Promise<CategoryProd> => {
    const response = await axios.put(`${API_URL}/categories/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/categories/${id}`);
  },

  getProductPromotions: async (productId: number): Promise<PromotionDTO[]> => {
    const response = await axios.get(
      `${API_URL}/promotions/product/${productId}`
    );
    const promotions: PromotionDTO[] = response.data;

    const currentDate = new Date();

    // Filtra promoções válidas
    const validPromotions = promotions.filter((promotion) => {
      const startDate = new Date(promotion.startDate);
      const endDate = new Date(promotion.endDate);
      return (
        promotion.status && currentDate >= startDate && currentDate <= endDate
      );
    });

    // Se houver promoções válidas, retorna a promoção com o maior desconto
    if (validPromotions.length > 0) {
      const maxDiscountPromotion = validPromotions.reduce((max, promotion) =>
        promotion.discountPercentage > max.discountPercentage ? promotion : max
      );
      return [maxDiscountPromotion];
    }

    // Se não houver promoções válidas, retorna um array vazio
    return [];
  },

  // Product endpoints
  getAllProducts: async (): Promise<
    (Product & { discountPercentage: number })[]
  > => {
    const response = await axios.get(`${API_URL}/products`);
    const products: Product[] = response.data;

    // Para cada produto, busque as promoções e inclua o percentual de desconto
    const productsWithDiscounts = await Promise.all(
      products.map(async (product) => {
        const promotions = await productService.getProductPromotions(
          product.id!
        );

        const discountPercentage =
          promotions.length > 0 ? promotions[0].discountPercentage : 0;
        return { ...product, discountPercentage };
      })
    );

    return productsWithDiscounts;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  getProductById: async (
    id: number
  ): Promise<Product & { discountPercentage: number }> => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    const product: Product = response.data;

    // Busque as promoções e inclua o percentual de desconto
    const promotions = await productService.getProductPromotions(product.id!);

    const discountPercentage =
      promotions.length > 0 ? promotions[0].discountPercentage : 0;

    return { ...product, discountPercentage };
  },

  createProduct: async (product: Product): Promise<Product> => {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
  },

  updateProduct: async (id: number, product: Product): Promise<Product> => {
    const response = await axios.put(`${API_URL}/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/products/${id}`);
  },

  // Product Image endpoint
  uploadProductImage: async (
    productId: number,
    imageFile: File,
    isMain: boolean
  ): Promise<ProductImage> => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("productId", productId.toString());
    formData.append("main", isMain.toString());

    const response = await axios.post(`${API_URL}/products/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAllProductImages: async (): Promise<ProductImagesSearchDTO[]> => {
    const response = await axios.get(`${API_URL_PRODUCTS}/images`);
    return response.data;
  },

  getProductImageById: async (id: number): Promise<ProductImagesSearchDTO> => {
    const response = await axios.get(`${API_URL_PRODUCTS}/images/${id}`);
    return response.data;
  },

  createProductImage: async (data: FormData): Promise<ProductImage> => {
    const response = await axios.post<ProductImage>(
      `${API_URL_PRODUCTS}/images`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  },

  updateProductImage: async (
    productId: number,
    imageId: number,
    productImageDTO: ProductImageDTO
  ): Promise<ProductImagesSearchDTO> => {
    const formData = new FormData();
    formData.append("description", productImageDTO.description);
    formData.append("image", productImageDTO.image);
    formData.append("productId", productImageDTO.productId.toString());

    const response = await axios.put(
      `${API_URL_PRODUCTS}/${productId}/images/${imageId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteProductImage: async (
    productId: number,
    imageId: number
  ): Promise<void> => {
    await axios.delete(`${API_URL_PRODUCTS}/${productId}/images/${imageId}`);
  },
};
