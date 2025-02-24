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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { ConfirmationDialog } from "../../pages/Components/ConfirmationDialog.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { User } from "../../types/user.types.ts";
import { UserRequest } from "../../types/user.types.ts";
import { userService } from "../../services/user.service.ts";

type Order = "asc" | "desc";

const validationSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  lastName: yup.string().required("Sobrenome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  cpf: yup.string().required("CPF é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  idProfile: yup.number().required("Perfil é obrigatório"),
  status: yup.boolean().required("Status é obrigatório"),
});

export const ManageUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [profiles, setProfiles] = useState<
    Array<{ id: number; name: string; status: boolean }>
  >([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    lastName?: string;
    email?: string;
    cpf?: string;
    phone?: string;
    idProfile?: number;
    status?: string;
  }>({});
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const { isAuthenticated, user, logout } = useAuthContext();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const openConfirmDialog = (userId: number) => {
    setSelectedUserId(userId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedUserId(null);
    setConfirmDialogOpen(false);
  };

  const fetchUsers = async () => {
    try {
      const fetchedUsers: User[] = await userService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const fetchedProfiles = await userService.getAllUserProfiles();
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProfiles();
  }, []);

  const handleUpdateUser = async (values: User) => {
    try {
      if (!editingId) return;

      const userRequest: UserRequest = {
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        cpf: values.cpf,
        phone: values.phone,
        profile: profiles.find((p) => p.id === values.idProfile) || {
          id: 0,
          name: "",
          status: false,
        },
        status: values.status,
      };

      await userService.updateUser(editingId, userRequest);
      await fetchUsers();
      formik.resetForm();
      setEditingId(null);
      showSnackbar("Usuário atualizado com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      showSnackbar("Erro ao atualizar os dados do usuário!", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleDelete = async () => {
    if (selectedUserId !== null) {
      try {
        await userService.deleteUser(selectedUserId);
        fetchUsers();
        closeConfirmDialog();
        showSnackbar("Usuário excluído com sucesso!", "success");
      } catch (error) {
        console.error("Failed to delete user:", error);
        showSnackbar("Erro ao excluir usuário!", "error");
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id ?? null);
    formik.setValues({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      idProfile: user.idProfile ?? 0,
      status: user.status ?? false,
    });
  };

  const validate = () => {
    const newErrors: {
      name?: string;
      lastName?: string;
      email?: string;
      cpf?: string;
      phone?: string;
      idProfile?: number;
      status?: string;
    } = {};
    if (!formik.values.name) newErrors.name = "Nome é obrigatório";
    if (!formik.values.lastName) newErrors.lastName = "Sobrenome é obrigatório";
    if (!formik.values.email) newErrors.email = "E-mail é obrigatório";
    if (!formik.values.cpf) newErrors.cpf = "CPF é obrigatório";
    if (!formik.values.phone) newErrors.phone = "Telefone é obrigatório";
    if (!formik.values.idProfile) newErrors.idProfile = 0;
    if (formik.values.status === undefined)
      newErrors.status = "Status é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await handleUpdateUser(formik.values);
      formik.resetForm();
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Erro ao atualizar o usuário.",
      }));
    }
  };

  const handleRequestSort = (property: keyof User) => {
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

  const filteredAndSortedUsers = React.useMemo(() => {
    return [...users]
      .filter((user) =>
        Object.values(user).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        if (aValue === undefined || bValue === undefined) return 0;
        if (order === "asc") {
          return aValue < bValue ? -1 : 1;
        } else {
          return bValue < aValue ? -1 : 1;
        }
      });
  }, [users, order, orderBy, searchTerm]);

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      cpf: "",
      phone: "",
      idProfile: 0,
      status: false,
    },
    validationSchema: validationSchema,
    onSubmit: handleUpdateUser,
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
            Editar Usuário
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
                <FormControl
                  fullWidth
                  error={
                    formik.touched.idProfile && Boolean(formik.errors.idProfile)
                  }
                >
                  <InputLabel id="profile-label">Perfil</InputLabel>
                  <Select
                    labelId="profile-label"
                    id="idProfile"
                    name="idProfile"
                    value={formik.values.idProfile}
                    label="Perfil"
                    onChange={formik.handleChange}
                    disabled={!editingId}
                  >
                    {profiles.map((profile) => (
                      <MenuItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            Usuários Cadastrados
          </Typography>

          <TextField
            fullWidth
            id="search"
            label="Buscar usuários"
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
                  <TableCell>Perfil</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{`${user.name} ${user.lastName}`}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.cpf}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        {" "}
                        {profiles.find((p) => p.id === user.idProfile)?.name ||
                          "N/A"}
                      </TableCell>
                      <TableCell>{user.status ? "Ativo" : "Inativo"}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            user.id !== undefined && openConfirmDialog(user.id)
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
              count={filteredAndSortedUsers.length}
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
          message="Tem certeza que deseja excluir este usuário?"
          onConfirm={handleDelete}
          onCancel={closeConfirmDialog}
        />
      </Box>
      <Footer />
    </Box>
  );
};
