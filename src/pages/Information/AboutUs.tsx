import React from "react";
import { Box, Container, Typography, Paper, Grid } from "@mui/material";

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

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 3,
      px: 2,
      mt: "auto",
      backgroundColor: (theme) => theme.palette.grey[200],
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Sobre a BookBrew
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sua loja especializada em livros, cafés, perfumes e bebidas.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Contato
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: contato@bookbrew.com
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tel: (11) 1234-5678
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Redes Sociais
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Instagram • Facebook • Twitter
          </Typography>
        </Grid>
      </Grid>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 2 }}
      >
        © 2024 BookBrew. Todos os direitos reservados.
      </Typography>
    </Container>
  </Box>
);

export const AboutUs = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
      }}
    >
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
            Nossa missão é ser a loja preferida dos amantes de livros e bebidas,
            oferecendo uma seleção diversificada de produtos e um serviço ao
            cliente incomparável.
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
      <Footer />
    </Box>
  );
};
