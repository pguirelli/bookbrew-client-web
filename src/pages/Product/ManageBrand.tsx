import React, { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import { productService } from "../../services/product.service.ts";
import * as yup from "yup";
import { Brand } from "../../types/product.types.ts";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { ConfirmationDialog } from "../../pages/Components/ConfirmationDialog.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";

type Order = "asc" | "desc";

const validationSchema = yup.object({
  description: yup.string().required("Informe a marca para cadastro"),
  status: yup.boolean().required(),
});

export const ManageBrand = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Brand>("description");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState<{ description?: string }>({});
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const { isAuthenticated, user, logout } = useAuthContext();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const openConfirmDialog = (brandId: number) => {
    setSelectedBrandId(brandId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedBrandId(null);
    setConfirmDialogOpen(false);
  };

  const fetchBrands = async () => {
    try {
      const fetchedBrands: Brand[] = await productService.getAllBrands();
      setBrands(fetchedBrands);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  const handleCreateOrUpdateBrand = async (values: Brand) => {
    try {
      if (editingId) {
        await productService.updateBrand(editingId, values);
      } else {
        await productService.createBrand(values);
      }
      fetchBrands();
      formik.resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Operation error:", error);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleDelete = async () => {
    if (selectedBrandId !== null) {
      try {
        await productService.deleteBrand(selectedBrandId);
        fetchBrands();
        closeConfirmDialog();
      } catch (error) {
        console.error("Failed to delete brand:", error);
      }
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id ?? null);
    formik.setValues({
      description: brand.description,
      status: brand.status ?? true,
    });
  };

  const validate = () => {
    const newErrors: { description?: string } = {};
    if (!formik.values.description) {
      newErrors.description = "Informe a marca para cadastro";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await handleCreateOrUpdateBrand(formik.values);
        showSnackbar("Marca cadastrada com sucesso!", "success");
        formik.resetForm();
      } catch (error) {
        showSnackbar("Erro ao cadastrar a marca.", "error");
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Erro ao cadastrar a marca.",
      }));
    }
  };

  const handleRequestSort = (property: keyof Brand) => {
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

  const filteredAndSortedBrands = React.useMemo(() => {
    return [...brands]
      .filter(
        (brand) =>
          brand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (brand.status ? "ativo" : "inativo").includes(
            searchTerm.toLowerCase()
          )
      )
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
  }, [brands, order, orderBy, searchTerm]);

  const formik = useFormik({
    initialValues: {
      description: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: handleCreateOrUpdateBrand,
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MenuItemsSummCustomer
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
        <Box sx={{ mt: 4 }} />
        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 3, textAlign: "center" }}
          >
            {editingId
              ? "Editar Marca de Produto"
              : "Cadastro de Marcas de Produto"}
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={10}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Descrição"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={Boolean(!!errors.description)}
                  helperText={errors.description}
                />
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
                  onClick={handleSubmit}
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
          <TextField
            fullWidth
            id="search"
            label="Buscar marcas"
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
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "status"}
                      direction={orderBy === "status" ? order : "asc"}
                      onClick={() => handleRequestSort("status")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedBrands
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell>{brand.description}</TableCell>
                      <TableCell>
                        {brand.status ? "Ativo" : "Inativo"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(brand)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            brand.id !== undefined &&
                            openConfirmDialog(brand.id)
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
              count={filteredAndSortedBrands.length}
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
          message="Tem certeza que deseja excluir esta marca?"
          onConfirm={handleDelete}
          onCancel={closeConfirmDialog}
        />
      </Box>
      <Footer />
    </Box>
  );
};
