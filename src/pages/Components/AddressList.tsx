import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormikProps } from "formik";
import { ConfirmationDialog } from "../../pages/Components/ConfirmationDialog.tsx";
import { customerService } from "../../services/customer.service.ts";

interface Address {
  id: number;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  type: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
}

interface AddressListProps {
  addresses: Address[];
  formik: FormikProps<any>;
  customerId?: number | null;
}

export const AddressList = ({
  addresses,
  formik,
  customerId,
}: AddressListProps) => {
  const [newAddress, setNewAddress] = useState<Address>({
    id: 0,
    zipCode: "",
    street: "",
    number: "",
    neighborhood: "",
    type: "",
    city: "",
    state: "",
    country: "",
    complement: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<{
    id: number;
    index: number;
  } | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const brazilianStates = [
    { value: "AC", label: "AC" },
    { value: "AL", label: "AL" },
    { value: "AP", label: "AP" },
    { value: "AM", label: "AM" },
    { value: "BA", label: "BA" },
    { value: "CE", label: "CE" },
    { value: "DF", label: "DF" },
    { value: "ES", label: "ES" },
    { value: "GO", label: "GO" },
    { value: "MA", label: "MA" },
    { value: "MT", label: "MT" },
    { value: "MS", label: "MS" },
    { value: "MG", label: "MG" },
    { value: "PA", label: "PA" },
    { value: "PB", label: "PB" },
    { value: "PR", label: "PR" },
    { value: "PE", label: "PE" },
    { value: "PI", label: "PI" },
    { value: "RJ", label: "RJ" },
    { value: "RN", label: "RN" },
    { value: "RS", label: "RS" },
    { value: "RO", label: "RO" },
    { value: "RR", label: "RR" },
    { value: "SC", label: "SC" },
    { value: "SP", label: "SP" },
    { value: "SE", label: "SE" },
    { value: "TO", label: "TO" },
  ];

  const handleAddAddress = async () => {
    try {
      const newAddress = {
        zipCode: "",
        street: "",
        number: "",
        neighborhood: "",
        type: "",
        city: "",
        state: "",
        country: "",
        complement: "",
      };

      const updatedAddresses = [...formik.values.addresses, newAddress];
      formik.setFieldValue("addresses", updatedAddresses);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleDeleteClick = (addressId: number | undefined, index: number) => {
    if (addressId) {
      setAddressToDelete({ id: addressId, index });
      setOpenDialog(true);
    } else {
      const newAddresses = [...formik.values.addresses];
      newAddresses.splice(index, 1);
      formik.setFieldValue("addresses", newAddresses);
    }
  };

  const handleConfirmDelete = async () => {
    if (addressToDelete && customerId) {
      try {
        await customerService.deleteCustomerAddress(
          customerId,
          addressToDelete.id
        );
        const newAddresses = [...formik.values.addresses];
        newAddresses.splice(addressToDelete.index, 1);
        formik.setFieldValue("addresses", newAddresses);
        showSnackbar("Endereço excluído com sucesso!", "success");
      } catch (error) {
        console.error("Error deleting address:", error);
        showSnackbar("Erro ao excluir endereço!", "error");
      }
    }
    setOpenDialog(false);
    setAddressToDelete(null);
  };

  return (
    <Box>
      {addresses.map((address, index) => (
        <Box
          key={index}
          sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={11}>
              <Typography variant="subtitle1">Endereço {index + 1}</Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={() => handleDeleteClick(address.id, index)}
                sx={{
                  color: address.id ? "error.main" : "action.disabled",
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CEP"
                value={address.zipCode}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[index].zipCode = e.target.value;
                  formik.setFieldValue("addresses", newAddresses);
                }}
                error={
                  formik.touched.addresses?.[index]?.zipCode &&
                  Boolean(formik.errors.addresses?.[index]?.zipCode)
                }
                helperText={
                  formik.touched.addresses?.[index]?.zipCode &&
                  formik.errors.addresses?.[index]?.zipCode
                }
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Rua"
                value={address.street}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[index].street = e.target.value;
                  formik.setFieldValue("addresses", newAddresses);
                }}
                error={
                  formik.touched.addresses?.[index]?.street &&
                  Boolean(formik.errors.addresses?.[index]?.street)
                }
                helperText={
                  formik.touched.addresses?.[index]?.street &&
                  formik.errors.addresses?.[index]?.street
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Número"
                value={address.number}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[index].number = e.target.value;
                  formik.setFieldValue("addresses", newAddresses);
                }}
                error={
                  formik.touched.addresses?.[index]?.number &&
                  Boolean(formik.errors.addresses?.[index]?.number)
                }
                helperText={
                  formik.touched.addresses?.[index]?.number &&
                  formik.errors.addresses?.[index]?.number
                }
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Bairro"
                value={address.neighborhood}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[index].neighborhood = e.target.value;
                  formik.setFieldValue("addresses", newAddresses);
                }}
                error={
                  formik.touched.addresses?.[index]?.neighborhood &&
                  Boolean(formik.errors.addresses?.[index]?.neighborhood)
                }
                helperText={
                  formik.touched.addresses?.[index]?.neighborhood &&
                  formik.errors.addresses?.[index]?.neighborhood
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={address.type}
                  label="Tipo"
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[index].type = e.target.value;
                    formik.setFieldValue("addresses", newAddresses);
                  }}
                  error={
                    formik.touched.addresses?.[index]?.type &&
                    Boolean(formik.errors.addresses?.[index]?.type)
                  }
                >
                  <MenuItem value="RESIDENTIAL">Residencial</MenuItem>
                  <MenuItem value="COMMERCIAL">Comercial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Complemento"
                value={address.complement}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[index].complement = e.target.value;
                  formik.setFieldValue("addresses", newAddresses);
                }}
                error={
                  formik.touched.addresses?.[index]?.complement &&
                  Boolean(formik.errors.addresses?.[index]?.complement)
                }
                helperText={
                  formik.touched.addresses?.[index]?.complement &&
                  formik.errors.addresses?.[index]?.complement
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cidade"
                value={address.city}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[index].city = e.target.value;
                  formik.setFieldValue("addresses", newAddresses);
                }}
                error={
                  formik.touched.addresses?.[index]?.city &&
                  Boolean(formik.errors.addresses?.[index]?.city)
                }
                helperText={
                  formik.touched.addresses?.[index]?.city &&
                  formik.errors.addresses?.[index]?.city
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl
                fullWidth
                error={
                  formik.touched.addresses?.[index]?.state &&
                  Boolean(formik.errors.addresses?.[index]?.state)
                }
              >
                <InputLabel>Estado</InputLabel>
                <Select
                  value={address.state}
                  label="Estado"
                  onChange={(e) => {
                    const newAddresses = [...addresses];
                    newAddresses[index].state = e.target.value;
                    formik.setFieldValue("addresses", newAddresses);
                  }}
                >
                  {brazilianStates.map((state) => (
                    <MenuItem key={state.value} value={state.value}>
                      {state.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="País"
                value={address.country}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[index].country = e.target.value;
                  formik.setFieldValue("addresses", newAddresses);
                }}
                error={
                  formik.touched.addresses?.[index]?.country &&
                  Boolean(formik.errors.addresses?.[index]?.country)
                }
                helperText={
                  formik.touched.addresses?.[index]?.country &&
                  formik.errors.addresses?.[index]?.country
                }
              />
            </Grid>
          </Grid>
        </Box>
      ))}
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
        open={openDialog}
        title="Confirmar exclusão"
        message="Deseja realmente excluir este endereço?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDialog(false)}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={handleAddAddress} fullWidth>
          Adicionar Endereço
        </Button>
      </Box>
    </Box>
  );
};
