import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Route,
  Navigation,
  ChevronDown,
  ChevronUp,
  Map,
  Settings,
  Play,
  Eye,
  Edit3,
  X,
  Check,
  ArrowUp,
  ArrowDown,
  Move,
  Camera,
  Clock,
  Wind,
  RotateCw,
  Layers,
  AlertTriangle,
} from "lucide-react";

interface Waypoint {
  id: number;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  hoverTime: number;
  action: string;
  gimbalPitch: number;
  yawMode: string;
  x: number;
  y: number;
}

interface Route {
  id: string;
  name: string;
  waypoints: Waypoint[];
  takeoffAlt: number;
  landingAlt: number;
  direction: number;
  returnSpeed: number;
  flySpeed: number;
  status: string;
  type?: string;
  description?: string; 
}

const initialRoutes: Route[] = [
  {
    id: "RT-001", name: "朝阳路巡查航线", status: "active",
    takeoffAlt: 30, landingAlt: 20, direction: 45, returnSpeed: 12, flySpeed: 8,
    type: "单次",
    description: "朝阳路重点区域日常巡查，覆盖主要路口和商业区",
    waypoints: [
      { id: 1, lat: 30.5920, lng: 114.3050, altitude: 120, speed: 8, hoverTime: 10, action: "拍照", gimbalPitch: -45, yawMode: "自动", x: 20, y: 30 },
      { id: 2, lat: 30.5940, lng: 114.3080, altitude: 100, speed: 10, hoverTime: 5, action: "录像", gimbalPitch: -30, yawMode: "手动", x: 40, y: 25 },
      { id: 3, lat: 30.5960, lng: 114.3060, altitude: 130, speed: 7, hoverTime: 15, action: "悬停", gimbalPitch: -60, yawMode: "航向锁定", x: 55, y: 45 },
      { id: 4, lat: 30.5945, lng: 114.3040, altitude: 110, speed: 9, hoverTime: 8, action: "拍照", gimbalPitch: -45, yawMode: "自动", x: 35, y: 60 },
      { id: 5, lat: 30.5925, lng: 114.3045, altitude: 120, speed: 8, hoverTime: 10, action: "录像", gimbalPitch: -30, yawMode: "手动", x: 18, y: 55 },
    ],
  },
  {
    id: "RT-002", name: "南环快速路航线", status: "active",
    takeoffAlt: 25, landingAlt: 15, direction: 90, returnSpeed: 15, flySpeed: 12,
    type: "循环",
    description: "南环快速路交通监控，循环巡检",
    waypoints: [
      { id: 1, lat: 30.5800, lng: 114.2900, altitude: 80, speed: 12, hoverTime: 5, action: "录像", gimbalPitch: -30, yawMode: "航向锁定", x: 15, y: 70 },
      { id: 2, lat: 30.5800, lng: 114.3100, altitude: 80, speed: 12, hoverTime: 5, action: "录像", gimbalPitch: -30, yawMode: "航向锁定", x: 65, y: 70 },
      { id: 3, lat: 30.5800, lng: 114.3300, altitude: 80, speed: 12, hoverTime: 5, action: "录像", gimbalPitch: -30, yawMode: "航向锁定", x: 85, y: 72 },
    ],
  },
];

const actions = ["拍照", "录像", "悬停", "变焦", "停止录像"];
const yawModes = ["自动", "手动", "航向锁定", "兴趣点环绕"];

