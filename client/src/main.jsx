import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Public Pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import HistoryPage from "./pages/HistoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MixologyPage from "./pages/MixologyPage";
import RecipePage from "./pages/RecipePage"; // Faltaba
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage"; // Faltaba

// Admin Pages
import AdminDashBoard from "./pages/admin/AdminDashboard";
import LoginPage from "./pages/admin/LoginPage";

const router = createBrowserRouter([
  // RUTAS PÚBLICAS
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/tienda", element: <ShopPage /> },
      { path: "/historia", element: <HistoryPage /> },
      { path: "/producto/:slug", element: <ProductDetailPage /> },
      { path: "/mixologia", element: <MixologyPage /> },
      { path: "/mixologia/:slug", element: <RecipePage /> },
      { path: "/carrito", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
    ],
  },

  // RUTAS DE ADMIN
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashBoard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
