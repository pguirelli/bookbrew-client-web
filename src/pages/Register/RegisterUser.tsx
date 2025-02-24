import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Container,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { MenuItemsSummCustomer } from "../Components/MenuItemsSummCustomer.tsx";
import { Footer } from "../Components/Footer.tsx";
import { userService } from "../../services/user.service.ts";
import { UserRequest } from "../../types/user.types.ts";

const validationSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  lastName: yup.string().required("Sobrenome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  cpf: yup.string().required("CPF é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  idProfile: yup
    .number()
    .min(1, "Perfil é obrigatório")
    .required("Perfil é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas devem ser iguais")
    .required("Confirmação de senha é obrigatória"),
  status: yup.boolean().required("Status é obrigatório"),
});

export const RegisterUser = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthContext();
  const [profiles, setProfiles] = useState<
    Array<{ id: number; name: string; status: boolean }>
  >([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const fetchedProfiles = await userService.getAllUserProfiles();
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
      showSnackbar("Erro ao carregar perfis!", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      cpf: "",
      phone: "",
      idProfile: 0,
      password: "",
      confirmPassword: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const userRequest: UserRequest = {
          name: values.name,
          lastName: values.lastName,
          email: values.email,
          cpf: values.cpf,
          phone: values.phone,
          password: values.password,
          profile: profiles.find((p) => p.id === values.idProfile) || {
            id: 0,
            name: "",
            status: false,
          },
          status: values.status,
        };

        await userService.createUser(userRequest);
        showSnackbar("Usuário cadastrado com sucesso!", "success");
        setTimeout(() => {
          navigate("/manage-user");
        }, 2000);
      } catch (error) {
        console.error("Registration error:", error);
        showSnackbar("Erro ao cadastrar usuário!", "error");
      }
    },
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
        <Container sx={{ mb: 4 }}>
          <Paper
            elevation={3}
            sx={{ p: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Cadastro de Usuário
            </Typography>

            <form onSubmit={formik.handleSubmit}>
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
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.idProfile &&
                      Boolean(formik.errors.idProfile)
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
                    >
                      {profiles.map((profile) => (
                        <MenuItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Senha"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirmar Senha"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    helperText={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
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
                    sx={{ mt: 3 }}
                  >
                    Cadastrar
                  </Button>
                </Grid>
              </Grid>
            </form>
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
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
