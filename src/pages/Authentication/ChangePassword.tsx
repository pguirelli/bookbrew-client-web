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
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service.ts";
import { useAuth } from "../../hooks/useAuth.ts";

const validationSchema = yup.object({
  currentPassword: yup.string().required("Informe a senha atual"),
  newPassword: yup
    .string()
    .min(6, "A nova senha deve ter no mínimo 6 caracteres")
    .required("Informe a nova senha"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "As senhas devem ser iguais")
    .required("Confirme a nova senha"),
});

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { getUserId } = useAuth();
  const userId = getUserId();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (!userId) {
          navigate("/login");
          return;
        }

        await authService.changePassword(userId, {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } catch (error) {
        console.error("Password change error:", error);
        formik.setStatus(
          "Erro no processo de alteração de senha.\n\n Verifique se a senha atual está correta e tente novamente.\n"
        );
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Alterar Senha
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
        <br></br>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="currentPassword"
                name="currentPassword"
                label="Senha Atual"
                type="password"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.currentPassword &&
                  Boolean(formik.errors.currentPassword)
                }
                helperText={
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="newPassword"
                name="newPassword"
                label="Nova Senha"
                type="password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar Nova Senha"
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
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
              >
                Alterar Senha
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Senha alterada com sucesso! Você será redirecionado para o login em 5
          segundos.
        </Alert>
      </Snackbar>
    </Box>
  );
};
