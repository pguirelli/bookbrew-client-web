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
import { userService } from "../../services/user.service.ts";
import * as yup from "yup";
import { UserProfile } from "../../types/user.types.ts";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { ConfirmationDialog } from "../../pages/Components/ConfirmationDialog.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";

type Order = "asc" | "desc";

const validationSchema = yup.object({
  name: yup.string().required("Informe o perfil de usuário para cadastro"),
  status: yup.boolean().required(),
});

export const ManageUserProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof UserProfile>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const { isAuthenticated, user, logout } = useAuthContext();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUserProfileId, setSelectedUserProfileId] = useState<
    number | null
  >(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const openConfirmDialog = (userprofileId: number) => {
    setSelectedUserProfileId(userprofileId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedUserProfileId(null);
    setConfirmDialogOpen(false);
  };

  const fetchUserProfile = async () => {
    try {
      const fetchedUserProfile: UserProfile[] =
        await userService.getAllUserProfiles();
      setUserProfile(fetchedUserProfile);
    } catch (error) {
      console.error("Failed to fetch user profiles:", error);
    }
  };

  const handleCreateOrUpdateUserProfile = async (values: UserProfile) => {
    try {
      if (editingId) {
        await userService.updateUserProfile(editingId, values);
      } else {
        await userService.createUserProfile(values);
      }
      fetchUserProfile();
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
    if (selectedUserProfileId !== null) {
      try {
        await userService.deleteUserProfile(selectedUserProfileId);
        fetchUserProfile();
        closeConfirmDialog();
      } catch (error) {
        console.error("Failed to delete user profile:", error);
      }
    }
  };

  const handleEdit = (userProfile: UserProfile) => {
    setEditingId(userProfile.id ?? null);
    formik.setValues({
      name: userProfile.name,
      status: userProfile.status ?? true,
    });
  };

  const validate = () => {
    const newErrors: { name?: string } = {};
    if (!formik.values.name) {
      newErrors.name = "Informe o perfil de usuário para cadastro";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await handleCreateOrUpdateUserProfile(formik.values);
        showSnackbar("Perfil de usuário cadastrado com sucesso!", "success");
        formik.resetForm();
      } catch (error) {
        showSnackbar("Erro ao cadastrar o perfil de usuário.", "error");
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Erro ao cadastrar o perfil de usuário.",
      }));
    }
  };

  const handleRequestSort = (property: keyof UserProfile) => {
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

  const filteredAndSortedUserProfile = React.useMemo(() => {
    return [...userProfile]
      .filter(
        (userProfile) =>
          userProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (userProfile.status ? "ativo" : "inativo").includes(
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
  }, [userProfile, order, orderBy, searchTerm]);

  const formik = useFormik({
    initialValues: {
      name: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: handleCreateOrUpdateUserProfile,
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
              ? "Editar Perfil de Usuário"
              : "Cadastro de Perfis de Usuário"}
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={10}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Descrição"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={Boolean(!!errors.name)}
                  helperText={errors.name}
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
            label="Buscar perfis de usuário"
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
                {filteredAndSortedUserProfile
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((userProfile) => (
                    <TableRow key={userProfile.id}>
                      <TableCell>{userProfile.name}</TableCell>
                      <TableCell>
                        {userProfile.status ? "Ativo" : "Inativo"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(userProfile)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            userProfile.id !== undefined &&
                            openConfirmDialog(userProfile.id)
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
              count={filteredAndSortedUserProfile.length}
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
          message="Tem certeza que deseja excluir este perfil de usuário?"
          onConfirm={handleDelete}
          onCancel={closeConfirmDialog}
        />
      </Box>
      <Footer />
    </Box>
  );
};
