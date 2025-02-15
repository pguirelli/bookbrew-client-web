import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Authentication/Login.tsx";
import { ForgotPassword } from "./pages/Authentication/ForgotPassword.tsx";
import { ForgotEmail } from "./pages/Authentication/ForgotEmail.tsx";
import { ChangePassword } from "./pages/Authentication/ChangePassword.tsx";
import { ResetPassword } from "./pages/Authentication/ResetPassword.tsx";
import { RegisterCustomer } from "./pages/Register/RegisterCustomer.tsx";
import { RegisterUser } from "./pages/Register/RegisterUser.tsx";
import { UserProfile } from "./pages/Register/UserProfile.tsx";
import { ManageCustomer } from "./pages/Register/ManageCustomer.tsx";
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-email" element={<ForgotEmail />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/success" element={<Success />} />
          <Route path="/register-customer" element={<RegisterCustomer />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/manage-customer" element={<ManageCustomer />} />
          <Route path="/manage-user" element={<ManageUser />} />
          <Route path="/manage-brand" element={<ManageBrand />} />
          <Route path="/manage-category" element={<ManageCategory />} />
          <Route path="/manage-product" element={<ManageProduct />} />
          <Route path="/manage-promotion" element={<ManagePromotion />} />
          <Route
            path="/customer-review/:productId"
            element={<CustomerReview />}
          />
          <Route path="/moderate-reviews" element={<ModerateReviews />} />
          <Route path="/register-order" element={<RegisterOrder />} />
          <Route path="/process-order" element={<ProcessOrder />} />
          <Route path="/manage-order" element={<ManageOrder />} />
          <Route path="/customer-orders" element={<CustomerOrders />} />
          <Route path="/" element={<Shopping />} />
          <Route
            path="/product/:id"
            element={<ProductView />}
          />

          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/questions" element={<Questions />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
