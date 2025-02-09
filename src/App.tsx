import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login/Login.tsx';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword.tsx';
import { ForgotEmail } from './pages/ForgotEmail/ForgotEmail.tsx';
import { ChangePassword } from './pages/ChangePassword/ChangePassword.tsx';
import { RegisterCustomer } from './pages/Register/RegisterCustomer.tsx';
import { RegisterUser } from './pages/Register/RegisterUser.tsx';
import { UserProfile } from './pages/Register/UserProfile.tsx';
import { ManageCustomer } from './pages/Register/ManageCustomer.tsx';
import { ManageUser } from './pages/Register/ManageUser.tsx';
import Success from './pages/Success/Success.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-email" element={<ForgotEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/success" element={<Success />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/manage-customer" element={<ManageCustomer />} />
        <Route path="/manage-user" element={<ManageUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
