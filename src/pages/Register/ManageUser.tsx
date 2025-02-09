import React, { useState } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableSortLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface UserType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  profile: string;
}

type Order = 'asc' | 'desc';

const validationSchema = yup.object({
  firstName: yup.string().required('Nome é obrigatório'),
  lastName: yup.string().required('Sobrenome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  profile: yup.string().required('Perfil é obrigatório')
});

export const ManageUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof UserType>('firstName');

  const handleRequestSort = (property: keyof UserType) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredAndSortedUsers = React.useMemo(() => {
    return [...users]
      .filter(user => 
        Object.values(user).some(value => 
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
  }, [users, order, orderBy, searchTerm]);

  // Add these state variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Add these handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      cpf: '',
      phone: '',
      profile: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingId) {
          const updatedUsers = users.map(user => 
            user.id === editingId ? { ...values, id: editingId } : user
          );
          setUsers(updatedUsers);
          setEditingId(null);
        } else {
          setUsers([...users, { ...values, id: Date.now() }]);
        }
        formik.resetForm();
      } catch (error) {
        console.error('Operation error:', error);
      }
    },
  });

  const handleEdit = (user: UserType) => {
    setEditingId(user.id);
    formik.setValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      profile: user.profile
    });
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          {editingId ? 'Editar Usuário' : 'Cadastro de Usuário'}
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
              <FormControl fullWidth error={formik.touched.profile && Boolean(formik.errors.profile)}>
                <InputLabel id="profile-label">Perfil</InputLabel>
                <Select
                  labelId="profile-label"
                  id="profile"
                  name="profile"
                  value={formik.values.profile}
                  label="Perfil"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="CUSTOMER">Cliente</MenuItem>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                  <MenuItem value="EMPLOYEE">Funcionário</MenuItem>
                </Select>
              </FormControl>
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
          Usuários Cadastrados
        </Typography>
        
        <TextField
          fullWidth
          id="search"
          label="Buscar usuários"
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
                <TableCell>Perfil</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredAndSortedUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cpf}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.profile}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.id)}>
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
            count={filteredAndSortedUsers.length}
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
