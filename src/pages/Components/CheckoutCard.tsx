import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Grid,
  TextField,
  Dialog,
  SelectChangeEvent,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { LocationOn, Payment, SettingsCellSharp } from "@mui/icons-material";
import { Address } from "../../types/customer.types.ts";
import { OrderRequestDTO } from "../../types/order.types.ts";
import { OrderItemDTO } from "../../types/order.types.ts";
import { orderService } from "../../services/order.service.ts";
import { Product } from "../../types/product.types.ts";

interface PaymentMethod {
  id: number;
  type: "CREDIT" | "DEBIT" | "PIX" | "MONEY";
  label: string;
}

interface CheckoutCardProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
  checkoutControl: boolean;
  onCheckoutControl: (value: boolean) => void;
  addresses: Address[];
  onOrderComplete: () => void;
  onConfirmOrder: (addressId: number, paymentMethod: string) => void;
}

function generateRandomCode(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

const paymentMethods: PaymentMethod[] = [
  { id: 1, type: "CREDIT", label: "CARTÃO DE CRÉDITO" },
  { id: 2, type: "DEBIT", label: "CARTÃO DE DÉBITO" },
  { id: 3, type: "PIX", label: "PIX" },
  { id: 4, type: "MONEY", label: "BOLETO" },
];

const PaymentCard = ({ type }: { type: "credit" | "debit" }) => {
  const [installments, setInstallments] = useState<string>("1");
  const total = 1000; // Este valor deve vir das props ou context

  const handleInstallmentChange = (event: SelectChangeEvent<string>) => {
    setInstallments(event.target.value);
  };

  const calculateInstallmentValue = (installment: number) => {
    return (total / installment).toFixed(2);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cartão de {type === "credit" ? "Crédito" : "Débito"}
      </Typography>
      <TextField
        fullWidth
        label="Número do Cartão"
        margin="normal"
        placeholder="0000 0000 0000 0000"
      />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField label="Validade" placeholder="MM/AA" sx={{ width: "50%" }} />
        <TextField label="CVV" placeholder="123" sx={{ width: "50%" }} />
      </Box>
      <TextField
        fullWidth
        label="Nome no Cartão"
        margin="normal"
        placeholder="Como está impresso no cartão"
      />

      {type === "credit" && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <FormLabel>Parcelamento</FormLabel>
          <Select value={installments} onChange={handleInstallmentChange}>
            <MenuItem value="1">
              À vista - R$ {calculateInstallmentValue(1)}
            </MenuItem>
            {[...Array(9)].map((_, index) => {
              const installment = index + 2;
              return (
                <MenuItem key={installment} value={String(installment)}>
                  {installment}x de R$ {calculateInstallmentValue(installment)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

const PaymentPix = () => (
  <Box textAlign="center">
    <Typography variant="h6">QR Code PIX</Typography>
    <Box sx={{ my: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
      [QR Code Placeholder]
    </Box>
    <TextField
      fullWidth
      label="Código PIX"
      value="00020126580014br.gov.bcb.pix0136example-key"
      multiline
      rows={2}
      InputProps={{ readOnly: true }}
    />
  </Box>
);

const PaymentBoleto = () => (
  <Box textAlign="center">
    <Typography variant="h6">Boleto Bancário</Typography>
    <Box sx={{ my: 2 }}>
      <Button variant="contained" color="primary">
        Gerar Boleto
      </Button>
    </Box>
  </Box>
);

const PaymentCreditCard = () => (
  <Box sx={{ mt: 2 }}>
    <Typography variant="h6" gutterBottom>
      Cartão de Crédito
    </Typography>
    <TextField
      fullWidth
      label="Número do Cartão"
      margin="normal"
      placeholder="0000 0000 0000 0000"
    />
    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
      <TextField label="Validade" placeholder="MM/AA" sx={{ width: "50%" }} />
      <TextField label="CVV" placeholder="123" sx={{ width: "50%" }} />
    </Box>
    <TextField
      fullWidth
      label="Nome no Cartão"
      margin="normal"
      placeholder="Como está impresso no cartão"
    />
  </Box>
);

export const CheckoutCard: React.FC<CheckoutCardProps> = ({
  open,
  onClose,
  addresses,
  onOrderComplete,
  onConfirmOrder,
  onCheckout,
  checkoutControl,
  onCheckoutControl,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const navigate = useNavigate();
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  const handleConfirm = () => {
    if (selectedAddress && selectedPayment) {
      onConfirmOrder(selectedAddress, selectedPayment);
    }
  };

  const extractOrderItems = (cartItems: Product[]): OrderItemDTO[] => {
    return cartItems.map((item) => {
      if (!item.id) {
        throw new Error("Product ID is required");
      }

      return {
        productId: item.id, // Agora TypeScript sabe que item.id não é undefined
        quantity: item.salesQuantity || 1,
        price: item.price,
        discountValue: (item.price * (item.discountPercentage || 0)) / 100,
        totalPrice:
          item.price *
          (item.salesQuantity || 1) *
          (1 - (item.discountPercentage || 0) / 100),
      };
    });
  };

  const convertToOrderItems = (): OrderItemDTO[] => {
    const storedItems = JSON.parse(localStorage.getItem("itemsOrder") || "[]");

    const orderItems: OrderItemDTO[] = storedItems.map((item: any) => {
      return {
        productId: item.id,
        quantity: item.quantidade,
        price: item.preco,
        discountValue: item.desconto,
        totalPrice: item.total,
      };
    });

    return orderItems;
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const convertToOrderRequestDTO = (order: {
    customerId: number;
    orderItems: OrderItemDTO[];
    status: string;
    addressId: number;
    paymentMethod: any;
  }): OrderRequestDTO => {
    return {
      customerId: order.customerId,
      orderItems: order.orderItems,
      status: order.status,
      payment: {
        paymentMethod: selectedPayment,
        status: "APROVADO",
        transactionCode: generateRandomCode(10),
      },
      deliveryAddress: order.addressId,
      promotionIds: [],
    };
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    console.log("localStorage", localStorage);

    if (!selectedAddress || !selectedPayment) {
      showSnackbar("Selecione endereço e forma de pagamento!", "error");
      return;
    }

    try {
      const customer = localStorage.getItem("customer");
      if (!customer) {
        showSnackbar("Cliente não encontrado!", "error");
        return;
      }
      const customerObj = JSON.parse(customer);
      const order = {
        customerId: customerObj.id,
        orderItems: convertToOrderItems(),
        status: "AGUARDANDO PAGAMENTO",
        addressId: selectedAddress,
        paymentMethod: selectedPayment,
      };

      // Aguarda a criação do pedido
      const response = await orderService.createOrder(
        convertToOrderRequestDTO(order)
      );

      if (response) {
        console.log("Pedido criado com sucesso");
        localStorage.removeItem("cart");
        localStorage.removeItem("itemsOrder");
        console.log("localStorage após limpeza:", localStorage);

        onOrderComplete(); // Limpa o carrinho

        // Notifica sucesso e fecha
        onCheckoutControl(true);
        onClose();

        // Redireciona após delay
        setTimeout(() => {
          navigate("/");
        }, 2000); // Reduzido para 2 segundos
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      showSnackbar("Erro ao efetuar o pedido!", "error");
    }
  };

  const handleAddressChange = (event: SelectChangeEvent<string>) => {
    setSelectedAddress(Number(event.target.value));
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(event.target.value);
  };

  const renderPaymentMethod = () => {
    switch (selectedPayment) {
      case "pix":
        return <PaymentPix />;
      case "debit":
        return <PaymentCard type="debit" />;
      case "boleto":
        return <PaymentBoleto />;
      case "credit":
        return <PaymentCard type="credit" />;
      default:
        return null;
    }
  };

  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.number}${
      address.complement ? ` - ${address.complement}` : ""
    } 
    ${address.neighborhood} - ${address.city}/${address.state} - CEP: ${
      address.zipCode
    }`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Finalizar Pedido
          </Typography>

          {/* Seleção de Endereço */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <LocationOn sx={{ mr: 1 }} />
              Endereço de Entrega
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(Number(e.target.value))}
              >
                {addresses.map((address) => (
                  <FormControlLabel
                    key={address.id}
                    value={address.id}
                    control={<Radio />}
                    label={formatAddress(address)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Seleção de Pagamento */}
          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Forma de Pagamento</FormLabel>
              <RadioGroup
                value={selectedPayment}
                onChange={handlePaymentChange}
              >
                <FormControlLabel
                  value="credit"
                  control={<Radio />}
                  label="Cartão de Crédito"
                />
                <FormControlLabel
                  value="debit"
                  control={<Radio />}
                  label="Cartão de Débito"
                />
                <FormControlLabel value="pix" control={<Radio />} label="PIX" />
                <FormControlLabel
                  value="boleto"
                  control={<Radio />}
                  label="Boleto Bancário"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {selectedPayment && (
            <Box sx={{ mt: 2, mb: 2 }}>{renderPaymentMethod()}</Box>
          )}

          {/* Botões de ação */}
          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmOrder}
              disabled={!selectedAddress || !selectedPayment}
            >
              Confirmar Pedido
            </Button>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </Dialog>
  );
};
