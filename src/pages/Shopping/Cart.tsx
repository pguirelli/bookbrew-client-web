import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Remove, Add, Delete } from "@mui/icons-material";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { Product } from "../../types/product.types.ts";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { base64ToBlob } from "../../pages/Components/FunctionToConvertBase64Blob.tsx";
import { useCart } from "../../contexts/CartProvider.tsx";
import { OrderSummaryCard } from "../Components/OrderSummaryCard.tsx";

interface CartItem extends Product {
  quantity: number;
}

function discountedPrice(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100);
}

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [orderComplete, setOrderComplete] = useState(false);

  const { state, addItemToCart, removeFromCart, updateQuantity, clearCart } =
    useCart();
  const [checkoutControl, setCheckoutControl] = useState<boolean>(false);

  const handleOrderComplete = () => {
    showSnackbar("Pedido realizado com sucesso!", "success");
    clearCart();
    localStorage.removeItem("cart");
    localStorage.removeItem("itemsOrder");
    setOrderComplete(true);
  };

  const handleCheckoutControl = (value: boolean) => {
    setCheckoutControl(value);
    if (value) {
      logCartItems();
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const logCartItems = () => {
    if (checkoutControl) {
      const itemsOrder = Array.from(
        document.querySelectorAll(".cart-item")
      ).map((item) => {
        const title = item.querySelector(".item-title")?.textContent;
        const quantity = parseInt(
          item.querySelector(".item-quantity")?.textContent || "0"
        );
        const priceText =
          item.querySelector(".item-price")?.textContent?.trim() || "0";
        const discountText =
          item.querySelector(".item-discount")?.textContent?.trim() || "0";
        const cleanedPriceText = priceText.replace(/[^\d,.-]/g, "");
        const cleanedDiscountText = discountText.replace(/[^\d,.-]/g, "");
        const productId = item.getAttribute("data-product-id");

        return {
          id: parseInt(productId || "0"), //
          titulo: title,
          preco: cleanedPriceText,
          desconto: cleanedDiscountText,
          quantidade: quantity,
          total: parseFloat(cleanedPriceText) * quantity,
        };
      });

      localStorage.removeItem("itemsOrder");
      localStorage.setItem("itemsOrder", JSON.stringify(itemsOrder));

      return itemsOrder;
    } else {
      handleCheckout();
    }
  };

  const handleCheckout = () => {
    if (!checkoutControl) {
      localStorage.removeItem("cart");
      localStorage.removeItem("itemsOrder");
      setCartItems([]);
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          marginBottom: "2rem",
          bgcolor: "background.default",
        }}
      >
        <MenuItemsSummCustomer
          user={user}
          isAuthenticated={isAuthenticated}
          logout={logout}
        />
      </Box>
      return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: "80px",
          gap: 3,
        }}
      >
        <Container sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Meu Carrinho
          </Typography>

          {state.items.length === 0 ? (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" align="center" sx={{ my: 2 }}>
                  Seu carrinho está vazio
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/")}
                  fullWidth
                >
                  Continuar Comprando
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Grid container spacing={3}>
                {state.items.map((item) => (
                  <Grid
                    item
                    xs={12}
                    key={item.id}
                    className="cart-item"
                    data-product-id={item.id}
                  >
                    <Card>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={2}>
                            {item.productImages?.[0] ? (
                              <img
                                src={URL.createObjectURL(
                                  base64ToBlob(
                                    item.productImages[0].imageData,
                                    "image/jpeg"
                                  )!
                                )}
                                alt={item.title}
                                style={{
                                  width: "100%",
                                  maxWidth: "100px",
                                  height: "auto",
                                }}
                              />
                            ) : (
                              <img
                                src="/landscape-placeholder.png"
                                alt="Placeholder"
                                style={{
                                  width: "100%",
                                  maxWidth: "100px",
                                  height: "auto",
                                }}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="h6" className="item-title">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Código: {item.code}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Typography
                              className="item-price"
                              variant="body1"
                              fontWeight="bold"
                            >
                              R${" "}
                              {item.discountPercentage
                                ? discountedPrice(
                                    item.price,
                                    item.discountPercentage
                                  ).toFixed(2)
                                : item.price.toFixed(2)}
                            </Typography>
                            {(item.discountPercentage ?? 0) > 0 && (
                              <Typography
                                className="item-discount"
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  textDecoration: "line-through",
                                  marginLeft: 1,
                                }}
                              >
                                R$ {item.price.toFixed(2)}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={2} className="item-quantity">
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  updateQuantity(
                                    item.id ?? 0,
                                    item.quantity - 1,
                                    1
                                  )
                                }
                              >
                                <Remove />
                              </IconButton>
                              <Typography sx={{ mx: 2 }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  updateQuantity(
                                    item.id ?? 0,
                                    item.quantity + 1,
                                    0
                                  )
                                }
                                disabled={item.quantity >= item.stock}
                              >
                                <Add />
                              </IconButton>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Box display="flex" justifyContent="center">
                              <IconButton
                                color="error"
                                onClick={() => removeFromCart(item.id ?? 0)}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          <OrderSummaryCard
            items={state.items}
            onCheckout={logCartItems}
            checkoutControl={checkoutControl}
            onCheckoutControl={handleCheckoutControl}
            onOrderComplete={handleOrderComplete}
          />
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
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
