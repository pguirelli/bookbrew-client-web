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
  TablePagination,
  IconButton,
  Checkbox,
  FormControlLabel,
  TableSortLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import * as yup from "yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface PromotionType {
  id: number;
  description: string;
  productId: number;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  status: boolean;
}

type Order = "asc" | "desc";

const validationSchema = yup.object({
  description: yup.string().required("Descrição é obrigatória"),
  productId: yup.number().required("Produto é obrigatório"),
  discountPercentage: yup
    .number()
    .required("Percentual de desconto é obrigatório")
    .min(0)
    .max(100),
  startDate: yup.date().required("Data inicial é obrigatória"),
  endDate: yup.date().required("Data final é obrigatória"),
  status: yup.boolean(),
});

export const ManagePromotion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof PromotionType>("description");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof PromotionType) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredAndSortedPromotions = React.useMemo(() => {
    return [...promotions]
      .filter(
        (promotion) =>
          promotion.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          promotion.discountPercentage.toString().includes(searchTerm) ||
          (promotion.status ? "ativo" : "inativo").includes(
            searchTerm.toLowerCase()
          )
      )
      .sort((a, b) => {
        if (order === "asc") {
          return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
          return b[orderBy] < a[orderBy] ? -1 : 1;
        }
      });
  }, [promotions, order, orderBy, searchTerm]);

  const formik = useFormik<{
    description: string;
    productId: number;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
    status: boolean;
  }>({
    initialValues: {
      description: "",
      productId: 0,
      discountPercentage: 0,
      startDate: new Date(),
      endDate: new Date(),
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingId) {
          const updatedPromotions = promotions.map((promotion) =>
            promotion.id === editingId
              ? { ...values, id: editingId }
              : promotion
          );
          setPromotions(updatedPromotions);
          setEditingId(null);
        } else {
          setPromotions([...promotions, { ...values, id: Date.now() }]);
        }
        formik.resetForm();
      } catch (error) {
        console.error("Operation error:", error);
      }
    },
  });

  const handleEdit = (promotion: PromotionType) => {
    setEditingId(promotion.id);
    formik.setValues({
      description: promotion.description,
      productId: promotion.productId,
      discountPercentage: promotion.discountPercentage,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      status: promotion.status,
    });
  };

  const handleDelete = (promotionId: number) => {
    setPromotions(
      promotions.filter((promotion) => promotion.id !== promotionId)
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 3, textAlign: "center" }}
        >
          {editingId ? "Editar Promoção" : "Cadastro de Promoção"}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Produto</InputLabel>
                <Select
                  id="productId"
                  name="productId"
                  value={formik.values.productId}
                  label="Produto"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.productId && Boolean(formik.errors.productId)
                  }
                >
                  <MenuItem value={1}>Produto 1</MenuItem>
                  <MenuItem value={2}>Produto 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                id="discountPercentage"
                name="discountPercentage"
                label="Desconto"
                type="number"
                value={formik.values.discountPercentage}
                onChange={formik.handleChange}
                error={
                  formik.touched.discountPercentage &&
                  Boolean(formik.errors.discountPercentage)
                }
                helperText={
                  formik.touched.discountPercentage &&
                  formik.errors.discountPercentage
                }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Data Início"
                  value={formik.values.startDate}
                  onChange={(value) => formik.setFieldValue("startDate", value)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Data Fim"
                  value={formik.values.endDate}
                  onChange={(value) => formik.setFieldValue("endDate", value)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={2}>
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
          Promoções Cadastradas
        </Typography>

        <TextField
          fullWidth
          id="search"
          label="Buscar promoções"
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
                    active={orderBy === "description"}
                    direction={orderBy === "description" ? order : "asc"}
                    onClick={() => handleRequestSort("description")}
                  >
                    Descrição
                  </TableSortLabel>
                </TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Desconto %</TableCell>
                <TableCell>Data Início</TableCell>
                <TableCell>Data Fim</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedPromotions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>{promotion.description}</TableCell>
                    <TableCell>{promotion.productId}</TableCell>
                    <TableCell>{promotion.discountPercentage}%</TableCell>
                    <TableCell>
                      {promotion.startDate.toLocaleString()}
                    </TableCell>
                    <TableCell>{promotion.endDate.toLocaleString()}</TableCell>
                    <TableCell>
                      {promotion.status ? "Ativo" : "Inativo"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(promotion)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(promotion.id)}>
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
            count={filteredAndSortedPromotions.length}
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
