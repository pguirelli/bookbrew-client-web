import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { MenuItemsSummCustomer } from "../Components/MenuItemsSummCustomer.tsx";
import { Footer } from "../Components/Footer.tsx";
import { customerService } from "../../services/customer.service.ts";
import { AddressList } from "../Components/AddressList.tsx";

const validationSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  lastName: yup.string().required("Sobrenome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  cpf: yup.string().required("CPF é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  birthDate: yup.date().required("Data de nascimento é obrigatória"),
  password: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas devem ser iguais")
    .required("Confirmação de senha é obrigatória"),
  addresses: yup
    .array()
    .of(
      yup.object({
        zipCode: yup.string().required("CEP é obrigatório"),
        street: yup.string().required("Rua é obrigatória"),
        number: yup.string().required("Número é obrigatório"),
        neighborhood: yup.string().required("Bairro é obrigatório"),
        type: yup.string().required("Tipo é obrigatório"),
        city: yup.string().required("Cidade é obrigatória"),
        state: yup.string().required("Estado é obrigatório"),
        country: yup.string().required("País é obrigatório"),
        complement: yup.string(),
      })
    )
    .min(1, "Adicione pelo menos um endereço")
    .required("Adicione pelo menos um endereço"),
});

export const RegisterCustomer = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

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
      birthDate: "",
      password: "",
      confirmPassword: "",
      addresses: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.addresses.length === 0) {
          formik.setFieldError("addresses", "Adicione pelo menos um endereço");
          return;
        }
        console.log("1 Register:", values);
        const customerRequest = {
          name: values.name,
          lastName: values.lastName,
          email: values.email,
          cpf: values.cpf,
          phone: values.phone,
          birthDate: values.birthDate,
          password: values.password,
          addresses: values.addresses,
        };

        console.log("2 Register:", values);
        await customerService.createCustomer(customerRequest);
        console.log("3 Register:", values);
        showSnackbar("Cliente cadastrado com sucesso! Você será redirecionado para tela de login.", "success");
        formik.resetForm();
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } catch (error) {
        console.error("Registration error:", error);
        showSnackbar("Erro ao cadastrar cliente!", "error");
      }
    },
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
            Cadastro de Cliente
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
                  helperText={formik.touched.lastName && formik.errors.lastName}
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
                />
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
                  helperText={formik.touched.password && formik.errors.password}
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
                <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                  Endereço
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <AddressList addresses={formik.values.addresses} formik={formik} />
                {formik.touched.addresses &&
                  formik.errors.addresses &&
                  typeof formik.errors.addresses === "string" && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {formik.errors.addresses}
                    </Typography>
                  )}
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
      </Box>
      <Footer />
    </Box>
  );
};