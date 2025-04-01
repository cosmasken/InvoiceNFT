import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserTypeSelection from './pages/UserTypeSelection';
import OnboardingSeller from './pages/OnboardingSeller';
import OnboardingBuyer from './pages/OnboardingBuyer';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import CreateInvoice from './pages/CreateInvoice';
import CreateInvoiceNFT from './pages/CreateInvoiceNFT';
import InvoiceDetails from './pages/InvoiceDetails';
import Transactions from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';
import InvestorDashboard from './pages/InvestorDashboard';
import UnderwritingApplication from './pages/UnderwritingApplication';
import LoanApplication from './pages/LoanApplication';
import UnderwriterDashboard from './pages/UnderwriterDashboard';
import { useStore } from './store/useStore';

function App() {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);

  const shouldShowOnboarding = isAuthenticated && user && !user.onboardingCompleted;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/select-type" replace />} />
        <Route path="/select-type" element={isAuthenticated ? <UserTypeSelection /> : <Navigate to="/login" replace />} />

        {/* Onboarding Routes */}
        <Route
          path="/onboarding/seller"
          element={shouldShowOnboarding && user?.role === 'seller' ? <OnboardingSeller /> : <Navigate to="/" replace />}
        />
        <Route
          path="/onboarding/buyer"
          element={shouldShowOnboarding && user?.role === 'buyer' ? <OnboardingBuyer /> : <Navigate to="/" replace />}
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              shouldShowOnboarding ? (
                <Navigate
                  to={user?.role === 'seller' ? '/onboarding/seller' : '/onboarding/buyer'}
                  replace
                />
              ) : (
                <Layout />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="invoices">
            <Route path="create" element={user?.role === 'seller' ? <CreateInvoice /> : <Navigate to="/" replace />} />
            <Route path="create-nft" element={user?.role === 'seller' ? <CreateInvoiceNFT /> : <Navigate to="/" replace />} />
            <Route path=":id" element={<InvoiceDetails />} />
          </Route>
          <Route path="wallet" element={<Wallet />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:id" element={<TransactionDetails />} />
          <Route path="invest" element={<InvestorDashboard />} />
          <Route path="apply" element={<UnderwritingApplication />} />
          <Route path="loans">
            <Route path="apply/:id" element={<LoanApplication />} />
            <Route path="review" element={<UnderwriterDashboard />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;