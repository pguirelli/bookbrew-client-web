import React from "react";
import {
  Box,
  Paper,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";

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

export const Questions = () => {
  const { isAuthenticated, user, logout } = useAuthContext();

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
        <Container maxWidth="lg" sx={{ mt: 10 }}>
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
              mt: 2,
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
      </Box>
      <Footer />
    </Box>
  );
};
