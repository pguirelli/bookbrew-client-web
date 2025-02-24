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
import { CategoryProd } from "../../types/product.types.ts";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { ConfirmationDialog } from "../../pages/Components/ConfirmationDialog.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";

type Order = "asc" | "desc";

const validationSchema = yup.object({
  description: yup.string().required("Informe a categoria para cadastro"),
  status: yup.boolean().required(),
});

export const ManageCategory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<CategoryProd[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof CategoryProd>("description");
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories: CategoryProd[] =
        await productService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCreateOrUpdateCategoryProd = async (values: CategoryProd) => {
    try {
      if (editingId) {
        await productService.updateCategory(editingId, values);
      } else {
        await productService.createCategory(values);
      }
      fetchCategories();
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

  const openConfirmDialog = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedCategoryId(null);
    setConfirmDialogOpen(false);
  };

  const handleDelete = async () => {
    if (selectedCategoryId !== null) {
      try {
        await productService.deleteCategory(selectedCategoryId);
        fetchCategories();
        closeConfirmDialog();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleEdit = (categoryprod: CategoryProd) => {
    setEditingId(categoryprod.id ?? null);
    formik.setValues({
      description: categoryprod.description,
      status: categoryprod.status ?? true,
    });
  };

  const validate = () => {
    const newErrors: { description?: string } = {};
    if (!formik.values.description) {
      newErrors.description = "Informe a categoria para cadastro";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await handleCreateOrUpdateCategoryProd(formik.values);
        showSnackbar("Categoria cadastrada com sucesso!", "success");
        formik.resetForm();
      } catch (error) {
        showSnackbar("Erro ao cadastrar a categoria.", "error");
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Erro ao cadastrar a categoria.",
      }));
    }
  };

  const handleRequestSort = (property: keyof CategoryProd) => {
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

  const filteredAndSortedCategories = React.useMemo(() => {
    return [...categories]
      .filter(
        (categoryprod) =>
          categoryprod.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (categoryprod.status ? "ativo" : "inativo").includes(
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
  }, [categories, order, orderBy, searchTerm]);

  const formik = useFormik({
    initialValues: {
      description: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: handleCreateOrUpdateCategoryProd,
  });

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
            {editingId
              ? "Editar Categoria de Produto"
              : "Cadastro de Categorias de Produto"}
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
            label="Buscar categorias"
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
                {filteredAndSortedCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((categoryprod) => (
                    <TableRow key={categoryprod.id}>
                      <TableCell>{categoryprod.description}</TableCell>
                      <TableCell>
                        {categoryprod.status ? "Ativo" : "Inativo"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(categoryprod)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            categoryprod.id !== undefined &&
                            openConfirmDialog(categoryprod.id)
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
              count={filteredAndSortedCategories.length}
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
          message="Tem certeza que deseja excluir esta categoria?"
          onConfirm={handleDelete}
          onCancel={closeConfirmDialog}
        />
      </Box>
      <Footer />
    </Box>
  );
};
