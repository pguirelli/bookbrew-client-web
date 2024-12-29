import React from 'react';
import { Box, Paper, TextField, Button, Typography, Link } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service.ts';

const validationSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

export const Login = () => {
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await authService.login(values);
        console.log('Login response:', response);
        // Handle successful login (store token, redirect, etc)

        // Check if login was successful and redirect
        if (response.cpf) {
          //localStorage.setItem('token', response.data.token); // Store token
          navigate('/success'); // Redirect to success page
        } else {
          alert('Login não efetuado. Verifique suas credenciais.'); // Show error popup
        }
      } catch (error) {
        // Handle error
        console.error('Login error:', error);
      }
    },
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          BookBrew Login
        </Typography>
        
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Senha"
            type="password"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          
          <Button 
            fullWidth 
            variant="contained" 
            type="submit" 
            sx={{ mt: 3 }}
          >
            Entrar
          </Button>
        </form>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/forgot-password" sx={{ display: 'block', mb: 1 }}>
            Esqueci minha senha
          </Link>
          <Link href="/forgot-email">
            Esqueci meu email
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};
