import React from 'react';
import { Box, Paper, TextField, Button, Typography, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const AddressList = ({ addresses, formik }) => {
  const addNewAddress = () => {
    const newAddress = {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      type: '',
      city: '',
      state: '',
      country: ''
    };
    formik.setFieldValue('addresses', [...addresses, newAddress]);
  };

  const removeAddress = (index) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    formik.setFieldValue('addresses', newAddresses);
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    formik.setFieldValue('addresses', newAddresses);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, bgcolor: '#f8f8f8' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Endereços</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={addNewAddress}
          >
            Adicionar Endereço
          </Button>
        </Box>

        {addresses.map((address, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
            <IconButton
              sx={{ position: 'initial', right: 8, top: 8 }}
              onClick={() => removeAddress(index)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name={`addresses.${index}.zipCode`}
                  label="CEP"
                  value={address.zipCode}
                  onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)}
                  error={formik.touched.addresses?.[index]?.zipCode && Boolean(formik.errors.addresses?.[index]?.zipCode)}
                  helperText={formik.touched.addresses?.[index]?.zipCode && formik.errors.addresses?.[index]?.zipCode}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  name={`addresses.${index}.street`}
                  label="Rua"
                  value={address.street}
                  onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                  error={formik.touched.addresses?.[index]?.street && Boolean(formik.errors.addresses?.[index]?.street)}
                  helperText={formik.touched.addresses?.[index]?.street && formik.errors.addresses?.[index]?.street}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name={`addresses.${index}.number`}
                  label="Número"
                  value={address.number}
                  onChange={(e) => handleAddressChange(index, 'number', e.target.value)}
                  error={formik.touched.addresses?.[index]?.number && Boolean(formik.errors.addresses?.[index]?.number)}
                  helperText={formik.touched.addresses?.[index]?.number && formik.errors.addresses?.[index]?.number}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  name={`addresses.${index}.complement`}
                  label="Complemento"
                  value={address.complement}
                  onChange={(e) => handleAddressChange(index, 'complement', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name={`addresses.${index}.neighborhood`}
                  label="Bairro"
                  value={address.neighborhood}
                  onChange={(e) => handleAddressChange(index, 'neighborhood', e.target.value)}
                  error={formik.touched.addresses?.[index]?.neighborhood && Boolean(formik.errors.addresses?.[index]?.neighborhood)}
                  helperText={formik.touched.addresses?.[index]?.neighborhood && formik.errors.addresses?.[index]?.neighborhood}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name={`addresses.${index}.type`}
                  label="Tipo"
                  value={address.type}
                  onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
                  error={formik.touched.addresses?.[index]?.type && Boolean(formik.errors.addresses?.[index]?.type)}
                  helperText={formik.touched.addresses?.[index]?.type && formik.errors.addresses?.[index]?.type}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name={`addresses.${index}.city`}
                  label="Cidade"
                  value={address.city}
                  onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                  error={formik.touched.addresses?.[index]?.city && Boolean(formik.errors.addresses?.[index]?.city)}
                  helperText={formik.touched.addresses?.[index]?.city && formik.errors.addresses?.[index]?.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name={`addresses.${index}.state`}
                  label="Estado"
                  value={address.state}
                  onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                  error={formik.touched.addresses?.[index]?.state && Boolean(formik.errors.addresses?.[index]?.state)}
                  helperText={formik.touched.addresses?.[index]?.state && formik.errors.addresses?.[index]?.state}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name={`addresses.${index}.country`}
                  label="País"
                  value={address.country}
                  onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                  error={formik.touched.addresses?.[index]?.country && Boolean(formik.errors.addresses?.[index]?.country)}
                  helperText={formik.touched.addresses?.[index]?.country && formik.errors.addresses?.[index]?.country}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Paper>
    </Box>
  );
};
