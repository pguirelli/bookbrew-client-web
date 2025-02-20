import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Visibility,
  Edit,
  LocalShipping,
  Check,
  Cancel,
} from "@mui/icons-material";
import { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from "@mui/icons-material/Search";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { customerService } from "../../services/customer.service.ts";
import { orderService } from "../../services/order.service.ts";
import { Customer } from "../../types/customer.types.ts";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { OrderDTO } from "../../types/order.types.ts";
import { OrderDetailsDialog } from "../../pages/Components/OrderDetailsDialog.tsx";

type OrderSort = "id" | "customerName" | "orderDate" | "total" | "status";
type OrderStatus =
  | "AGUARDANDO PAGAMENTO"
  | "PREPARANDO"
  | "ENVIADO"
  | "ENTREGUE"
  | "CANCELADO"
  | "ALL";

export const ProcessOrder = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<OrderSort>("orderDate");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<Map<number, Customer>>(new Map());

  const [filteredOrders, setFilteredOrders] = useState<OrderDTO[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("ALL");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response);
      setFilteredOrders(response);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    filterOrders(searchValue, statusFilter, dateRange);
  };

  const handleStatusFilter = (event: SelectChangeEvent<string>) => {
    const status = event.target.value as OrderStatus;
    setStatusFilter(status);
    filterOrders(searchTerm, status, dateRange);
  };

  const filterOrders = (
    search: string,
    status: OrderStatus,
    dateRange: { start: string; end: string }
  ) => {
    let filtered = orders;

    // Aplicar filtro de pesquisa
    if (search) {
      filtered = filtered.filter(
        (order) =>
          order.id?.toString().includes(search) ||
          customers.get(order.customerId)?.name.toLowerCase().includes(search)
      );
    }

    // Aplicar filtro de status
    if (status !== "ALL") {
      filtered = filtered.filter((order) => order.status === status);
    }

    // Aplicar filtro de data
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    setFilteredOrders(filtered);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchUserCustomer = async (customerId: number) => {
    try {
      const customerData = await customerService.getCustomerById(customerId);
      setCustomers((prev) => new Map(prev).set(customerId, customerData));
    } catch (error) {
      console.error(`Erro ao carregar dados do cliente ${customerId}:`, error);
    }
  };

  const { isAuthenticated, user, logout } = useAuthContext();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getAllOrders();
        setOrders(response);

        response.forEach((response) => {
          if (response.customerId) {
            fetchUserCustomer(response.customerId);
          }
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Add error handling/notification here
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenDialog = (order: OrderDTO) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenOrderDetails = (order: OrderDTO) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleSort = (property: OrderSort) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    const status = getStatusFromLabel(order.status);

    const colors = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error",
    } as const;

    return colors[status] || "gray";
  };

  const getStatusLabel = (order: OrderDTO) => {
    const status = getStatusFromLabel(order.status);
    const labels = {
      pending: "AGUARDANDO PAGAMENTO",
      processing: "PREPARANDO",
      shipped: "ENVIADO",
      delivered: "ENTREGUE",
      cancelled: "CANCELADO",
    };

    return labels[status] || "DESCONHECIDO";
  };

  const handleShipOrder = (order: OrderDTO) => {
    setSelectedOrder(order);
    setShippingDialogOpen(true);
  };

  const handleDateChange = (field: "start" | "end", value: string) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    filterOrders(searchTerm, statusFilter, newDateRange);
  };

  const handleConfirmShipment = async (orderId: number, newStatus: string) => {
    try {
      if (selectedOrder) {
        setOrders(
          orders.map((order) =>
            order.id === selectedOrder.id
              ? { ...order, status: "cancelled" }
              : order
          )
        );

        await orderService.updateOrder(selectedOrder?.id ?? 0, {
          customerId: selectedOrder.customerId,
          orderItems: selectedOrder.orderItems,
          status: "ENVIADO",
          payment: selectedOrder.payment,
          deliveryAddress: selectedOrder.addressId,
          promotionIds: [],
        });
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }

      setShippingDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  };

  /*
  // Add this function inside RegisterOrder component
  const filterOrders = () => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        //order.customerId. .customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.id?.toString().includes(searchTerm);

      const matchesFilter = filterType === "all" || order.status === filterType;

      const matchesDate =
        !dateRange.start ||
        !dateRange.end ||
        (new Date(order.orderDate) >= new Date(dateRange.start) &&
          new Date(order.orderDate) <= new Date(dateRange.end));

      return matchesSearch && matchesFilter && matchesDate;
    });
  };
*/

  const handleUpdateStatus = (order: OrderDTO, newStatus: string) => {
    const statusMessages: { [key: string]: string } = {
      PREPARANDO: "preparar",
      ENVIADO: "enviar",
      ENTREGUE: "marcar como entregue",
      CANCELADO: "cancelar",
    };

    setSelectedOrder(order);
    setConfirmDialog({
      open: true,
      title: "Confirmar alteração de status",
      message: `Deseja ${statusMessages[newStatus]} este pedido?`,
      onConfirm: async () => {
        try {
          console.log("order", order);
          console.log("newStatus", newStatus);
          console.log("customerId", order.customerId);
          console.log("orderItems", order.orderItems);
          console.log("payment", order.payment);
          console.log("deliveryAddress", order.addressId);

          await orderService.updateOrder(order?.id ?? 0, {
            customerId: order.customerId,
            orderItems: order.orderItems,
            status: newStatus,
            payment: order.payment,
            deliveryAddress: order.addressId,
            promotionIds: [],
          });
          // Atualiza a lista de pedidos
          setOrders(
            orders.map((o) =>
              o.id === order.id ? { ...o, status: newStatus } : o
            )
          );
          // Fecha o diálogo
          setConfirmDialog((prev) => ({ ...prev, open: false }));
          setShippingDialogOpen(false);
        } catch (error) {
          console.error("Erro ao atualizar status:", error);
          // Adicione aqui tratamento de erro (ex: notificação)
        }
      },
    });
  };

  const handleViewOrder = (order: OrderDTO) => {
    console.log("Ordem selecionada:", order); // Debug

    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const OrderActionCell: React.FC<{
    order: OrderDTO;
    onUpdateStatus: (order: OrderDTO, newStatus: string) => void;
    onViewOrder: (order: OrderDTO) => void;
    onShipOrder: (order: OrderDTO) => void;
    setConfirmDialog: (dialog: any) => void;
  }> = ({
    order,
    onUpdateStatus,
    onViewOrder,
    onShipOrder,
    setConfirmDialog,
  }) => {
    const handleStatusChange = (newStatus: string) => {
      const statusMessages = {
        PREPARANDO: "Iniciar preparação do pedido",
        ENVIADO: "Marcar pedido como enviado",
        ENTREGUE: "Confirmar entrega do pedido",
        CANCELADO: "Cancelar o pedido",
      };

      setConfirmDialog({
        open: true,
        title: `Confirmar Alteração de Status`,
        message: `Deseja ${
          statusMessages[newStatus as keyof typeof statusMessages]
        }?`,
        action: () => {
          onUpdateStatus(order!, newStatus);
        },
      });
    };

    return (
      <TableCell>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Botão de Visualização - sempre visível */}
          <IconButton
            onClick={() => handleViewOrder(order)}
            color="primary"
            size="small"
            title="Visualizar Pedido"
          >
            <Visibility />
          </IconButton>

          {/* Botões baseados no status */}
          {order.status === "AGUARDANDO PAGAMENTO" && (
            <>
              <IconButton
                onClick={() => onUpdateStatus(order!, "PREPARANDO")}
                color="primary"
                size="small"
                title="Preparar Pedido"
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => onUpdateStatus(order!, "CANCELADO")}
                color="error"
                size="small"
                title="Cancelar Pedido"
              >
                <Cancel />
              </IconButton>
            </>
          )}

          {order.status === "PREPARANDO" && (
            <>
              <IconButton
                onClick={() => onShipOrder(order)}
                color="primary"
                size="small"
                title="Enviar Pedido"
              >
                <LocalShipping />
              </IconButton>
              <IconButton
                onClick={() => onUpdateStatus(order!, "CANCELADO")}
                color="error"
                size="small"
                title="Cancelar Pedido"
              >
                <Cancel />
              </IconButton>
            </>
          )}

          {order.status === "ENVIADO" && (
            <IconButton
              onClick={() => onUpdateStatus(order!, "ENTREGUE")}
              color="success"
              size="small"
              title="Marcar como Entregue"
            >
              <Check />
            </IconButton>
          )}
          <ConfirmationDialog
            open={confirmDialog.open}
            title={confirmDialog.title}
            message={confirmDialog.message}
            onConfirm={confirmDialog.onConfirm}
            onClose={() =>
              setConfirmDialog((prev) => ({ ...prev, open: false }))
            }
          />
        </Box>
      </TableCell>
    );
  };

  const ConfirmationDialog: React.FC<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
  }> = ({ open, title, message, onConfirm, onClose }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={onConfirm} color="primary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  interface ShippingDialogProps {
    open: boolean;
    selectedOrder: OrderDTO | null;
    onClose: () => void;
    onUpdateStatus: (
      order: OrderDTO,
      status: string,
      trackingCode: string
    ) => void;
  }

  // Componente ShippingDialog atualizado
  const ShippingDialog: React.FC<ShippingDialogProps> = ({
    open,
    selectedOrder,
    onClose,
    onUpdateStatus,
  }) => {
    const [trackingCode, setTrackingCode] = useState("");

    // Limpa o código de rastreio quando o diálogo é fechado
    useEffect(() => {
      if (!open) {
        setTrackingCode("");
      }
    }, [open]);

    const handleConfirm = () => {
      if (selectedOrder && trackingCode.trim()) {
        onUpdateStatus(selectedOrder, "ENVIADO", trackingCode);
        setShippingDialogOpen(false);
        setTrackingCode("");
      }
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Enviar Pedido</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Código de Rastreio"
            fullWidth
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!trackingCode.trim() || !selectedOrder}
          >
            Confirmar Envio
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MenuItemsSummCustomer
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f0f4f8",
        }}
      >
        <Box sx={{ p: 8 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Gerenciar Pedidos
            </Typography>

            <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                placeholder="Buscar por cliente ou número do pedido"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  label="Status"
                >
                  <MenuItem value="ALL">TODOS</MenuItem>
                  <MenuItem value="AGUARDANDO PAGAMENTO">AGUARDANDO PAGAMENTO</MenuItem>
                  <MenuItem value="PREPARANDO">PREPARANDO</MenuItem>
                  <MenuItem value="ENVIADO">ENVIADO</MenuItem>
                  <MenuItem value="ENTREGUE">ENTREGUE</MenuItem>
                  <MenuItem value="CANCELADO">CANCELADO</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="date"
                label="Data Inicial"
                size="small"
                value={dateRange.start}
                onChange={(e) => handleDateChange("start", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                type="date"
                label="Data Final"
                size="small"
                value={dateRange.end}
                onChange={(e) => handleDateChange("end", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "id"}
                        direction={orderBy === "id" ? order : "asc"}
                        onClick={() => handleSort("id")}
                      >
                        Pedido
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "customerName"}
                        direction={orderBy === "customerName" ? order : "asc"}
                        onClick={() => handleSort("customerName")}
                      >
                        Cliente
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "orderDate"}
                        direction={orderBy === "orderDate" ? order : "asc"}
                        onClick={() => handleSort("orderDate")}
                      >
                        Data
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Itens</TableCell>
                    <TableCell>Pagamento</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "total"}
                        direction={orderBy === "total" ? order : "asc"}
                        onClick={() => handleSort("total")}
                      >
                        Total
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "status"}
                        direction={orderBy === "status" ? order : "asc"}
                        onClick={() => handleSort("status")}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>
                          {" "}
                          {customers.get(order.customerId)?.name}{" "}
                          {customers.get(order.customerId)?.lastName}
                        </TableCell>
                        <TableCell>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{order.itemCount}</TableCell>
                        <TableCell>{order.payment.paymentMethod}</TableCell>
                        <TableCell>R$ {order.subTotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(order)}
                            color={getStatusColor(order)}
                            size="small"
                          />
                        </TableCell>
                        <OrderActionCell
                          order={order}
                          onUpdateStatus={handleUpdateStatus}
                          onViewOrder={(order) => {
                            setSelectedOrder(order);
                            setViewDialogOpen(true);
                          }}
                          onShipOrder={handleShipOrder}
                          setConfirmDialog={setConfirmDialog}
                        />
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Dialogs */}
            <ConfirmationDialog
              open={confirmDialog.open}
              title={confirmDialog.title}
              message={confirmDialog.message}
              onConfirm={() => {
                confirmDialog.onConfirm();
                setConfirmDialog({ ...confirmDialog, open: false });
              }}
              onClose={() =>
                setConfirmDialog({ ...confirmDialog, open: false })
              }
            />

            {selectedOrder && (
              <OrderDetailsDialog
                open={viewDialogOpen}
                onClose={handleCloseOrderDetails}
                orderData={selectedOrder}
                customerData={customers.get(selectedOrder.customerId) ?? null}
              />
            )}

            <ShippingDialog
              open={shippingDialogOpen}
              selectedOrder={selectedOrder}
              onClose={() => {
                setShippingDialogOpen(false);
                setSelectedOrder(null);
              }}
              onUpdateStatus={handleUpdateStatus}
            />

            <TablePagination
              component="div"
              count={filteredOrders.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens por página"
            />
          </Paper>

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Enviar Pedido</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Código de Rastreio"
                fullWidth
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button
                onClick={() => {
                  if (selectedOrder?.id) {
                    handleConfirmShipment(selectedOrder.id, "ENVIADO");
                  }
                }}
                variant="contained"
                disabled={!trackingCode}
              >
                Confirmar Envio
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
