import {
  Edit as EditIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  LocalShipping as ShippingIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  ListItemSecondaryAction,
} from "@mui/material";
import React, { useState } from "react";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: number;
  orderDate: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  paymentMethod: string;
  paymentDetails: {
    cardNumber?: string;
    cardHolder?: string;
    installments?: number;
    pixCode?: string;
    boletoCode?: string;
  };
  shippingAddress: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  trackingCode?: string;
  total: number;
  discount: number;
  notes: string;
}

export const CustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderDate: "2024-02-20",
      status: "processing",
      items: [
        {
          productId: 1,
          productName: "Livro 1",
          quantity: 2,
          unitPrice: 29.9,
          subtotal: 59.8,
        },
      ],
      paymentMethod: "credit",
      paymentDetails: {
        cardNumber: "1111 1111 1111 1111",
        cardHolder: "1111",
        installments: 1,
        pixCode: "pix code",
        boletoCode: "boleto code",
      },
      shippingAddress: {
        street: "Rua Exemplo",
        number: "121",
        complement: "Casa",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "38400-000",
      },
      trackingCode: "tracking",
      total: 59.8,
      discount: 0,
      notes: "notes",
    },
    // Add more sample orders
  ]);

  // Add this component for payment details display
  const PaymentDetails = ({ order }: { order: Order }) => {
    switch (order.paymentMethod) {
      case "credit":
      case "debit":
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Detalhes do Cartão
            </Typography>
            <Typography>
              Número: **** **** ****{" "}
              {order.paymentDetails.cardNumber?.slice(-4)}
            </Typography>
            <Typography>Titular: {order.paymentDetails.cardHolder}</Typography>
            {order.paymentMethod === "credit" && (
              <Typography>
                Parcelas: {order.paymentDetails.installments}x
              </Typography>
            )}
          </Box>
        );
      case "pix":
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              PIX
            </Typography>
            <TextField
              fullWidth
              label="Código PIX"
              value={order.paymentDetails.pixCode}
              InputProps={{ readOnly: true }}
              size="small"
              multiline
            />
          </Box>
        );
      case "boleto":
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Boleto
            </Typography>
            <Button variant="outlined" size="small">
              Visualizar Boleto
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  const handleExpandOrder = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const handleEditItem = (item: OrderItem) => {
    // Add your edit logic here
    console.log("Editing item:", item);
  };

  const confirmCancelOrder = () => {
    if (selectedOrder) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: "cancelled" }
            : order
        )
      );
      setCancelDialogOpen(false);
      setSelectedOrder(null);
      setCancellationReason("");
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error",
    } as const;
    return colors[status];
  };

  // Add these functions inside CustomerOrders component:
  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (selectedOrder) {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          const updatedItems = [...order.items];
          updatedItems[index].quantity = newQuantity;
          updatedItems[index].subtotal =
            newQuantity * updatedItems[index].unitPrice;
          return { ...order, items: updatedItems };
        }
        return order;
      });
      setOrders(updatedOrders);
    }
  };

  const calculateTotalItems = () => {
    return (
      selectedOrder?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
    );
  };

  const calculateSubtotal = () => {
    return (
      selectedOrder?.items.reduce((sum, item) => sum + item.subtotal, 0) || 0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() - (selectedOrder?.discount || 0);
  };

  const handleRemoveItem = (index: number) => {
    if (selectedOrder) {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          const updatedItems = order.items.filter((_, i) => i !== index);
          return { ...order, items: updatedItems };
        }
        return order;
      });
      setOrders(updatedOrders);
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    const labels = {
      pending: "Pendente",
      processing: "Em Processamento",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return labels[status];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Meus Pedidos
        </Typography>

        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Pedido #{order.id}</Typography>
                    <Chip
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status)}
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography color="textSecondary">
                        Data do Pedido
                      </Typography>
                      <Typography>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography color="textSecondary">Valor Total</Typography>
                      <Typography>R$ {order.total.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography color="textSecondary">
                        Forma de Pagamento
                      </Typography>
                      <Typography>
                        {order.paymentMethod === "credit"
                          ? "Cartão de Crédito"
                          : order.paymentMethod === "debit"
                          ? "Cartão de Débito"
                          : order.paymentMethod === "pix"
                          ? "PIX"
                          : "Boleto"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleExpandOrder(order.id)}
                      endIcon={
                        expandedOrder === order.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      }
                    >
                      {expandedOrder === order.id
                        ? "Ocultar Detalhes"
                        : "Ver Detalhes"}
                    </Button>
                    {order.status === "processing" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancelOrder(order)}
                      >
                        Cancelar Pedido
                      </Button>
                    )}
                    {order.trackingCode && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ShippingIcon />}
                      >
                        Rastrear Pedido
                      </Button>
                    )}
                  </Box>

                  <Collapse in={expandedOrder === order.id}>
                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6">
                                Itens do Pedido
                              </Typography>
                              <List>
                                {order.items.map((item, index) => (
                                  <ListItem key={index}>
                                    <ListItemText
                                      primary={item.productName}
                                      secondary={`R$ ${item.unitPrice.toFixed(
                                        2
                                      )}`}
                                    />
                                    <TextField
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          index,
                                          parseInt(e.target.value)
                                        )
                                      }
                                      inputProps={{ min: 1 }}
                                      sx={{ width: 80, mx: 2 }}
                                    />
                                    <Typography sx={{ minWidth: 100 }}>
                                      R$ {item.subtotal.toFixed(2)}
                                    </Typography>
                                    <ListItemSecondaryAction>
                                      <IconButton
                                        onClick={() => handleRemoveItem(index)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6">
                                Resumo do Pedido
                              </Typography>
                              <List>
                                <ListItem>
                                  <ListItemText primary="Quantidade de Itens" />
                                  <Typography>
                                    {calculateTotalItems()} itens
                                  </Typography>
                                </ListItem>
                                <ListItem>
                                  <ListItemText primary="Subtotal" />
                                  <Typography>
                                    R$ {calculateSubtotal().toFixed(2)}
                                  </Typography>
                                </ListItem>
                                <ListItem>
                                  <ListItemText primary="Desconto" />
                                  <Typography>
                                    R${" "}
                                    {(selectedOrder?.discount || 0).toFixed(2)}
                                  </Typography>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                  <ListItemText primary="Total" />
                                  <Typography variant="h6">
                                    R$ {calculateTotal().toFixed(2)}
                                  </Typography>
                                </ListItem>
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            Endereço de Entrega
                          </Typography>
                          <Typography>
                            {`${order.shippingAddress.street}, ${order.shippingAddress.number}`}
                          </Typography>
                          {order.shippingAddress.complement && (
                            <Typography>
                              {order.shippingAddress.complement}
                            </Typography>
                          )}
                          <Typography>
                            {`${order.shippingAddress.neighborhood}, ${order.shippingAddress.city}/${order.shippingAddress.state}`}
                          </Typography>
                          <Typography>
                            {order.shippingAddress.zipCode}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            Pagamento
                          </Typography>
                          <PaymentDetails order={order} />
                        </Grid>

                        {order.trackingCode && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                              Rastreamento
                            </Typography>
                            <Typography>
                              Código de Rastreio: {order.trackingCode}
                            </Typography>
                          </Grid>
                        )}

                        {order.notes && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                              Observações
                            </Typography>
                            <Typography>{order.notes}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancelar Pedido</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Tem certeza que deseja cancelar este pedido?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Motivo do Cancelamento"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Voltar</Button>
          <Button
            onClick={confirmCancelOrder}
            color="error"
            variant="contained"
          >
            Confirmar Cancelamento
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
