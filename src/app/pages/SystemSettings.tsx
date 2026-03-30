import { useState } from "react";
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
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const users = [
  { id: 1, name: "张管理员", username: "admin", role: "admin", status: "active", lastLogin: "2026-03-30 09:12", createdAt: "2025-01-15" },
  { id: 2, name: "李操作员", username: "operator", role: "operator", status: "active", lastLogin: "2026-03-30 08:45", createdAt: "2025-02-20" },
  { id: 3, name: "王操作员", username: "wang_op", role: "operator", status: "active", lastLogin: "2026-03-29 17:30", createdAt: "2025-03-01" },
  { id: 4, name: "刘分析师", username: "liu_analyst", role: "analyst", status: "inactive", lastLogin: "2026-03-25 14:22", createdAt: "2025-03-10" },
  { id: 5, name: "陈操作员", username: "chen_op", role: "operator", status: "active", lastLogin: "2026-03-30 07:55", createdAt: "2025-04-05" },
];

const systemLogs = [
  { id: 1, time: "2026-03-30 10:35:22", level: "info", msg: "UAV-001 任务「朝阳路巡查」开始执行", user: "系统" },
  { id: 2, time: "2026-03-30 10:30:01", level: "warning", msg: "UAV-005 电量低于 25%，已触发返航", user: "系统" },
  { id: 3, time: "2026-03-30 10:25:44", level: "info", msg: "管理员 张管理员 修改了航线 RT-001", user: "admin" },
  { id: 4, time: "2026-03-30 10:18:33", level: "error", msg: "AI模型 LicensePlate-OCR 部署失败，设备连接超时", user: "系统" },
  { id: 5, time: "2026-03-30 10:10:00", level: "info", msg: "系统每日自检完成，所有设备状态正常", user: "系统" },
  { id: 6, time: "2026-03-30 09:50:15", level: "info", msg: "操作员 李操作员 登录系统", user: "operator" },
  { id: 7, time: "2026-03-30 09:45:00", level: "warning", msg: "BS-04 基站信号弱，建议检查", user: "系统" },
  { id: 8, time: "2026-03-30 09:12:30", level: "info", msg: "管理员 张管理员 登录系统", user: "admin" },
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

export function SystemSettings() {
  const [activeMenu, setActiveMenu] = useState("users");
  const [userList, setUserList] = useState(users);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<typeof users[0] | null>(null);
  const [newUser, setNewUser] = useState({ name: "", username: "", role: "operator", password: "" });
  const [showPw, setShowPw] = useState(false);
  const loggedInUser = JSON.parse(sessionStorage.getItem("drone_user") || "{}");

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
  };

  const deleteUser = (id: number) => setUserList((p) => p.filter((u) => u.id !== id));

  const toggleStatus = (id: number) =>
    setUserList((p) =>
      p.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u))
    );

  return (
    <div className="flex h-full" style={{ background: "#080d1a" }}>
      {/* Left Menu */}
      <div
        className="flex-shrink-0"
        style={{ width: "200px", background: "#0b1120", borderRight: "1px solid #1e2d4a" }}
      >
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
        {/* User Role Management */}
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
                    <tr key={user.id} style={{ borderBottom: "1px solid #0f1829" }}>
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
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className="flex items-center gap-1.5"
                        >
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
                        {loggedInUser.role === "admin" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditUser(user)}
                              className="p-1.5 rounded-lg"
                              style={{ background: "rgba(0,100,200,0.15)", border: "1px solid rgba(0,180,255,0.25)" }}
                            >
                              <Edit3 size={11} color="#00b4ff" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-1.5 rounded-lg"
                              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                            >
                              <Trash2 size={11} color="#ef4444" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Operations Management */}
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
                <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>系统日志</span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "11px" }}>
                    <RefreshCw size={11} /> 刷新
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "11px" }}>
                    <Download size={11} /> 导出
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {systemLogs.map((log) => (
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

        {/* Devices */}
        {activeMenu === "devices" && (
          <div>
            <div className="mb-6">
              <h3 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 700 }}>设备管理</h3>
              <p style={{ color: "#4a6080", fontSize: "12px" }}>无人机与基站设备配置</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {/* Drones */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
                  <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>无人机设备</span>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { id: "UAV-001", model: "DJI Matrice 300 RTK", firmware: "v08.01.10", status: "online" },
                    { id: "UAV-002", model: "DJI Matrice 300 RTK", firmware: "v08.01.10", status: "online" },
                    { id: "UAV-003", model: "DJI Matrice 350 RTK", firmware: "v09.00.01", status: "online" },
                    { id: "UAV-004", model: "DJI Matrice 300 RTK", firmware: "v08.01.10", status: "online" },
                    { id: "UAV-005", model: "DJI Inspire 3", firmware: "v01.01.0100", status: "maintenance" },
                    { id: "UAV-006", model: "DJI Matrice 350 RTK", firmware: "v09.00.01", status: "online" },
                    { id: "UAV-007", model: "DJI Matrice 300 RTK", firmware: "v08.01.10", status: "online" },
                    { id: "UAV-008", model: "DJI Inspire 3", firmware: "v01.01.0100", status: "offline" },
                  ].map((d) => (
                    <div key={d.id} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.status === "online" ? "#22c55e" : d.status === "maintenance" ? "#f59e0b" : "#4a6080" }} />
                        <div>
                          <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }}>{d.id}</div>
                          <div style={{ color: "#4a6080", fontSize: "10px" }}>{d.model}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ color: "#4a6080", fontSize: "10px" }}>固件 {d.firmware}</div>
                        <div style={{ color: d.status === "online" ? "#22c55e" : d.status === "maintenance" ? "#f59e0b" : "#4a6080", fontSize: "10px" }}>
                          {d.status === "online" ? "在线" : d.status === "maintenance" ? "维护中" : "离线"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stations */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
                  <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>地面基站</span>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { id: "BS-01", name: "北区基站", location: "北环路1号", status: "online", drones: 3 },
                    { id: "BS-02", name: "南区基站", location: "南环路5号", status: "online", drones: 2 },
                    { id: "BS-03", name: "东区基站", location: "东大道12号", status: "online", drones: 3 },
                    { id: "BS-04", name: "西区基站", location: "西环路8号", status: "offline", drones: 0 },
                  ].map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications & Security */}
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
            <div className="max-w-xl space-y-4">
              {activeMenu === "notifications" ? (
                [
                  { label: "无人机低电量告警 (<25%)", enabled: true },
                  { label: "无人机失联告警", enabled: true },
                  { label: "任务完成通知", enabled: true },
                  { label: "AI检测到异常事件", enabled: true },
                  { label: "系统每日报告", enabled: false },
                  { label: "设备维护提醒", enabled: true },
                ].map(({ label, enabled }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                    <span style={{ color: "#e2e8f0", fontSize: "13px" }}>{label}</span>
                    <div
                      className="w-10 h-5 rounded-full relative cursor-pointer"
                      style={{ background: enabled ? "#0066ff" : "#1e2d4a" }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ transform: enabled ? "translateX(22px)" : "translateX(2px)" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                [
                  { label: "双因素认证 (2FA)", enabled: false },
                  { label: "登录失败锁定 (5次)", enabled: true },
                  { label: "操作日志记录", enabled: true },
                  { label: "数据传输加密 (TLS)", enabled: true },
                  { label: "自动登出 (30分钟)", enabled: true },
                  { label: "IP白名单限制", enabled: false },
                ].map(({ label, enabled }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                    <span style={{ color: "#e2e8f0", fontSize: "13px" }}>{label}</span>
                    <div
                      className="w-10 h-5 rounded-full relative cursor-pointer"
                      style={{ background: enabled ? "#0066ff" : "#1e2d4a" }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ transform: enabled ? "translateX(22px)" : "translateX(2px)" }}
                      />
                    </div>
                  </div>
                ))
              )}
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg mt-4"
                style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}
              >
                <Save size={13} /> 保存设置
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
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
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#4a6080" }}
                  >
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
    </div>
  );
}
