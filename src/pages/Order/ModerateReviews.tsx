import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Rating,
  TableSortLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

interface ReviewType {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  status: boolean;
  creationDate: Date;
}

type Order = "asc" | "desc";

export const ModerateReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof ReviewType>("creationDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusChange = (reviewId: number) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, status: !review.status } : review
      )
    );
  };

  // Add handleRequestSort function
  const handleRequestSort = (property: keyof ReviewType) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Add sorted and filtered reviews
  const sortedAndFilteredReviews = React.useMemo(() => {
    return [...reviews]
      .filter((review) => {
        const matchesSearch =
          review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.rating.toString().includes(searchTerm);

        const matchesStatus =
          statusFilter === "all"
            ? true
            : statusFilter === "active"
            ? review.status
            : !review.status;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (order === "asc") {
          return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
          return b[orderBy] < a[orderBy] ? -1 : 1;
        }
      });
  }, [reviews, order, orderBy, searchTerm, statusFilter]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 1200, margin: "0 auto" }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
          Moderação de Avaliações
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Buscar avaliações"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Ativos</MenuItem>
                <MenuItem value="inactive">Inativos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "productId"}
                    direction={orderBy === "productId" ? order : "asc"}
                    onClick={() => handleRequestSort("productId")}
                  >
                    Produto
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "rating"}
                    direction={orderBy === "rating" ? order : "asc"}
                    onClick={() => handleRequestSort("rating")}
                  >
                    Avaliação
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "comment"}
                    direction={orderBy === "comment" ? order : "asc"}
                    onClick={() => handleRequestSort("comment")}
                  >
                    Comentário
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "creationDate"}
                    direction={orderBy === "creationDate" ? order : "asc"}
                    onClick={() => handleRequestSort("creationDate")}
                  >
                    Data
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndFilteredReviews
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.productId}</TableCell>
                    <TableCell>
                      <Rating value={review.rating} readOnly />
                    </TableCell>
                    <TableCell>{review.comment}</TableCell>
                    <TableCell>
                      {review.creationDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={review.status}
                        onChange={() => handleStatusChange(review.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={reviews.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Registros por página"
          />
        </TableContainer>
      </Paper>
    </Box>
  );
};
