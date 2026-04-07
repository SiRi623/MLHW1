import { useState, useEffect, useRef } from "react";
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
  X,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle,
  Zap,
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
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userStr = sessionStorage.getItem("drone_user");
  const user = userStr ? JSON.parse(userStr) : { name: "操作员", role: "operator" };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const removeNotif = (id: number) => setNotifications((p) => p.filter((n) => n.id !== id));

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    if (showNotif) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotif]);

  const handleLogout = () => {
    sessionStorage.removeItem("drone_user");
    navigate("/login");
  };

  const notifIcon = (type: string) => {
    if (type === "warning") return <AlertTriangle size={13} color="#f59e0b" />;
    if (type === "error") return <AlertTriangle size={13} color="#ef4444" />;
    if (type === "success") return <CheckCircle size={13} color="#22c55e" />;
    return <Info size={13} color="#00b4ff" />;
  };

  const notifColor = (type: string) => {
    if (type === "warning") return { dot: "#f59e0b", border: "rgba(245,158,11,0.2)" };
    if (type === "error") return { dot: "#ef4444", border: "rgba(239,68,68,0.2)" };
    if (type === "success") return { dot: "#22c55e", border: "rgba(34,197,94,0.15)" };
    return { dot: "#00b4ff", border: "rgba(0,180,255,0.15)" };
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
          <div className="flex-shrink-0" style={{ filter: "drop-shadow(0 0 8px rgba(0,180,255,0.5))" }}>
            <DroneLogoIcon size={36} />
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
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #0044bb, #0088ff)" }}
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
          style={{ width: "24px", height: "24px", background: "#1a2d4a", border: "1px solid #2a3d5a", color: "#6b8299" }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{ background: "#080d1a", borderBottom: "1px solid #1e2d4a", height: "56px" }}
        >
          <div className="flex items-center gap-4">
            <div style={{ color: "#4a6080", fontSize: "12px" }}>
              <span style={{ color: "#00b4ff" }}>低空无人机智能分析系统</span>
              <span className="mx-2">/</span>
              <span>城市交通治理平台</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LiveClock />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "#0a1628", border: "1px solid #1a2d4a" }}>
              <Wifi size={12} color="#22c55e" />
              <span style={{ color: "#22c55e", fontSize: "11px" }}>实时连接</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "#0a1628", border: "1px solid #1a2d4a" }}>
              <Shield size={12} color="#00b4ff" />
              <span style={{ color: "#00b4ff", fontSize: "11px" }}>
                {user.role === "admin" ? "管理员" : "操作员"}权限
              </span>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif((v) => !v)}
                className="relative p-2 rounded-lg transition-all"
                style={{
                  background: showNotif ? "rgba(0,100,200,0.2)" : "#0a1628",
                  border: `1px solid ${showNotif ? "rgba(0,180,255,0.4)" : "#1a2d4a"}`,
                }}
              >
                <Bell size={15} color={unreadCount > 0 ? "#f59e0b" : "#6b8299"} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "#ef4444", fontSize: "9px", color: "#fff", fontWeight: 700 }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotif && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] rounded-xl overflow-hidden z-[200]"
                  style={{
                    width: "360px",
                    background: "#0b1120",
                    border: "1px solid #1e2d4a",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,180,255,0.08)",
                  }}
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: "1px solid #1e2d4a", background: "rgba(0,50,120,0.15)" }}
                  >
                    <div className="flex items-center gap-2">
                      <Bell size={14} color="#00b4ff" />
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 700 }}>通知中心</span>
                      {unreadCount > 0 && (
                        <span
                          className="px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", fontSize: "10px", fontWeight: 600 }}
                        >
                          {unreadCount} 条未读
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
                          style={{ background: "rgba(0,100,200,0.15)", border: "1px solid rgba(0,180,255,0.2)", color: "#00b4ff", fontSize: "10px" }}
                        >
                          <CheckCheck size={11} /> 全部已读
                        </button>
                      )}
                      <button onClick={() => setShowNotif(false)} style={{ color: "#4a6080" }}>
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <Bell size={28} color="#1e2d4a" />
                        <p style={{ color: "#4a6080", fontSize: "12px", marginTop: "8px" }}>暂无通知</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const c = notifColor(n.type);
                        return (
                          <div
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
                            style={{
                              background: n.read ? "transparent" : "rgba(0,60,140,0.12)",
                              borderBottom: "1px solid #0f1829",
                              borderLeft: `3px solid ${n.read ? "transparent" : c.dot}`,
                            }}
                          >
                            {/* Icon */}
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: c.border, border: `1px solid ${c.dot}44` }}
                            >
                              {notifIcon(n.type)}
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <span
                                  style={{
                                    color: n.read ? "#6b8299" : "#e2e8f0",
                                    fontSize: "12px",
                                    fontWeight: n.read ? 400 : 600,
                                  }}
                                >
                                  {n.title}
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeNotif(n.id); }}
                                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ color: "#2a3a50" }}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <p style={{ color: "#4a6080", fontSize: "11px", marginTop: "2px", lineHeight: "1.5" }}>
                                {n.desc}
                              </p>
                              <span style={{ color: "#2a3a60", fontSize: "10px", marginTop: "4px", display: "block" }}>
                                {n.time}
                              </span>
                            </div>
                            {/* Unread dot */}
                            {!n.read && (
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: c.dot }} />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div
                    className="px-4 py-2.5 flex items-center justify-between"
                    style={{ borderTop: "1px solid #1e2d4a", background: "rgba(0,0,0,0.2)" }}
                  >
                    <span style={{ color: "#2a3a60", fontSize: "10px" }}>共 {notifications.length} 条通知</span>
                    <button
                      onClick={() => setNotifications([])}
                      style={{ color: "#2a3a60", fontSize: "10px" }}
                      className="hover:text-red-400 transition-colors"
                    >
                      清空全部
                    </button>
                  </div>
                </div>
              )}
            </div>
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

