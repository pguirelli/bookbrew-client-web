import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  TextField,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Search,
  Category,
  Bookmark,
  LocalShipping,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  brand: string;
}

export const Shopping = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [products] = useState<Product[]>([
    {
      id: 1,
      title: "O Senhor dos Anéis",
      description: "Trilogia completa",
      price: 199.9,
      imageUrl: "/images/lotr.jpg",
      category: "Livros",
      brand: "Editora A",
    },
    // Add more sample products
  ]);

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

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem>
          <Typography variant="h6">BookBrew</Typography>
        </ListItem>
        <Divider />
        <ListItem onClick={() => navigate("/products")}>
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText primary="Produtos" />
        </ListItem>
        <ListItem onClick={() => navigate("/categories")}>
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText primary="Categorias" />
        </ListItem>
        <ListItem onClick={() => navigate("/orders")}>
          <ListItemIcon>
            <LocalShipping />
          </ListItemIcon>
          <ListItemText primary="Meus Pedidos" />
        </ListItem>
        <ListItem onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
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
            <TextField
              size="small"
              placeholder="Buscar..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                width: 300,
              }}
              InputProps={{
                endAdornment: <Search />,
              }}
            />

            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Person />
            </IconButton>
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
        <MenuItem onClick={() => navigate("/profile")}>Meu Perfil</MenuItem>
        <MenuItem onClick={() => navigate("/addresses")}>Endereços</MenuItem>
        <MenuItem onClick={() => navigate("/orders")}>Meus Pedidos</MenuItem>
        <MenuItem onClick={() => navigate("/wishlist")}>
          Lista de Desejos
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/logout")}>Sair</MenuItem>
      </Menu>

      <Container sx={{ mt: 10, mb: 4 }}>
        <Grid container spacing={3}>
          {products
            .filter(
              (product) =>
                product.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                product.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
            .map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {product.title}
                    </Typography>
                    <Typography color="textSecondary">
                      {product.category} - {product.brand}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      R$ {product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Detalhes
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => addToCart(product)}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
  );
};
