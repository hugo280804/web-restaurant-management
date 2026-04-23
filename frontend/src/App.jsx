import { Routes, Route } from "react-router-dom";

/* ================= ADMIN ================= */
import FeatureLayout from "./FeatureLayout";

import Orders from "./admin/pages/Orders";
import Kitchen from "./admin/pages/Kitchen";
import Service from "./admin/pages/Service";
import Stats from "./admin/pages/Stats";
import Menu from "./admin/pages/Menu";
import Ingredient from "./admin/pages/Ingredient";
import TableMap from "./admin/pages/TableMap";
import Warehouse from "./admin/pages/inventory-transaction";
import Recipes from "./admin/pages/Recipes";
import Inventory from "./admin/pages/Inventory";
import OrdersAdmin from "./admin/pages/orders_admin";
import Employee from "./admin/pages/Employee";
import Shift from "./admin/pages/Shift";
import Promotion from "./admin/pages/Promotion";
import Combo from "./admin/pages/Combo";
import Customer from "./admin/pages/Customer";
import HomeAdmin from "./admin/pages/Home";
import Forbidden from "./admin/pages/Forbidden";
import PaymentSuccess from "./admin/pages/PaymentSuccess";
/* AUTH */
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import Login from "./admin/pages/Login";

/* ================= USER ================= */
import UserLayout from "./user/layout/UserLayout";
import Home from "./user/pages/Home";
import UserMenu from "./user/pages/Menu";
import Order from "./user/pages/Order";
import Reservation from "./user/pages/Reservation";
import TrackOrder from "./user/pages/TrackOrder";
import Recruitment from "./user/pages/Recruitment";

function App() {
  return (
    <Routes>

      {/* ===== LOGIN ===== */}
      <Route path="/login" element={<Login />} />

      {/* ================= USER WEBSITE ================= */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<UserMenu />} />
        <Route path="order" element={<Order />} />
        <Route path="reservation" element={<Reservation />} />
        <Route path="track" element={<TrackOrder />} />
        <Route path="recruitment" element={<Recruitment />} />
      </Route>

      {/* ================= ADMIN ================= */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
<Route
  path="/admin"
  element={
    <PrivateRoute>
      <FeatureLayout />
    </PrivateRoute>
  }
>

  {/* ===== ORDERS (Admin + Phục vụ) ===== */}
  <Route
    path="orders"
    element={
      <RoleRoute roles={["Admin", "Phục vụ"]}>
        <Orders />
      </RoleRoute>
    }
  />

  {/* ===== KITCHEN (Admin + Bếp) ===== */}
  <Route
    path="kitchen"
    element={
      <RoleRoute roles={["Admin", "Bếp"]}>
        <Kitchen />
      </RoleRoute>
    }
  />

  {/* ===== SERVICE (Admin + Phục vụ) ===== */}
  <Route
    path="service"
    element={
      <RoleRoute roles={["Admin", "Phục vụ"]}>
        <Service />
      </RoleRoute>
    }
  />

  {/* ===== STATS (ALL ROLE TRONG ADMIN) ===== */}
  <Route
    path="stats"
    element={
      <RoleRoute roles={["Admin", "Bếp", "Phục vụ"]}>
        <Stats />
      </RoleRoute>
    }
  />

  {/* ===== ADMIN ONLY ===== */}
  <Route
    path="features/menu"
    element={
      <RoleRoute roles={["Admin"]}>
        <Menu />
      </RoleRoute>
    }
  />

  <Route path="features/recipe" element={
    <RoleRoute roles={["Admin"]}><Recipes /></RoleRoute>
  } />

  <Route path="features/ingredient" element={
    <RoleRoute roles={["Admin"]}><Ingredient /></RoleRoute>
  } />

  <Route path="features/tablemap" element={
    <RoleRoute roles={["Admin"]}><TableMap /></RoleRoute>
  } />

  <Route path="features/inventory-transaction" element={
    <RoleRoute roles={["Admin"]}><Warehouse /></RoleRoute>
  } />

  <Route path="features/inventory" element={
    <RoleRoute roles={["Admin"]}><Inventory /></RoleRoute>
  } />

  <Route path="features/orders_admin" element={
    <RoleRoute roles={["Admin"]}><OrdersAdmin /></RoleRoute>
  } />

  <Route path="features/promotion" element={
    <RoleRoute roles={["Admin"]}><Promotion /></RoleRoute>
  } />

  <Route path="features/combo" element={
    <RoleRoute roles={["Admin"]}><Combo /></RoleRoute>
  } />

  <Route path="features/customer" element={
    <RoleRoute roles={["Admin"]}><Customer /></RoleRoute>
  } />

  <Route path="features/home" element={
    <RoleRoute roles={["Admin"]}><HomeAdmin /></RoleRoute>
  } />

  <Route path="features/employee" element={
    <RoleRoute roles={["Admin"]}><Employee /></RoleRoute>
  } />

  <Route path="features/shift" element={
    <RoleRoute roles={["Admin"]}><Shift /></RoleRoute>
  } />


</Route>

     

    </Routes>
  );
}

export default App;