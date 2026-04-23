export default function RoleRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // chưa login
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h2>⚠️ Vui lòng đăng nhập</h2>
      </div>
    );
  }

  // admin luôn ok
  if (user.role === "Admin") return children;

  // không có quyền → HIỆN TẠI CHỖ
  if (!roles.includes(user.role)) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h2>❌ Bạn không có quyền truy cập</h2>
      </div>
    );
  }

  return children;
}