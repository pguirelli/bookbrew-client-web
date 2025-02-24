import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Rating,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { ConfirmationDialog } from "../../pages/Components/ConfirmationDialog.tsx";
import { Footer } from "../../pages/Components/Footer.tsx";
import { MenuItemsSummCustomer } from "../../pages/Components/MenuItemsSummCustomer.tsx";
import { orderService } from "../../services/order.service.ts";
import { productService } from "../../services/product.service.ts";
import { customerService } from "../../services/customer.service.ts";
import { userService } from "../../services/user.service.ts";
import { ProductReviewDTO } from "../../types/order.types.ts";
import { Product } from "../../types/product.types.ts";
import { User } from "../../types/user.types.ts";
import ImageCarousel from "../../pages/Shopping/ImageCarousel.tsx";
import { base64ToBlob } from "../../pages/Components/FunctionToConvertBase64Blob.tsx";

type OrderByType = "user" | "product" | "rating" | "status" | null;
type OrderDirection = "asc" | "desc";

const validationSchema = yup.object({
  comment: yup.string().required("Comentário é obrigatório"),
  rating: yup.number().min(1).max(5).required("Avaliação é obrigatória"),
});

export const CustomerReview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<ProductReviewDTO[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [orderBy, setOrderBy] = useState<OrderByType>(null);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isAuthenticated, user, logout } = useAuthContext();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [users, setUsers] = useState<Map<number, User>>(new Map());
  const [products, setProducts] = useState<Map<number, Product>>(new Map());
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  const handleNewReview = (product: Product) => {
    setSelectedProduct(product);
    setShowReviewForm(true);
    setEditingId(null);
    formik.resetForm();
    formik.setFieldValue("productId", product.id);
    formik.setFieldValue("userId", user?.id);
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setSelectedProduct(null);
    setEditingId(null);
    formik.resetForm();
  };

  const handleRequestSort = (property: OrderByType) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortReviews = (reviews: ProductReviewDTO[]) => {
    if (!orderBy) return reviews;

    return [...reviews].sort((a, b) => {
      const direction = orderDirection === "asc" ? 1 : -1;

      switch (orderBy) {
        case "rating":
          return (a.rating - b.rating) * direction;

        case "status":
          return (Number(a.status) - Number(b.status)) * direction;

        default:
          return 0;
      }
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchReviews();
      await fetchAvailableProducts();
    };

    loadData();
  }, []);

  const fetchUserData = async (userId: number) => {
    try {
      const userData = await userService.getUserById(userId);
      setUsers((prev) => new Map(prev).set(userId, userData));
    } catch (error) {
      console.error(`Erro ao carregar dados do usuário ${userId}:`, error);
    }
  };

  const fetchProductData = async (idProduct: number) => {
    try {
      const productData = await productService.getProductById(idProduct);
      setProducts((prev) => new Map(prev).set(idProduct, productData));
    } catch (error) {
      console.error(`Erro ao carregar dados do usuário ${idProduct}:`, error);
    }
  };

  const fetchReviews = async () => {
    try {
      const fetchedReviews = await orderService.getReviewsByUser(user?.id ?? 0);
      setReviews(fetchedReviews);

      fetchedReviews.forEach((review) => {
        if (review.userId) {
          fetchUserData(review.userId);
        }
        if (review.productId) {
          fetchProductData(review.productId);
        }
      });
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      let customer = await customerService.getCustomerByUserId(user?.id ?? 0);
      const userOrders = await orderService.getOrdersByCustomer(
        customer?.id ?? 0
      );

      const orderedProductIds = new Set(
        userOrders.flatMap(
          (order) => order.orderItems?.map((item) => item.productId) ?? []
        )
      );

      const productPromises = Array.from(orderedProductIds).map((id) =>
        productService.getProductById(id)
      );

      const products = await Promise.all(productPromises);

      const reviewedProductIds = new Set(
        reviews.map((review) => review.productId)
      );

      const availableToReview = products.filter(
        (product) => !reviewedProductIds.has(product.id ?? 0)
      );

      setAvailableProducts(availableToReview);
    } catch (error) {
      console.error("Erro ao carregar produtos disponíveis:", error);
    }
  };

  const handleEdit = (review: ProductReviewDTO) => {
    setEditingId(review.id ?? null);
    formik.setValues({
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
    });
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const openConfirmDialog = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setConfirmDialogOpen(true);
  };

  const handleCreateOrUpdateReview = async (values: ProductReviewDTO) => {
    try {
      if (editingId) {
        await orderService.updateReview(editingId, values);
        showSnackbar("Avaliação atualizada com sucesso!", "success");
      } else {
        await orderService.createReview(values);
        showSnackbar("Avaliação cadastrada com sucesso!", "success");
      }
      fetchReviews();
      formik.resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Operation error:", error);
      showSnackbar("Erro na operação!", "error");
    }
  };

  const closeConfirmDialog = () => {
    setSelectedReviewId(null);
    setConfirmDialogOpen(false);
  };

  const handleDelete = async () => {
    if (selectedReviewId !== null) {
      try {
        await orderService.deleteReview(selectedReviewId);
        showSnackbar("Avaliação excluída com sucesso!", "success");
        fetchReviews();
        closeConfirmDialog();
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const filterReviews = (reviews: ProductReviewDTO[], searchTerm: string) => {
    if (!searchTerm) return reviews;

    const searchLower = searchTerm.toLowerCase().trim();

    return reviews.filter((review) => {
      const userName = users.get(review.userId)?.name?.toLowerCase() || "";
      const productTitle =
        products.get(review.productId)?.title?.toLowerCase() || "";
      const comment = review.comment?.toLowerCase() || "";

      return (
        userName.includes(searchLower) ||
        productTitle.includes(searchLower) ||
        comment.includes(searchLower)
      );
    });
  };

  const handleCancel = async () => {
    formik.resetForm();
    setEditingId(null);
  };

  const formik = useFormik<ProductReviewDTO>({
    initialValues: {
      userId: 0,
      productId: 0,
      rating: 0,
      comment: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: handleCreateOrUpdateReview,
  });

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
        <Box sx={{ mt: 1 }} />
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Minhas Avaliações
            </Typography>

            {showReviewForm && selectedProduct && (
              <Paper elevation={3} sx={{ p: 3, mb: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {editingId ? "Editar Avaliação" : "Nova Avaliação"}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <ImageCarousel
                      images={(selectedProduct?.productImages ?? [])
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
                    <Typography variant="subtitle1"></Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <form onSubmit={formik.handleSubmit}>
                      <Box sx={{ mb: 2 }}>
                        <Typography component="legend">
                          Sua avaliação
                        </Typography>
                        <Rating
                          name="rating"
                          value={formik.values.rating}
                          onChange={(_, value) =>
                            formik.setFieldValue("rating", value)
                          }
                        />
                        {formik.touched.rating && formik.errors.rating && (
                          <Typography color="error" variant="caption">
                            {formik.errors.rating}
                          </Typography>
                        )}
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name="comment"
                        label="Seu comentário"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.comment &&
                          Boolean(formik.errors.comment)
                        }
                        helperText={
                          formik.touched.comment && formik.errors.comment
                        }
                        sx={{ mb: 2 }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button variant="outlined" onClick={handleCancelReview}>
                          Cancelar
                        </Button>
                        <Button variant="contained" type="submit">
                          {editingId ? "Atualizar" : "Enviar"} Avaliação
                        </Button>
                      </Box>
                    </form>
                  </Grid>
                </Grid>
              </Paper>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 3, mt: 4 }}>
              <Typography variant="h6" gutterBottom align="center">
                Produtos Disponíveis para Avaliação
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {availableProducts
                  .filter(
                    (product) =>
                      !reviews.some((review) => review.productId === product.id)
                  )
                  .map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Card
                          sx={{
                            width: "100%",
                            maxWidth: 300,
                            height: 150,
                            overflow: "hidden",
                          }}
                        >
                          {product.productImages?.[0] ? (
                            <img
                              src={URL.createObjectURL(
                                base64ToBlob(
                                  product.productImages[0].imageData,
                                  "image/jpeg"
                                )!
                              )}
                              style={{
                                width: "100%",
                              }}
                            />
                          ) : (
                            <img
                              src="/landscape-placeholder.png"
                              alt="Placeholder"
                              style={{
                                width: "100%",
                              }}
                            />
                          )}
                        </Card>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" align="center">
                            {product.title}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleNewReview(product)}
                          >
                            Avaliar Produto
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            </Paper>

            <Box sx={{ mt: 1 }} />
            {(editingId || formik.values.comment) && (
              <Paper
                elevation={3}
                sx={{ p: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}
              >
                <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                  {editingId ? "Moderar Avaliação" : "Visualizar Avaliação"}
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Avaliação feita por:{" "}
                        {users.get(formik.values.userId)?.name}{" "}
                        {users.get(formik.values.userId)?.lastName}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ mb: 2 }}
                      >
                        Produto: {""}
                        {products.get(formik.values.productId)?.title ??
                          `Produto #${formik.values.productId}`}
                      </Typography>
                      <Rating
                        name="rating"
                        value={Number(formik.values.rating)}
                        onChange={(event, newValue) => {
                          formik.setFieldValue("rating", newValue);
                        }}
                        precision={1}
                        size="large"
                        readOnly={!editingId}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="comment"
                        name="comment"
                        label="Comentário"
                        multiline
                        rows={4}
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.comment &&
                          Boolean(formik.errors.comment)
                        }
                        helperText={
                          formik.touched.comment && formik.errors.comment
                        }
                        InputProps={{
                          readOnly: !editingId,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
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

                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      {editingId ? (
                        <>
                          <Button variant="outlined" onClick={handleCancel}>
                            Cancelar
                          </Button>
                          <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                          >
                            Salvar Alterações
                          </Button>
                        </>
                      ) : (
                        <Button variant="outlined" onClick={handleCancel}>
                          Fechar
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            )}

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mb: 3 }}
                align="center"
              >
                Moderação de Avaliações
              </Typography>

              <TextField
                fullWidth
                id="search"
                label="Buscar avaliações"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuário</TableCell>
                      <TableCell>Produto</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "rating"}
                          direction={
                            orderBy === "rating" ? orderDirection : "asc"
                          }
                          onClick={() => handleRequestSort("rating")}
                        >
                          Avaliação
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Comentário</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "status"}
                          direction={
                            orderBy === "status" ? orderDirection : "asc"
                          }
                          onClick={() => handleRequestSort("status")}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortReviews(filterReviews(reviews, searchTerm))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            {" "}
                            {users.get(review.userId)?.name ||
                              `Usuário #${review.userId}`}
                          </TableCell>
                          <TableCell>
                            {" "}
                            {products.get(review.productId)?.title ||
                              `Usuário #${review.productId}`}
                          </TableCell>
                          <TableCell>
                            <Rating value={review.rating} readOnly />
                          </TableCell>
                          <TableCell>{review.comment}</TableCell>
                          <TableCell>
                            {review.status ? "Ativo" : "Inativo"}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleEdit(review)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                review.id && openConfirmDialog(review.id)
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
                  count={filterReviews(reviews, searchTerm).length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  labelRowsPerPage="Registros por página"
                />
              </TableContainer>
            </Paper>
          </Paper>
        </Container>
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
          message="Tem certeza que deseja excluir esta avaliação?"
          onConfirm={handleDelete}
          onCancel={closeConfirmDialog}
        />
      </Box>
      <Footer />
    </Box>
  );
};
