import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { authService } from "../../services/auth.service.ts";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  cpf: yup
    .string()
    .test("cpf-or-phone", "Informe CPF ou Telefone", function (value) {
      return Boolean(value || this.parent.phone);
    }),
  phone: yup
    .string()
    .test("phone-or-cpf", "Informe CPF ou Telefone", function (value) {
      return Boolean(value || this.parent.cpf);
    }),
});

export const ForgotEmail = () => {
  const navigate = useNavigate();

  const [recoveredEmail, setRecoveredEmail] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      cpf: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setRecoveredEmail(null);
        formik.setStatus(null);
        let response;
        if (values.cpf) {
          response = await authService.forgotEmail({
            cpf: values.cpf,
            phone: "",
          });
        } else if (values.phone) {
          response = await authService.forgotEmail({
            phone: values.phone,
            cpf: "",
          });
        }
        setRecoveredEmail(response.email);
      } catch (error) {
        console.error("Error:", error);
        formik.setStatus(
          "Erro ao buscar e-mail.\n\n Verifique os dados informados!"
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
          Recuperar E-mail
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
            id="cpf"
            name="cpf"
            label="CPF"
            margin="normal"
            value={formik.values.cpf}
            onChange={formik.handleChange}
            error={formik.touched.cpf && Boolean(formik.errors.cpf)}
            helperText={formik.touched.cpf && formik.errors.cpf}
          />

          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Telefone"
            margin="normal"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
            Buscar
          </Button>

          {recoveredEmail && (
            <Box
              sx={{
                mt: 3,
                textAlign: "center",
                p: 2,
                backgroundColor: "#e0f7fa",
                borderRadius: 1,
              }}
            >
              <Typography variant="h6">E-mail Recuperado:</Typography>
              <Typography variant="body1">{recoveredEmail}</Typography>

              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{ mt: 3 }}
              >
                Fazer Login
              </Button>
            </Box>
          )}
        </form>
      </Paper>
    </Box>
  );
};
