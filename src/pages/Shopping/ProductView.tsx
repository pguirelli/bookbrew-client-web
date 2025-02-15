import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Badge,
  TextField,
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  Divider,
  MenuItem,
  Drawer,
  Menu,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Settings,
  LocalShipping,
  Category,
} from "@mui/icons-material";
import ImageCarousel from "../../pages/Shopping/ImageCarousel.tsx";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { Product } from "../../types/product.types.ts";
import { productService } from "../../services/product.service.ts";

function base64ToBlob(
  base64: string,
  contentType: string = "",
  sliceSize: number = 512
): Blob {
  const base64Data = base64.split(",")[1] || base64;
  const byteCharacters = atob(base64Data);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

function discountedPrice(price: number, discountPercentage: number): number {
  console.log("Discount Percentage:", discountPercentage);
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
  const [productsOpen, setProductsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdmin = user?.profile.id === 1;
  const isManager = user?.profile.id === 2;
  const isModerator = user?.profile.id === 3;
  const isCustomer = user?.profile.id === 4;

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const fetchedProduct = await productService.getProductById(
            Number(id)
          );
          console.log("Fetched Product:", fetchedProduct);
          setProduct(fetchedProduct);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const menuItems = isAuthenticated ? (
    <>
      {(isAdmin || isManager) && (
        <>
          <MenuItem onClick={() => navigate("/manage-order")}>Pedidos</MenuItem>
          <MenuItem onClick={() => navigate("/process-order")}>
            Processar Pedido
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-promotion")}>
            Promoções
          </MenuItem>
          <MenuItem onClick={() => navigate("/moderate-reviews")}>
            Avaliações
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-category")}>
            Categoria
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-brand")}>Marca</MenuItem>
          <MenuItem onClick={() => navigate("/manage-product")}>
            Produto
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-user")}>Usuários</MenuItem>
          <MenuItem onClick={() => navigate("/manage-customer")}>
            Clientes
          </MenuItem>
          <MenuItem onClick={() => navigate("/user-profile")}>Perfis</MenuItem>
        </>
      )}
      {isModerator && (
        <>
          <MenuItem onClick={() => navigate("/moderate-reviews")}>
            Avaliações
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-product")}>
            Produto
          </MenuItem>
        </>
      )}
      {isCustomer && (
        <>
          <MenuItem onClick={() => navigate("/user-profile")}>
            Meus Dados
          </MenuItem>
          <MenuItem onClick={() => navigate("/customer-orders")}>
            Meus Pedidos
          </MenuItem>
          <MenuItem onClick={() => navigate("/customer-review")}>
            Minhas Avaliações
          </MenuItem>
        </>
      )}
      <Divider />
      <MenuItem onClick={() => navigate("/change-password")}>
        Alterar Senha
      </MenuItem>
      <MenuItem
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Sair
      </MenuItem>
    </>
  ) : null;

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
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

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem>
          <Typography variant="h6">BookBrew</Typography>
        </ListItem>
        <Divider />

        <ListItem onClick={() => navigate("/")}>
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText primary="Todos os produtos" />
        </ListItem>

        <ListItem onClick={() => navigate("/questions")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Perguntas Frequentes" />
        </ListItem>

        <ListItem onClick={() => navigate("/contact")}>
          <ListItemIcon>
            <LocalShipping />
          </ListItemIcon>
          <ListItemText primary="Contato" />
        </ListItem>

        <ListItem onClick={() => navigate("/about-us")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Sobre Nós" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            BookBrew
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <Person />
              </IconButton>
            ) : (
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                startIcon={<Person />}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawerContent}
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {menuItems}
      </Menu>

      <Container sx={{ mt: 10, mb: 4 }}>
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
                  images={(product?.productImages ?? []).map((image) =>
                    URL.createObjectURL(
                      base64ToBlob(image.imageData, "image/jpeg")
                    )
                  )}
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
                      Peso: {product.weight} kg | Altura: {product.height} cm |
                      Largura: {product.width} cm | Comprimento:{" "}
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
                          {/* Preço com desconto */}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          justifyContent="center"
                        >
                          {" "}
                          {/* Exibe horizontalmente */}
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
                            {/* Preço original riscado */}
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
                        R$ {product.price.toFixed(2)} {/* Preço sem desconto */}
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
                    onClick={() => product && addToCart(product)}
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
    </Box>
  );
};
