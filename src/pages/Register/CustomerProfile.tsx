import React, { useState, useEffect } from "react";
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
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { MenuItemsSummCustomer } from "../Components/MenuItemsSummCustomer.tsx";
import { Footer } from "../Components/Footer.tsx";
import { Address } from "../../types/customer.types.ts";
import { customerService } from "../../services/customer.service.ts";
import { AddressList } from "../Components/AddressList.tsx";

const validationSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  lastName: yup.string().required("Sobrenome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  birthDate: yup.date().required("Data de nascimento é obrigatória"),
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

export const CustomerProfile = () => {
  const { isAuthenticated, user, logout } = useAuthContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [customerId, setCustomerId] = useState<number | null>(null);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  interface FormValues {
    name: string;
    lastName: string;
    email: string;
    cpf: string;
    phone: string;
    birthDate: string;
    addresses: Address[];
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      cpf: "",
      phone: "",
      birthDate: "",
      addresses: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.addresses.length === 0) {
          formik.setFieldError("addresses", "Adicione pelo menos um endereço");
          return;
        }

        const customerRequest = {
          name: values.name,
          lastName: values.lastName,
          email: values.email,
          cpf: values.cpf,
          phone: values.phone,
          birthDate: values.birthDate,
          addresses: values.addresses,
        };

        if (customerId !== null) {
          await customerService.updateCustomer(customerId, customerRequest);
          showSnackbar("Dados atualizados com sucesso!", "success");

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          showSnackbar("ID do cliente não encontrado!", "error");
        }
        showSnackbar("Dados atualizados com sucesso!", "success");
      } catch (error) {
        console.error("Update error:", error);
        showSnackbar("Erro ao atualizar dados!", "error");
      }
    },
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        if (user) {
          const customerData = await customerService.getCustomerByUserId(
            user.id
          );
          setCustomerId(customerData.id ?? null);

          if (customerData.id) {
            const addressesData = await customerService.getCustomerAddresses(
              customerData.id
            );

            formik.setValues({
              name: customerData.name,
              lastName: customerData.lastName,
              email: customerData.email,
              cpf: customerData.cpf,
              phone: customerData.phone,
              birthDate: customerData.birthDate,
              addresses: addressesData || [],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        showSnackbar("Erro ao carregar dados do cliente!", "error");
      }
    };

    if (user?.id) {
      fetchCustomerData();
    }
  }, [user?.id]);

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
            Meu Perfil
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
                  disabled
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

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                  Endereços
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <AddressList
                  addresses={formik.values.addresses}
                  formik={formik}
                  customerId={customerId}
                />
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
                  Salvar Alterações
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
