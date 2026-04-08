import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUtensils, FaClipboardList, FaFire, FaUsers, FaChartBar, FaCogs, FaHamburger, FaList, FaBoxes, FaMap, FaBars } from "react-icons/fa";
import { GiLeafSwirl } from "react-icons/gi"; // icon lá/rau
export default function FeatureLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isFeature = location.pathname.startsWith("/features");
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="brand">
          <FaUtensils size={24} />
          <span>Admin</span>
        </div>
        <div className="nav-links">
          <Link className={isActive("/orders") ? "active" : ""} to="/orders"><FaClipboardList /> Xem đơn</Link>
          <Link className={isActive("/service") ? "active" : ""} to="/service"><FaUsers /> Phục vụ</Link>
          <Link className={isActive("/kitchen") ? "active" : ""} to="/kitchen"><FaFire /> Chế biến</Link>
          <Link className={isActive("/stats") ? "active" : ""} to="/stats"><FaChartBar /> Thống kê</Link>
          <Link className={isFeature ? "active" : ""} to="/features/menu"><FaCogs /> Tính năng</Link>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {isFeature && (
          <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <button onClick={() => setCollapsed(!collapsed)}><FaBars /></button>
            <nav>
              <Link className={isActive("/features/menu") ? "active" : ""} to="/features/menu">
                <FaHamburger /> {!collapsed && <span>Thực đơn</span>}
              </Link>
              <Link className={isActive("/features/recipe") ? "active" : ""} to="/features/recipe">
                <FaHamburger /> {!collapsed && <span>Công thức</span>}
              </Link>
               <Link className={isActive("/features/ingredient") ? "active" : ""} to="/features/ingredient">
                <GiLeafSwirl /> {!collapsed && <span>Nguyên liệu</span>}
              </Link>

              <Link className={isActive("/features/tablemap") ? "active" : ""} to="/features/tablemap">
                <FaMap /> {!collapsed && <span>Sơ đồ</span>}
              </Link>
              <Link className={isActive("/features/warehouse") ? "active" : ""} to="/features/warehouse">
                <FaBoxes /> {!collapsed && <span>Kho</span>}
              </Link>
            </nav>
          </div>
        )}

        {/* Main content */}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}