import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  TableSortLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { productService } from "../../services/product.service.ts";
import { Product } from "../../types/product.types.ts";
import { CategoryProd } from "../../types/product.types.ts";
import { Brand } from "../../types/product.types.ts";
import { ProductImage } from "../../types/product.types.ts";
import { ProductImageDTO } from "../../types/product.types.ts";
import ImageCarousel from "../../pages/Shopping/ImageCarousel.tsx";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { ConfirmationDialog } from "../Components/ConfirmationDialog.tsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { base64ToBlob } from "../../pages/Components/FunctionToConvertBase64Blob.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Esquema de validação centralizado com yup
const validationSchema = yup.object({
  code: yup.string().required("Informe o código do produto"),
  title: yup.string().required("Informe o título do produto"),
  description: yup.string().required("Informe a descrição do produto"),
  price: yup.number().required("Informe o preço do produto"),
  stock: yup.number().required("Informe o estoque do produto"),
  minimumStock: yup.number().required("Informe o estoque mínimo do produto"),
  status: yup.boolean(),
  weight: yup.number().required("Informe o peso do produto"),
  height: yup.number().required("Informe a altura do produto"),
  width: yup.number().required("Informe a largura do produto"),
  length: yup.number().required("Informe o comprimento do produto"),
  idCategory: yup
    .number()
    .min(1, "Selecione uma categoria")
    .required("Selecione uma categoria"),
  idBrand: yup
    .number()
    .min(1, "Selecione uma marca")
    .required("Selecione uma marca"),
});

// Tipo para ordenação
type Order = "asc" | "desc";

