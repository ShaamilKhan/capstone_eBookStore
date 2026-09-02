import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import HomePage              from './pages/HomePage'
import LoginPage             from './pages/LoginPage'
import RegisterPage          from './pages/RegisterPage'
import CataloguePage         from './pages/CataloguePage'
import ProductDetailPage     from './pages/ProductDetailPage'
import CartPage              from './pages/CartPage'
import CheckoutPage          from './pages/CheckoutPage'
import PaymentPage           from './pages/PaymentPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderHistoryPage      from './pages/OrderHistoryPage'
import ProfilePage           from './pages/ProfilePage'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/"          element={<Layout><HomePage /></Layout>} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/catalogue" element={<Layout><CataloguePage /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />

            <Route element={<ProtectedRoute />}>
              <Route path="/cart"     element={<Layout><CartPage /></Layout>} />
              <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
              <Route path="/payment"  element={<Layout><PaymentPage /></Layout>} />
              <Route path="/order-confirmation/:orderId" element={<Layout><OrderConfirmationPage /></Layout>} />
              <Route path="/orders"   element={<Layout><OrderHistoryPage /></Layout>} />
              <Route path="/profile"  element={<Layout><ProfilePage /></Layout>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
