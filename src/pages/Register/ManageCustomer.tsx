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
  TableSortLabel,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { ConfirmationDialog } from "../../pages/Components/ConfirmationDialog.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { Customer } from "../../types/customer.types.ts";
import { customerService } from "../../services/customer.service.ts";

type Order = "asc" | "desc";

const validationSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  lastName: yup.string().required("Sobrenome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  cpf: yup.string().required("CPF é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  birthDate: yup.date().required("Data de nascimento é obrigatória"),
  status: yup.boolean().required("Status é obrigatório"),
});

export const ManageCustomer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Customer>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    lastName?: string;
    email?: string;
    cpf?: string;
    phone?: string;
    birthDate?: string;
    status?: string;
  }>({});
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const { isAuthenticated, user, logout } = useAuthContext();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openConfirmDialog = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedCustomerId(null);
    setConfirmDialogOpen(false);
  };

  const fetchCustomers = async () => {
    try {
      const fetchedCustomers: Customer[] =
        await customerService.getAllCustomers();
      setCustomers(fetchedCustomers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const handleUpdateCustomer = async (values: Customer) => {
    try {
      if (!editingId) return;
      // Log dos valores antes de enviar
      console.log("Dados enviados para atualização:", {
        ...values,
        phone: values.phone, // verificar formato do telefone
      });
      await customerService.updateCustomer(editingId, values);
      await fetchCustomers();
      formik.resetForm();
      setEditingId(null);
      showSnackbar("Cliente atualizado com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro detalhado:", {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      showSnackbar("Erro ao atualizar os dados do cliente!", "error");
      return;
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleDelete = async () => {
    if (selectedCustomerId !== null) {
      try {
        await customerService.deleteCustomer(selectedCustomerId);
        fetchCustomers();
        closeConfirmDialog();
      } catch (error) {
        console.error("Failed to delete customer:", error);
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id ?? null);
    formik.setValues({
      name: customer.name,
      lastName: customer.lastName,
      email: customer.email,
      cpf: customer.cpf,
      phone: customer.phone,
      status: customer.status ?? false,
      birthDate: customer.birthDate
        ? new Date(customer.birthDate).toISOString().split("T")[0]
        : "",
    });
  };

  const validate = () => {
    const newErrors: {
      name?: string;
      lastName?: string;
      email?: string;
      cpf?: string;
      phone?: string;
      birthDate?: string;
      status?: string;
    } = {};
    if (!formik.values.name) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formik.values.lastName) {
      newErrors.lastName = "Sobrenome é obrigatório";
    }
    if (!formik.values.email) {
      newErrors.email = "E-mail é obrigatório";
    }
    if (!formik.values.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    }
    if (!formik.values.phone) {
      newErrors.phone = "Telefone é obrigatório";
    }
    if (!formik.values.birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    }
    if (formik.values.status === undefined) {
      newErrors.status = "Status é obrigatório";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await handleUpdateCustomer(formik.values);
      formik.resetForm();
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Erro ao atualizar o cliente.",
      }));
    }
  };

  const handleRequestSort = (property: keyof Customer) => {
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

  const filteredAndSortedCustomers = React.useMemo(() => {
    return [...customers]
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.cpf.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [customers, order, orderBy, searchTerm]);

  const formik = useFormik<Customer>({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      cpf: "",
      phone: "",
      birthDate: "",
      status: false,
    },
    validationSchema: validationSchema,
    onSubmit: handleUpdateCustomer,
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
            Editar Cliente
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nome"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  disabled={!editingId}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Sobrenome"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  disabled={!editingId}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="E-mail"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={!editingId}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="cpf"
                  name="cpf"
                  label="CPF"
                  value={formik.values.cpf}
                  onChange={formik.handleChange}
                  error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                  helperText={formik.touched.cpf && formik.errors.cpf}
                  disabled={!editingId}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Telefone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  disabled={!editingId}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="birthDate"
                  name="birthDate"
                  label="Data de Nascimento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.birthDate}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.birthDate && Boolean(formik.errors.birthDate)
                  }
                  helperText={
                    formik.touched.birthDate && formik.errors.birthDate
                  }
                  disabled={!editingId}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="status"
                      name="status"
                      checked={formik.values.status}
                      onChange={formik.handleChange}
                      disabled={!editingId}
                    />
                  }
                  label="Ativo"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={!editingId}
                  sx={{ mt: 3 }}
                >
                  Atualizar
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
            Clientes Cadastrados
          </Typography>

          <TextField
            fullWidth
            id="search"
            label="Buscar clientes"
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
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Nome
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Data Nascimento</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedCustomers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{`${customer.name} ${customer.lastName}`}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.cpf}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.birthDate}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(customer)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            customer.id !== undefined &&
                            openConfirmDialog(customer.id)
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
              count={filteredAndSortedCustomers.length}
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
          message="Tem certeza que deseja excluir este cliente?"
          onConfirm={handleDelete}
          onCancel={closeConfirmDialog}
        />
      </Box>
      <Footer />
    </Box>
  );
};
