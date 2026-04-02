import { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Settings,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Bell,
  Lock,
  Edit3,
  Trash2,
  Plus,
  CheckCircle,
  AlertTriangle,
  Activity,
  Database,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  X,
  Save,
  ChevronRight,
  User,
  Key,
  Clock,
  Radio,
  Zap,
  MapPin,
  Signal,
  Thermometer,
  Battery,
  Layers,
  Navigation,
  Globe,
  AlertCircle,
  CheckSquare,
  Info,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const initialUsers = [
  { id: 1, name: "张管理员", username: "admin", role: "admin", status: "active", lastLogin: "2026-03-30 09:12", createdAt: "2025-01-15" },
  { id: 2, name: "李操作员", username: "operator", role: "operator", status: "active", lastLogin: "2026-03-30 08:45", createdAt: "2025-02-20" },
  { id: 3, name: "王操作员", username: "wang_op", role: "operator", status: "active", lastLogin: "2026-03-29 17:30", createdAt: "2025-03-01" },
  { id: 4, name: "刘分析师", username: "liu_analyst", role: "analyst", status: "inactive", lastLogin: "2026-03-25 14:22", createdAt: "2025-03-10" },
  { id: 5, name: "陈操作员", username: "chen_op", role: "operator", status: "active", lastLogin: "2026-03-30 07:55", createdAt: "2025-04-05" },
];

const initialLogs = [
  { id: 1, time: "2026-03-30 10:35:22", level: "info", msg: "UAV-001 任务「朝阳路巡查」开始执行", user: "系统" },
  { id: 2, time: "2026-03-30 10:30:01", level: "warning", msg: "UAV-005 电量低于 25%，已触发返航", user: "系统" },
  { id: 3, time: "2026-03-30 10:25:44", level: "info", msg: "管理员 张管理员 修改了航线 RT-001", user: "admin" },
  { id: 4, time: "2026-03-30 10:18:33", level: "error", msg: "AI模型 LicensePlate-OCR 部署失败，设备连接超时", user: "系统" },
  { id: 5, time: "2026-03-30 10:10:00", level: "info", msg: "系统每日自检完成，所有设备状态正常", user: "系统" },
  { id: 6, time: "2026-03-30 09:50:15", level: "info", msg: "操作员 李操作员 登录系统", user: "operator" },
  { id: 7, time: "2026-03-30 09:45:00", level: "warning", msg: "BS-04 基站信号弱，建议检查", user: "系统" },
  { id: 8, time: "2026-03-30 09:12:30", level: "info", msg: "管理员 张管理员 登录系统", user: "admin" },
];

const droneData = [
  {
    id: "UAV-001", model: "DJI Matrice 300 RTK", firmware: "v08.01.10", status: "online",
    battery: 87, signal: 95, altitude: 120, speed: 8.5, temp: 42,
    location: "朝阳区北路段上空", flightHours: "328h 42m",
    payload: "禅思 H20T 双光云台", lastMission: "朝阳路巡查", ip: "192.168.10.101",
    serialNo: "3AADU300001001", nextMaintenance: "2026-05-01",
  },
  {
    id: "UAV-002", model: "DJI Matrice 300 RTK", firmware: "v08.01.10", status: "online",
    battery: 63, signal: 88, altitude: 80, speed: 6.2, temp: 39,
    location: "东城区主干道上空", flightHours: "215h 10m",
    payload: "禅思 H20 双光云台", lastMission: "东城路段监控", ip: "192.168.10.102",
    serialNo: "3AADU300001002", nextMaintenance: "2026-04-20",
  },
  {
    id: "UAV-003", model: "DJI Matrice 350 RTK", firmware: "v09.00.01", status: "online",
    battery: 74, signal: 92, altitude: 100, speed: 7.0, temp: 38,
    location: "西城区环路上空", flightHours: "112h 55m",
    payload: "禅思 H30T 多光谱", lastMission: "西城环路巡逻", ip: "192.168.10.103",
    serialNo: "3AADU350001003", nextMaintenance: "2026-06-15",
  },
  {
    id: "UAV-004", model: "DJI Matrice 300 RTK", firmware: "v08.01.10", status: "online",
    battery: 55, signal: 80, altitude: 90, speed: 5.8, temp: 41,
    location: "南区商业街上空", flightHours: "401h 03m",
    payload: "禅思 H20T 双光云台", lastMission: "南区商业街巡查", ip: "192.168.10.104",
    serialNo: "3AADU300001004", nextMaintenance: "2026-04-10",
  },
  {
    id: "UAV-005", model: "DJI Inspire 3", firmware: "v01.01.0100", status: "maintenance",
    battery: 0, signal: 0, altitude: 0, speed: 0, temp: 25,
    location: "维护站 BS-01 停机坪", flightHours: "88h 20m",
    payload: "DL 50mm F2.8 LS ASPH", lastMission: "影像采集任务", ip: "192.168.10.105",
    serialNo: "3AADI3NSPIRE005", nextMaintenance: "2026-04-02（进行中）",
  },
  {
    id: "UAV-006", model: "DJI Matrice 350 RTK", firmware: "v09.00.01", status: "online",
    battery: 91, signal: 97, altitude: 150, speed: 9.3, temp: 36,
    location: "北区高速立交上空", flightHours: "76h 44m",
    payload: "禅思 H30 多光谱", lastMission: "北区高速巡查", ip: "192.168.10.106",
    serialNo: "3AADU350001006", nextMaintenance: "2026-07-01",
  },
  {
    id: "UAV-007", model: "DJI Matrice 300 RTK", firmware: "v08.01.10", status: "online",
    battery: 42, signal: 75, altitude: 60, speed: 4.1, temp: 44,
    location: "中心广场上空", flightHours: "290h 18m",
    payload: "禅思 H20T 双光云台", lastMission: "广场安防巡查", ip: "192.168.10.107",
    serialNo: "3AADU300001007", nextMaintenance: "2026-05-20",
  },
  {
    id: "UAV-008", model: "DJI Inspire 3", firmware: "v01.01.0100", status: "offline",
    battery: 0, signal: 0, altitude: 0, speed: 0, temp: 22,
    location: "BS-03 停机坪（离线）", flightHours: "45h 30m",
    payload: "DL 35mm F2.8 LS ASPH", lastMission: "影像建模任务", ip: "—",
    serialNo: "3AADI3NSPIRE008", nextMaintenance: "2026-04-15",
  },
];

const stationData = [
  {
    id: "BS-01", name: "北区基站", location: "北环路1号", status: "online", drones: 3,
    ip: "192.168.1.11", lat: "39.9812° N", lng: "116.3862° E",
    signalStrength: 98, uptime: "99.8%", bandwidth: "120 Mbps",
    linkedDrones: ["UAV-001", "UAV-003", "UAV-006"],
    lastChecked: "2026-03-30 10:00",
    powerStatus: "正常供电", backupPower: "UPS 满电",
    antennaType: "全向天线 5.8GHz", coverage: "半径 5km",
    firmware: "v3.2.1", serialNo: "BS-NORTH-001",
  },
  {
    id: "BS-02", name: "南区基站", location: "南环路5号", status: "online", drones: 2,
    ip: "192.168.1.12", lat: "39.8654° N", lng: "116.4075° E",
    signalStrength: 91, uptime: "99.5%", bandwidth: "95 Mbps",
    linkedDrones: ["UAV-002", "UAV-004"],
    lastChecked: "2026-03-30 09:55",
    powerStatus: "正常供电", backupPower: "UPS 满电",
    antennaType: "定向天线 2.4GHz", coverage: "半径 4km",
    firmware: "v3.2.1", serialNo: "BS-SOUTH-002",
  },
  {
    id: "BS-03", name: "东区基站", location: "东大道12号", status: "online", drones: 3,
    ip: "192.168.1.13", lat: "39.9231° N", lng: "116.5143° E",
    signalStrength: 85, uptime: "98.9%", bandwidth: "88 Mbps",
    linkedDrones: ["UAV-007", "UAV-008", "UAV-006"],
    lastChecked: "2026-03-30 09:40",
    powerStatus: "正常供电", backupPower: "UPS 80%",
    antennaType: "全向天线 5.8GHz", coverage: "半径 4.5km",
    firmware: "v3.1.8", serialNo: "BS-EAST-003",
  },
  {
    id: "BS-04", name: "西区基站", location: "西环路8号", status: "offline", drones: 0,
    ip: "—", lat: "39.9408° N", lng: "116.2487° E",
    signalStrength: 0, uptime: "87.2%", bandwidth: "0 Mbps",
    linkedDrones: [],
    lastChecked: "2026-03-30 08:15",
    powerStatus: "供电异常", backupPower: "UPS 低电量 12%",
    antennaType: "全向天线 5.8GHz", coverage: "—",
    firmware: "v3.1.5", serialNo: "BS-WEST-004",
  },
];

const serverMetrics = Array.from({ length: 20 }, (_, i) => ({
  t: i,
  cpu: 40 + Math.sin(i * 0.5) * 20 + Math.random() * 10,
  mem: 60 + Math.cos(i * 0.4) * 10 + Math.random() * 5,
}));

const roleConfig: Record<string, { label: string; color: string; permissions: string[] }> = {
  admin: {
    label: "管理员",
    color: "#f59e0b",
    permissions: ["全部功能访问", "用户管理", "系统配置", "数据删除", "模型部署"],
  },
  operator: {
    label: "操作员",
    color: "#00b4ff",
    permissions: ["地图查看", "视频管理", "任务监控", "计划作业", "航线查看"],
  },
  analyst: {
    label: "数据分析师",
    color: "#a855f7",
    permissions: ["数据查看", "报表生成", "视频查看", "AI模型查看"],
  },
};

const settingsMenus = [
  { id: "users", icon: Users, label: "用户角色管理" },
  { id: "ops", icon: Server, label: "运维管理" },
  { id: "devices", icon: Radio, label: "设备管理" },
  { id: "notifications", icon: Bell, label: "通知设置" },
  { id: "security", icon: Lock, label: "安全策略" },
];

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: "success" | "info" | "error"; onClose: () => void }) {
  const colors = {
    success: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)", text: "#22c55e", icon: CheckCircle },
    info: { bg: "rgba(0,180,255,0.12)", border: "rgba(0,180,255,0.3)", text: "#00b4ff", icon: Info },
    error: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#ef4444", icon: AlertCircle },
  };
  const c = colors[type];
  const Icon = c.icon;
  return (
    <div
      className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl z-[100]"
      style={{ background: c.bg, border: `1px solid ${c.border}`, backdropFilter: "blur(8px)", minWidth: "260px" }}
    >
      <Icon size={16} color={c.text} />
      <span style={{ color: "#e2e8f0", fontSize: "13px" }}>{message}</span>
      <button onClick={onClose} className="ml-auto" style={{ color: "#4a6080" }}><X size={14} /></button>
    </div>
  );
}

