import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { authService } from "../../services/auth.service.ts";

const validationSchema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  cpf: yup
    .string()
    .matches(/^\d{11}$/, "CPF deve ter 11 dígitos")
    .required("CPF é obrigatório"),
});

export const ForgotPassword = () => {
  const [token, setToken] = useState<string | null>(null); // State to store the token
  const formik = useFormik({
    initialValues: {
      email: "",
      cpf: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await authService.forgotPassword(values);
        setToken(response.token);
        console.log("ForgotPassword response:", response);
        // Handle success (show message, redirect, etc)
      } catch (error) {
        // Handle error
        alert("Erro ao recuperar senha.");
        console.error("Login error:", error);
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
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Recuperar Senha
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            id="cpf"
            name="cpf"
            label="CPF"
            margin="normal"
            value={formik.values.cpf}
            onChange={formik.handleChange}
            error={formik.touched.cpf && Boolean(formik.errors.cpf)}
            helperText={formik.touched.cpf && formik.errors.cpf}
          />

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
            Enviar
          </Button>
        </form>

        {/* Display the token in a styled box if it exists */}
        {token && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "#e0f7fa", // Light teal color
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Token de Recuperação:</Typography>
            <Typography variant="body1">{token}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
