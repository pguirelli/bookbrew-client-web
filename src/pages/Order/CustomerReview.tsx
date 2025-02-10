import React from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Rating
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  rating: yup.number().required("Avaliação é obrigatória").min(1).max(5),
  comment: yup.string(),
});

export const CustomerReview = () => {

    const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // API call to save review
      console.log(values);
    },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 800, margin: "0 auto" }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: "center" }}>
          Avaliar Produto
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Rating
                name="rating"
                value={formik.values.rating}
                onChange={(event, newValue) => {
                  formik.setFieldValue("rating", newValue);
                }}
                size="large"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="comment"
                name="comment"
                label="Seu comentário sobre o produto"
                value={formik.values.comment}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit">
                Enviar Avaliação
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
