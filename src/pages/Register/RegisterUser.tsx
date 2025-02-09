import React from 'react';
import { Box, Paper, TextField, Button, Typography, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const validationSchema = yup.object({
  firstName: yup.string().required('Nome é obrigatório'),
  lastName: yup.string().required('Sobrenome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  profile: yup.string().required('Perfil é obrigatório'),
  password: yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
});

export const RegisterUser = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      cpf: '',
      phone: '',
      profile: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Add your registration API call here
        console.log('Form values:', values);
        navigate('/login');
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 800 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          Cadastro de Usuário
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
                {formik.touched.profile && formik.errors.profile && (
                <Typography variant="caption" color="error">
                    {formik.errors.profile}
                </Typography>
                )}
            </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Senha"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar Senha"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant="contained" 
                type="submit" 
                sx={{ mt: 3 }}
              >
                Cadastrar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