export const ManageProduct = () => {
  // Estados gerais
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Product>("title");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { isAuthenticated, user, logout } = useAuthContext();
  const [categories, setCategories] = useState<CategoryProd[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  // Carrega os produtos ao montar o componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Carrega as categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await productService.getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  // Carrega as marcas
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const fetchedBrands = await productService.getAllBrands();
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Erro ao carregar marcas:", error);
      }
    };
    fetchBrands();
  }, []);

  // Configurações do Formik – utilizando o esquema de validação com yup
  const formik = useFormik({
    initialValues: {
      code: "",
      title: "",
      description: "",
      price: 0,
      stock: 0,
      minimumStock: 0,
      status: true,
      weight: 0,
      height: 0,
      width: 0,
      length: 0,
      idCategory: 0,
      idBrand: 0,
      productImages: [] as ProductImage[],
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Monta o objeto produto SEM o campo productImages
        const prod: Product = {
          code: values.code,
          title: values.title,
          description: values.description,
          price: values.price,
          stock: values.stock,
          minimumStock: values.minimumStock,
          status: values.status,
          weight: values.weight,
          height: values.height,
          width: values.width,
          length: values.length,
          category: categories.find((cat) => cat.id === values.idCategory) || {
            id: 0,
            description: "",
            status: false,
          },
          brand: brands.find((mar) => mar.id === values.idBrand) || {
            id: 0,
            description: "",
            status: false,
          },
          // NOTE: productImages não é enviado aqui!
        };

        let productId: number;

        if (editingId) {
          // Atualiza o produto sem imagens
          await productService.updateProduct(editingId, prod);
          productId = editingId;
          await handleUpdateProductImages(productId);
        } else {
          // Cria o produto sem enviar as imagens
          const createdProduct = await productService.createProduct(prod);
          productId = createdProduct.id ?? 1;
        }

        // Após criar ou atualizar o produto, insere as imagens separadamente,
        // transformando cada item em um objeto do tipo ProductImagesSearchDTO.
        if (values.productImages && values.productImages.length > 0) {
          for (const image of values.productImages) {
            if (image instanceof File) {
              const formData = new FormData();
              // Utilize a chave "image" conforme o cURL bem-sucedido
              formData.append("image", image, image.name);
              // Se houver uma descrição associada, use-a;
              // se não, você pode deixar uma string vazia ou atribuir um valor default.
              formData.append("description", image.name || "Img");
              // Utilize a chave "product.id" para enviar o id do produto
              formData.append("product.id", productId.toString());
              // Chamada do serviço para upload de imagem (não passando o productId como parâmetro, pois ele vem no form-data)
              await productService.createProductImage(formData);
            }
          }
          fetchProducts();
          resetForm();
          setEditingId(null);
          showSnackbar("Produto cadastrado com sucesso!", "success");
        }
      } catch (error) {
        console.error("Erro ao cadastrar o produto:", error);
        showSnackbar("Erro ao cadastrar o produto.", "error");
      }
    },
  });

  // Função para exibir a snackbar
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Carregar a lista de produtos
  const fetchProducts = async () => {
    try {
      const fetchedProducts: Product[] = await productService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Falha ao carregar produtos:", error);
    }
  };

  // Abertura do diálogo de confirmação para exclusão
  const openConfirmDialog = (productId: number) => {
    setSelectedProductId(productId);
    setConfirmDialogOpen(true);
  };

  // Fechar o diálogo de confirmação
  const closeConfirmDialog = () => {
    setSelectedProductId(null);
    setConfirmDialogOpen(false);
  };

  // Manuseia a exclusão de produtos
  const handleDelete = async () => {
    if (selectedProductId !== null) {
      try {
        // Para exclusão, primeiro buscamos os detalhes do produto para obter os IDs das imagens.
        const productDetail = await productService.getProduct(
          selectedProductId
        );

        // Caso haja imagens associadas, iteramos para chamar deleteProductImage para cada uma.
        if (
          productDetail.productImages &&
          productDetail.productImages.length > 0
        ) {
          for (const img of productDetail.productImages) {
            // Verifica se o id da imagem está definido
            if (img.id) {
              await productService.deleteProductImage(
                selectedProductId,
                img.id
              );
            }
          }
        }
        // Em seguida, excluir o produto.
        await productService.deleteProduct(selectedProductId);
        fetchProducts();
        closeConfirmDialog();
        showSnackbar("Produto excluído com sucesso!", "success");
        formik.resetForm();
      } catch (error) {
        console.error("Falha ao excluir produto:", error);
        showSnackbar("Erro ao excluir produto.", "error");
      }
    }
  };

  // Filtra e ordena os produtos conforme os critérios selecionados
  const filteredAndSortedProducts = React.useMemo(() => {
    return [...products]
      .filter((product) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.code.toLowerCase().includes(searchLower) ||
          product.title.toLowerCase().includes(searchLower) ||
          product.category.description.toLowerCase().includes(searchLower) ||
          product.brand.description.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          (product.status ? "ativo" : "inativo").includes(searchLower)
        );
      })
      .sort((a, b) => {
        const aValue = a[orderBy] ?? "";
        const bValue = b[orderBy] ?? "";
        if (order === "asc") {
          return aValue < bValue ? -1 : 1;
        } else {
          return bValue < aValue ? -1 : 1;
        }
      });
  }, [products, order, orderBy, searchTerm]);

  // Carrega os dados para edição
  const handleEdit = async (product: Product) => {
    setEditingId(product.id ?? null);
    try {
      const response = await productService.getProduct(product.id ?? 0);
      formik.setValues({
        code: response.code,
        title: response.title,
        description: response.description,
        price: response.price,
        stock: response.stock,
        minimumStock: response.minimumStock,
        status: response.status ?? false,
        weight: response.weight,
        height: response.height,
        width: response.width,
        length: response.length,
        idCategory: response.category.id ?? 0,
        idBrand: response.brand.id ?? 0,
        productImages: response.productImages ?? ([] as ProductImage[]),
      });
    } catch (error) {
      console.error("Erro ao buscar detalhes do produto:", error);
      showSnackbar("Erro ao carregar produto para edição.", "error");
    }
  };

  // Paginação da tabela de produtos
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleUpdateProductImages = async (productId: number) => {
    // a. Executa a exclusão das imagens marcadas
    for (const imageId of deletedImageIds) {
      try {
        await productService.deleteProductImage(productId, imageId);
      } catch (error) {
        console.error("Erro ao excluir imagem com id:", imageId, error);
        // Opcionalmente, tratar erro (exibir snackbar, etc)
      }
    }

    // b. Executa a inclusão das novas imagens (apenas objetos File)
    if (formik.values.productImages && formik.values.productImages.length > 0) {
      for (const image of formik.values.productImages) {
        if (image instanceof File) {
          try {
            const formData = new FormData();
            formData.append("image", image, image.name);
            formData.append("description", image.name || "Img");
            formData.append("product.id", productId.toString());
            await productService.createProductImage(formData);
          } catch (error) {
            console.error("Erro ao criar imagem:", error);
            // Opcionalmente, tratar erro (exibir snackbar, etc)
          }
        }
      }
    }
    // Limpe o estado dos IDs marcados após a operação
    setDeletedImageIds([]);
  };

    const handleRequestSort = (property: keyof Product) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MenuItemsSummCustomer
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
        <Box sx={{ mt: 4 }} />

        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 3, textAlign: "center" }}
          >
            {editingId ? "Editar Produto" : "Cadastro de Produto"}
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="code"
                  name="code"
                  label="Código"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={7}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Título"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="status"
                      name="status"
                      checked={formik.values.status}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Status"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="description"
                  name="description"
                  label="Descrição"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormControl
                  fullWidth
                  error={
                    formik.touched.idCategory &&
                    Boolean(formik.errors.idCategory)
                  }
                >
                  {" "}
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    id="idCategory"
                    name="idCategory"
                    value={formik.values.idCategory}
                    label="Categoria"
                    onChange={formik.handleChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormControl
                  fullWidth
                  error={
                    formik.touched.idBrand && Boolean(formik.errors.idBrand)
                  }
                >
                  {" "}
                  <InputLabel>Marca</InputLabel>
                  <Select
                    id="idBrand"
                    name="idBrand"
                    value={formik.values.idBrand}
                    label="Marca"
                    onChange={formik.handleChange}
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  id="price"
                  name="price"
                  label="Preço"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  id="stock"
                  name="stock"
                  label="Estoque"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  error={formik.touched.stock && Boolean(formik.errors.stock)}
                  helperText={formik.touched.stock && formik.errors.stock}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  id="minimumStock"
                  name="minimumStock"
                  label="Estoque Mínimo"
                  value={formik.values.minimumStock}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.minimumStock &&
                    Boolean(formik.errors.minimumStock)
                  }
                  helperText={
                    formik.touched.minimumStock && formik.errors.minimumStock
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2.4}>
                <TextField
                  fullWidth
                  type="number"
                  id="weight"
                  name="weight"
                  label="Peso (kg)"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  error={formik.touched.weight && Boolean(formik.errors.weight)}
                  helperText={formik.touched.weight && formik.errors.weight}
                />
              </Grid>
              <Grid item xs={12} sm={2.4}>
                <TextField
                  fullWidth
                  type="number"
                  id="length"
                  name="length"
                  label="Comprimento (cm)"
                  value={formik.values.length}
                  onChange={formik.handleChange}
                  error={formik.touched.length && Boolean(formik.errors.length)}
                  helperText={formik.touched.length && formik.errors.length}
                />
              </Grid>
              <Grid item xs={12} sm={2.4}>
                <TextField
                  fullWidth
                  type="number"
                  id="width"
                  name="width"
                  label="Largura (cm)"
                  value={formik.values.width}
                  onChange={formik.handleChange}
                  error={formik.touched.width && Boolean(formik.errors.width)}
                  helperText={formik.touched.width && formik.errors.width}
                />
              </Grid>
              <Grid item xs={12} sm={2.4}>
                <TextField
                  fullWidth
                  type="number"
                  id="height"
                  name="height"
                  label="Altura (cm)"
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  error={formik.touched.height && Boolean(formik.errors.height)}
                  helperText={formik.touched.height && formik.errors.height}
                />
              </Grid>

              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  width: "100%",
                  maxWidth: 800,
                  margin: "0 auto",
                  minHeight: 500, 
                  overflow: "hidden",
                  mt: 4,
                }}
              >
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ mb: 3, textAlign: "center" }}
                >
                  Imagens do Produto
                </Typography>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={12} md={6}>
                    <ImageCarousel
                      images={
                        formik.values.productImages
                          ?.map((image) => {
                            const blob = base64ToBlob(
                              image.imageData,
                              "image/jpeg"
                            );
                            if (blob) {
                              return URL.createObjectURL(blob);
                            }
                            if (image instanceof File) {
                              // Se a imagem for um objeto File, cria uma URL diretamente
                              return URL.createObjectURL(image);
                            }
                            if (image.imageData) {
                              // Quando editamos o produto, o backend pode retornar a URL da imagem na propriedade 'path'
                              return image.imageData;
                            } else if (typeof image === "string") {
                              return image;
                            }
                          })
                          .filter((url): url is string => url !== null) ?? []
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="image-upload"
                      multiple
                      type="file"
                      onChange={(event) => {
                        const files = event.target.files;
                        if (files) {
                          // Armazena os objetos File diretamente
                          const newImages = Array.from(files);
                          formik.setFieldValue("productImages", [
                            ...(formik.values.productImages ?? []),
                            ...newImages,
                          ]);
                        }
                      }}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                      >
                        Adicionar Imagens
                      </Button>
                    </label>
                    {formik.touched.productImages &&
                      formik.errors.productImages && (
                        <Typography color="error" variant="caption">
                          {formik.errors.productImages as string}
                        </Typography>
                      )}
                    <List>
                      {(formik.values.productImages ?? []).map(
                        (productImages, index) => (
                          <ListItem
                            key={index}
                            sx={{ width: "75%", display: "inline-block" }}
                          >
                            <ListItemText primary={`Imagem ${index + 1}`} />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => {
                                  // Se a imagem for persistida, grava seu id
                                  if (!(productImages instanceof File) && productImages.id) {
                                    setDeletedImageIds((prev) => [...prev, productImages.id?? 0]);
                                  }
                                  const newImages = (
                                    formik.values.productImages ?? []
                                  ).filter((_, i) => i !== index);
                                  formik.setFieldValue(
                                    "productImages",
                                    newImages
                                  );
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        )
                      )}
                    </List>
                  </Grid>
                </Grid>
              </Paper>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3 }}
                >
                  {editingId ? "Atualizar" : "Cadastrar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Produtos Cadastrados
          </Typography>

          <TextField
            fullWidth
            id="search"
            label="Buscar produtos"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "title"}
                      direction={orderBy === "title" ? order : "asc"}
                      onClick={() => handleRequestSort("title")}
                    >
                      Título
                    </TableSortLabel>
                    </TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Estoque</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>{product.category.description}</TableCell>
                      <TableCell>{product.brand.description}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(product)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            product.id !== undefined &&
                            openConfirmDialog(product.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Registros por página"
            />
          </TableContainer>
        </Paper>
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
        <ConfirmationDialog
          open={confirmDialogOpen}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este produto?"
          onConfirm={handleDelete}
          onCancel={closeConfirmDialog}
        />
      </Box>
      <Footer />
    </Box>
  );
};
