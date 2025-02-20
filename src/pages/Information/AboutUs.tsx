import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
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

export const AboutUs = () => {
  const { isAuthenticated, user, logout } = useAuthContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MenuItemsSummCustomer
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f0f4f8",
        }}
      >
        <Box sx={{ mt: 3 }} />
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
              Sobre Nós
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
            <SectionTitle>Nossa História</SectionTitle>
            <Typography variant="body1" paragraph>
              A BookBrew foi fundada com a missão de oferecer uma experiência
              única de compra de livros, cafés, perfumes e bebidas. Desde o
              início, nosso objetivo tem sido proporcionar aos nossos clientes
              produtos de alta qualidade e um atendimento excepcional.
            </Typography>
            <SectionTitle>Nossa Missão</SectionTitle>
            <Typography variant="body1" paragraph>
              Nossa missão é ser a loja preferida dos amantes de livros e
              bebidas, oferecendo uma seleção diversificada de produtos e um
              serviço ao cliente incomparável.
            </Typography>
            <SectionTitle>Nossos Valores</SectionTitle>
            <Typography variant="body1" paragraph>
              Valorizamos a qualidade, a integridade e a satisfação do cliente
              acima de tudo. Estamos comprometidos em criar uma comunidade de
              clientes satisfeitos e apaixonados pelos nossos produtos.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <img
                src="/book-brew.jpg"
                alt="Book Brew"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
