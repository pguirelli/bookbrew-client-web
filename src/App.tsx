import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Authentication/Login.tsx";
import { ForgotPassword } from "./pages/Authentication/ForgotPassword.tsx";
import { ForgotEmail } from "./pages/Authentication/ForgotEmail.tsx";
import { ChangePassword } from "./pages/Authentication/ChangePassword.tsx";
import { ResetPassword } from "./pages/Authentication/ResetPassword.tsx";
import { RegisterCustomer } from "./pages/Register/RegisterCustomer.tsx";
import { RegisterUser } from "./pages/Register/RegisterUser.tsx";
import { ManageUserProfile } from "./pages/Register/ManageUserProfile.tsx";
import { ManageCustomer } from "./pages/Register/ManageCustomer.tsx";
import { CustomerProfile } from "./pages/Register/CustomerProfile.tsx";
import { ManageUser } from "./pages/Register/ManageUser.tsx";
import { ManageBrand } from "./pages/Product/ManageBrand.tsx";
import { ManageCategory } from "./pages/Product/ManageCategory.tsx";
import { ManageProduct } from "./pages/Product/ManageProduct.tsx";
import { ManagePromotion } from "./pages/Order/ManagePromotion.tsx";
import { CustomerReview } from "./pages/Order/CustomerReview.tsx";
import { ModerateReviews } from "./pages/Order/ModerateReviews.tsx";
import { RegisterOrder } from "./pages/Order/RegisterOrder.tsx";
import { ProcessOrder } from "./pages/Order/ProcessOrder.tsx";
import { ManageOrder } from "./pages/Order/ManageOrder.tsx";
import { CustomerOrders } from "./pages/Order/CustomerOrders.tsx";
import { Shopping } from "./pages/Shopping/Shopping.tsx";
import Success from "./pages/Authentication/Success.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { AboutUs } from "./pages/Information/AboutUs.tsx";
import { Contact } from "./pages/Information/Contact.tsx";
import { Questions } from "./pages/Information/Questions.tsx";
import { ProductView } from "./pages/Shopping/ProductView.tsx";
import { Cart } from "./pages/Shopping/Cart.tsx";
import { CartProvider } from "./contexts/CartProvider.tsx";
import { PrivateRoute } from "./contexts/PrivateRoute.tsx";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-email" element={<ForgotEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/success" element={<Success />} />
            <Route path="/register-customer" element={<RegisterCustomer />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/" element={<Shopping />} />
            {/* Rotas protegidas */}
            <Route
              path="/register-user"
              element={
                <PrivateRoute>
                  <RegisterUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <PrivateRoute>
                  <ManageUserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer-profile"
              element={
                <PrivateRoute>
                  <CustomerProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-customer"
              element={
                <PrivateRoute>
                  <ManageCustomer />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-user"
              element={
                <PrivateRoute>
                  <ManageUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-brand"
              element={
                <PrivateRoute>
                  <ManageBrand />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-category"
              element={
                <PrivateRoute>
                  <ManageCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-product"
              element={
                <PrivateRoute>
                  <ManageProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-promotion"
              element={
                <PrivateRoute>
                  <ManagePromotion />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer-review/:productId"
              element={
                <PrivateRoute>
                  <CustomerReview />
                </PrivateRoute>
              }
            />
            <Route
              path="/moderate-reviews"
              element={
                <PrivateRoute>
                  <ModerateReviews />
                </PrivateRoute>
              }
            />
            <Route
              path="/register-order"
              element={
                <PrivateRoute>
                  <RegisterOrder />
                </PrivateRoute>
              }
            />
            <Route
              path="/process-order"
              element={
                <PrivateRoute>
                  <ProcessOrder />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-order"
              element={
                <PrivateRoute>
                  <ManageOrder />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer-orders"
              element={
                <PrivateRoute>
                  <CustomerOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <PrivateRoute>
                  <ProductView />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
