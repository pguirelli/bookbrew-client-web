import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service.ts";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { useAuthContext } from "../../contexts/AuthContext.tsx";

const validationSchema = yup.object({
  token: yup.string().required("Informe o token recebido"),
  newPassword: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("Informe a nova senha"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "As senhas não conferem")
    .required("Confirme a nova senha"),
});

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { isAuthenticated, user, logout } = useAuthContext();

  const formik = useFormik({
    initialValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await authService.resetPassword({
          token: values.token,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } catch (error) {
        console.error("Reset password error:", error);
        if (error.response?.status === 400) {
          formik.setStatus(
            "Erro no processo de recuperação de senha.\n\n Token inválido ou expirado!"
          );
        }
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
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
          justifyContent: "center",
          p: 3,
          pb: "80px",
          overflowY: "auto",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Redefinir Senha
          </Typography>

          {formik.status && (
            <pre
              style={{
                color: "#d32f2f",
                fontSize: "0.75rem",
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {formik.status}
            </pre>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="token"
              name="token"
              label="Token de Recuperação"
              margin="normal"
              value={formik.values.token}
              onChange={formik.handleChange}
              error={formik.touched.token && Boolean(formik.errors.token)}
              helperText={formik.touched.token && formik.errors.token}
            />

            <TextField
              fullWidth
              id="newPassword"
              name="newPassword"
              label="Nova Senha"
              type="password"
              margin="normal"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
            />

            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar Nova Senha"
              type="password"
              margin="normal"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />

            <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
              Redefinir Senha
            </Button>
          </form>
        </Paper>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" elevation={6} variant="filled">
            Senha redefinida com sucesso! Você será redirecionado para o login
            em 5 segundos.
          </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </Box>
  );
};
