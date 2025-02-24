import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { CheckCircle, Home, Package, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { customerService } from "../../services/customer.service.ts";
import { orderService } from "../../services/order.service.ts";
import { Address, Customer } from "../../types/customer.types.ts";
import {
  OrderDTO,
  OrderItemDTO,
  OrderRequestDTO,
} from "../../types/order.types.ts";

export const CustomerOrders = () => {
  const [address, setAddress] = useState<Address>();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [customer, setCustomer] = useState<Customer>();
  const { isAuthenticated, user, logout } = useAuthContext();
  const [expandedTracking, setExpandedTracking] = useState<number | null>(null);

  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        if (user?.id) {
          const customerData = await customerService.getCustomerByUserId(
            user.id
          );
          setCustomer(customerData);
        }
      } catch (error) {
        console.error("Erro ao carregar customer:", error);
      }
    };
    loadCustomer();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (customer?.id) {
          const customerOrders = await orderService.getOrdersByCustomer(
            customer.id
          );
          setOrders(customerOrders);
        }
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };

    if (customer) {
      fetchOrders();
    }
  }, [customer]);

  useEffect(() => {
    const loadAddress = async () => {
      if (customer?.id && selectedOrder?.addressId) {
        const addressData = await customerService.getCustomerAddressById(
          customer.id,
          selectedOrder.addressId
        );
        setAddress(addressData);
      }
    };

    if (customer && selectedOrder) {
      loadAddress();
    }
  }, [customer, selectedOrder]);

  const handleTrackOrder = (order: OrderDTO) => {
    if (order.id) {
      setExpandedTracking(expandedTracking === order.id ? null : order.id);
    }
  };

  const PaymentDetails = ({ order }: { order: OrderDTO }) => {
    switch (order.payment.paymentMethod) {
      case "CRÉDITO":
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Detalhes do Cartão
            </Typography>
            <Typography>Número: 56** **** **** **34</Typography>
            <Typography>Titular: {customer?.name?.toUpperCase()}</Typography>
            <Typography>Parcelas: 6x</Typography>
          </Box>
        );
      case "DÉBITO":
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Detalhes do Cartão
            </Typography>
            <Typography>Número: 54** **** **** **99</Typography>
            <Typography>
              Titular:{" "}
              {(customer?.name + " " + customer?.lastName).toUpperCase()}
            </Typography>
            <Typography>À VISTA</Typography>
          </Box>
        );
      case "PIX":
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              PIX
            </Typography>
            <TextField
              fullWidth
              label="Código PIX"
              value="00020126410014BR.GOV.BCB.PIX01140014123e4567-e12b-12d1-a456-42665544000052040000530398654041.505802BR5913BookBrew6009SAO PAULO62070503***6304A4F8"
              InputProps={{ readOnly: true }}
              size="small"
              multiline
            />
          </Box>
        );
      case "BOLETO":
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Boleto
            </Typography>
            <TextField
              fullWidth
              label="Código PIX"
              value="00020126410014BR.GOV.BCB.PIX01140014123e4567-e12b-12d1-a456-42665544000052040000530398654041.505802BR5913BookBrew6009SAO PAULO62070503***6304A4F8"
              InputProps={{ readOnly: true }}
              size="small"
              multiline
            />
            <Typography>
              Chave de acesso: 3125 0240 6339 9000 0110 5500 1000 0097 8416 1228
              5425
            </Typography>
            <Typography>Beneficiário: BOOK BREW LTDA</Typography>
            <Typography>
              Pagador:{" "}
              {(customer?.name + " " + customer?.lastName).toUpperCase()}
            </Typography>
            <Typography>Valor do documento: {order.amount}</Typography>
            <Button variant="outlined" size="small">
              Visualizar Boleto
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  const handleExpandOrder = async (order: OrderDTO) => {
    try {
      if (customer?.id && order.id) {
        const addressData = await customerService.getCustomerAddressById(
          customer.id,
          order.addressId
        );
        setAddress(addressData);

        setSelectedOrder(order);
        setExpandedOrder(expandedOrder === order.id ? null : order.id);
      }
    } catch (error) {
      console.error("Erro ao carregar endereço:", error);
    }
  };

  const handleCancelOrder = (order: OrderDTO) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
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
      orderService.updateOrder(selectedOrder?.id ?? 0, {
        customerId: selectedOrder.customerId,
        orderItems: selectedOrder.orderItems,
        status: "CANCELADO",
        payment: selectedOrder.payment,
        deliveryAddress: selectedOrder.addressId,
        promotionIds: [],
      });
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (selectedOrder) {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          const updatedItems = [...order.orderItems];
          updatedItems[index].quantity = newQuantity;
          updatedItems[index].totalPrice =
            newQuantity * updatedItems[index].price;
          return { ...order, items: updatedItems };
        }
        return order;
      });
      setOrders(updatedOrders);
    }
  };

  const calculateTotalItems = () => {
    return (
      selectedOrder?.orderItems.reduce((sum, item) => sum + item.quantity, 0) ||
      0
    );
  };

  const calculateSubtotal = () => {
    return (
      selectedOrder?.orderItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      ) || 0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() - (selectedOrder?.discountAmount || 0);
  };

  const handleRemoveItem = (index: number) => {
    if (selectedOrder) {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          const updatedItems = order.orderItems.filter((_, i) => i !== index);
          return { ...order, items: updatedItems };
        }
        return order;
      });
      setOrders(updatedOrders);
    }
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

  const getStatusColor = (order: OrderDTO) => {
    const status = getStatusFromLabel(order.status ?? "");

    const colors = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error",
    } as const;

    return colors[status as keyof typeof colors] || "gray";
  };

  const getStatusLabel = (order: OrderDTO) => {
    const status = getStatusFromLabel(order.status ?? "");
    const labels = {
      pending: "AGUARDANDO PAGAMENTO",
      processing: "PREPARANDO",
      shipped: "ENVIADO",
      delivered: "ENTREGUE",
      cancelled: "CANCELADO",
    };

    return labels[status as keyof typeof labels] || "DESCONHECIDO";
  };

  const trackingData = [
    {
      status: "Pedido Recebido",
      date: "2024-01-20 14:30",
      description: "Pedido confirmado e processado",
      icon: <Package className="w-5 h-5 text-white" />,
      completed: true,
    },
    {
      status: "Em Separação",
      date: "2024-01-21 09:15",
      description: "Produtos sendo separados no estoque",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      completed: true,
    },
    {
      status: "Em Transporte",
      date: "2024-01-21 16:45",
      description: "Pedido saiu para entrega",
      icon: <Truck className="w-5 h-5 text-white" />,
      completed: true,
    },
    {
      status: "Entrega Prevista",
      date: "2024-01-22 13:00",
      description: "Previsão de entrega ao destinatário",
      icon: <Home className="w-5 h-5 text-white" />,
      completed: false,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          marginBottom: "2rem",
          bgcolor: "background.default",
        }}
      >
        <MenuItemsSummCustomer
          user={user}
          isAuthenticated={isAuthenticated}
          logout={logout}
        />
      </Box>
      return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: "80px",
          gap: 3,
        }}
      >
        <Box sx={{ mt: 2 }}>
          <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom align="center">
                Meus Pedidos
              </Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
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
                          <Typography variant="h6">
                            Pedido #{order.id}
                          </Typography>
                          <Chip
                            label={getStatusLabel(order)}
                            color={getStatusColor(order)}
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
                            <Typography color="textSecondary">
                              Valor Total
                            </Typography>
                            <Typography>
                              R$ {order.subTotal.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography color="textSecondary">
                              Forma de Pagamento
                            </Typography>
                            <Typography>
                              {order.payment.paymentMethod}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleExpandOrder(order)}
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
                          {(order.status === "AGUARDANDO PAGAMENTO" ||
                            order.status === "PREPARANDO") && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleCancelOrder(order)}
                            >
                              Cancelar Pedido
                            </Button>
                          )}
                          {order.status !== "AGUARDANDO PAGAMENTO" &&
                            order.status !== "PREPARANDO" &&
                            order.status !== "CANCELADO" && (
                              <Button
                                startIcon={<ShippingIcon />}
                                variant="outlined"
                                size="small"
                                onClick={() => handleTrackOrder(order)}
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
                                  : "Rastrear Pedido"}
                              </Button>
                            )}
                        </Box>

                        {expandedTracking === order.id && (
                          <Grid container spacing={3} gap={10}>
                            <Grid item xs={12}>
                              <Box sx={{ mt: 3 }} />
                              <div>
                                <Paper
                                  className="p-6"
                                  sx={{ width: "100%", padding: 3 }}
                                >
                                  <Typography
                                    variant="h6"
                                    className="mb-4 font-bold"
                                  >
                                    Informações de Rastreio
                                  </Typography>

                                  <div className="space-y-6">
                                    {trackingData.map((step, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start space-x-4"
                                      >
                                        <Typography
                                          padding={1}
                                          variant="subtitle1"
                                          className={
                                            step.completed
                                              ? "text-blue-500"
                                              : "text-gray-500"
                                          }
                                        >
                                          {step.icon} {step.status}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                          paddingLeft={1}
                                        >
                                          {step.date}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                          padding={1}
                                        >
                                          {step.description}
                                        </Typography>
                                      </div>
                                    ))}
                                  </div>
                                </Paper>
                              </div>
                            </Grid>
                          </Grid>
                        )}

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
                                      {order.orderItems.map((item, index) => (
                                        <ListItem key={index}>
                                          <ListItemText
                                            primary={item.productId}
                                            secondary={`R$ ${item.price.toFixed(
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
                                            R$ {item.totalPrice.toFixed(2)}
                                          </Typography>
                                          <ListItemSecondaryAction>
                                            <IconButton
                                              onClick={() =>
                                                handleRemoveItem(index)
                                              }
                                            ></IconButton>
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
                                          {(
                                            selectedOrder?.discountAmount || 0
                                          ).toFixed(2)}
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
                                <Typography>{address?.type}</Typography>
                                <Typography>
                                  {`${address?.street}, ${address?.number}`}
                                </Typography>
                                <Typography>{address?.complement}</Typography>
                                <Typography>
                                  {`${address?.neighborhood}, ${address?.city}/${address?.state}, ${address?.country}`}
                                </Typography>
                                <Typography>{address?.zipCode}</Typography>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Pagamento
                                </Typography>
                                <PaymentDetails order={order} />
                                <Typography>
                                  Status do pagamento: {order.payment.status}
                                </Typography>
                                <Typography>
                                  Data do pagamento: {order.payment.paymentDate}
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Rastreamento
                                </Typography>
                                <Typography>
                                  Código de Rastreio: "PYB54824D5"
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Container>
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
      </Box>
      <Footer />
    </Box>
  );
};
