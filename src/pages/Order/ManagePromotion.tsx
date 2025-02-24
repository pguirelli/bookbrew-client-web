import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Checkbox,
  FormControlLabel,
  TableSortLabel,
  FormControl,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import * as yup from "yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { PromotionDTO } from "../../types/order.types.ts";
import { Product } from "../../types/product.types.ts";
import { productService } from "../../services/product.service.ts";
import { orderService } from "../../services/order.service.ts";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { ConfirmationDialog } from "../../pages/Components/ConfirmationDialog.tsx";

type Order = "asc" | "desc";

const validationSchema = yup.object({
  description: yup.string().required("Descrição é obrigatória"),
  productId: yup
    .number()
    .min(1, "Selecione um produto")
    .required("Produto é obrigatório"),
  discountPercentage: yup
    .number()
    .required("Percentual de desconto é obrigatório")
    .min(0)
    .max(100),
  startDate: yup.date().required("Data inicial é obrigatória"),
  endDate: yup.date().required("Data final é obrigatória"),
  status: yup.boolean(),
});

export const ManagePromotion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState<PromotionDTO[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof PromotionDTO>("description");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isAuthenticated, user, logout } = useAuthContext();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(
    null
  );
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchPromotions = async () => {
    try {
      const fetchedPromotions = await orderService.getAllPromotions();
      setPromotions(fetchedPromotions);
    } catch (error) {
      console.error("Erro ao carregar promoções:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await productService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCreateOrUpdatePromotion = async (values: PromotionDTO) => {
    try {
      if (editingId) {
        await orderService.updatePromotion(editingId, values);
        showSnackbar("Promoção atualizada com sucesso!", "success");
      } else {
        await orderService.createPromotion(values);
        showSnackbar("Promoção cadastrada com sucesso!", "success");
      }
      fetchPromotions();
      formik.resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Operation error:", error);
      showSnackbar("Erro no cadastro de promoção!", "error");
    }
  };

  const handleDelete = async () => {
    if (selectedPromotionId !== null) {
      try {
        await orderService.deletePromotion(selectedPromotionId);
        fetchPromotions();
        closeConfirmDialog();
      } catch (error) {
        console.error("Failed to delete promotion:", error);
      }
    }
  };

  const openConfirmDialog = (promotionId: number) => {
    setSelectedPromotionId(promotionId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedPromotionId(null);
    setConfirmDialogOpen(false);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof PromotionDTO) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy} ${hours}:${minutes}:${seconds}`;
  };

  const filteredAndSortedPromotions = React.useMemo(() => {
    return [...promotions]
      .filter((promotion) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          promotion.description.toLowerCase().includes(searchLower) ||
          promotion.productId ||
          promotion.discountPercentage ||
          promotion.startDate.toLowerCase().includes(searchLower) ||
          promotion.endDate.toLowerCase().includes(searchLower) ||
          (promotion.status ? "ativo" : "inativo").includes(searchLower)
        );
      })
      .sort((a, b) => {
        if (order === "asc") {
          if (a[orderBy] === undefined || b[orderBy] === undefined) {
            return 0;
          }
          return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
          if (a[orderBy] === undefined || b[orderBy] === undefined) {
            return 0;
          }
          return b[orderBy] < a[orderBy] ? -1 : 1;
        }
      });
  }, [promotions, order, orderBy, searchTerm]);

  const formik = useFormik<{
    description: string;
    productId: number;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
    status: boolean;
  }>({
    initialValues: {
      description: "",
      productId: 0,
      discountPercentage: 0,
      startDate: new Date(),
      endDate: new Date(),
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const promotionToSave: PromotionDTO = {
          ...values,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
        };
        await handleCreateOrUpdatePromotion(promotionToSave);
      } catch (error) {
        console.error("Operation error:", error);
      }
    },
  });

  const handleEdit = (promotion: PromotionDTO) => {
    setEditingId(promotion.id ?? null);
    formik.setValues({
      description: promotion.description,
      productId: promotion.productId,
      discountPercentage: promotion.discountPercentage,
      startDate: new Date(promotion.startDate),
      endDate: new Date(promotion.endDate),
      status: promotion.status,
    });
  };

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
        <Box sx={{ mt: 1 }} />

        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 3, textAlign: "center" }}
          >
            {editingId ? "Editar Promoção" : "Cadastro de Promoção"}
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Descrição"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.title}
                    value={
                      products.find((p) => p.id === formik.values.productId) ||
                      null
                    }
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "productId",
                        newValue ? newValue.id : 0
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Produto"
                        error={
                          formik.touched.productId &&
                          Boolean(formik.errors.productId)
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  id="discountPercentage"
                  name="discountPercentage"
                  label="Desconto"
                  type="number"
                  value={formik.values.discountPercentage}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.discountPercentage &&
                    Boolean(formik.errors.discountPercentage)
                  }
                  helperText={
                    formik.touched.discountPercentage &&
                    formik.errors.discountPercentage
                  }
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Data Início"
                    value={formik.values.startDate}
                    onChange={(value) =>
                      formik.setFieldValue("startDate", value)
                    }
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Data Fim"
                    value={formik.values.endDate}
                    onChange={(value) => formik.setFieldValue("endDate", value)}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="status"
                      name="status"
                      checked={formik.values.status}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Status"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3 }}
                >
                  {editingId ? "Atualizar" : "Cadastrar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Promoções Cadastradas
          </Typography>

          <TextField
            fullWidth
            id="search"
            label="Buscar promoções"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "description"}
                      direction={orderBy === "description" ? order : "asc"}
                      onClick={() => handleRequestSort("description")}
                    >
                      Descrição
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>Desconto %</TableCell>
                  <TableCell>Data Início</TableCell>
                  <TableCell>Data Fim</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedPromotions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>{promotion.description}</TableCell>
                      <TableCell>
                        {products.find((p) => p.id === promotion.productId)
                          ?.title || "Produto não encontrado"}
                      </TableCell>
                      <TableCell>{promotion.discountPercentage}%</TableCell>
                      <TableCell>{formatDate(promotion.startDate)}</TableCell>
                      <TableCell>{formatDate(promotion.endDate)}</TableCell>
                      <TableCell>
                        {promotion.status ? "Ativo" : "Inativo"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(promotion)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            promotion.id !== undefined &&
                            openConfirmDialog(promotion.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20]}
              component="div"
              count={filteredAndSortedPromotions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Registros por página"
            />
          </TableContainer>
        </Paper>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity={snackbarSeverity} elevation={6} variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <ConfirmationDialog
          open={confirmDialogOpen}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir esta promoção?"
          onConfirm={handleDelete}
          onCancel={closeConfirmDialog}
        />
      </Box>
      <Footer />
    </Box>
  );
};
