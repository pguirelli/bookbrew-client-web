import React, { useState } from 'react';
import { 
  Box, 
  Paper,
  Button,
  TextField,
  Typography, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  IconButton,
  TableSortLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface CustomerType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  addresses: Array<{
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    type: string;
    city: string;
    state: string;
    country: string;
    complement: string;
  }>;
}

interface AddressType {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  type: string;
  city: string;
  state: string;
  country: string;
  complement: string;
}

type Order = 'asc' | 'desc';

const validationSchema = yup.object({
  firstName: yup.string().required('Nome é obrigatório'),
  lastName: yup.string().required('Sobrenome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  birthDate: yup.date().required('Data de nascimento é obrigatória'),
  addresses: yup.array().of(
    yup.object({
      zipCode: yup.string().required('CEP é obrigatório'),
      street: yup.string().required('Rua é obrigatória'),
      number: yup.string().required('Número é obrigatório'),
      neighborhood: yup.string().required('Bairro é obrigatório'),
      type: yup.string().required('Tipo é obrigatório'),
      city: yup.string().required('Cidade é obrigatória'),
      state: yup.string().required('Estado é obrigatório'),
      country: yup.string().required('País é obrigatório'),
      complement: yup.string()
    })
  ).min(1, 'Adicione pelo menos um endereço')
});

export const ManageCustomer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof CustomerType>('firstName');

  // Add pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Add pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const handleRequestSort = (property: keyof CustomerType) => {
  const isAsc = orderBy === property && order === 'asc';
  setOrder(isAsc ? 'desc' : 'asc');
  setOrderBy(property);
};

    const filteredAndSortedCustomers = React.useMemo(() => {
      return [...customers]
        .filter(customer => 
          Object.values(customer).some(value => 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .sort((a, b) => {
          if (order === 'asc') {
            return a[orderBy] < b[orderBy] ? -1 : 1;
          } else {
            return b[orderBy] < a[orderBy] ? -1 : 1;
          }
        });
    }, [customers, order, orderBy, searchTerm]);


  const formik = useFormik<{
    firstName: string;
    lastName: string;
    email: string;
    cpf: string;
    phone: string;
    birthDate: string;
    addresses: AddressType[];
  }>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      cpf: '',
      phone: '',
      birthDate: '',
      addresses: []
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingId) {
          const updatedCustomers = customers.map(customer => 
            customer.id === editingId ? { ...values, id: editingId } : customer
          );
          setCustomers(updatedCustomers);
          setEditingId(null);
        } else {
          setCustomers([...customers, { ...values, id: Date.now() }]);
        }
        formik.resetForm();
      } catch (error) {
        console.error('Operation error:', error);
      }
    },
  });

  const handleEdit = (customer: CustomerType) => {
    setEditingId(customer.id);
    formik.setValues({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      cpf: customer.cpf,
      phone: customer.phone,
      birthDate: customer.birthDate,
      addresses: customer.addresses
    });
  };
  

  const handleDelete = (customerId: number) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          {editingId ? 'Editar Cliente' : 'Cadastro de Cliente'}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Nome"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Sobrenome"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="cpf"
                name="cpf"
                label="CPF"
                value={formik.values.cpf}
                onChange={formik.handleChange}
                error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                helperText={formik.touched.cpf && formik.errors.cpf}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Telefone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="birthDate"
                name="birthDate"
                label="Data de Nascimento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.birthDate}
                onChange={formik.handleChange}
                error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                helperText={formik.touched.birthDate && formik.errors.birthDate}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant="contained" 
                type="submit" 
                sx={{ mt: 3 }}
              >
                {editingId ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Clientes Cadastrados
        </Typography>
        
        <TextField
          fullWidth
          id="search"
          label="Buscar clientes"
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
                    active={orderBy === 'firstName'}
                    direction={orderBy === 'firstName' ? order : 'asc'}
                    onClick={() => handleRequestSort('firstName')}
                  >
                    Nome
                  </TableSortLabel>
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Data Nascimento</TableCell>
                <TableCell>Endereços</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                  {filteredAndSortedCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.cpf}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.birthDate}</TableCell>
                  <TableCell>{customer.addresses.length} endereço(s)</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(customer)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(customer.id)}>
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
              count={filteredAndSortedCustomers.length}
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
