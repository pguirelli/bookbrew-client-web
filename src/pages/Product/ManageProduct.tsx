import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TableSortLabel,
  TablePagination,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormik } from "formik";
import * as yup from "yup";

interface ProductType {
  id: number;
  code: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  status: boolean;
  weight: number;
  length: number;
  width: number;
  height: number;
  size: number;
  soldQuantity: number;
  category: string;
  brand: string;
  images: string[];
}

type Order = "asc" | "desc";

const validationSchema = yup.object({
  code: yup.string().required("Código é obrigatório"),
  title: yup.string().required("Título é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  price: yup
    .number()
    .positive("Preço deve ser positivo")
    .required("Preço é obrigatório"),
  stock: yup
    .number()
    .min(0, "Estoque não pode ser negativo")
    .required("Estoque é obrigatório"),
  minStock: yup
    .number()
    .min(0, "Estoque mínimo não pode ser negativo")
    .required("Estoque mínimo é obrigatório"),
  status: yup.boolean(),
  weight: yup
    .number()
    .positive("Peso deve ser positivo")
    .required("Peso é obrigatório"),
  length: yup
    .number()
    .positive("Comprimento deve ser positivo")
    .required("Comprimento é obrigatório"),
  width: yup
    .number()
    .positive("Largura deve ser positiva")
    .required("Largura é obrigatória"),
  height: yup
    .number()
    .positive("Altura deve ser positiva")
    .required("Altura é obrigatória"),
  size: yup.string().required("Tamanho é obrigatório"),
  soldQuantity: yup.number().min(0, "Quantidade vendida não pode ser negativa"),
  category: yup.string().required("Categoria é obrigatória"),
  brand: yup.string().required("Marca é obrigatória"),
  images: yup.array().of(yup.string()).min(1, "Adicione pelo menos uma imagem"),
});

export const ManageProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof ProductType>("title");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Add these state variables
  const [categories] = useState([
    "Livros",
    "Revistas",
    "HQs",
    "Mangás",
    "Artigos de Papelaria",
  ]);
  const [brands] = useState([
    "Editora A",
    "Editora B",
    "Editora C",
    "Marca D",
    "Marca E",
  ]);

  const handleRequestSort = (property: keyof ProductType) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredAndSortedProducts = React.useMemo(() => {
    return [...products]
      .filter((product) =>
        Object.values(product).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (order === "asc") {
          return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
          return b[orderBy] < a[orderBy] ? -1 : 1;
        }
      });
  }, [products, order, orderBy, searchTerm]);

  const formik = useFormik<{
    code: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    minStock: number;
    status: boolean;
    weight: number;
    length: number;
    width: number;
    height: number;
    size: number;
    soldQuantity: number;
    category: string;
    brand: string;
    images: string[];
  }>({
    initialValues: {
      code: "",
      title: "",
      description: "",
      price: 0,
      stock: 0,
      minStock: 0,
      status: true,
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      size: 0,
      soldQuantity: 0,
      category: "",
      brand: "",
      images: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingId) {
          const updatedProducts = products.map((product) =>
            product.id === editingId ? { ...values, id: editingId } : product
          );
          setProducts(updatedProducts);
          setEditingId(null);
        } else {
          setProducts([...products, { ...values, id: Date.now() }]);
        }
        formik.resetForm();
      } catch (error) {
        console.error("Operation error:", error);
      }
    },
  });

  const handleEdit = (product: ProductType) => {
    setEditingId(product.id);
    formik.setValues({
      code: product.code,
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      status: product.status,
      weight: product.weight,
      length: product.length,
      width: product.width,
      height: product.height,
      size: product.size,
      soldQuantity: product.soldQuantity,
      category: product.category,
      brand: product.brand,
      images: product.images,
    });
  };

  const handleDelete = (productId: number) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 1200, margin: "0 auto" }}
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
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sm={6} md={4}>
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
                id="minStock"
                name="minStock"
                label="Estoque Mínimo"
                value={formik.values.minStock}
                onChange={formik.handleChange}
                error={
                  formik.touched.minStock && Boolean(formik.errors.minStock)
                }
                helperText={formik.touched.minStock && formik.errors.minStock}
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
            <Grid item xs={12} sm={2.4}>
              <TextField
                fullWidth
                type="number"
                id="size"
                name="size"
                label="Tamanho (cm)"
                value={formik.values.size}
                onChange={formik.handleChange}
                error={formik.touched.size && Boolean(formik.errors.size)}
                helperText={formik.touched.size && formik.errors.size}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  label="Categoria"
                  onChange={formik.handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Marca</InputLabel>
                <Select
                  id="brand"
                  name="brand"
                  value={formik.values.brand}
                  label="Marca"
                  onChange={formik.handleChange}
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Imagens do Produto
              </Typography>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                multiple
                type="file"
                onChange={(event) => {
                  const files = event.target.files;
                  if (files) {
                    const newImages = Array.from(files).map((file) =>
                      URL.createObjectURL(file)
                    );
                    formik.setFieldValue("images", [
                      ...formik.values.images,
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
              {formik.touched.images && formik.errors.images && (
                <Typography color="error" variant="caption">
                  {formik.errors.images as string}
                </Typography>
              )}
              <List>
                {formik.values.images.map((image, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`Imagem ${index + 1}`} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => {
                          const newImages = formik.values.images.filter(
                            (_, i) => i !== index
                          );
                          formik.setFieldValue("images", newImages);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>

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
        sx={{ p: 4, width: "100%", maxWidth: 1200, margin: "0 auto" }}
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
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "code"}
                    direction={orderBy === "code" ? order : "asc"}
                    onClick={() => handleRequestSort("code")}
                  >
                    Código
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "title"}
                    direction={orderBy === "title" ? order : "asc"}
                    onClick={() => handleRequestSort("title")}
                  >
                    Título
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "price"}
                    direction={orderBy === "price" ? order : "asc"}
                    onClick={() => handleRequestSort("price")}
                  >
                    Preço
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "stock"}
                    direction={orderBy === "stock" ? order : "asc"}
                    onClick={() => handleRequestSort("stock")}
                  >
                    Estoque
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={orderBy === "category" ? order : "asc"}
                    onClick={() => handleRequestSort("category")}
                  >
                    Categoria
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "brand"}
                    direction={orderBy === "brand" ? order : "asc"}
                    onClick={() => handleRequestSort("brand")}
                  >
                    Marca
                  </TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
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
                    <TableCell>{`R$ ${product.price.toFixed(2)}`}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>
                      {product.status ? "Ativo" : "Inativo"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product.id)}>
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
            count={filteredAndSortedProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Registros por página"
          />
        </TableContainer>
      </Paper>
    </Box>
  );
};
