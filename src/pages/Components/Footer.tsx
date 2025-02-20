import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";

export const Footer: React.FC = () => (
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
