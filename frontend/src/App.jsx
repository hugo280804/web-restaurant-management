import FeatureLayout from "./FeatureLayout";
import Orders from "./pages/Orders";
import Kitchen from "./pages/Kitchen";
import Service from "./pages/Service";
import Stats from "./pages/Stats";
import Menu from "./pages/Menu";
import Ingredient from "./pages/Ingredient";
import TableMap from "./pages/TableMap";
import Warehouse from "./pages/Warehouse";
import Recipes from "./pages/Recipes";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FeatureLayout />}>
        <Route path="orders" element={<Orders />} />
        <Route path="kitchen" element={<Kitchen />} />
        <Route path="service" element={<Service />} />
        <Route path="stats" element={<Stats />} />

        {/* Features */}
        <Route path="features/menu" element={<Menu />} />
        <Route path="features/recipe" element={<Recipes />} />
        <Route path="features/ingredient" element={<Ingredient />} />
        <Route path="features/tablemap" element={<TableMap />} />
        <Route path="features/warehouse" element={<Warehouse />} />
      </Route>
    </Routes>
  );
}

export default App;