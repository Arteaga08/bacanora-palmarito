import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import "./index.css";

// 🌟 1. IMPORTAMOS EL CEREBRO DEL CARRITO
import { CartProvider } from "./context/CartContext";

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
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AgeVerification from "./components/home/AgeVerification";

const GlobalWrapper = () => {
  return (
    <>
      <AgeVerification />
      <ScrollRestoration />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <GlobalWrapper />,
    children: [
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
          { path: "/checkout/success", element: <OrderSuccessPage /> },
        ],
      },
      { path: "/producto/:id", element: <ProductDetailPage /> },

      // RUTAS DE ADMIN
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <AdminDashBoard />,
          },
          {
            path: "orders",
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
    ],
  },
]);

// 🌟 2. ENVOLVEMOS TU APP ENTERA CON EL CART PROVIDER
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>,
);
