import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Plane, Shield, Wifi, Lock } from "lucide-react";

const USERS = [
  { username: "admin", password: "admin123", name: "张管理员", role: "admin" },
  { username: "operator", password: "op123", name: "李操作员", role: "operator" },
];

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "operator">("operator");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const user = USERS.find(
      (u) => u.username === username && u.password === password && u.role === selectedRole
    );

    if (user) {
      sessionStorage.setItem("drone_user", JSON.stringify(user));
      navigate("/map");
    } else {
      setError("用户名或密码错误，请重试");
    }
    setLoading(false);
  };

  const fillDemo = (role: "admin" | "operator") => {
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin123");
      setSelectedRole("admin");
    } else {
      setUsername("operator");
      setPassword("op123");
      setSelectedRole("operator");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "#040810" }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0" style={{ opacity: 0.15 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00b4ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Radial Glow */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,100,200,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Scan Lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
          opacity: 0.3,
        }}
      />

      {/* Floating Drone Indicators */}
      {[
        { x: "10%", y: "20%", delay: "0s" },
        { x: "85%", y: "15%", delay: "1s" },
        { x: "75%", y: "75%", delay: "2s" },
        { x: "15%", y: "80%", delay: "0.5s" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: pos.x, top: pos.y, animationDelay: pos.delay }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "#00b4ff",
              boxShadow: "0 0 12px #00b4ff",
              animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
        </div>
      ))}

      {/* Login Card */}
      <div
        className="relative w-full max-w-md mx-4"
        style={{
          background: "linear-gradient(135deg, rgba(10,20,40,0.95) 0%, rgba(8,15,30,0.98) 100%)",
          border: "1px solid rgba(0,180,255,0.2)",
          borderRadius: "16px",
          boxShadow: "0 0 60px rgba(0,100,200,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div
            className="inline-flex items-center justify-center rounded-2xl mb-4"
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #0044aa, #00b4ff)",
              boxShadow: "0 0 30px rgba(0,180,255,0.4)",
            }}
          >
            <Plane size={32} color="#fff" />
          </div>
          <h1 style={{ color: "#e2e8f0", fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>
            低空无人机智能分析系统
          </h1>
          <p style={{ color: "#4a6080", fontSize: "13px" }}>城市交通治理平台 · Urban Sky Intelligence</p>
        </div>

        {/* Role Selector */}
        <div className="px-8 mb-6">
          <div
            className="flex rounded-lg p-1"
            style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}
          >
            {[
              { key: "operator", label: "操作员登录" },
              { key: "admin", label: "管理员登录" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedRole(key as "admin" | "operator");
                  setUsername("");
                  setPassword("");
                }}
                className="flex-1 py-2 rounded-md transition-all duration-200"
                style={{
                  background: selectedRole === key ? "linear-gradient(135deg, #0044bb, #0088ff)" : "transparent",
                  color: selectedRole === key ? "#fff" : "#4a6080",
                  fontSize: "13px",
                  fontWeight: selectedRole === key ? 600 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="px-8 pb-8 space-y-4">
          <div>
            <label style={{ color: "#6b8299", fontSize: "12px", display: "block", marginBottom: "6px" }}>
              用户名
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={selectedRole === "admin" ? "admin" : "operator"}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200"
                style={{
                  background: "#060c1a",
                  border: "1px solid #1e2d4a",
                  color: "#e2e8f0",
                  fontSize: "14px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#00b4ff")}
                onBlur={(e) => (e.target.style.borderColor = "#1e2d4a")}
              />
            </div>
          </div>

          <div>
            <label style={{ color: "#6b8299", fontSize: "12px", display: "block", marginBottom: "6px" }}>
              密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200"
                style={{
                  background: "#060c1a",
                  border: "1px solid #1e2d4a",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  paddingRight: "44px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#00b4ff")}
                onBlur={(e) => (e.target.style.borderColor = "#1e2d4a")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#4a6080" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="px-4 py-3 rounded-lg"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "13px" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: loading
                ? "rgba(0,100,200,0.5)"
                : "linear-gradient(135deg, #0055cc, #00b4ff)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              boxShadow: loading ? "none" : "0 0 20px rgba(0,180,255,0.3)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <Lock size={16} />
            {loading ? "验证中..." : "安全登录"}
          </button>

          {/* Demo Buttons */}
          <div className="pt-2">
            <p style={{ color: "#4a6080", fontSize: "11px", textAlign: "center", marginBottom: "8px" }}>
              快速体验（演示账号）
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo("operator")}
                className="flex-1 py-2 rounded-lg transition-colors"
                style={{ background: "#0a1628", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "12px" }}
              >
                操作员体验
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="flex-1 py-2 rounded-lg transition-colors"
                style={{ background: "#0a1628", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "12px" }}
              >
                管理员体验
              </button>
            </div>
          </div>
        </form>

        {/* Status Bar */}
        <div
          className="px-8 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid #1e2d4a", background: "rgba(0,0,0,0.2)", borderRadius: "0 0 16px 16px" }}
        >
          <div className="flex items-center gap-1.5">
            <Shield size={11} color="#22c55e" />
            <span style={{ color: "#22c55e", fontSize: "10px" }}>TLS 1.3 加密传输</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi size={11} color="#00b4ff" />
            <span style={{ color: "#4a6080", fontSize: "10px" }}>v2.4.1 · 系统正常</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
