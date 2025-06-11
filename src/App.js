import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import {
  BasicSettingsPage,
  ContentManagementPage,
  NotificationsPage,
  UserManagementPage
} from './pages/administration';
import DashboardPage from './pages/DashboardPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import SignUpPage from './pages/SignUpPage';
import VerificationSentPage from './pages/VerificationSentPage';

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  // if (loading) {
  //   return <div>Application Loading...</div>;
  // }

  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verification-sent" element={<VerificationSentPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* 公共可访问的Marketplace路由（仅非登录用户访问） */}
      {!isAuthenticated && (
        <Route element={<PublicLayout />}>
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Route>
      )}

      {/* 受保护的路由，需要登录 */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* 登录用户的Marketplace路由 */}
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/administration" element={<AdminLayout />}>
            <Route path="" element={<Navigate to="/administration/basic" replace />} />
            <Route path="basic" element={<BasicSettingsPage title="Look & Feel" />} />
            <Route path="users" element={<UserManagementPage title="User Management" />} />
            <Route path="content" element={<ContentManagementPage title="Content Management" />} />
            <Route path="notifications" element={<NotificationsPage title="Notifications" />} />
          </Route>
          {/* <Route path="/administration/einvoice" element={<EInvoiceSettingsPage title="E-Invoice Settings" />} /> */}
        </Route>

        {/* Administration routes with AdminLayout */}

      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
};

export default App; 