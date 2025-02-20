import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Grid,
} from "@mui/material";
import { Instagram, WhatsApp, Facebook } from "@mui/icons-material";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";

const SectionTitle = ({ children }) => (
  <Box
    sx={{
      backgroundColor: "#1976d2",
      color: "#ffffff",
      p: 2,
      borderRadius: 1,
      mb: 2,
    }}
  >
    <Typography variant="h6" component="h2">
      {children}
    </Typography>
  </Box>
);

export const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const { isAuthenticated, user, logout } = useAuthContext();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!name) newErrors.name = "Nome é obrigatório";
    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }
    if (!message) newErrors.message = "Mensagem é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSnackbarMessage(
        "Mensagem enviada com sucesso! Aguarde, em até 3 dias úteis nosso time retornará o contato."
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MenuItemsSummCustomer
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f0f4f8",
        }}
      >
        <Box sx={{ mt: 6 }} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper
            elevation={3}
            sx={{ p: 4, mb: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ textAlign: "center", color: "#1976d2" }}
            >
              Fale Conosco
            </Typography>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 800,
              margin: "0 auto",
              backgroundColor: "#ffffff",
              mb: 4,
              mt: 2,
            }}
          >
            <SectionTitle>Informações de Contato</SectionTitle>
            <Typography variant="body1" paragraph>
              Email: contato@bookbrew.com
            </Typography>
            <Typography variant="body1" paragraph>
              Tel: (11) 1234-5678
            </Typography>
            <SectionTitle>Redes Sociais</SectionTitle>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Grid item xs={12} sm={4} textAlign="center">
                <IconButton
                  href="https://www.instagram.com"
                  target="_blank"
                  sx={{ color: "#1976d2", fontSize: 40 }}
                >
                  <Instagram fontSize="inherit" />
                </IconButton>
                <Typography variant="body2" sx={{ color: "#1976d2" }}>
                  Siga-nos no Instagram
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} textAlign="center">
                <IconButton
                  href="https://www.whatsapp.com"
                  target="_blank"
                  sx={{ color: "#1976d2", fontSize: 40 }}
                >
                  <WhatsApp fontSize="inherit" />
                </IconButton>
                <Typography variant="body2" sx={{ color: "#1976d2" }}>
                  Converse pelo WhatsApp
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} textAlign="center">
                <IconButton
                  href="https://www.facebook.com"
                  target="_blank"
                  sx={{ color: "#1976d2", fontSize: 40 }}
                >
                  <Facebook fontSize="inherit" />
                </IconButton>
                <Typography variant="body2" sx={{ color: "#1976d2" }}>
                  Curta nossa página no Facebook
                </Typography>
              </Grid>
            </Grid>
            <SectionTitle>Formulário de Contato</SectionTitle>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              onSubmit={handleSubmit}
            >
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="Mensagem"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                error={!!errors.message}
                helperText={errors.message}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ backgroundColor: "#1976d2" }}
              >
                Enviar
              </Button>
            </Box>
          </Paper>
        </Container>
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
