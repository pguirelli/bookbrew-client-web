import React from "react";
import { Box, Paper, TextField, Button, Typography, Link } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service.ts";
import { useAuthContext } from "../../contexts/AuthContext.tsx";

const validationSchema = yup.object({
  email: yup.string().email("E-mail inválido").required("Informe seu e-mail"),
  password: yup.string().required("Informe sua senha"),
});

export const Login = () => {
  const { login } = useAuthContext();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await authService.login(values);
        if (response.cpf) {
          const userData = {
            id: response.id,
            name: response.name,
            lastName: response.lastName,
            email: response.email,
            cpf: response.cpf,
            phone: response.phone,
            status: response.status,
            profile: {
              id: response.profile.id,
              name: response.profile.name,
              status: response.profile.status,
            },
          };
          login(userData);
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        if (error.response?.status === 400) {
          formik.setStatus("E-mail ou senha incorretos");
        } else {
          formik.setStatus(
            "O site encontrou um erro ao realizar login.\n\n Aguarde alguns minutos e tente novamente!"
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
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 3, textAlign: "center" }}
        >
          BookBrew Login
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
            id="email"
            name="email"
            label="E-mail"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Senha"
            type="password"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
            Entrar
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link href="/forgot-password" sx={{ display: "block", mb: 1 }}>
            Esqueci minha senha
          </Link>
          <Link href="/forgot-email">Esqueci meu e-mail</Link>
        </Box>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#e0e0e0",
        }}
      >
        <Typography variant="body1" color="#666">
          Ainda não tem usuário?
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/register-customer")}
        >
          Cadastre-se
        </Button>
      </Paper>
    </Box>
  );
};
