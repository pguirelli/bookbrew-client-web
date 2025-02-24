import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import ImageCarousel from "../../pages/Shopping/ImageCarousel.tsx";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { Product } from "../../types/product.types.ts";
import { productService } from "../../services/product.service.ts";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { base64ToBlob } from "../../pages/Components/FunctionToConvertBase64Blob.tsx";
import { useCart } from "../../contexts/CartProvider.tsx";

function discountedPrice(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100);
}

export const ProductView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const { isAuthenticated, user, logout } = useAuthContext();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { state, addItemToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const fetchedProduct = await productService.getProductById(
            Number(id)
          );
          setProduct(fetchedProduct);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (product: Product) => {
    addItemToCart(product);
  };

  const navigateToCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/order");
    }
  };

  const handleCalculateShipping = () => {
    const randomDeliveryTime = Math.random() > 0.5 ? "2" : "5";
    const randomShippingCost = Math.random() > 0.5 ? 0 : 15.5;
    setDeliveryTime(randomDeliveryTime);
    setShippingCost(randomShippingCost);
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
        <Container sx={{ mt: 4, mb: 4 }}>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid item xs={12} sm={4} md={3}>
              <Card sx={{ height: "100%" }}>
                <Box sx={{ flex: "1 1 auto" }}>
                  <ImageCarousel
                    images={(product?.productImages ?? [])
                      .map((image) => {
                        const blob = base64ToBlob(
                          image.imageData,
                          "image/jpeg"
                        );
                        if (!blob) {
                          console.error(
                            "Falha ao converter dados da imagem para Blob:",
                            image
                          );
                          return null;
                        }
                        return URL.createObjectURL(blob);
                      })
                      .filter((url): url is string => url !== null)}
                  />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  {product && (
                    <>
                      <Typography variant="h4" component="h1" gutterBottom>
                        {product.title}{" "}
                        <small style={{ fontSize: "0.75rem" }}>
                          ({product.code})
                        </small>
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Categoria: {product.category.description} | Marca:{" "}
                        {product.brand.description}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {product.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Peso: {product.weight} kg | Altura: {product.height} cm
                        | Largura: {product.width} cm | Comprimento:{" "}
                        {product.length} cm
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={8} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  {product && (
                    <>
                      {product.discountPercentage ? (
                        <>
                          <Typography
                            variant="h3"
                            color="primary"
                            align="center"
                            gutterBottom
                          >
                            R${" "}
                            {discountedPrice(
                              product.price,
                              product.discountPercentage ?? 0
                            ).toFixed(2)}{" "}
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            justifyContent="center"
                          >
                            {" "}
                            <Typography
                              align="center"
                              variant="h6"
                              color="error"
                              gutterBottom
                            >
                              -{product.discountPercentage}%
                            </Typography>
                            <Typography
                              color="textSecondary"
                              style={{ textDecoration: "line-through" }}
                              align="center"
                              gutterBottom
                            >
                              R$ {product.price.toFixed(2)}{" "}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Typography
                          variant="h5"
                          color="primary"
                          align="center"
                          gutterBottom
                        >
                          R$ {product.price.toFixed(2)}{" "}
                        </Typography>
                      )}
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{ fontSize: "1rem" }}
                      >
                        Estoque: {product.stock}
                      </Typography>

                      <Box mt={2}>
                        <TextField
                          label="Quantidade"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          inputProps={{
                            min: 1,
                            max: product ? product.stock : 1,
                          }}
                          fullWidth
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        Quantidade Vendida: {product.salesQuantity}
                      </Typography>
                    </>
                  )}

                  <Box mt={2}>
                    <Button
                      size="large"
                      color="primary"
                      sx={{
                        height: "100%",
                        color: "#fff",
                        backgroundColor: "#1976d2",
                        marginLeft: "2px",
                        flex: 1,
                        "&:hover": {
                          backgroundColor: "#34e8eb",
                        },
                      }}
                      onClick={() => product && handleAddToCart(product)}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </Box>
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCalculateShipping}
                      fullWidth
                    >
                      Calcular Frete
                    </Button>
                    {shippingCost !== null && (
                      <Typography variant="body1" color="textSecondary" mt={2}>
                        Custo do Frete: R${shippingCost}
                      </Typography>
                    )}
                    {deliveryTime !== null && (
                      <Typography variant="body1" color="textSecondary" mt={2}>
                        Prazo de Entrega: {deliveryTime} dias úteis
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {cartItems.length > 0 && (
            <Box
              sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 1000,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={navigateToCheckout}
                startIcon={<ShoppingCart />}
              >
                Finalizar Compra ({cartItems.length} itens)
              </Button>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
