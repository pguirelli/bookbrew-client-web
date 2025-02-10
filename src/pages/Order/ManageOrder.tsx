import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Reuse the same interfaces from RegisterOrder
interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Address {
  id: number;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  main: boolean;
}

// Reuse the PaymentCardForm component
const PaymentCardForm = ({ type, readOnly = false }: { type: 'credit' | 'debit', readOnly?: boolean }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField 
        fullWidth 
        label="Número do Cartão" 
        name={`${type}CardNumber`}
        InputProps={{ readOnly }}
        required
      />
    </Grid>
    <Grid item xs={6}>
      <TextField 
        fullWidth 
        label="Validade" 
        name={`${type}ExpiryDate`}
        InputProps={{ readOnly }}
        required
      />
    </Grid>
    <Grid item xs={6}>
      <TextField 
        fullWidth 
        label="CVV" 
        name={`${type}Cvv`}
        InputProps={{ readOnly }}
        required
      />
    </Grid>
    <Grid item xs={12}>
      <TextField 
        fullWidth 
        label="Nome no Cartão" 
        name={`${type}HolderName`}
        InputProps={{ readOnly }}
        required
      />
    </Grid>
    {type === 'credit' && (
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Parcelas</InputLabel>
          <Select defaultValue={1} name="installments" disabled={readOnly}>
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}x {i === 0 ? 'sem juros' : 'com juros'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    )}
  </Grid>
);

// Reuse the PaymentPix component
const PaymentPix = ({ readOnly = false }) => (
  <Box textAlign="center">
    <Typography variant="h6">QR Code PIX</Typography>
    <Box sx={{ my: 2, p: 2, border: '1px solid #ccc' }}>
      [QR Code Placeholder]
    </Box>
    <TextField
      fullWidth
      label="Código PIX"
      value="00020126580014br.gov.bcb.pix0136example-key"
      multiline
      rows={2}
      InputProps={{ readOnly: true }}
    />
  </Box>
);

// Reuse the PaymentBoleto component
const PaymentBoleto = ({ readOnly = false }) => (
  <Box textAlign="center">
    <Typography variant="h6">Boleto Bancário</Typography>
    <Box sx={{ my: 2 }}>
      <Button variant="contained" color="primary" disabled={readOnly}>
        Gerar Boleto
      </Button>
    </Box>
  </Box>
);

const validationSchema = yup.object({
  items: yup.array().of(
    yup.object({
      productId: yup.number().required(),
      quantity: yup.number().min(1).required("Quantidade é obrigatória"),
    })
  ),
  addressId: yup.number().required("Selecione um endereço de entrega"),
  paymentMethod: yup.string().required("Selecione um método de pagamento"),
});

export const ManageOrder = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [addresses] = useState<Address[]>([
    {
      id: 1,
      street: "Rua Exemplo",
      number: "123",
      complement: "Apto 101",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01001-000",
      main: true,
    },
  ]);

  const formik = useFormik({
    initialValues: {
      items: [
        {
          productId: 1,
          productName: "Livro 1",
          quantity: 2,
          unitPrice: 29.90,
          subtotal: 59.80,
        },
      ] as OrderItem[],
      addressId: '',
      paymentMethod: '',
      discount: 0,
      status: 'pending',
      customerName: '',
      customerEmail: '',
      customerCPF: '',
      customerPhone: '',
      notes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Order updated:', values);
    },
  });

  const calculateTotalItems = () => {
    return formik.values.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const calculateSubtotal = () => {
    return formik.values.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - formik.values.discount;
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedItems = [...formik.values.items];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].subtotal = newQuantity * updatedItems[index].unitPrice;
    formik.setFieldValue('items', updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue('items', updatedItems);
  };

  const renderPaymentMethod = () => {
    switch (selectedPaymentMethod) {
      case 'credit':
        return <PaymentCardForm type="credit" readOnly />;
      case 'debit':
        return <PaymentCardForm type="debit" readOnly />;
      case 'pix':
        return <PaymentPix readOnly />;
      case 'boleto':
        return <PaymentBoleto readOnly />;
      default:
        return null;
    }
  };

  // Rest of the component remains the same but includes all sections from RegisterOrder
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, margin: "0 auto" }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Modificar Pedido
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Customer Information Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Informações do Cliente</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="customerName"
                        label="Nome do Cliente"
                        value={formik.values.customerName}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="customerEmail"
                        label="Email"
                        value={formik.values.customerEmail}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="customerCPF"
                        label="CPF"
                        value={formik.values.customerCPF}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="customerPhone"
                        label="Phone"
                        value={formik.values.customerPhone}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Items Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Itens do Pedido</Typography>
                  <List>
                    {formik.values.items.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={item.productName}
                          secondary={`R$ ${item.unitPrice.toFixed(2)}`}
                        />
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                          inputProps={{ min: 1 }}
                          sx={{ width: 80, mx: 2 }}
                        />
                        <Typography sx={{ minWidth: 100 }}>
                          R$ {item.subtotal.toFixed(2)}
                        </Typography>
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => handleRemoveItem(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Address Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Endereço de Entrega</Typography>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Selecione um endereço</InputLabel>
                    <Select
                      value={formik.values.addressId}
                      onChange={formik.handleChange}
                      name="addressId"
                    >
                      {addresses.map((address) => (
                        <MenuItem key={address.id} value={address.id}>
                          {`${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Payment Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Pagamento</Typography>
                  <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
                    <InputLabel>Método de Pagamento</InputLabel>
                    <Select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      name="paymentMethod"
                    >
                      <MenuItem value="credit">Cartão de Crédito</MenuItem>
                      <MenuItem value="debit">Cartão de Débito</MenuItem>
                      <MenuItem value="pix">PIX</MenuItem>
                      <MenuItem value="boleto">Boleto</MenuItem>
                    </Select>
                  </FormControl>
                  {renderPaymentMethod()}
                </CardContent>
              </Card>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Resumo do Pedido</Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Quantidade de Itens" />
                      <Typography>{calculateTotalItems()} itens</Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Subtotal" />
                      <Typography>R$ {calculateSubtotal().toFixed(2)}</Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Desconto" />
                      <Typography>R$ {formik.values.discount.toFixed(2)}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText primary="Total" />
                      <Typography variant="h6">
                        R$ {calculateTotal().toFixed(2)}
                      </Typography>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Salvar Alterações
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
