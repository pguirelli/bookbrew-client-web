import React, { useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  paymentMethod: string;
  trackingCode?: string;
}

type OrderSort = "id" | "customerName" | "orderDate" | "total" | "status";

export const ProcessOrder = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customerName: "João Silva",
      orderDate: "2024-02-20",
      total: 299.9,
      status: "pending",
      items: 3,
      paymentMethod: "credit",
    },
    // Add more sample orders
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<OrderSort>("orderDate");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const handleSort = (property: OrderSort) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (
    status: Order["status"]
  ): "warning" | "info" | "primary" | "success" | "error" => {
    const colors = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error",
    } as const;
    return colors[status];
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

  const handleUpdateStatus = (orderId: number, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleShipOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleConfirmShipment = () => {
    if (selectedOrder && trackingCode) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: "shipped", trackingCode }
            : order
        )
      );
      setDialogOpen(false);
      setTrackingCode("");
      setSelectedOrder(null);
    }
  };

  // Add this function inside RegisterOrder component
  const filterOrders = () => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm);

      const matchesFilter = filterType === "all" || order.status === filterType;

      const matchesDate =
        !dateRange.start ||
        !dateRange.end ||
        (new Date(order.orderDate) >= new Date(dateRange.start) &&
          new Date(order.orderDate) <= new Date(dateRange.end));

      return matchesSearch && matchesFilter && matchesDate;
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gerenciar Pedidos
        </Typography>

        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Buscar por cliente ou número do pedido"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">Pendentes</MenuItem>
              <MenuItem value="processing">Em Processamento</MenuItem>
              <MenuItem value="shipped">Enviados</MenuItem>
              <MenuItem value="delivered">Entregues</MenuItem>
              <MenuItem value="cancelled">Cancelados</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="date"
            label="Data Inicial"
            size="small"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            label="Data Final"
            size="small"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
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
                    Pedido #
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
              {filterOrders()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" title="Visualizar">
                        <Visibility />
                      </IconButton>
                      {order.status === "pending" && (
                        <>
                          <IconButton
                            size="small"
                            title="Processar"
                            onClick={() =>
                              handleUpdateStatus(order.id, "processing")
                            }
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Cancelar"
                            onClick={() =>
                              handleUpdateStatus(order.id, "cancelled")
                            }
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}
                      {order.status === "processing" && (
                        <IconButton
                          size="small"
                          title="Enviar"
                          onClick={() => handleShipOrder(order)}
                        >
                          <LocalShipping />
                        </IconButton>
                      )}
                      {order.status === "shipped" && (
                        <IconButton
                          size="small"
                          title="Marcar como Entregue"
                          onClick={() =>
                            handleUpdateStatus(order.id, "delivered")
                          }
                        >
                          <Check />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filterOrders().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Registros por página"
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
          <Button onClick={handleConfirmShipment} variant="contained">
            Confirmar Envio
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
