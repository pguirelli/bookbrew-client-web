import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { Product } from "../../types/product.types.ts";
import { Address } from "../../types/customer.types.ts";
import { CheckoutCard } from "../Components/CheckoutCard.tsx";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { customerService } from "../../services/customer.service.ts";

interface CartItem extends Product {
  quantity: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  onCheckout: () => void;
  onOrderComplete: () => void;
  checkoutControl;
  onCheckoutControl;
}

export const OrderSummaryCard: React.FC<OrderSummaryProps> = ({
  items,
  onCheckout,
  onOrderComplete,
  checkoutControl,
  onCheckoutControl 
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { isAuthenticated, user, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        setAddressError(null);

        const customer = await customerService.getCustomerByUserId(
          user?.id ?? 0
        );

        localStorage.setItem("customer", JSON.stringify(customer));

        setAddresses(
          await customerService.getCustomerAddresses(customer.id ?? 0)
        );
      } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        setAddressError(
          "Não foi possível carregar os endereços. Tente novamente."
        );
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    if (user?.id) {
      fetchAddresses();
    }
  }, [user]);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const calculateDiscounts = () => {
    return items.reduce((total, item) => {
      if (!item.discountPercentage) return total;
      const originalPrice = item.price * item.quantity;
      const discountedPrice =
        item.price * (1 - item.discountPercentage / 100) * item.quantity;
      return total + (originalPrice - discountedPrice);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscounts();
  };

  const handleCheckout = () => {
    
    onCheckout(); 

    //console.log("teste:", teste);

    const savedCart = localStorage.getItem("cart");

    console.log("cartItems:", savedCart);
    const cartToSave = cartItems.map((item) => ({
      id: item.id,
      salesQuantity: item.quantity,
      price: item.price,
      discountPercentage: item.discountPercentage,
      totalPrice:
        item.price * item.quantity * (1 - (item.discountPercentage ?? 0) / 100),
      // adicione outros campos necessários
    }));

    localStorage.setItem("orderItems", JSON.stringify(cartToSave));
    console.log("orderItems:", cartItems);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const handleConfirmOrder = async (
    addressId: number,
    paymentMethod: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      setIsCheckoutOpen(false);
    } catch (err) {
      setError("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasDiscounts = items.some((item) => (item.discountPercentage ?? 0) > 0);

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Resumo do Pedido
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Subtotal:</Typography>
          <Typography variant="h6">
            R$ {calculateSubtotal().toFixed(2)}
          </Typography>
        </Box>

        {hasDiscounts && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              color: "success.main",
            }}
          >
            <Typography variant="h6">Descontos:</Typography>
            <Typography variant="h6">
              - R$ {calculateDiscounts().toFixed(2)}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            pt: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Total:
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            R$ {calculateTotal().toFixed(2)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleCheckout}
          sx={{ mt: 2 }}
        >
          Fazer checkout
        </Button>
      </CardContent>

      <CheckoutCard
        open={isCheckoutOpen}
        onClose={handleCloseCheckout}
        onOrderComplete={onOrderComplete}
        addresses={addresses}
        onConfirmOrder={handleConfirmOrder}
        onCheckout={onCheckout}
        checkoutControl={checkoutControl}
        onCheckoutControl={onCheckoutControl}
      />
    </Card>
  );
};
