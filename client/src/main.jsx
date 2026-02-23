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
import RecipePage from "./pages/RecipePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

// Admin Pages
import AdminDashBoard from "./pages/admin/AdminDashboard";
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./components/layout/AdminLayout";
import OrdersPage from "./pages/admin/OrdersPage";
import OrderDetailsPage from "./pages/admin/OrderDetailsPage";
import AuditLogPage from "./pages/admin/AuditLogPage";
import ProductsPage from "./pages/admin/ProductsPage";
import InventoryPage from "./pages/admin/InventoryPage";
import ProductCreatePage from "./pages/admin/ProductCreatePage";
import ProductEditPage from "./pages/admin/ProductEditPage";
import AdminMixologyPage from "./pages/admin/AdminMixologyPage";
import AdminRecipeCreatePage from "./pages/admin/AdminRecipeCreatePage";
import AdminRecipeEditPage from "./pages/admin/AdminRecipeEditPage";

const router = createBrowserRouter([
  // RUTAS PÚBLICAS
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/tienda", element: <ShopPage /> },
      { path: "/historia", element: <HistoryPage /> },

      { path: "/mixologia", element: <MixologyPage /> },
      { path: "/mixologia/:slug", element: <RecipePage /> },
      { path: "/carrito", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
    ],
  },
  { path: "/producto/:id", element: <ProductDetailPage /> },

  // RUTAS DE ADMIN
  {
    path: "/admin",
    element: <AdminLayout />, // 👈 El "Padre" que tiene el Sidebar
    children: [
      {
        path: "dashboard", // ➝ /admin/dashboard
        element: <AdminDashBoard />,
      },
      {
        path: "orders", // ➝ /admin/orders (¡NUEVA RUTA!) 🚚
        element: <OrdersPage />,
      },
      {
        path: "orders/:id",
        element: <OrderDetailsPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      { path: "products/new", element: <ProductCreatePage /> },
      { path: "products/edit/:id", element: <ProductEditPage /> },
      { path: "mixology", element: <AdminMixologyPage /> },
      { path: "mixology/new", element: <AdminRecipeCreatePage /> },
      { path: "mixology/edit/:id", element: <AdminRecipeEditPage /> },
      {
        path: "inventory",
        element: <InventoryPage />,
      },
      {
        path: "logs",
        element: <AuditLogPage />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