// Custom drone logo SVG
function DroneLogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer hex ring */}
      <path
        d="M18 2L32 10V26L18 34L4 26V10L18 2Z"
        stroke="url(#hexGrad)"
        strokeWidth="1.2"
        fill="rgba(0,100,255,0.12)"
      />
      {/* Inner scan ring */}
      <circle cx="18" cy="18" r="7" stroke="url(#ringGrad)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
      {/* Drone body center */}
      <circle cx="18" cy="18" r="3" fill="url(#coreGrad)" />
      {/* Arms */}
      <line x1="18" y1="15" x2="18" y2="9" stroke="#00b4ff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="18" y1="21" x2="18" y2="27" stroke="#00b4ff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="18" x2="9" y2="18" stroke="#00b4ff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="21" y1="18" x2="27" y2="18" stroke="#00b4ff" strokeWidth="1.2" strokeLinecap="round" />
      {/* Propeller circles */}
      <circle cx="18" cy="8.5" r="2.5" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,180,255,0.15)" />
      <circle cx="18" cy="27.5" r="2.5" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,180,255,0.15)" />
      <circle cx="8.5" cy="18" r="2.5" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,180,255,0.15)" />
      <circle cx="27.5" cy="18" r="2.5" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,180,255,0.15)" />
      {/* Propeller cross lines */}
      <line x1="16.5" y1="8.5" x2="19.5" y2="8.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="18" y1="7" x2="18" y2="10" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16.5" y1="27.5" x2="19.5" y2="27.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="18" y1="26" x2="18" y2="29" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8.5" y1="16.5" x2="8.5" y2="19.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="7" y1="18" x2="10" y2="18" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="27.5" y1="16.5" x2="27.5" y2="19.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="26" y1="18" x2="29" y2="18" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="hexGrad" x1="4" y1="2" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066ff" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <linearGradient id="ringGrad" x1="11" y1="11" x2="25" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0088ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#0055cc" />
        </radialGradient>
      </defs>
    </svg>
  );
}

const notificationsData = [
  {
    id: 1, type: "warning", read: false,
    title: "UAV-005 电量低于 25%",
    desc: "无人机 UAV-005 电量不足，已自动触发返航程序。",
    time: "10分钟前",
  },
  {
    id: 2, type: "error", read: false,
    title: "AI模型部署失败",
    desc: "LicensePlate-OCR 部署至 UAV-003 失败，设备连接超时，请检查网络。",
    time: "25分钟前",
  },
  {
    id: 3, type: "info", read: false,
    title: "任务完成通知",
    desc: "UAV-001 已完成「朝阳路巡查」任务，飞行时长 42 分钟，视频已归档。",
    time: "1小时前",
  },
  {
    id: 4, type: "warning", read: true,
    title: "BS-04 基站信号异常",
    desc: "西区基站 BS-04 信号强度持续下降，当前仅 12%，建议现场检查。",
    time: "2小时前",
  },
  {
    id: 5, type: "success", read: true,
    title: "系统自检完成",
    desc: "今日 09:00 系统例行自检已完成，全部 12 台设备状态正常。",
    time: "3小时前",
  },
  {
    id: 6, type: "info", read: true,
    title: "航线 RT-001 已更新",
    desc: "管理员 张管理员 修改了朝阳路巡查航线，新增 3 个检测点位。",
    time: "5小时前",
  },
];