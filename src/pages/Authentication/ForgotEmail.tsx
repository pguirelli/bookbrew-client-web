import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { authService } from "../../services/auth.service.ts";

const validationSchema = yup
  .object({
    cpf: yup
      .string()
      .matches(/^\d{11}$/, "CPF deve ter 11 dígitos")
      .nullable(), // CPF is optional
    phoneNumber: yup
      .string()
      .matches(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos")
      .nullable(), // Phone number is optional
  })
  .test(
    "at-least-one",
    "Por favor, preencha pelo menos um campo: CPF ou Telefone.",
    function (value) {
      const { cpf, phoneNumber } = value || {};
      if (!cpf && !phoneNumber) {
        return this.createError({
          message: "Por favor, preencha pelo menos um campo: CPF ou Telefone.",
        });
      }
      return true; // Return true if at least one field is filled
    }
  );

export const ForgotEmail = () => {
  const [recoveredEmail, setRecoveredEmail] = useState<string | null>(null); // State to store the recovered email
  const formik = useFormik({
    initialValues: {
      cpf: "",
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await authService.forgotEmail(values);
        setRecoveredEmail(response.email); // Assuming the email is returned in response.data.email
      } catch (error) {
        // Handle error
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
          Recuperar Email
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="cpf"
            name="cpf"
            label="CPF"
            margin="normal"
            value={formik.values.cpf}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cpf && Boolean(formik.errors.cpf)}
            helperText={formik.touched.cpf && formik.errors.cpf}
          />

          <TextField
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label="Telefone"
            margin="normal"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3 }}
            disabled={!formik.isValid || !formik.dirty} // Disable button if form is invalid or not dirty
          >
            Buscar
          </Button>

          {/* Display the recovered email if it exists */}
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
              <Typography variant="h6">Email Recuperado:</Typography>
              <Typography variant="body1">{recoveredEmail}</Typography>
            </Box>
          )}

          {/* Display a general error message if both fields are empty */}
          {formik.errors.cpf && formik.errors.phoneNumber && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {formik.errors.cpf}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
};
