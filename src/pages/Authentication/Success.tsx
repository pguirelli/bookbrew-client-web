import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/'); // Redirect to login page
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography variant="h3" component="h1" sx={{ mb: 3 }}>
        Bem-vindo ao BookBrew!
      </Typography>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Você está logado com sucesso.
      </Typography>
      <Button variant="contained" onClick={handleLogout}>
        Sair
      </Button>
    </Box>
  );
};

export default Success;
