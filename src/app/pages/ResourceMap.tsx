import { useState, useEffect } from "react";
import {
  Layers,
  Navigation,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  Radio,
  ChevronDown,
  MapPin,
  Filter,
  BarChart2,
  Eye,
  Maximize2,
} from "lucide-react";

const MAP_BG = "https://images.unsplash.com/photo-1761921558642-0a287d43606c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBjaXR5JTIwc2F0ZWxsaXRlJTIwdmlldyUyMGRhcmslMjBuaWdodHxlbnwxfHx8fDE3NzQ4NjgzMTF8MA&ixlib=rb-4.1.0&q=80&w=1080";

const drones = [
  { id: "UAV-001", x: 28, y: 35, status: "active", battery: 82, task: "路口巡检", altitude: 120 },
  { id: "UAV-002", x: 52, y: 22, status: "active", battery: 65, task: "交通监测", altitude: 100 },
  { id: "UAV-003", x: 70, y: 58, status: "active", battery: 91, task: "事故处置", altitude: 150 },
  { id: "UAV-004", x: 40, y: 70, status: "standby", battery: 100, task: "待命", altitude: 0 },
  { id: "UAV-005", x: 18, y: 55, status: "warning", battery: 23, task: "低电返航", altitude: 80 },
  { id: "UAV-006", x: 62, y: 38, status: "active", battery: 74, task: "流量统计", altitude: 110 },
  { id: "UAV-007", x: 82, y: 30, status: "active", battery: 55, task: "违规抓拍", altitude: 90 },
  { id: "UAV-008", x: 45, y: 48, status: "offline", battery: 0, task: "离线", altitude: 0 },
];

const stations = [
  { id: "BS-01", x: 15, y: 25, name: "北区基站", online: true },
  { id: "BS-02", x: 55, y: 65, name: "南区基站", online: true },
  { id: "BS-03", x: 80, y: 20, name: "东区基站", online: true },
  { id: "BS-04", x: 35, y: 80, name: "西区基站", online: false },
];

const shootingPoints = [
  { id: "SP-01", x: 30, y: 40, type: "traffic", label: "路口A" },
  { id: "SP-02", x: 55, y: 25, type: "accident", label: "事故点B" },
  { id: "SP-03", x: 68, y: 55, type: "traffic", label: "路口C" },
  { id: "SP-04", x: 20, y: 62, type: "parking", label: "停车场D" },
  { id: "SP-05", x: 72, y: 38, type: "traffic", label: "路口E" },
  { id: "SP-06", x: 48, y: 72, type: "parking", label: "停车场F" },
];

const dataTypes = [
  { label: "交通流量", count: 1248, color: "#00b4ff", change: "+12%" },
  { label: "违规行为", count: 87, color: "#f59e0b", change: "+5%" },
  { label: "事故记录", count: 23, color: "#ef4444", change: "-8%" },
  { label: "停车违规", count: 342, color: "#a855f7", change: "+18%" },
];

const statusColors: Record<string, string> = {
  active: "#22c55e",
  standby: "#00b4ff",
  warning: "#f59e0b",
  offline: "#4a6080",
};

const typeColors: Record<string, string> = {
  traffic: "#00b4ff",
  accident: "#ef4444",
  parking: "#a855f7",
};

