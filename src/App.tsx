import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login/Login.tsx';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword.tsx';
import { ForgotEmail } from './pages/ForgotEmail/ForgotEmail.tsx';
import Success from './pages/Success/Success.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-email" element={<ForgotEmail />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