export function SystemSettings() {
  const [activeMenu, setActiveMenu] = useState("users");
  const [userList, setUserList] = useState(initialUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<typeof initialUsers[0] | null>(null);
  const [editUserForm, setEditUserForm] = useState<typeof initialUsers[0] | null>(null);
  const [newUser, setNewUser] = useState({ name: "", username: "", role: "operator", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [logs, setLogs] = useState(initialLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Device detail panel states
  const [selectedDrone, setSelectedDrone] = useState<typeof droneData[0] | null>(null);
  const [selectedStation, setSelectedStation] = useState<typeof stationData[0] | null>(null);

  // Notification settings state
  const [notifSettings, setNotifSettings] = useState([
    { key: "low_battery", label: "无人机低电量告警 (<25%)", enabled: true },
    { key: "lost_signal", label: "无人机失联告警", enabled: true },
    { key: "mission_done", label: "任务完成通知", enabled: true },
    { key: "ai_event", label: "AI检测到异常事件", enabled: true },
    { key: "daily_report", label: "系统每日报告", enabled: false },
    { key: "maintenance", label: "设备维护提醒", enabled: true },
  ]);

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState([
    { key: "two_fa", label: "双因素认证 (2FA)", enabled: false },
    { key: "login_lock", label: "登录失败锁定 (5次)", enabled: true },
    { key: "op_log", label: "操作日志记录", enabled: true },
    { key: "tls", label: "数据传输加密 (TLS)", enabled: true },
    { key: "auto_logout", label: "自动登出 (30分钟)", enabled: true },
    { key: "ip_whitelist", label: "IP白名单限制", enabled: false },
  ]);

  const loggedInUser = JSON.parse(sessionStorage.getItem("drone_user") || "{}");

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.username) return;
    const u = {
      id: Date.now(),
      ...newUser,
      status: "active",
      lastLogin: "—",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setUserList((p) => [...p, u]);
    setShowAddUser(false);
    setNewUser({ name: "", username: "", role: "operator", password: "" });
    showToast("用户创建成功", "success");
  };

  const deleteUser = (id: number) => {
    setUserList((p) => p.filter((u) => u.id !== id));
    showToast("用户已删除", "info");
  };

  const toggleStatus = (id: number) =>
    setUserList((p) =>
      p.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u))
    );

  const openEditUser = (user: typeof initialUsers[0]) => {
    setEditUser(user);
    setEditUserForm({ ...user });
  };

  const handleSaveEditUser = () => {
    if (!editUserForm) return;
    setUserList((p) => p.map((u) => (u.id === editUserForm.id ? editUserForm : u)));
    setEditUser(null);
    setEditUserForm(null);
    showToast("用户信息已更新", "success");
  };

  const handleRefreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const timeStr = `2026-03-30 ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const newLog = {
        id: Date.now(),
        time: timeStr,
        level: "info",
        msg: "系统日志已刷新，所有指标运行正常",
        user: "系统",
      };
      setLogs((p) => [newLog, ...p]);
      setIsRefreshing(false);
      showToast("日志已刷新", "success");
    }, 900);
  };

  const handleExportLogs = () => {
    const header = "时间,级别,消息,操作用户\n";
    const rows = logs.map((l) => `"${l.time}","${l.level}","${l.msg}","${l.user}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "system_logs.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("日志已导出为 CSV 文件", "success");
  };

  const handleSaveSettings = (type: "notifications" | "security") => {
    showToast(type === "notifications" ? "通知设置已保存" : "安全策略已保存", "success");
  };

  const toggleNotif = (key: string) => {
    setNotifSettings((p) => p.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)));
  };

  const toggleSecurity = (key: string) => {
    setSecuritySettings((p) => p.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)));
  };

  const statusColor = (s: string) => s === "online" ? "#22c55e" : s === "maintenance" ? "#f59e0b" : "#4a6080";
  const statusLabel = (s: string) => s === "online" ? "在线" : s === "maintenance" ? "维护中" : "离线";

  return (
    <div className="flex h-full" style={{ background: "#080d1a" }}>
      {/* Left Menu */}
      <div className="flex-shrink-0" style={{ width: "200px", background: "#0b1120", borderRight: "1px solid #1e2d4a" }}>
        <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <h2 style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>系统设置</h2>
          <p style={{ color: "#4a6080", fontSize: "11px" }}>管理员控制台</p>
        </div>
        <nav className="p-3 space-y-1">
          {settingsMenus.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveMenu(id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all"
              style={{
                background: activeMenu === id ? "rgba(0,100,200,0.15)" : "transparent",
                border: `1px solid ${activeMenu === id ? "rgba(0,180,255,0.3)" : "transparent"}`,
              }}
            >
              <div className="flex items-center gap-2">
                <Icon size={14} color={activeMenu === id ? "#00b4ff" : "#6b8299"} />
                <span style={{ color: activeMenu === id ? "#e2e8f0" : "#6b8299", fontSize: "12px" }}>{label}</span>
              </div>
              <ChevronRight size={12} color={activeMenu === id ? "#00b4ff" : "#4a6080"} />
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">

        {/* ── User Role Management ── */}
        {activeMenu === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 700 }}>用户角色管理</h3>
                <p style={{ color: "#4a6080", fontSize: "12px" }}>管理系统用户与权限分配</p>
              </div>
              {loggedInUser.role === "admin" && (
                <button
                  onClick={() => setShowAddUser(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}
                >
                  <Plus size={14} /> 新增用户
                </button>
              )}
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(roleConfig).map(([key, val]) => (
                <div key={key} className="p-4 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={15} color={val.color} />
                    <span style={{ color: val.color, fontSize: "13px", fontWeight: 600 }}>{val.label}</span>
                    <span style={{ color: "#4a6080", fontSize: "11px" }}>
                      ({userList.filter((u) => u.role === key).length} 人)
                    </span>
                  </div>
                  <div className="space-y-1">
                    {val.permissions.map((p) => (
                      <div key={p} className="flex items-center gap-1.5">
                        <CheckCircle size={10} color={val.color} />
                        <span style={{ color: "#94a3b8", fontSize: "11px" }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* User Table */}
            <div className="rounded-xl overflow-hidden" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
                <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>用户列表</span>
                <span style={{ color: "#4a6080", fontSize: "11px", marginLeft: "8px" }}>共 {userList.length} 个用户</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e2d4a" }}>
                    {["用户名称", "账号", "角色", "状态", "最近登录", "注册日期", "操作"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left" style={{ color: "#4a6080", fontSize: "11px", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #0f1829" }} className="hover:bg-[rgba(0,100,200,0.05)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #0044aa, #0088ff)" }}
                          >
                            <User size={13} color="#fff" />
                          </div>
                          <span style={{ color: "#e2e8f0", fontSize: "12px" }}>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#6b8299", fontSize: "12px" }}>{user.username}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            background: `${roleConfig[user.role]?.color}22` || "#1e2d4a",
                            color: roleConfig[user.role]?.color || "#6b8299",
                            fontSize: "11px",
                          }}
                        >
                          {roleConfig[user.role]?.label || user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => loggedInUser.role === "admin" ? toggleStatus(user.id) : undefined} className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "animate-pulse" : ""}`}
                            style={{ background: user.status === "active" ? "#22c55e" : "#4a6080" }} />
                          <span style={{ color: user.status === "active" ? "#22c55e" : "#4a6080", fontSize: "11px" }}>
                            {user.status === "active" ? "启用" : "停用"}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#6b8299", fontSize: "11px" }}>{user.lastLogin}</td>
                      <td className="px-4 py-3" style={{ color: "#6b8299", fontSize: "11px" }}>{user.createdAt}</td>
                      <td className="px-4 py-3">
                        {loggedInUser.role === "admin" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditUser(user)}
                              className="p-1.5 rounded-lg transition-all hover:scale-110"
                              style={{ background: "rgba(0,100,200,0.15)", border: "1px solid rgba(0,180,255,0.25)" }}
                              title="编辑用户"
                            >
                              <Edit3 size={11} color="#00b4ff" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-1.5 rounded-lg transition-all hover:scale-110"
                              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                              title="删除用户"
                            >
                              <Trash2 size={11} color="#ef4444" />
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#2a3a50", fontSize: "11px" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Operations Management ── */}
        {activeMenu === "ops" && (
          <div>
            <div className="mb-6">
              <h3 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 700 }}>运维管理</h3>
              <p style={{ color: "#4a6080", fontSize: "12px" }}>系统健康监控与维护</p>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "CPU 使用率", value: "42%", ok: true, icon: Cpu },
                { label: "内存使用", value: "6.2 / 16 GB", ok: true, icon: Database },
                { label: "磁盘空间", value: "2.4 / 8 TB", ok: true, icon: HardDrive },
                { label: "网络延迟", value: "12 ms", ok: true, icon: Wifi },
              ].map(({ label, value, ok, icon: Icon }) => (
                <div key={label} className="p-4 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon size={13} color="#00b4ff" />
                      <span style={{ color: "#6b8299", fontSize: "11px" }}>{label}</span>
                    </div>
                    {ok ? <CheckCircle size={12} color="#22c55e" /> : <AlertTriangle size={12} color="#ef4444" />}
                  </div>
                  <div style={{ color: "#e2e8f0", fontSize: "18px", fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-5 mb-6">
              {["CPU 使用率趋势 (%)", "内存使用趋势 (%)"].map((title, idx) => (
                <div key={title} className="p-5 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                  <h4 style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>{title}</h4>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={serverMetrics}>
                      <defs>
                        <linearGradient id={`grad${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={idx === 0 ? "#00b4ff" : "#22c55e"} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={idx === 0 ? "#00b4ff" : "#22c55e"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="t" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: "#0b1120", border: "1px solid #1e2d4a", fontSize: "10px" }} itemStyle={{ color: "#e2e8f0" }} />
                      <Area type="monotone" dataKey={idx === 0 ? "cpu" : "mem"} stroke={idx === 0 ? "#00b4ff" : "#22c55e"} fill={`url(#grad${idx})`} strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>

            {/* System Logs */}
            <div className="rounded-xl overflow-hidden" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
                <div className="flex items-center gap-3">
                  <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>系统日志</span>
                  <span style={{ color: "#4a6080", fontSize: "11px" }}>{logs.length} 条记录</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRefreshLogs}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:border-[#00b4ff]/50"
                    style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#94a3b8", fontSize: "11px" }}
                  >
                    <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} /> 刷新
                  </button>
                  <button
                    onClick={handleExportLogs}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:border-[#00b4ff]/50"
                    style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#94a3b8", fontSize: "11px" }}
                  >
                    <Download size={11} /> 导出 CSV
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 px-4 py-3 rounded-lg"
                    style={{
                      background: "#060c1a",
                      border: `1px solid ${log.level === "error" ? "rgba(239,68,68,0.2)" : log.level === "warning" ? "rgba(245,158,11,0.15)" : "#1e2d4a"}`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                      style={{ background: log.level === "error" ? "#ef4444" : log.level === "warning" ? "#f59e0b" : "#22c55e" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span style={{ color: "#4a6080", fontSize: "10px", fontFamily: "monospace" }}>{log.time}</span>
                        <span
                          className="px-1.5 py-0.5 rounded"
                          style={{
                            background: log.level === "error" ? "rgba(239,68,68,0.15)" : log.level === "warning" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.1)",
                            color: log.level === "error" ? "#ef4444" : log.level === "warning" ? "#f59e0b" : "#22c55e",
                            fontSize: "9px",
                          }}
                        >
                          {log.level.toUpperCase()}
                        </span>
                        <span style={{ color: "#4a6080", fontSize: "10px" }}>[{log.user}]</span>
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "2px" }}>{log.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Devices ── */}
        {activeMenu === "devices" && (
          <div>
            <div className="mb-6">
              <h3 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 700 }}>设备管理</h3>
              <p style={{ color: "#4a6080", fontSize: "12px" }}>点击设备或基站卡片查看详细属性</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {/* Drones */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
                  <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>无人机设备</span>
                  <span style={{ color: "#4a6080", fontSize: "11px", marginLeft: "8px" }}>
                    {droneData.filter(d => d.status === "online").length} 台在线 / 共 {droneData.length} 台
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {droneData.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => { setSelectedDrone(d); setSelectedStation(null); }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left"
                      style={{
                        background: selectedDrone?.id === d.id ? "rgba(0,100,200,0.18)" : "#060c1a",
                        border: `1px solid ${selectedDrone?.id === d.id ? "rgba(0,180,255,0.45)" : "#1e2d4a"}`,
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor(d.status) }} />
                        <div>
                          <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }}>{d.id}</div>
                          <div style={{ color: "#4a6080", fontSize: "10px" }}>{d.model}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ color: "#4a6080", fontSize: "10px" }}>固件 {d.firmware}</div>
                        <div style={{ color: statusColor(d.status), fontSize: "10px" }}>{statusLabel(d.status)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stations */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
                  <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>地面基站</span>
                  <span style={{ color: "#4a6080", fontSize: "11px", marginLeft: "8px" }}>
                    {stationData.filter(s => s.status === "online").length} 个在线 / 共 {stationData.length} 个
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {stationData.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedStation(s); setSelectedDrone(null); }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left"
                      style={{
                        background: selectedStation?.id === s.id ? "rgba(0,100,200,0.18)" : "#060c1a",
                        border: `1px solid ${selectedStation?.id === s.id ? "rgba(0,180,255,0.45)" : "#1e2d4a"}`,
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Radio size={14} color={s.status === "online" ? "#00b4ff" : "#4a6080"} />
                        <div>
                          <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }}>{s.id} - {s.name}</div>
                          <div style={{ color: "#4a6080", fontSize: "10px" }}>{s.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ color: s.status === "online" ? "#22c55e" : "#4a6080", fontSize: "11px" }}>
                          {s.status === "online" ? "在线" : "离线"}
                        </div>
                        <div style={{ color: "#4a6080", fontSize: "10px" }}>关联 {s.drones} 台无人机</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detail Panel – Drone */}
            {selectedDrone && (
              <div className="mt-5 rounded-xl overflow-hidden" style={{ background: "#0b1120", border: "1px solid rgba(0,180,255,0.35)" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1e2d4a", background: "rgba(0,100,200,0.1)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: statusColor(selectedDrone.status) }} />
                    <span style={{ color: "#00b4ff", fontSize: "14px", fontWeight: 700 }}>{selectedDrone.id}</span>
                    <span style={{ color: "#e2e8f0", fontSize: "13px" }}>{selectedDrone.model}</span>
                    <span className="px-2 py-0.5 rounded-full" style={{ background: `${statusColor(selectedDrone.status)}22`, color: statusColor(selectedDrone.status), fontSize: "11px" }}>
                      {statusLabel(selectedDrone.status)}
                    </span>
                  </div>
                  <button onClick={() => setSelectedDrone(null)} style={{ color: "#4a6080" }}><X size={16} /></button>
                </div>
                <div className="p-5 grid grid-cols-3 gap-5">
                  {/* Real-time */}
                  <div>
                    <p style={{ color: "#4a6080", fontSize: "11px", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>实时状态</p>
                    <div className="space-y-2.5">
                      {[
                        { icon: Battery, label: "电量", value: `${selectedDrone.battery}%`, color: selectedDrone.battery > 30 ? "#22c55e" : "#f59e0b" },
                        { icon: Signal, label: "信号强度", value: `${selectedDrone.signal}%`, color: "#00b4ff" },
                        { icon: Navigation, label: "飞行高度", value: `${selectedDrone.altitude} m`, color: "#e2e8f0" },
                        { icon: Activity, label: "飞行速度", value: `${selectedDrone.speed} m/s`, color: "#e2e8f0" },
                        { icon: Thermometer, label: "机身温度", value: `${selectedDrone.temp} °C`, color: selectedDrone.temp > 60 ? "#ef4444" : "#e2e8f0" },
                      ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon size={12} color="#4a6080" />
                            <span style={{ color: "#6b8299", fontSize: "11px" }}>{label}</span>
                          </div>
                          <span style={{ color, fontSize: "12px", fontWeight: 600 }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Hardware */}
                  <div>
                    <p style={{ color: "#4a6080", fontSize: "11px", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>硬件信息</p>
                    <div className="space-y-2.5">
                      {[
                        { label: "序列号", value: selectedDrone.serialNo },
                        { label: "固件版本", value: selectedDrone.firmware },
                        { label: "搭载载荷", value: selectedDrone.payload },
                        { label: "管理 IP", value: selectedDrone.ip },
                        { label: "累计飞行", value: selectedDrone.flightHours },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-start justify-between gap-2">
                          <span style={{ color: "#6b8299", fontSize: "11px", flexShrink: 0 }}>{label}</span>
                          <span style={{ color: "#e2e8f0", fontSize: "11px", textAlign: "right" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Mission */}
                  <div>
                    <p style={{ color: "#4a6080", fontSize: "11px", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>任务 & 维护</p>
                    <div className="space-y-2.5">
                      {[
                        { icon: MapPin, label: "当前位置", value: selectedDrone.location },
                        { icon: Activity, label: "最近任务", value: selectedDrone.lastMission },
                        { icon: Clock, label: "下次维护", value: selectedDrone.nextMaintenance },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon size={11} color="#4a6080" />
                            <span style={{ color: "#6b8299", fontSize: "10px" }}>{label}</span>
                          </div>
                          <span style={{ color: "#e2e8f0", fontSize: "11px" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                    {/* Battery bar */}
                    {selectedDrone.status !== "offline" && (
                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span style={{ color: "#6b8299", fontSize: "10px" }}>电量</span>
                          <span style={{ color: selectedDrone.battery > 30 ? "#22c55e" : "#f59e0b", fontSize: "10px" }}>{selectedDrone.battery}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: "#1e2d4a" }}>
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${selectedDrone.battery}%`,
                              background: selectedDrone.battery > 50 ? "#22c55e" : selectedDrone.battery > 25 ? "#f59e0b" : "#ef4444",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Detail Panel – Station */}
            {selectedStation && (
              <div className="mt-5 rounded-xl overflow-hidden" style={{ background: "#0b1120", border: "1px solid rgba(0,180,255,0.35)" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1e2d4a", background: "rgba(0,100,200,0.1)" }}>
                  <div className="flex items-center gap-3">
                    <Radio size={16} color={selectedStation.status === "online" ? "#00b4ff" : "#4a6080"} />
                    <span style={{ color: "#00b4ff", fontSize: "14px", fontWeight: 700 }}>{selectedStation.id}</span>
                    <span style={{ color: "#e2e8f0", fontSize: "13px" }}>{selectedStation.name}</span>
                    <span className="px-2 py-0.5 rounded-full" style={{
                      background: selectedStation.status === "online" ? "rgba(34,197,94,0.15)" : "rgba(74,96,128,0.2)",
                      color: selectedStation.status === "online" ? "#22c55e" : "#4a6080", fontSize: "11px",
                    }}>
                      {selectedStation.status === "online" ? "在线" : "离线"}
                    </span>
                  </div>
                  <button onClick={() => setSelectedStation(null)} style={{ color: "#4a6080" }}><X size={16} /></button>
                </div>
                <div className="p-5 grid grid-cols-3 gap-5">
                  {/* Network */}
                  <div>
                    <p style={{ color: "#4a6080", fontSize: "11px", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>网络状态</p>
                    <div className="space-y-2.5">
                      {[
                        { icon: Signal, label: "信号强度", value: `${selectedStation.signalStrength}%`, color: selectedStation.signalStrength > 60 ? "#22c55e" : "#f59e0b" },
                        { icon: Wifi, label: "带宽", value: selectedStation.bandwidth, color: "#00b4ff" },
                        { icon: Activity, label: "在线率", value: selectedStation.uptime, color: "#22c55e" },
                        { icon: Globe, label: "管理 IP", value: selectedStation.ip, color: "#e2e8f0" },
                        { icon: Clock, label: "最近检测", value: selectedStation.lastChecked, color: "#6b8299" },
                      ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon size={12} color="#4a6080" />
                            <span style={{ color: "#6b8299", fontSize: "11px" }}>{label}</span>
                          </div>
                          <span style={{ color, fontSize: "11px", fontWeight: 600 }}>{value}</span>
                        </div>
                      ))}
                    </div>
                    {/* Signal bar */}
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span style={{ color: "#6b8299", fontSize: "10px" }}>信号强度</span>
                        <span style={{ color: selectedStation.signalStrength > 60 ? "#22c55e" : "#f59e0b", fontSize: "10px" }}>{selectedStation.signalStrength}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ background: "#1e2d4a" }}>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${selectedStation.signalStrength}%`,
                            background: selectedStation.signalStrength > 70 ? "#22c55e" : selectedStation.signalStrength > 40 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Hardware */}
                  <div>
                    <p style={{ color: "#4a6080", fontSize: "11px", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>硬件信息</p>
                    <div className="space-y-2.5">
                      {[
                        { label: "序列号", value: selectedStation.serialNo },
                        { label: "固件版本", value: selectedStation.firmware },
                        { label: "天线类型", value: selectedStation.antennaType },
                        { label: "覆盖范围", value: selectedStation.coverage },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-start justify-between gap-2">
                          <span style={{ color: "#6b8299", fontSize: "11px", flexShrink: 0 }}>{label}</span>
                          <span style={{ color: "#e2e8f0", fontSize: "11px", textAlign: "right" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Location & Power */}
                  <div>
                    <p style={{ color: "#4a6080", fontSize: "11px", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>位置 & 电力</p>
                    <div className="space-y-2.5">
                      {[
                        { icon: MapPin, label: "部署位置", value: selectedStation.location },
                        { icon: Globe, label: "纬度", value: selectedStation.lat },
                        { icon: Globe, label: "经度", value: selectedStation.lng },
                        { icon: Zap, label: "供电状态", value: selectedStation.powerStatus },
                        { icon: Battery, label: "备用电源", value: selectedStation.backupPower },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Icon size={11} color="#4a6080" />
                            <span style={{ color: "#6b8299", fontSize: "11px" }}>{label}</span>
                          </div>
                          <span style={{ color: "#e2e8f0", fontSize: "11px", textAlign: "right" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                    {/* Linked drones */}
                    {selectedStation.linkedDrones.length > 0 && (
                      <div className="mt-4 p-3 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
                        <p style={{ color: "#4a6080", fontSize: "10px", marginBottom: "6px" }}>关联无人机</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedStation.linkedDrones.map((id) => (
                            <span key={id} className="px-2 py-0.5 rounded" style={{ background: "rgba(0,100,200,0.2)", color: "#00b4ff", fontSize: "10px" }}>{id}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Notifications & Security ── */}
        {(activeMenu === "notifications" || activeMenu === "security") && (
          <div>
            <div className="mb-6">
              <h3 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 700 }}>
                {activeMenu === "notifications" ? "通知设置" : "安全策略"}
              </h3>
              <p style={{ color: "#4a6080", fontSize: "12px" }}>
                {activeMenu === "notifications" ? "配置告警和通知规则" : "系统访问与数据安全策略"}
              </p>
            </div>
            <div className="max-w-xl space-y-3">
              {activeMenu === "notifications"
                ? notifSettings.map(({ key, label, enabled }) => (
                  <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                    <div className="flex items-center gap-2">
                      <Bell size={13} color={enabled ? "#00b4ff" : "#4a6080"} />
                      <span style={{ color: "#e2e8f0", fontSize: "13px" }}>{label}</span>
                    </div>
                    <button
                      onClick={() => toggleNotif(key)}
                      className="relative flex-shrink-0 transition-all"
                      style={{ width: "42px", height: "22px" }}
                    >
                      <div
                        className="absolute inset-0 rounded-full transition-colors"
                        style={{ background: enabled ? "#0066ff" : "#1e2d4a" }}
                      />
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: enabled ? "24px" : "3px", transition: "left 0.2s ease" }}
                      />
                    </button>
                  </div>
                ))
                : securitySettings.map(({ key, label, enabled }) => (
                  <div key={key} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                    <div className="flex items-center gap-2">
                      <Lock size={13} color={enabled ? "#00b4ff" : "#4a6080"} />
                      <span style={{ color: "#e2e8f0", fontSize: "13px" }}>{label}</span>
                    </div>
                    <button
                      onClick={() => toggleSecurity(key)}
                      className="relative flex-shrink-0"
                      style={{ width: "42px", height: "22px" }}
                    >
                      <div
                        className="absolute inset-0 rounded-full transition-colors"
                        style={{ background: enabled ? "#0066ff" : "#1e2d4a" }}
                      />
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
                        style={{ left: enabled ? "24px" : "3px", transition: "left 0.2s ease" }}
                      />
                    </button>
                  </div>
                ))
              }
              <button
                onClick={() => handleSaveSettings(activeMenu as "notifications" | "security")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg mt-4 transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}
              >
                <Save size={13} /> 保存设置
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add User Modal ── */}
      {showAddUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(4,8,16,0.85)" }} onClick={() => setShowAddUser(false)}>
          <div className="rounded-2xl overflow-hidden" style={{ width: "440px", background: "#0b1120", border: "1px solid #1e2d4a" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
              <h3 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 700 }}>新增用户</h3>
              <button onClick={() => setShowAddUser(false)} style={{ color: "#4a6080" }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "真实姓名", key: "name", type: "text", placeholder: "请输入姓名" },
                { label: "登录账号", key: "username", type: "text", placeholder: "请输入用户名" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>{label}</label>
                  <input
                    type={type}
                    value={newUser[key as keyof typeof newUser]}
                    onChange={(e) => setNewUser((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-lg outline-none"
                    style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                  />
                </div>
              ))}
              <div>
                <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>角色</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                >
                  <option value="operator">操作员</option>
                  <option value="admin">管理员</option>
                  <option value="analyst">数据分析师</option>
                </select>
              </div>
              <div>
                <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>初始密码</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))}
                    placeholder="请设置初始密码"
                    className="w-full px-3 py-2.5 rounded-lg outline-none"
                    style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px", paddingRight: "40px" }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#4a6080" }}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #1e2d4a" }}>
              <button onClick={() => setShowAddUser(false)} className="px-4 py-2 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "13px" }}>取消</button>
              <button onClick={handleAddUser} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}>
                <Save size={13} /> 创建用户
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ── */}
      {editUser && editUserForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(4,8,16,0.85)" }} onClick={() => { setEditUser(null); setEditUserForm(null); }}>
          <div className="rounded-2xl overflow-hidden" style={{ width: "460px", background: "#0b1120", border: "1px solid #1e2d4a" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0044aa, #0088ff)" }}>
                  <User size={13} color="#fff" />
                </div>
                <div>
                  <h3 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 700 }}>编辑用户</h3>
                  <p style={{ color: "#4a6080", fontSize: "11px" }}>修改用户信息与权限</p>
                </div>
              </div>
              <button onClick={() => { setEditUser(null); setEditUserForm(null); }} style={{ color: "#4a6080" }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "真实姓名", key: "name", type: "text" },
                { label: "登录账号", key: "username", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>{label}</label>
                  <input
                    type={type}
                    value={editUserForm[key as keyof typeof editUserForm] as string}
                    onChange={(e) => setEditUserForm((p) => p ? { ...p, [key]: e.target.value } : p)}
                    className="w-full px-3 py-2.5 rounded-lg outline-none"
                    style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                  />
                </div>
              ))}
              <div>
                <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>角色</label>
                <select
                  value={editUserForm.role}
                  onChange={(e) => setEditUserForm((p) => p ? { ...p, role: e.target.value } : p)}
                  className="w-full px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                >
                  <option value="operator">操作员</option>
                  <option value="admin">管理员</option>
                  <option value="analyst">数据分析师</option>
                </select>
              </div>
              <div>
                <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>账号状态</label>
                <div className="flex gap-3">
                  {["active", "inactive"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setEditUserForm((p) => p ? { ...p, status: s } : p)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg flex-1 justify-center transition-all"
                      style={{
                        background: editUserForm.status === s ? (s === "active" ? "rgba(34,197,94,0.15)" : "rgba(74,96,128,0.15)") : "#060c1a",
                        border: `1px solid ${editUserForm.status === s ? (s === "active" ? "rgba(34,197,94,0.4)" : "#4a6080") : "#1e2d4a"}`,
                        color: editUserForm.status === s ? (s === "active" ? "#22c55e" : "#6b8299") : "#4a6080",
                        fontSize: "12px",
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: s === "active" ? "#22c55e" : "#4a6080" }} />
                      {s === "active" ? "启用" : "停用"}
                    </button>
                  ))}
                </div>
              </div>
              {/* Info row */}
              <div className="px-4 py-3 rounded-lg flex items-center gap-3" style={{ background: "rgba(0,100,200,0.08)", border: "1px solid rgba(0,180,255,0.15)" }}>
                <Info size={13} color="#00b4ff" />
                <span style={{ color: "#6b8299", fontSize: "11px" }}>注册日期：{editUser.createdAt} · 最近登录：{editUser.lastLogin}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #1e2d4a" }}>
              <button onClick={() => { setEditUser(null); setEditUserForm(null); }} className="px-4 py-2 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "13px" }}>取消</button>
              <button onClick={handleSaveEditUser} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}>
                <Save size={13} /> 保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
