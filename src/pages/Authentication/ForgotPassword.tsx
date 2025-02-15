import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { authService } from "../../services/auth.service.ts";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  email: yup.string().email("E-mail inválido").required("Informe o e-mail"),
  cpf: yup
    .string()
    .matches(/^\d{11}$/, "CPF deve ter 11 dígitos")
    .required("Informe o CPF"),
});

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const formik = useFormik({
    initialValues: {
      email: "",
      cpf: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setToken(null);
      formik.setStatus(null);
      try {
        const response = await authService.forgotPassword(values);
        setToken(response.token);
        console.log("ForgotPassword response:", response);
      } catch (error) {
        console.error("Error:", error);
        formik.setStatus(
          "Erro ao recuperar senha.\n\n Verifique os dados informados para geração do token!"
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

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/reset-password")}
              sx={{ mt: 3 }}
            >
              Alterar Senha
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
