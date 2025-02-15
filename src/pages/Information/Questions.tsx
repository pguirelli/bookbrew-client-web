import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

const faqData = [
  {
    question: "Como faço para comprar um livro?",
    answer:
      "Para comprar um livro, basta acessar a nossa loja online, selecionar o livro desejado e seguir as instruções para finalizar a compra.",
  },
  {
    question: "Quais são as formas de pagamento aceitas?",
    answer:
      "Aceitamos diversas formas de pagamento, incluindo cartões de crédito, débito, boleto bancário e PayPal.",
  },
  {
    question: "Qual é o prazo de entrega?",
    answer:
      "O prazo de entrega varia de acordo com a sua localização e o método de envio escolhido. Em média, o prazo é de 5 a 10 dias úteis.",
  },
  {
    question: "Posso devolver um produto?",
    answer:
      "Sim, você pode devolver um produto em até 30 dias após a compra. Para mais informações, consulte nossa política de devoluções.",
  },
  {
    question: "Como entro em contato com o suporte?",
    answer:
      "Você pode entrar em contato com o nosso suporte através do email suporte@bookbrew.com ou pelo telefone (11) 1234-5678.",
  },
];

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

export const Questions = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4 }} >
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
            Perguntas Frequentes
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
            mt: 2
          }}
        >
          {faqData.map((item, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ backgroundColor: "#1976d2", color: "#ffffff" }}
              >
                <Typography>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};
