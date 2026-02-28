import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import "./index.css";

import { CartProvider } from "./context/CartContext";

// --- COMPONENTES DE ESTRUCTURA ---
import MainLayout from "./components/layout/MainLayout";
import AgeVerification from "./components/home/AgeVerification";
import PalmaritoLoader from "./components/ui/PalmaritoLoader";

// Páginas Públicas
const HomePage = lazy(() => import("./pages/HomePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const MixologyPage = lazy(() => import("./pages/MixologyPage"));
const RecipePage = lazy(() => import("./pages/RecipePage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));

// Páginas de Administración (Aquí está el mayor ahorro de peso)
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const AdminDashBoard = lazy(() => import("./pages/admin/AdminDashboard"));
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const OrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/admin/OrderDetailsPage"));
const AuditLogPage = lazy(() => import("./pages/admin/AuditLogPage"));
const ProductsPage = lazy(() => import("./pages/admin/ProductsPage"));
const InventoryPage = lazy(() => import("./pages/admin/InventoryPage"));
const ProductCreatePage = lazy(() => import("./pages/admin/ProductCreatePage"));
const ProductEditPage = lazy(() => import("./pages/admin/ProductEditPage"));
const AdminMixologyPage = lazy(() => import("./pages/admin/AdminMixologyPage"));
const AdminRecipeCreatePage = lazy(
  () => import("./pages/admin/AdminRecipeCreatePage"),
);
const AdminRecipeEditPage = lazy(
  () => import("./pages/admin/AdminRecipeEditPage"),
);

// --- WRAPPER GLOBAL ---
const GlobalWrapper = () => {
  return (
    <>
      <AgeVerification />
      <ScrollRestoration />
      {/* 🌟 SUSPENSE: El "Plan de Emergencia" mientras se descarga la página solicitada */}
      <Suspense
        fallback={
          <PalmaritoLoader fullScreen={true} text="Preparando Bacanora" />
        }
      >
        <Outlet />
      </Suspense>
    </>
  );
};

// --- CONFIGURACIÓN DE RUTAS ---
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
          { path: "dashboard", element: <AdminDashBoard /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "orders/:id", element: <OrderDetailsPage /> },
          { path: "products", element: <ProductsPage /> },
          { path: "products/new", element: <ProductCreatePage /> },
          { path: "products/edit/:id", element: <ProductEditPage /> },
          { path: "mixology", element: <AdminMixologyPage /> },
          { path: "mixology/new", element: <AdminRecipeCreatePage /> },
          { path: "mixology/edit/:id", element: <AdminRecipeEditPage /> },
          { path: "inventory", element: <InventoryPage /> },
          { path: "logs", element: <AuditLogPage /> },
        ],
      },
      {
        path: "/admin/login",
        element: <LoginPage />,
      },
    ],
  },
]);

// --- RENDERIZADO FINAL ---
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>,
);