export function RoutePlanning() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [editingRoute, setEditingRoute] = useState(false);
  const [showNewRoute, setShowNewRoute] = useState(false);
  const [newRouteName, setNewRouteName] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedWp, setExpandedWp] = useState<number | null>(1);
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const updateWaypoint = (id: number, field: keyof Waypoint, value: number | string) => {
    const updated = {
      ...selectedRoute,
      waypoints: selectedRoute.waypoints.map((wp) =>
        wp.id === id ? { ...wp, [field]: value } : wp
      ),
    };
    setSelectedRoute(updated);
    setRoutes((p) => p.map((r) => (r.id === selectedRoute.id ? updated : r)));
  };

  const addWaypoint = () => {
    const last = selectedRoute.waypoints[selectedRoute.waypoints.length - 1];
    const newWp: Waypoint = {
      id: Date.now(),
      lat: last.lat + 0.001,
      lng: last.lng + 0.001,
      altitude: last.altitude,
      speed: last.speed,
      hoverTime: 5,
      action: "拍照",
      gimbalPitch: -45,
      yawMode: "自动",
      x: Math.min(90, last.x + 15),
      y: Math.max(10, last.y - 10),
    };
    const updated = { ...selectedRoute, waypoints: [...selectedRoute.waypoints, newWp] };
    setSelectedRoute(updated);
    setRoutes((p) => p.map((r) => (r.id === selectedRoute.id ? updated : r)));
  };

  const removeWaypoint = (id: number) => {
    const updated = { ...selectedRoute, waypoints: selectedRoute.waypoints.filter((wp) => wp.id !== id) };
    setSelectedRoute(updated);
    setRoutes((p) => p.map((r) => (r.id === selectedRoute.id ? updated : r)));
  };

  const createRoute = () => {
    if (!newRouteName.trim()) return;
    const route: Route = {
      id: `RT-${String(routes.length + 1).padStart(3, "0")}`,
      name: newRouteName,
      status: "draft",
      takeoffAlt: 30, landingAlt: 20, direction: 0, returnSpeed: 12, flySpeed: 8,
      type: "单次",
      description: "",
      waypoints: [
        { id: 1, lat: 30.5928, lng: 114.3055, altitude: 100, speed: 8, hoverTime: 10, action: "拍照", gimbalPitch: -45, yawMode: "自动", x: 50, y: 50 },
      ],
    };
    setRoutes((p) => [...p, route]);
    setSelectedRoute(route);
    setShowNewRoute(false);
    setNewRouteName("");
  };

  const updateRouteParam = (field: keyof Route, value: number | string) => {
    const updated = { ...selectedRoute, [field]: value };
    setSelectedRoute(updated);
    setRoutes((p) => p.map((r) => (r.id === selectedRoute.id ? updated : r)));

  };
  const handleSave = () => {
      // 显示提示
    setShowToast(true);
      // 3秒后自动隐藏
    setTimeout(() => setShowToast(false), 3000);
  };
  const handleExecute = () => {
  setShowConfirm(true);
  };

  const confirmExecute = () => {
    setShowConfirm(false);
    // 这里可以添加实际执行航线的逻辑
    // 例如：调用API、显示执行中状态等
    alert(`正在执行航线：${selectedRoute.name}`);
  };

  const cancelExecute = () => {
    setShowConfirm(false);
  };

  return (
    <div className="flex h-full" style={{ background: "#080d1a" }}>
      {/* Left Panel - Route List */}
      <div
        className="flex-shrink-0 flex flex-col"
        style={{ width: "220px", background: "#0b1120", borderRight: "1px solid #1e2d4a" }}
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <div>
            <h2 style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>航线管理</h2>
            <p style={{ color: "#4a6080", fontSize: "11px" }}>{routes.length} 条航线</p>
          </div>
          <button
            onClick={() => setShowNewRoute(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)" }}
          >
            <Plus size={14} color="#fff" />
          </button>
        </div>
        {showNewRoute && (
          <div className="p-3" style={{ borderBottom: "1px solid #1e2d4a", background: "#060c1a" }}>
            <input
              type="text"
              value={newRouteName}
              onChange={(e) => setNewRouteName(e.target.value)}
              placeholder="航线名称..."
              className="w-full px-3 py-2 rounded-lg outline-none mb-2"
              style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "12px" }}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={createRoute} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1" style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#22c55e", fontSize: "11px" }}>
                <Check size={11} /> 创建
              </button>
              <button onClick={() => setShowNewRoute(false)} className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1" style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "11px" }}>
                <X size={11} /> 取消
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className="w-full text-left p-3 rounded-lg transition-all"
              style={{
                background: selectedRoute.id === route.id ? "rgba(0,100,200,0.15)" : "#060c1a",
                border: `1px solid ${selectedRoute.id === route.id ? "rgba(0,180,255,0.4)" : "#1e2d4a"}`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }} className="truncate">{route.name}</span>
                <span style={{
                  color: route.status === "active" ? "#22c55e" : "#4a6080",
                  fontSize: "9px",
                  flexShrink: 0,
                  marginLeft: "4px",
                }}>
                  {route.status === "active" ? "●" : "○"}
                </span>
              </div>
              <div style={{ color: "#4a6080", fontSize: "10px" }}>
                {route.id} · {route.waypoints.length} 航点
              </div>
              <div style={{ color: "#4a6080", fontSize: "10px" }}>
                飞行速度: {route.flySpeed} m/s
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center - Map Preview */}
      <div className="flex-1 relative overflow-hidden" style={{ minWidth: 0 }}>
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: previewMode ? "rgba(34,197,94,0.2)" : "#0b1120",
              border: `1px solid ${previewMode ? "rgba(34,197,94,0.4)" : "#1e2d4a"}`,
              color: previewMode ? "#22c55e" : "#6b8299",
              fontSize: "12px",
            }}
          >
            <Eye size={12} /> {previewMode ? "退出预览" : "预览飞行"}
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "12px" }}
          >
            <Layers size={12} /> 图层
          </button>
        </div>

        {/* Map */}
        <div
          className="absolute inset-0"
          style={{
            background: "#060c18",
            backgroundImage: "linear-gradient(rgba(0,100,200,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,200,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          {/* City Block Shapes */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
            <rect x="10%" y="20%" width="15%" height="10%" fill="#00b4ff" opacity="0.1" stroke="#00b4ff" strokeWidth="0.5" rx="2" />
            <rect x="30%" y="15%" width="20%" height="12%" fill="#00b4ff" opacity="0.1" stroke="#00b4ff" strokeWidth="0.5" rx="2" />
            <rect x="55%" y="22%" width="18%" height="15%" fill="#00b4ff" opacity="0.1" stroke="#00b4ff" strokeWidth="0.5" rx="2" />
            <rect x="12%" y="45%" width="22%" height="18%" fill="#00b4ff" opacity="0.1" stroke="#00b4ff" strokeWidth="0.5" rx="2" />
            <rect x="40%" y="50%" width="16%" height="20%" fill="#00b4ff" opacity="0.1" stroke="#00b4ff" strokeWidth="0.5" rx="2" />
            <rect x="65%" y="55%" width="20%" height="15%" fill="#00b4ff" opacity="0.1" stroke="#00b4ff" strokeWidth="0.5" rx="2" />
            {/* Roads */}
            <line x1="0" y1="38%" x2="100%" y2="38%" stroke="#1e4080" strokeWidth="3" />
            <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#1e4080" strokeWidth="2" />
            <line x1="28%" y1="0" x2="28%" y2="100%" stroke="#1e4080" strokeWidth="3" />
            <line x1="60%" y1="0" x2="60%" y2="100%" stroke="#1e4080" strokeWidth="2" />
          </svg>
        </div>

        {/* Route SVG */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
          {/* Route Path */}
          {selectedRoute.waypoints.length > 1 && (
            <>
              <polyline
                points={selectedRoute.waypoints.map((wp) => `${wp.x}%,${wp.y}%`).join(" ")}
                fill="none"
                stroke="#00b4ff"
                strokeWidth="2"
                strokeDasharray={previewMode ? "none" : "6,3"}
                opacity="0.7"
              />
              {/* Return path dashed */}
              <line
                x1={`${selectedRoute.waypoints[selectedRoute.waypoints.length - 1].x}%`}
                y1={`${selectedRoute.waypoints[selectedRoute.waypoints.length - 1].y}%`}
                x2={`${selectedRoute.waypoints[0].x}%`}
                y2={`${selectedRoute.waypoints[0].y}%`}
                stroke="#a855f7"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            </>
          )}
          {/* Direction arrows */}
          {selectedRoute.waypoints.slice(0, -1).map((wp, i) => {
            const next = selectedRoute.waypoints[i + 1];
            const mx = (wp.x + next.x) / 2;
            const my = (wp.y + next.y) / 2;
            return (
              <circle key={i} cx={`${mx}%`} cy={`${my}%`} r="3" fill="#00b4ff" opacity="0.5" />
            );
          })}
        </svg>

        {/* Waypoints */}
        {selectedRoute.waypoints.map((wp, i) => (
          <div
            key={wp.id}
            className="absolute cursor-pointer"
            style={{ left: `${wp.x}%`, top: `${wp.y}%`, transform: "translate(-50%, -50%)", zIndex: 10 }}
            onClick={() => setSelectedWaypoint(selectedWaypoint?.id === wp.id ? null : wp)}
          >
            <div className="relative flex items-center justify-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: i === 0 ? "rgba(34,197,94,0.3)" : i === selectedRoute.waypoints.length - 1 ? "rgba(239,68,68,0.3)" : "rgba(0,100,200,0.3)",
                  border: `2px solid ${i === 0 ? "#22c55e" : i === selectedRoute.waypoints.length - 1 ? "#ef4444" : "#00b4ff"}`,
                  boxShadow: selectedWaypoint?.id === wp.id ? `0 0 15px ${i === 0 ? "#22c55e" : "#00b4ff"}` : "none",
                }}
              >
                <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700 }}>{i + 1}</span>
              </div>
              <div
                className="absolute -bottom-5 whitespace-nowrap px-1 py-0.5 rounded text-center"
                style={{ background: "rgba(8,13,26,0.9)", color: "#94a3b8", fontSize: "9px", left: "50%", transform: "translateX(-50%)" }}
              >
                {wp.action}
              </div>
            </div>
          </div>
        ))}

        {/* Scale Bar */}
        <div className="absolute bottom-4 left-4 flex items-end gap-2">
          <div>
            <div style={{ width: "80px", height: "3px", background: "#00b4ff", opacity: 0.6, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "1px", background: "#00b4ff" }} />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "1px", background: "#00b4ff" }} />
            </div>
            <div style={{ color: "#4a6080", fontSize: "9px", textAlign: "center", marginTop: "2px" }}>500m</div>
          </div>
        </div>

        {/* Route Info Overlay */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-xl"
          style={{ background: "rgba(11,17,32,0.9)", border: "1px solid #1e2d4a" }}
        >
          <div className="flex items-center gap-1.5">
            <Navigation size={11} color="#00b4ff" />
            <span style={{ color: "#4a6080", fontSize: "10px" }}>总距离:</span>
            <span style={{ color: "#e2e8f0", fontSize: "11px" }}>2.8 km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={11} color="#22c55e" />
            <span style={{ color: "#4a6080", fontSize: "10px" }}>预计时长:</span>
            <span style={{ color: "#e2e8f0", fontSize: "11px" }}>22 min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowUp size={11} color="#a855f7" />
            <span style={{ color: "#4a6080", fontSize: "10px" }}>最高高度:</span>
            <span style={{ color: "#e2e8f0", fontSize: "11px" }}>130 m</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Settings */}
      <div
        className="flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ width: "280px", background: "#0b1120", borderLeft: "1px solid #1e2d4a" }}
      >
        {/* Route Settings */}
        <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#00b4ff", fontSize: "13px", fontWeight: 700 }}>{selectedRoute.name}</h3>
            <button style={{ color: "#4a6080" }}><Edit3 size={13} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "起飞高度(m)", field: "takeoffAlt", value: selectedRoute.takeoffAlt },
              { label: "降落高度(m)", field: "landingAlt", value: selectedRoute.landingAlt },
              { label: "航线方向(°)", field: "direction", value: selectedRoute.direction },
              { label: "飞行速度(m/s)", field: "flySpeed", value: selectedRoute.flySpeed },
              { label: "返航速度(m/s)", field: "returnSpeed", value: selectedRoute.returnSpeed },
            ].map(({ label, field, value }) => {
              // 如果是航线方向，显示带罗盘的输入框
              if (field === "direction") {
                return (
                  <div key={field} className="col-span-2">
                    <label style={{ color: "#6b8299", fontSize: "10px", display: "block", marginBottom: "4px" }}>{label}</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => updateRouteParam(field as keyof Route, Number(e.target.value))}
                        className="flex-1 px-3 py-2 rounded-lg outline-none"
                        style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "12px" }}
                      />
                      {/* 罗盘指示器 */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center relative"
                        style={{ 
                          background: "#060c1a", 
                          border: "1px solid #1e2d4a",
                        }}
                      >
                        {/* 刻度线 - 四个方向 */}
                        <div className="absolute inset-0 rounded-full">
                          <div style={{ position: "absolute", top: "4px", left: "50%", transform: "translateX(-50%)", color: "#ef4444", fontSize: "10px", fontWeight: "bold" }}>N</div>
                          <div style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", color: "#6b8299", fontSize: "10px" }}>E</div>
                          <div style={{ position: "absolute", bottom: "4px", left: "50%", transform: "translateX(-50%)", color: "#6b8299", fontSize: "10px" }}>S</div>
                          <div style={{ position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)", color: "#6b8299", fontSize: "10px" }}>W</div>
                        </div>
                        
                        {/* 指针 */}
                        <div 
                          className="absolute w-0.5 h-4 rounded-full"
                          style={{
                            background: "#00b4ff",
                            transformOrigin: "bottom center",
                            transform: `rotate(${selectedRoute.direction}deg) translateY(-8px)`,
                            bottom: "50%",
                            left: "50%",
                            marginLeft: "-1px",
                          }}
                        />
                        {/* 中心点 */}
                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute" />
                      </div>
                    </div>
                  </div>
                );
              }
              
              // 其他字段正常显示
              return (
                <div key={field} className={field === "direction" ? "col-span-2" : ""}>
                  <label style={{ color: "#6b8299", fontSize: "10px", display: "block", marginBottom: "4px" }}>{label}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateRouteParam(field as keyof Route, Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "12px" }}
                  />
                </div>
              );
            })}
          </div>
          
          {/* 航线类型 */}
          <div className="mt-4">
            <label style={{ color: "#6b8299", fontSize: "10px", display: "block", marginBottom: "4px" }}>航线类型</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateRouteParam("type", "单次")}
                style={{
                  flex: 1,
                  background: selectedRoute.type === "单次" ? "rgba(0,180,255,0.3)" : "#060c1a",
                  border: `1px solid ${selectedRoute.type === "单次" ? "#00b4ff" : "#1e2d4a"}`,
                  color: selectedRoute.type === "单次" ? "#00b4ff" : "#6b8299",
                  padding: "6px 0",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
              >
                单次
              </button>
              <button
                onClick={() => updateRouteParam("type", "循环")}
                style={{
                  flex: 1,
                  background: selectedRoute.type === "循环" ? "rgba(0,180,255,0.3)" : "#060c1a",
                  border: `1px solid ${selectedRoute.type === "循环" ? "#00b4ff" : "#1e2d4a"}`,
                  color: selectedRoute.type === "循环" ? "#00b4ff" : "#6b8299",
                  padding: "6px 0",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
              >
                循环
              </button>
            </div>
          </div>

          {/* 航线描述 */}
              <div className="mt-4">
                <label style={{ color: "#6b8299", fontSize: "10px", display: "block", marginBottom: "4px" }}>航线描述</label>
                <textarea
                  value={selectedRoute.description || ""}
                  onChange={(e) => updateRouteParam("description", e.target.value)}
                  placeholder="输入航线说明信息..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg outline-none resize-none"
                  style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "12px" }}
                />
              </div>
        </div>

        {/* Waypoints */}
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation size={13} color="#00b4ff" />
              <span style={{ color: "#00b4ff", fontSize: "12px", fontWeight: 600 }}>航点设置</span>
              <span style={{ color: "#4a6080", fontSize: "10px" }}>({selectedRoute.waypoints.length} 个)</span>
            </div>
            <button
              onClick={addWaypoint}
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ background: "rgba(0,100,200,0.2)", border: "1px solid rgba(0,180,255,0.3)", color: "#00b4ff", fontSize: "11px" }}
            >
              <Plus size={11} /> 添加
            </button>
          </div>

          <div className="space-y-2">
            {selectedRoute.waypoints.map((wp, i) => (
              <div
                key={wp.id}
                className="rounded-lg overflow-hidden"
                style={{
                  background: "#060c1a",
                  border: `1px solid ${selectedWaypoint?.id === wp.id ? "rgba(0,180,255,0.4)" : "#1e2d4a"}`,
                }}
              >
                {/* Waypoint Header */}
                <button
                  className="w-full flex items-center justify-between px-3 py-2"
                  onClick={() => setExpandedWp(expandedWp === wp.id ? null : wp.id)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{
                        background: i === 0 ? "rgba(34,197,94,0.3)" : i === selectedRoute.waypoints.length - 1 ? "rgba(239,68,68,0.3)" : "rgba(0,100,200,0.3)",
                        color: i === 0 ? "#22c55e" : i === selectedRoute.waypoints.length - 1 ? "#ef4444" : "#00b4ff",
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ color: "#e2e8f0", fontSize: "11px", fontWeight: 600 }}>
                      {i === 0 ? "起点" : i === selectedRoute.waypoints.length - 1 ? "终点" : `航点 ${i + 1}`}
                    </span>
                    <span style={{ color: "#4a6080", fontSize: "10px" }}>{wp.action}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedRoute.waypoints.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeWaypoint(wp.id); }}
                        className="p-0.5 rounded"
                        style={{ color: "#4a6080" }}
                      >
                        <X size={10} />
                      </button>
                    )}
                    {expandedWp === wp.id ? <ChevronUp size={12} color="#4a6080" /> : <ChevronDown size={12} color="#4a6080" />}
                  </div>
                </button>

                {/* Expanded Settings */}
                {expandedWp === wp.id && (
                  <div className="px-3 pb-3 grid grid-cols-2 gap-2">
                    {/* 经纬度 */}
                    <div>
                      <label style={{ color: "#4a6080", fontSize: "9px", display: "block", marginBottom: "3px" }}>纬度</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={wp.lat}
                        onChange={(e) => updateWaypoint(wp.id, "lat", parseFloat(e.target.value))}
                        className="w-full px-2 py-1 rounded outline-none"
                        style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "11px" }}
                      />
                    </div>
                    <div>
                      <label style={{ color: "#4a6080", fontSize: "9px", display: "block", marginBottom: "3px" }}>经度</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={wp.lng}
                        onChange={(e) => updateWaypoint(wp.id, "lng", parseFloat(e.target.value))}
                        className="w-full px-2 py-1 rounded outline-none"
                        style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "11px" }}
                      />
                    </div>
                    {[
                      { label: "高度(m)", field: "altitude", value: wp.altitude },
                      { label: "速度(m/s)", field: "speed", value: wp.speed },
                      { label: "悬停时间(s)", field: "hoverTime", value: wp.hoverTime },
                      { label: "云台俯仰角(°)", field: "gimbalPitch", value: wp.gimbalPitch },
                    ].map(({ label, field, value }) => (
                      <div key={field}>
                        <label style={{ color: "#4a6080", fontSize: "9px", display: "block", marginBottom: "3px" }}>{label}</label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => updateWaypoint(wp.id, field as keyof Waypoint, Number(e.target.value))}
                          className="w-full px-2 py-1 rounded outline-none"
                          style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "11px" }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ color: "#4a6080", fontSize: "9px", display: "block", marginBottom: "3px" }}>动作</label>
                      <select
                        value={wp.action}
                        onChange={(e) => updateWaypoint(wp.id, "action", e.target.value)}
                        className="w-full px-2 py-1 rounded outline-none"
                        style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "11px" }}
                      >
                        {actions.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ color: "#4a6080", fontSize: "9px", display: "block", marginBottom: "3px" }}>偏航角模式</label>
                      <select
                        value={wp.yawMode}
                        onChange={(e) => updateWaypoint(wp.id, "yawMode", e.target.value)}
                        className="w-full px-2 py-1 rounded outline-none"
                        style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "11px" }}
                      >
                        {yawModes.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4 flex gap-3" style={{ borderTop: "1px solid #1e2d4a" }}>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}
          >
            <Save size={13} /> 保存航线
          </button>
          <button
            onClick={handleExecute}
            className="px-4 py-2.5 rounded-lg flex items-center justify-center gap-2"
            style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: "13px" }}
          >
            <Play size={13} /> 执行
          </button>
        </div>
      </div>
      {/* 保存提示 Toast */}
      {showToast && (
        <div
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50"
          style={{
            background: "#22c55e",
            color: "#fff",
            fontSize: "14px",
          }}
        >
          ✅ 航线保存成功！
        </div>
      )}
      {/* 执行确认弹窗 */}
      {showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={cancelExecute}
        >
          <div
            className="bg-[#0b1120] rounded-xl p-5 w-80 border border-[#1e2d4a]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-lg font-semibold mb-2">确认执行</h3>
            <p className="text-[#94a3b8] text-sm mb-4">
              确定要执行航线「{selectedRoute.name}」吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmExecute}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#0055cc] to-[#00b4ff] text-white text-sm"
              >
                确认执行
              </button>
              <button
                onClick={cancelExecute}
                className="flex-1 py-2 rounded-lg bg-[#060c1a] border border-[#1e2d4a] text-[#94a3b8] text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}