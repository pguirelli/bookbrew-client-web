import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Badge,
  Menu,
  TextField,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Search,
  Category,
  LocalShipping,
  Settings,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { Product } from "../../types/product.types.ts";
import { productService } from "../../services/product.service.ts";
import ImageCarousel from "../../pages/Shopping/ImageCarousel.tsx";
import { Brand } from "../../types/product.types";
import { CategoryProd } from "../../types/product.types";
import { MenuItemsManagement } from "../../pages/Components/MenuItemsManagement.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { base64ToBlob } from "../../pages/Components/FunctionToConvertBase64Blob.tsx";
import { useCart } from '../../contexts/CartProvider.tsx';

function discountedPrice(price: number, discount: number): number {
  if (discount > 0) {
    const discountAmount = (price * discount) / 100;
    return price - discountAmount;
  }
  return price;
}

export const Shopping = () => {
  const navigate = useNavigate();
  const { state, addItemToCart } = useCart();
  const { isAuthenticated, user, logout } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productsOpen, setProductsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<CategoryProd[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showBestSellers, setShowBestSellers] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productService.getAllProducts();
        let filteredProducts = fetchedProducts;

        if (showBestSellers) {
          filteredProducts = fetchedProducts
            .sort((a, b) => (b.salesQuantity || 0) - (a.salesQuantity || 0))
            .slice(0, 30); // Pega apenas os 30 mais vendidos
        } else {
          filteredProducts = fetchedProducts.filter((product) => {
            const matchesBrand = selectedBrand
              ? product.brand?.id === selectedBrand
              : true;
            const matchesCategory = selectedCategory
              ? product.category?.id === selectedCategory
              : true;
            return matchesBrand && matchesCategory;
          });
        }

        setProductsList(filteredProducts);
      } catch (error) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedBrand, selectedCategory, showBestSellers]);

  useEffect(() => {
    const fetchBrands = async () => {
      const fetchedBrands = await productService.getAllBrands();
      setBrands(fetchedBrands);
    };

    fetchBrands();
  }, []);

  
  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await productService.getAllCategories();
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productService.getAllProducts();
        setProductsList(fetchedProducts); // Atualiza o estado com os produtos da API
      } catch (error) {
        setError("Failed to fetch products"); // Se ocorrer erro, armazena a mensagem de erro
      } finally {
        setLoading(false); // Desativa o carregamento
      }
    };

    fetchProducts(); // Chama a função para buscar os produtos
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Mostra a mensagem de carregamento
  }

  if (error) {
    return <div>{error}</div>; // Exibe a mensagem de erro
  }

  const handleAddToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
    addItemToCart(product);
  };

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
      navigate("/cart");
    }
  };

  const handleProductsClick = () => {
    setProductsOpen(!productsOpen);
    if (!productsOpen) {
      setCategoriesOpen(false);
    }
  };

  const handleCategoriesClick = () => {
    setCategoriesOpen(!categoriesOpen);
    if (!categoriesOpen) {
      setProductsOpen(false);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event: SelectChangeEvent) => {
    setItemsPerPage(Number(event.target.value));
    setPage(1);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const getSortedProducts = () => {
    const sortedProducts = [...productsList];
    switch (sortBy) {
      case "price-high":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "price-low":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "discount":
        return sortedProducts.sort(
          (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)
        );
      case "bestseller":
        return sortedProducts.sort(
          (a, b) => (b.salesQuantity || 0) - (a.salesQuantity || 0)
        );
      default:
        return sortedProducts;
    }
  };

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = getSortedProducts().slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem>
          <Typography variant="h6">BookBrew</Typography>
        </ListItem>
        <Divider />

        <ListItem
          onClick={() => {
            setShowBestSellers(false);
            setSelectedBrand(null);
            setSelectedCategory(null);
            setPage(1); // Redefine a paginação
            setSortBy(""); // Redefine a ordenação
            setDrawerOpen(false); // Fecha o menu
          }}
        >
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText primary="Todos os produtos" />
        </ListItem>

        <div>
          <ListItem onClick={handleProductsClick}>
            <ListItemIcon>
              <Category />
            </ListItemIcon>
            <ListItemText primary="Marcas" />
            {productsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={productsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {brands.map((brand) => (
                <ListItem
                  key={brand.id}
                  sx={{ pl: 4 }}
                  onClick={() => {
                    if (brand.id !== undefined) {
                      setSelectedBrand(brand.id);
                    }
                    setSelectedCategory(null);
                    setShowBestSellers(false);
                    setPage(1); // Redefine a paginação
                    setSortBy(""); // Redefine a ordenação
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={brand.description} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </div>

        <div>
          <ListItem onClick={handleCategoriesClick}>
            <ListItemIcon>
              <Category />
            </ListItemIcon>
            <ListItemText primary="Categorias" />
            {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {categories.map((categoryProd) => (
                <ListItem
                  key={categoryProd.id}
                  sx={{ pl: 4 }}
                  onClick={() => {
                    if (categoryProd.id !== undefined) {
                      setSelectedCategory(categoryProd.id);
                    }
                    setSelectedBrand(null);
                    setShowBestSellers(false);
                    setPage(1); // Redefine a paginação
                    setSortBy(""); // Redefine a ordenação
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={categoryProd.description} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </div>

        <ListItem
          onClick={() => {
            setShowBestSellers(true);
            setSelectedBrand(null);
            setSelectedCategory(null);
            setPage(1); // Redefine a paginação
            setSortBy(""); // Redefine a ordenação
            setDrawerOpen(false); // Fecha o menu
          }}
        >
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Mais Vendidos" />
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
        <MenuItemsManagement
          user={user}
          isAuthenticated={isAuthenticated}
          logout={logout}
        />
      </Menu>

      <Container sx={{ mt: 10, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Ordenar por"
            >
              <MenuItem value="price-high">Maior Valor</MenuItem>
              <MenuItem value="price-low">Menor Valor</MenuItem>
              <MenuItem value="discount">Maior Desconto</MenuItem>
              <MenuItem value="bestseller">Mais Vendidos</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {currentItems
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
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={3}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        align="center"
                        gutterBottom
                        variant="h6"
                        component="h2"
                      >
                        {product.title}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        align="center"
                        gutterBottom
                      >
                        {product.category?.description} -{" "}
                        {product.brand?.description}
                      </Typography>
                      <div>
                        {(product.discountPercentage ?? 0) > 0 ? (
                          <>
                            <Typography
                              variant="h5"
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
                            <Box display="flex" alignItems="center" gap={2}>
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
                            R$ {product.price.toFixed(2)}{" "}
                            {/* Preço sem desconto */}
                          </Typography>
                        )}
                      </div>
                    </CardContent>
                  </Box>
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "2px",
                    }}
                  >
                    <Button
                      size="small"
                      sx={{
                        height: "100%",
                        color: "#fff",
                        backgroundColor: "#1976d2",
                        marginRight: "2px",
                        flex: 1,
                        "&:hover": {
                          backgroundColor: "#34e8eb",
                        },
                      }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Detalhes
                    </Button>
                    <Button
                      size="small"
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
                      onClick={() => handleAddToCart(product)}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            mt: 4,
          }}
        >
          <Select
            size="small"
            value={itemsPerPage.toString()}
            onChange={handleItemsPerPageChange}
          >
            <MenuItem value={20}>20 itens</MenuItem>
            <MenuItem value={30}>30 itens</MenuItem>
          </Select>

          <Pagination
            count={Math.ceil(productsList.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>

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

      <Footer />
    </Box>
  );
};
