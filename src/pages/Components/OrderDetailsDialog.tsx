import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Package, User } from "lucide-react";
import { productService } from "../../services/product.service.ts";
import { Customer } from "../../types/customer.types";
import { OrderDTO } from "../../types/order.types";
import { Product } from "../../types/product.types";

interface OrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  orderData: OrderDTO;
  customerData: Customer | null;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onClose,
  orderData,
  customerData,
}) => {
  const getStatusColor = (status: string) => {
    const statusOrder = getStatusFromLabel(status);

    const statusColors = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error",
    };

    return statusColors[statusOrder as keyof typeof statusColors] || "default";
  };

  const getStatusFromLabel = (label: string): OrderDTO["status"] => {
    const labelsToStatusMap: { [key: string]: OrderDTO["status"] } = {
      "AGUARDANDO PAGAMENTO": "pending",
      PREPARANDO: "processing",
      ENVIADO: "shipped",
      ENTREGUE: "delivered",
      CANCELADO: "cancelled",
    };

    return labelsToStatusMap[label] || label;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (orderData) {
      const fetchProductData = async () => {
        setLoading(true);
        try {
          const productIds = orderData.orderItems.map((item) => item.productId);

          const productsList: Product[] = [];

          for (const productId of productIds) {
            try {
              const productData = await productService.getProductById(
                productId
              );
              if (productData?.id !== undefined) {
                productsList.push(productData);
              }
            } catch (error) {
              console.error(
                `Erro ao carregar dados do produto ${productId}:`,
                error
              );
            }
          }

          setProducts(productsList);
        } catch (error) {
          console.error("Erro ao carregar dados do produto", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProductData();
    }
  }, [orderData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!products.length) {
    return <div>Produtos não encontrados!</div>;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Pedido #{orderData.id}</Typography>
          <Chip
            label={orderData.status}
            color={
              getStatusColor(orderData.status ?? "") as
                | "warning"
                | "info"
                | "primary"
                | "success"
                | "error"
                | "default"
                | "secondary"
            }
            size="medium"
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <User size={20} />
                <Typography variant="h6">Informações do Cliente</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Nome
                  </Typography>
                  <Typography>
                    {customerData?.name} {customerData?.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    CPF
                  </Typography>
                  <Typography>{customerData?.cpf}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography>{customerData?.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Telefone
                  </Typography>
                  <Typography>{customerData?.phone}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Package size={20} />
                <Typography variant="h6">Detalhes do Pedido</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Data do Pedido
                  </Typography>
                  <Typography>
                    {new Date(orderData.orderDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Valor Total
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(orderData.subTotal)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Package size={20} />
                <Typography variant="h6">Itens do Pedido</Typography>
              </Box>

              {orderData.orderItems.map((item, index) => {
                const product = products.find(
                  (product) => product.id === (item.productId ?? 0)
                );
                return (
                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom:
                        index !== orderData.orderItems.length - 1 ? 1 : 0,
                      borderColor: "divider",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography>
                          {product ? product.title : "Produto não encontrado"}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2" color="text.secondary">
                          Qtd: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>{formatCurrency(item.price)}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>
                          {formatCurrency(item.discountValue)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={onClose} variant="outlined">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
