import { Routes, Route } from 'react-router'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Home from "@/pages/Home"
import Shop from "@/pages/Shop"
import ProductDetail from "@/pages/ProductDetail"
import Cart from "@/pages/Cart"
import Checkout from "@/pages/Checkout"
import OrderSuccess from "@/pages/OrderSuccess"
import Orders from "@/pages/Orders"
import Profile from "@/pages/Profile"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Shop />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido-exito" element={<OrderSuccess />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
