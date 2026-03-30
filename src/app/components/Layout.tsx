import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  Map,
  Video,
  Activity,
  Calendar,
  Route,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  LogOut,
  Wifi,
  Shield,
  Plane,
} from "lucide-react";

const navItems = [
  { path: "/map", icon: Map, label: "资源地图" },
  { path: "/videos", icon: Video, label: "视频管理" },
  { path: "/monitoring", icon: Activity, label: "作业监控" },
  { path: "/planned-ops", icon: Calendar, label: "计划作业" },
  { path: "/route-planning", icon: Route, label: "航线设定" },
  { path: "/ai-models", icon: Brain, label: "AI模型库" },
  { path: "/settings", icon: Settings, label: "系统设置" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const userStr = sessionStorage.getItem("drone_user");
  const user = userStr ? JSON.parse(userStr) : { name: "操作员", role: "operator" };

  const handleLogout = () => {
    sessionStorage.removeItem("drone_user");
    navigate("/login");
  };

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: "#080d1a", color: "#e2e8f0" }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300 relative"
        style={{
          width: collapsed ? "64px" : "220px",
          background: "linear-gradient(180deg, #0b1120 0%, #080d1a 100%)",
          borderRight: "1px solid #1e2d4a",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid #1e2d4a" }}
        >
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #0066ff, #00b4ff)",
            }}
          >
            <Plane size={20} color="#fff" />
          </div>
          {!collapsed && (
            <div>
              <div style={{ color: "#00b4ff", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em" }}>
                低空智析
              </div>
              <div style={{ color: "#4a6080", fontSize: "10px" }}>Urban Sky Intelligence</div>
            </div>
          )}
        </div>

        {/* System Status */}
        {!collapsed && (
          <div className="px-3 py-2 mx-3 mt-3 rounded-lg" style={{ background: "#0a1628", border: "1px solid #1a2d4a" }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
              <span style={{ color: "#22c55e", fontSize: "11px" }}>系统运行正常</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#4a6080", fontSize: "10px" }}>在线无人机</span>
              <span style={{ color: "#00b4ff", fontSize: "10px", fontWeight: 700 }}>8 / 12</span>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive ? "nav-active" : "nav-inactive"
                }`
              }
              style={({ isActive }) => ({
                background: isActive
                  ? "linear-gradient(135deg, rgba(0,100,255,0.2), rgba(0,180,255,0.1))"
                  : "transparent",
                border: isActive ? "1px solid rgba(0,180,255,0.3)" : "1px solid transparent",
                color: isActive ? "#00b4ff" : "#6b8299",
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} color={isActive ? "#00b4ff" : "#6b8299"} className="flex-shrink-0" />
                  {!collapsed && (
                    <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400 }}>{label}</span>
                  )}
                  {isActive && !collapsed && (
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full"
                      style={{ background: "#00b4ff" }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div
          className="p-3 flex-shrink-0"
          style={{ borderTop: "1px solid #1e2d4a" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #0044bb, #0088ff)",
              }}
            >
              <User size={15} color="#fff" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }}>{user.name}</div>
                <div style={{ color: "#4a6080", fontSize: "10px" }}>
                  {user.role === "admin" ? "管理员" : "操作员"}
                </div>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-1 rounded hover:bg-red-900/20 transition-colors"
                title="退出登录"
              >
                <LogOut size={14} color="#6b8299" />
              </button>
            )}
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full z-10"
          style={{
            width: "24px",
            height: "24px",
            background: "#1a2d4a",
            border: "1px solid #2a3d5a",
            color: "#6b8299",
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{
            background: "#080d1a",
            borderBottom: "1px solid #1e2d4a",
            height: "56px",
          }}
        >
          <div className="flex items-center gap-4">
            <div style={{ color: "#4a6080", fontSize: "12px" }}>
              <span style={{ color: "#00b4ff" }}>低空无人机智能分析系统</span>
              <span className="mx-2">/</span>
              <span>城市交通治理平台</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Live Clock */}
            <LiveClock />
            {/* Connection Status */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "#0a1628", border: "1px solid #1a2d4a" }}>
              <Wifi size={12} color="#22c55e" />
              <span style={{ color: "#22c55e", fontSize: "11px" }}>实时连接</span>
            </div>
            {/* Security */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "#0a1628", border: "1px solid #1a2d4a" }}>
              <Shield size={12} color="#00b4ff" />
              <span style={{ color: "#00b4ff", fontSize: "11px" }}>
                {user.role === "admin" ? "管理员" : "操作员"}权限
              </span>
            </div>
            {/* Notification */}
            <button className="relative p-2 rounded-lg transition-colors" style={{ background: "#0a1628", border: "1px solid #1a2d4a" }}>
              <Bell size={15} color="#6b8299" />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "#ef4444" }}
              />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto" style={{ background: "#080d1a" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ color: "#6b8299", fontSize: "12px", fontFamily: "monospace" }}>
      {time.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })}
    </div>
  );
}