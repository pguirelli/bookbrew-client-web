import axios from "axios";
import {
  OrderRequestDTO,
  ProductReviewDTO,
  ProductReviewRequestDTO,
  PromotionDTO,
  OrderDTO,
} from "../types/order.types.ts";

const API_URL = "http://localhost:8081/bff";

const OrderService = {
  // Order endpoints
  createOrder: async (orderRequest: OrderRequestDTO): Promise<OrderDTO> => {
    const response = await axios.post(`${API_URL}/orders`, orderRequest);
    return response.data;
  },

  getAllOrders: async (): Promise<OrderDTO[]> => {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  },

  getOrderById: async (id: number): Promise<OrderDTO> => {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  },

  updateOrder: async (
    orderId: number,
    orderRequest: OrderRequestDTO
  ): Promise<OrderDTO> => {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}`,
      orderRequest
    );
    return response.data;
  },

  deleteOrder: async (orderId: number): Promise<void> => {
    await axios.delete(`${API_URL}/orders/${orderId}`);
  },

  // Promotion endpoints
  createPromotion: async (promotion: PromotionDTO): Promise<PromotionDTO> => {
    const response = await axios.post(`${API_URL}/promotions`, promotion);
    return response.data;
  },

  getAllPromotions: async (): Promise<PromotionDTO[]> => {
    const response = await axios.get(`${API_URL}/promotions`);
    return response.data;
  },

  getPromotionById: async (id: number): Promise<PromotionDTO> => {
    const response = await axios.get(`${API_URL}/promotions/${id}`);
    return response.data;
  },

  updatePromotion: async (
    id: number,
    promotion: PromotionDTO
  ): Promise<PromotionDTO> => {
    const response = await axios.put(`${API_URL}/promotions/${id}`, promotion);
    return response.data;
  },

  deletePromotion: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/promotions/${id}`);
  },

  getPromotionsByProduct: async (
    productId: number
  ): Promise<PromotionDTO[]> => {
    const response = await axios.get(
      `${API_URL}/promotions/product/${productId}`
    );
    return response.data;
  },

  // Review endpoints
  getAllReviews: async (): Promise<ProductReviewDTO[]> => {
    const response = await axios.get(`${API_URL}/reviews`);
    return response.data;
  },

  getReviewById: async (id: number): Promise<ProductReviewDTO> => {
    const response = await axios.get(`${API_URL}/reviews/${id}`);
    return response.data;
  },

  getReviewsByProduct: async (
    productId: number
  ): Promise<ProductReviewDTO[]> => {
    const response = await axios.get(`${API_URL}/reviews/product/${productId}`);
    return response.data;
  },

  createReview: async (
    reviewRequest: ProductReviewRequestDTO
  ): Promise<ProductReviewDTO> => {
    const response = await axios.post(`${API_URL}/reviews`, reviewRequest);
    return response.data;
  },

  updateReview: async (
    id: number,
    reviewRequest: ProductReviewRequestDTO
  ): Promise<ProductReviewDTO> => {
    const response = await axios.put(`${API_URL}/reviews/${id}`, reviewRequest);
    return response.data;
  },

  deleteReview: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/reviews/${id}`);
  },
};

export default OrderService;
