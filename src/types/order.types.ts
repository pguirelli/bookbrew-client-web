export interface OrderRequestDTO {
  customerId: number;
  orderItems: OrderItemDTO[];
  status: string;
  payment: PaymentDTO;
  deliveryAddress: number;
  promotionIds: number[];
}

export interface ProductReviewDTO {
  id?: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  creationDate?: string;
  updateDate?: string;
  status: boolean;
}

export interface ProductReviewRequestDTO {
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  status: boolean;
}

export interface PromotionDTO {
  id?: number;
  description: string;
  productId: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: boolean;
  creationDate?: string;
  updateDate?: string;
}

export interface PaymentDTO {
  id?: number;
  paymentMethod: string;
  status: string;
  transactionCode: string;
  paymentDate?: string;
}

export interface OrderDTO {
  id?: number;
  customerId: number;
  orderDate: string;
  status?: string;
  orderItems: OrderItemDTO[];
  subTotal: number;
  itemCount: number;
  discountAmount: number;
  amount: number;
  payment: PaymentDTO;
  addressId: number;
  creationDate?: string;
  updateDate?: string;
}

export interface OrderItemDTO {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
  discountValue: number;
  totalPrice: number;
  creationDate?: string;
  updateDate?: string;
}
