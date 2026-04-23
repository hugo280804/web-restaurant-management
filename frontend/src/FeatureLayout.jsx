import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaUtensils,
  FaClipboardList,
  FaFire,
  FaUsers,
  FaChartBar,
  FaCogs,
  FaHamburger,
  FaList,
  FaBoxes,
  FaMap,
  FaMoneyBill,
  FaBell,
  FaGift,   
  FaBox,  
  FaUserCircle 
} from "react-icons/fa";
import { GiLeafSwirl } from "react-icons/gi";

export default function FeatureLayout() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [openWarehouse, setOpenWarehouse] = useState(false);

  // ✅ FIX: đúng prefix admin
  const isFeature = location.pathname.startsWith("/admin/features");

  // ✅ ACTIVE CHUẨN
  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  // ✅ KHO ACTIVE FIX
  const isWarehouseActive =
    location.pathname.startsWith("/admin/features/inventory") ||
    location.pathname.startsWith("/admin/features/inventory-transaction");

  useEffect(() => {
    if (isWarehouseActive) {
      setOpenWarehouse(true);
    }
  }, [isWarehouseActive]);
 
  const user = JSON.parse(localStorage.getItem("user"));
  const [openUser, setOpenUser] = useState(false);
console.log(user);
  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">
        <div className="brand">
          <FaUtensils size={24} />
          <span>Admin</span>
        </div>

        <div className="nav-links">
          <Link className={isActive("/admin/orders") ? "active" : ""} to="/admin/orders">
            <FaClipboardList /> Xem đơn
          </Link>

          <Link className={isActive("/admin/service") ? "active" : ""} to="/admin/service">
            <FaUsers /> Phục vụ
          </Link>

          <Link className={isActive("/admin/kitchen") ? "active" : ""} to="/admin/kitchen">
            <FaFire /> Chế biến
          </Link>

          <Link className={isActive("/admin/stats") ? "active" : ""} to="/admin/stats">
            <FaChartBar /> Thống kê
          </Link>

          <Link className={isFeature ? "active" : ""} to="/admin/features/menu">
            <FaCogs /> Tính năng
          </Link>
        </div>
        
              <div className="user-info" onClick={() => setOpenUser(!openUser)}>
            <FaUserCircle size={26} />

            <div className="user-text">
              <span className="name">
                {user?.name || user?.username}
              </span>
              <span className="role">{user?.role}</span>
            </div>

            <span className="arrow">▼</span>

            {/* DROPDOWN */}
            {openUser && (
              <div className="user-menu">
                <div className="menu-item">Thông tin</div>

                <div
                  className="menu-item logout"
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 tránh đóng menu trước
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* SIDEBAR */}
        {isFeature && (
          <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <button
              className="sidebar-toggle"
              onClick={() => setCollapsed(!collapsed)}
            >
              <span>{collapsed ? "⮞" : "⮜"}</span>
            </button>

            <nav>

              {!collapsed && <div className="sidebar-group">Món & kho</div>}

              <Link
                to="/admin/features/menu"
                className={`sidebar-item ${isActive("/admin/features/menu") ? "active" : ""}`}
              >
                <FaHamburger />
                {!collapsed && <span>Thực đơn</span>}
              </Link>
               <Link
              to="/admin/features/combo"
              className={`sidebar-item ${isActive("/admin/features/combo") ? "active" : ""}`}
            >
              <FaBox />
              {!collapsed && <span>Combo</span>}
            </Link>
                      
                <Link
              to="/admin/features/promotion"
              className={`sidebar-item ${isActive("/admin/features/promotion") ? "active" : ""}`}
            >
              <FaGift />
              {!collapsed && <span>Khuyến mãi</span>}
            </Link>

               <Link
                to="/admin/features/recipe"
                className={`sidebar-item ${isActive("/admin/features/recipe") ? "active" : ""}`}
              >
                <FaHamburger />
                {!collapsed && <span>Công thức</span>}
              </Link>

              <Link
                to="/admin/features/ingredient"
                className={`sidebar-item ${isActive("/admin/features/ingredient") ? "active" : ""}`}
              >
                <GiLeafSwirl />
                {!collapsed && <span>Nguyên liệu</span>}
              </Link>

              {/* KHO */}
              <div
                className={`sidebar-item sidebar-group-click ${
                  isWarehouseActive ? "active" : ""
                }`}
                onClick={() => setOpenWarehouse(!openWarehouse)}
              >
                <FaBoxes />
                {!collapsed && <span>Kho</span>}
              </div>

              {openWarehouse && (
                <div className="submenu">

                  <Link
                    to="/admin/features/inventory"
                    className={isActive("/admin/features/inventory") ? "active" : ""}
                  >
                    📊 {!collapsed && <span>Tồn kho</span>}
                  </Link>

                  <Link
                    to="/admin/features/inventory-transaction"
                    className={isActive("/admin/features/inventory-transaction") ? "active" : ""}
                  >
                    📜 {!collapsed && <span>Nhập / Xuất</span>}
                  </Link>

                </div>
              )}

              {!collapsed && <div className="sidebar-group">Vận hành</div>}

              <Link to="/admin/features/tablemap"
                className={`sidebar-item ${isActive("/admin/features/tablemap") ? "active" : ""}`}>
                <FaMap /> {!collapsed && <span>Sơ đồ</span>}
              </Link>

              <Link to="/admin/features/orders_admin"
                className={`sidebar-item ${isActive("/admin/features/orders_admin") ? "active" : ""}`}>
                <FaClipboardList /> {!collapsed && <span>Đơn hàng</span>}
              </Link>

              <Link to="/admin/features/payment"
                className={`sidebar-item ${isActive("/admin/features/payment") ? "active" : ""}`}>
                <FaMoneyBill /> {!collapsed && <span>Thanh toán</span>}
              </Link>

              {!collapsed && <div className="sidebar-group">Quản lý</div>}

              <Link to="/admin/features/employee"
                className={`sidebar-item ${isActive("/admin/features/employee") ? "active" : ""}`}>
                <FaUsers /> {!collapsed && <span>Nhân viên</span>}
              </Link>

              <Link to="/admin/features/customer"
                className={`sidebar-item ${isActive("/admin/features/customer") ? "active" : ""}`}>
                <FaUsers /> {!collapsed && <span>Khách hàng</span>}
              </Link>

              <Link to="/admin/features/shift"
                className={`sidebar-item ${isActive("/admin/features/shift") ? "active" : ""}`}>
                <FaUsers /> {!collapsed && <span>Ca làm</span>}
              </Link>

              {!collapsed && <div className="sidebar-group">Hệ thống</div>}

              <Link to="/admin/features/settings"
                className={`sidebar-item ${isActive("/admin/features/settings") ? "active" : ""}`}>
                <FaCogs /> {!collapsed && <span>Cài đặt</span>}
              </Link>

              <Link to="/admin/features/notification"
                className={`sidebar-item ${isActive("/admin/features/notification") ? "active" : ""}`}>
                <FaBell /> {!collapsed && <span>Thông báo</span>}
              </Link>
              <Link
              to="/admin/features/home"
              className={`sidebar-item ${isActive("/admin/features/home") ? "active" : ""}`}
            >
              🏠 {!collapsed && <span>Trang chủ</span>}
            </Link>

            </nav>
          </div>
        )}

        {/* CONTENT */}
        <div className="content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}