export function ResourceMap() {
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const [showLayer, setShowLayer] = useState({
    drones: true,
    stations: true,
    shootingPoints: true,
    routes: true,
  });
  const [dronePositions, setDronePositions] = useState(drones);
  const [mapMode, setMapMode] = useState<"satellite" | "grid">("satellite");

  useEffect(() => {
    const timer = setInterval(() => {
      setDronePositions((prev) =>
        prev.map((d) => ({
          ...d,
          x: d.status === "active" ? Math.max(5, Math.min(95, d.x + (Math.random() - 0.5) * 1.5)) : d.x,
          y: d.status === "active" ? Math.max(5, Math.min(95, d.y + (Math.random() - 0.5) * 1.5)) : d.y,
        }))
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const selectedDroneData = dronePositions.find((d) => d.id === selectedDrone);

  return (
    <div className="flex h-full" style={{ background: "#080d1a" }}>
      {/* Left Panel */}
      <div
        className="flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ width: "260px", background: "#0b1120", borderRight: "1px solid #1e2d4a" }}
      >
        <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <h2 style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>资源地图</h2>
          <p style={{ color: "#4a6080", fontSize: "11px", marginTop: "2px" }}>实时资源分布态势</p>
        </div>

        {/* Layer Control */}
        <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2 mb-3">
            <Layers size={13} color="#00b4ff" />
            <span style={{ color: "#00b4ff", fontSize: "12px", fontWeight: 600 }}>图层控制</span>
          </div>
          <div className="space-y-2">
            {[
              { key: "drones", label: "无人机", color: "#22c55e" },
              { key: "stations", label: "地面基站", color: "#00b4ff" },
              { key: "shootingPoints", label: "拍摄点位", color: "#f59e0b" },
              { key: "routes", label: "航线轨迹", color: "#a855f7" },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() =>
                  setShowLayer((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))
                }
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors"
                style={{
                  background: showLayer[key as keyof typeof showLayer] ? "rgba(0,180,255,0.08)" : "transparent",
                  border: `1px solid ${showLayer[key as keyof typeof showLayer] ? "rgba(0,180,255,0.2)" : "#1e2d4a"}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span style={{ color: "#e2e8f0", fontSize: "12px" }}>{label}</span>
                </div>
                <div
                  className="w-8 h-4 rounded-full transition-colors"
                  style={{ background: showLayer[key as keyof typeof showLayer] ? "#0066ff" : "#1e2d4a" }}
                >
                  <div
                    className="w-3 h-3 rounded-full bg-white m-0.5 transition-transform"
                    style={{ transform: showLayer[key as keyof typeof showLayer] ? "translateX(16px)" : "translateX(0)" }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Stats */}
        <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={13} color="#00b4ff" />
            <span style={{ color: "#00b4ff", fontSize: "12px", fontWeight: 600 }}>数据类型统计</span>
          </div>
          <div className="space-y-2">
            {dataTypes.map((dt) => (
              <div
                key={dt.label}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: dt.color }} />
                  <span style={{ color: "#94a3b8", fontSize: "11px" }}>{dt.label}</span>
                </div>
                <div className="text-right">
                  <div style={{ color: dt.color, fontSize: "13px", fontWeight: 700 }}>{dt.count}</div>
                  <div style={{ color: dt.change.startsWith("+") ? "#22c55e" : "#ef4444", fontSize: "10px" }}>
                    {dt.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drone List */}
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation size={13} color="#00b4ff" />
              <span style={{ color: "#00b4ff", fontSize: "12px", fontWeight: 600 }}>无人机列表</span>
            </div>
            <span style={{ color: "#4a6080", fontSize: "11px" }}>{dronePositions.filter((d) => d.status === "active").length}/8 在线</span>
          </div>
          <div className="space-y-1.5">
            {dronePositions.map((drone) => (
              <button
                key={drone.id}
                onClick={() => setSelectedDrone(selectedDrone === drone.id ? null : drone.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                style={{
                  background: selectedDrone === drone.id ? "rgba(0,180,255,0.12)" : "#060c1a",
                  border: `1px solid ${selectedDrone === drone.id ? "rgba(0,180,255,0.3)" : "#1e2d4a"}`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: statusColors[drone.status],
                    boxShadow: drone.status === "active" ? `0 0 6px ${statusColors[drone.status]}` : "none",
                  }}
                />
                <div className="flex-1 text-left">
                  <div style={{ color: "#e2e8f0", fontSize: "11px", fontWeight: 600 }}>{drone.id}</div>
                  <div style={{ color: "#4a6080", fontSize: "10px" }}>{drone.task}</div>
                </div>
                <div
                  className="text-right"
                  style={{ color: drone.battery < 30 ? "#ef4444" : "#6b8299", fontSize: "10px" }}
                >
                  {drone.battery}%
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <button
            onClick={() => setMapMode("satellite")}
            className="px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: mapMode === "satellite" ? "#0066ff" : "#0b1120",
              border: "1px solid #1e2d4a",
              color: mapMode === "satellite" ? "#fff" : "#6b8299",
              fontSize: "12px",
            }}
          >
            卫星图
          </button>
          <button
            onClick={() => setMapMode("grid")}
            className="px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: mapMode === "grid" ? "#0066ff" : "#0b1120",
              border: "1px solid #1e2d4a",
              color: mapMode === "grid" ? "#fff" : "#6b8299",
              fontSize: "12px",
            }}
          >
            网格图
          </button>
        </div>

        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "12px" }}
          >
            <Filter size={12} />
            筛选
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "12px" }}
          >
            <Maximize2 size={12} />
          </button>
        </div>

        {/* Map Background */}
        <div className="absolute inset-0">
          {mapMode === "satellite" ? (
            <img
              src={MAP_BG}
              alt="city map"
              className="w-full h-full object-cover"
              style={{ opacity: 0.6, filter: "hue-rotate(200deg) saturate(0.8)" }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: "#060c18",
                backgroundImage:
                  "linear-gradient(rgba(0,100,200,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,200,0.08) 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
          )}
          {/* Map Overlay Gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(8,13,26,0.3), rgba(8,13,26,0.1) 50%, rgba(8,13,26,0.4))",
            }}
          />
        </div>

        {/* SVG Overlay */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
          {/* Route Lines */}
          {showLayer.routes && (
            <>
              <path
                d={`M ${dronePositions[0].x}% ${dronePositions[0].y}% L ${stations[0].x}% ${stations[0].y}%`}
                stroke="#22c55e"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.4"
              />
              <path
                d={`M ${dronePositions[1].x}% ${dronePositions[1].y}% L ${stations[2].x}% ${stations[2].y}%`}
                stroke="#22c55e"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.4"
              />
              <path
                d={`M ${dronePositions[2].x}% ${dronePositions[2].y}% L ${stations[1].x}% ${stations[1].y}%`}
                stroke="#22c55e"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.4"
              />
              {/* Patrol route polygon */}
              <polygon
                points="28,40 55,25 70,55 45,72"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1"
                strokeDasharray="6,3"
                opacity="0.3"
                style={{ transform: "scaleX(1)", transformOrigin: "center" }}
                transform="scale(1)"
              />
            </>
          )}
        </svg>

        {/* Map Elements */}
        <div className="absolute inset-0">
          {/* Base Stations */}
          {showLayer.stations &&
            stations.map((st) => (
              <div
                key={st.id}
                className="absolute"
                style={{ left: `${st.x}%`, top: `${st.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <div className="relative flex items-center justify-center">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: st.online ? "rgba(0,100,200,0.8)" : "rgba(74,96,128,0.8)",
                      border: `2px solid ${st.online ? "#00b4ff" : "#4a6080"}`,
                      boxShadow: st.online ? "0 0 12px rgba(0,180,255,0.5)" : "none",
                    }}
                  >
                    <Radio size={14} color={st.online ? "#fff" : "#4a6080"} />
                  </div>
                  <div
                    className="absolute -bottom-5 whitespace-nowrap px-1 py-0.5 rounded"
                    style={{ background: "rgba(8,13,26,0.85)", color: "#94a3b8", fontSize: "9px" }}
                  >
                    {st.name}
                  </div>
                </div>
              </div>
            ))}

          {/* Shooting Points */}
          {showLayer.shootingPoints &&
            shootingPoints.map((sp) => (
              <div
                key={sp.id}
                className="absolute"
                style={{ left: `${sp.x}%`, top: `${sp.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <div className="relative">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: typeColors[sp.type],
                      boxShadow: `0 0 8px ${typeColors[sp.type]}`,
                    }}
                  >
                    <Camera size={9} color="#fff" />
                  </div>
                  <div
                    className="absolute -bottom-4 whitespace-nowrap"
                    style={{ color: typeColors[sp.type], fontSize: "8px", left: "50%", transform: "translateX(-50%)" }}
                  >
                    {sp.label}
                  </div>
                </div>
              </div>
            ))}

          {/* Drones */}
          {showLayer.drones &&
            dronePositions.map((drone) => (
              <div
                key={drone.id}
                className="absolute cursor-pointer"
                style={{ left: `${drone.x}%`, top: `${drone.y}%`, transform: "translate(-50%, -50%)" }}
                onClick={() => setSelectedDrone(selectedDrone === drone.id ? null : drone.id)}
              >
                <div className="relative">
                  {drone.status === "active" && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        background: `${statusColors[drone.status]}33`,
                        transform: "scale(2.5)",
                      }}
                    />
                  )}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center relative z-10"
                    style={{
                      background: `${statusColors[drone.status]}22`,
                      border: `2px solid ${statusColors[drone.status]}`,
                      boxShadow: `0 0 10px ${statusColors[drone.status]}66`,
                    }}
                  >
                    <Navigation size={12} color={statusColors[drone.status]} />
                  </div>
                  {selectedDrone === drone.id && (
                    <div
                      className="absolute left-8 top-0 px-2 py-1 rounded-lg whitespace-nowrap z-20"
                      style={{ background: "#0b1120", border: "1px solid #1e2d4a", fontSize: "10px", color: "#e2e8f0" }}
                    >
                      <div style={{ fontWeight: 700 }}>{drone.id}</div>
                      <div style={{ color: "#4a6080" }}>{drone.task}</div>
                      <div>高度: {drone.altitude}m | 电量: {drone.battery}%</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Bottom Legend */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-xl"
          style={{ background: "rgba(11,17,32,0.9)", border: "1px solid #1e2d4a" }}
        >
          {[
            { color: "#22c55e", label: "作业中" },
            { color: "#00b4ff", label: "待命" },
            { color: "#f59e0b", label: "警告" },
            { color: "#4a6080", label: "离线" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span style={{ color: "#94a3b8", fontSize: "11px" }}>{item.label}</span>
            </div>
          ))}
          <div className="w-px h-4" style={{ background: "#1e2d4a" }} />
          {[
            { color: "#00b4ff", label: "交通" },
            { color: "#ef4444", label: "事故" },
            { color: "#a855f7", label: "停车" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <Camera size={10} color={item.color} />
              <span style={{ color: "#94a3b8", fontSize: "11px" }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Stats Overlay (top right) */}
        <div className="absolute top-14 right-4 z-10 space-y-2">
          {[
            { icon: CheckCircle, label: "作业中", count: 6, color: "#22c55e" },
            { icon: Clock, label: "计划中", count: 3, color: "#00b4ff" },
            { icon: AlertTriangle, label: "异常", count: 1, color: "#f59e0b" },
          ].map(({ icon: Icon, label, count, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "rgba(11,17,32,0.9)", border: "1px solid #1e2d4a" }}
            >
              <Icon size={12} color={color} />
              <span style={{ color: "#94a3b8", fontSize: "11px" }}>{label}</span>
              <span style={{ color, fontSize: "13px", fontWeight: 700 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Drone Detail */}
      {selectedDroneData && (
        <div
          className="flex-shrink-0"
          style={{ width: "220px", background: "#0b1120", borderLeft: "1px solid #1e2d4a" }}
        >
          <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
            <div className="flex items-center justify-between">
              <h3 style={{ color: "#00b4ff", fontSize: "13px", fontWeight: 700 }}>{selectedDroneData.id}</h3>
              <div
                className="px-2 py-0.5 rounded-full"
                style={{
                  background: `${statusColors[selectedDroneData.status]}22`,
                  border: `1px solid ${statusColors[selectedDroneData.status]}`,
                  color: statusColors[selectedDroneData.status],
                  fontSize: "10px",
                }}
              >
                {selectedDroneData.status === "active" ? "作业中" :
                  selectedDroneData.status === "standby" ? "待命" :
                  selectedDroneData.status === "warning" ? "警告" : "离线"}
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: "执行任务", value: selectedDroneData.task },
              { label: "飞行高度", value: `${selectedDroneData.altitude} m` },
              { label: "纬度", value: "30.5928° N" },
              { label: "经度", value: "114.3055° E" },
              { label: "飞行速度", value: "8.5 m/s" },
              { label: "朝向", value: "NE 45°" },
              {
                label: "电量", value: (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1e2d4a" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${selectedDroneData.battery}%`,
                          background: selectedDroneData.battery > 50 ? "#22c55e" : selectedDroneData.battery > 20 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                    <span style={{ color: selectedDroneData.battery > 50 ? "#22c55e" : "#ef4444", fontSize: "11px" }}>
                      {selectedDroneData.battery}%
                    </span>
                  </div>
                ),
              },
              { label: "任务进度", value: (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1e2d4a" }}>
                    <div className="h-full rounded-full" style={{ width: "68%", background: "#00b4ff" }} />
                  </div>
                  <span style={{ color: "#00b4ff", fontSize: "11px" }}>68%</span>
                </div>
              )},
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ color: "#4a6080", fontSize: "10px", marginBottom: "2px" }}>{label}</div>
                {typeof value === "string" ? (
                  <div style={{ color: "#e2e8f0", fontSize: "12px" }}>{value}</div>
                ) : (
                  value
                )}
              </div>
            ))}
            <button
              className="w-full py-2 rounded-lg mt-4 flex items-center justify-center gap-2"
              style={{ background: "rgba(0,100,200,0.2)", border: "1px solid rgba(0,180,255,0.3)", color: "#00b4ff", fontSize: "12px" }}
            >
              <Eye size={12} />
              查看直播
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
