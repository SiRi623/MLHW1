import { useState, useEffect, useRef } from "react";
import {
  Navigation,
  Battery,
  Wifi,
  Wind,
  Thermometer,
  Eye,
  Signal,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowRight,
  RotateCw,
  Pause,
  Play,
  Square,
  ChevronUp,
  ChevronDown,
  Radio,
  Camera,
  Activity,
  Clock,
  MapPin,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const LIVE_IMG = "https://images.unsplash.com/photo-1718925896582-764bd87bda6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMHN1cnZlaWxsYW5jZSUyMHVyYmFuJTIwdHJhZmZpYyUyMG1vbml0b3Jpbmd8ZW58MXx8fHwxNzc0ODY4MzEyfDA&ixlib=rb-4.1.0&q=80&w=1080";

const drones = [
  { id: "UAV-001", task: "路口巡检-朝阳路", status: "active", battery: 82, speed: 8.5, altitude: 120, signal: 95, progress: 68 },
  { id: "UAV-002", task: "南环快速路监测", status: "active", battery: 65, speed: 10.2, altitude: 100, signal: 88, progress: 45 },
  { id: "UAV-003", task: "事故现场处置", status: "active", battery: 91, speed: 0, altitude: 150, signal: 92, progress: 30 },
  { id: "UAV-004", task: "停车场巡检", status: "standby", battery: 100, speed: 0, altitude: 0, signal: 99, progress: 0 },
  { id: "UAV-005", task: "低电返航", status: "warning", battery: 23, speed: 12, altitude: 80, signal: 71, progress: 85 },
  { id: "UAV-006", task: "流量统计", status: "active", battery: 74, speed: 7.8, altitude: 110, signal: 85, progress: 55 },
];

const statusColor: Record<string, string> = {
  active: "#22c55e",
  standby: "#00b4ff",
  warning: "#f59e0b",
  offline: "#4a6080",
};

const generateAltData = () =>
  Array.from({ length: 30 }, (_, i) => ({
    t: i,
    alt: 100 + Math.sin(i * 0.3) * 20 + Math.random() * 10,
    spd: 8 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
  }));

export function OperationMonitoring() {
  const [selected, setSelected] = useState(drones[0]);
  const [playing, setPlaying] = useState(true);
  const [telemetry, setTelemetry] = useState({
    battery: selected.battery,
    speed: selected.speed,
    altitude: selected.altitude,
    heading: 45,
    lat: 30.5928,
    lng: 114.3055,
    voltage: 24.8,
    satellites: 14,
    windSpeed: 3.2,
    temperature: 22,
  });
  const [altData, setAltData] = useState(generateAltData());
  const [alerts, setAlerts] = useState([
    { id: 1, time: "10:32:45", msg: "UAV-005 电量低于 25%，建议返航", level: "warning" },
    { id: 2, time: "10:28:12", msg: "UAV-003 进入禁飞区域边界，请注意", level: "warning" },
    { id: 3, time: "10:15:00", msg: "UAV-001 任务开始执行", level: "info" },
    { id: 4, time: "10:10:33", msg: "系统初始化完成，所有无人机就绪", level: "info" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((p) => ({
        ...p,
        battery: Math.max(0, p.battery - 0.1),
        speed: Math.max(0, p.speed + (Math.random() - 0.5) * 0.5),
        altitude: Math.max(0, p.altitude + (Math.random() - 0.5) * 2),
        heading: (p.heading + 0.5) % 360,
        lat: p.lat + (Math.random() - 0.5) * 0.0001,
        lng: p.lng + (Math.random() - 0.5) * 0.0001,
      }));
      setAltData((p) => [
        ...p.slice(1),
        { t: p[p.length - 1].t + 1, alt: 100 + Math.random() * 40, spd: 6 + Math.random() * 6 },
      ]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTelemetry((p) => ({
      ...p,
      battery: selected.battery,
      speed: selected.speed,
      altitude: selected.altitude,
    }));
  }, [selected]);

  return (
    <div className="flex h-full" style={{ background: "#080d1a" }}>
      {/* Left: Drone Selection */}
      <div
        className="flex-shrink-0 flex flex-col"
        style={{ width: "220px", background: "#0b1120", borderRight: "1px solid #1e2d4a" }}
      >
        <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <h2 style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>作业态势监控</h2>
          <p style={{ color: "#4a6080", fontSize: "11px" }}>实时无人机状态</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {drones.map((drone) => (
            <button
              key={drone.id}
              onClick={() => setSelected(drone)}
              className="w-full text-left p-3 rounded-lg transition-all"
              style={{
                background: selected.id === drone.id ? "rgba(0,100,200,0.15)" : "#060c1a",
                border: `1px solid ${selected.id === drone.id ? "rgba(0,180,255,0.4)" : "#1e2d4a"}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  background: statusColor[drone.status],
                  boxShadow: `0 0 6px ${statusColor[drone.status]}`,
                }} />
                <span style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 700 }}>{drone.id}</span>
                {drone.status === "warning" && <AlertTriangle size={11} color="#f59e0b" />}
              </div>
              <div style={{ color: "#4a6080", fontSize: "10px" }} className="truncate mb-2">{drone.task}</div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full" style={{ background: "#1e2d4a" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${drone.battery}%`,
                    background: drone.battery > 50 ? "#22c55e" : drone.battery > 20 ? "#f59e0b" : "#ef4444",
                  }} />
                </div>
                <span style={{ color: "#4a6080", fontSize: "9px" }}>{drone.battery}%</span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span style={{ color: "#4a6080", fontSize: "9px" }}>{drone.speed.toFixed(1)} m/s</span>
                <span style={{ color: "#4a6080", fontSize: "9px" }}>{drone.altitude}m</span>
                <Signal size={9} color={drone.signal > 80 ? "#22c55e" : "#f59e0b"} />
              </div>
            </button>
          ))}
        </div>
        {/* Alerts */}
        <div style={{ borderTop: "1px solid #1e2d4a" }}>
          <div className="px-4 py-3 flex items-center gap-2">
            <AlertTriangle size={12} color="#f59e0b" />
            <span style={{ color: "#f59e0b", fontSize: "12px", fontWeight: 600 }}>告警信息</span>
          </div>
          <div className="px-3 pb-3 space-y-1.5" style={{ maxHeight: "160px", overflowY: "auto" }}>
            {alerts.map((a) => (
              <div key={a.id} className="px-2 py-2 rounded-lg" style={{
                background: "#060c1a",
                border: `1px solid ${a.level === "warning" ? "rgba(245,158,11,0.25)" : "#1e2d4a"}`,
              }}>
                <div style={{ color: a.level === "warning" ? "#f59e0b" : "#4a6080", fontSize: "10px" }}>{a.time}</div>
                <div style={{ color: "#94a3b8", fontSize: "10px", lineHeight: "1.4", marginTop: "2px" }}>{a.msg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Live Feed + Map */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Live Feed */}
        <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
          <img src={LIVE_IMG} alt="live feed" className="w-full h-full object-cover" style={{ opacity: 0.65 }} />
          {/* Overlay HUD */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="60" height="60" style={{ opacity: 0.4 }}>
                <circle cx="30" cy="30" r="20" fill="none" stroke="#00b4ff" strokeWidth="1" strokeDasharray="4,2" />
                <line x1="30" y1="8" x2="30" y2="18" stroke="#00b4ff" strokeWidth="1" />
                <line x1="30" y1="42" x2="30" y2="52" stroke="#00b4ff" strokeWidth="1" />
                <line x1="8" y1="30" x2="18" y2="30" stroke="#00b4ff" strokeWidth="1" />
                <line x1="42" y1="30" x2="52" y2="30" stroke="#00b4ff" strokeWidth="1" />
              </svg>
            </div>
            {/* Top HUD */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(0,180,255,0.3)" }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                  <span style={{ color: "#ef4444", fontSize: "11px", fontWeight: 700 }}>LIVE</span>
                </div>
                <div className="px-2 py-1 rounded" style={{ background: "rgba(0,0,0,0.7)" }}>
                  <span style={{ color: "#e2e8f0", fontSize: "11px" }}>{selected.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded" style={{ background: "rgba(0,0,0,0.7)", color: "#94a3b8", fontSize: "10px" }}>
                  {new Date().toLocaleTimeString("zh-CN")}
                </div>
              </div>
            </div>
            {/* Bottom HUD */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{ background: "linear-gradient(transparent, rgba(8,13,26,0.95))" }}
            >
              <div className="flex items-center gap-6">
                {[
                  { label: "高度", value: `${telemetry.altitude.toFixed(0)}m`, icon: ArrowUp },
                  { label: "速度", value: `${telemetry.speed.toFixed(1)}m/s`, icon: Navigation },
                  { label: "朝向", value: `${telemetry.heading.toFixed(0)}°`, icon: ArrowRight },
                  { label: "纬度", value: telemetry.lat.toFixed(4), icon: MapPin },
                  { label: "经度", value: telemetry.lng.toFixed(4), icon: MapPin },
                  { label: "信号", value: `${selected.signal}%`, icon: Signal },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon size={11} color="#00b4ff" />
                    <span style={{ color: "#4a6080", fontSize: "10px" }}>{label}:</span>
                    <span style={{ color: "#e2e8f0", fontSize: "11px", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Controls */}
          <div className="absolute top-3 right-3 flex gap-2 pointer-events-auto">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(0,180,255,0.3)", color: "#e2e8f0" }}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
            >
              <Square size={14} />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.7)", border: "1px solid #1e2d4a", color: "#6b8299" }}
            >
              <Camera size={14} />
            </button>
          </div>
        </div>

        {/* Chart Panel */}
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{ background: "#0b1120", borderTop: "1px solid #1e2d4a", height: "140px" }}
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "#00b4ff" }} />
              <span style={{ color: "#4a6080", fontSize: "11px" }}>飞行高度 (m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
              <span style={{ color: "#4a6080", fontSize: "11px" }}>飞行速度 (m/s)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={altData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00b4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00b4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#0b1120", border: "1px solid #1e2d4a", fontSize: "10px" }}
                labelStyle={{ color: "#4a6080" }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Area type="monotone" dataKey="alt" stroke="#00b4ff" fill="url(#altGrad)" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="spd" stroke="#22c55e" fill="url(#spdGrad)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right: Telemetry */}
      <div
        className="flex-shrink-0 overflow-y-auto"
        style={{ width: "240px", background: "#0b1120", borderLeft: "1px solid #1e2d4a" }}
      >
        <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <h3 style={{ color: "#00b4ff", fontSize: "13px", fontWeight: 700 }}>遥测数据</h3>
          <div style={{ color: "#4a6080", fontSize: "11px" }}>{selected.id} · {selected.task}</div>
        </div>

        <div className="p-4 space-y-3">
          {/* Battery */}
          <div className="p-3 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Battery size={13} color={telemetry.battery > 50 ? "#22c55e" : telemetry.battery > 20 ? "#f59e0b" : "#ef4444"} />
                <span style={{ color: "#94a3b8", fontSize: "11px" }}>电池状态</span>
              </div>
              <span style={{
                color: telemetry.battery > 50 ? "#22c55e" : telemetry.battery > 20 ? "#f59e0b" : "#ef4444",
                fontSize: "14px", fontWeight: 700,
              }}>
                {telemetry.battery.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: "#1e2d4a" }}>
              <div className="h-full rounded-full transition-all" style={{
                width: `${telemetry.battery}%`,
                background: telemetry.battery > 50 ? "#22c55e" : telemetry.battery > 20 ? "#f59e0b" : "#ef4444",
              }} />
            </div>
            <div className="flex justify-between mt-1">
              <span style={{ color: "#4a6080", fontSize: "10px" }}>电压: {telemetry.voltage}V</span>
              <span style={{ color: "#4a6080", fontSize: "10px" }}>预计剩余: 24min</span>
            </div>
          </div>

          {/* Flight Data */}
          {[
            { label: "飞行高度", value: `${telemetry.altitude.toFixed(1)} m`, icon: ArrowUp, color: "#00b4ff" },
            { label: "飞行速度", value: `${telemetry.speed.toFixed(2)} m/s`, icon: Navigation, color: "#22c55e" },
            { label: "机头朝向", value: `${telemetry.heading.toFixed(1)}°`, icon: RotateCw, color: "#a855f7" },
            { label: "信号强度", value: `${selected.signal}%`, icon: Signal, color: "#00b4ff" },
            { label: "GPS卫星", value: `${telemetry.satellites} 颗`, icon: Radio, color: "#22c55e" },
            { label: "风速", value: `${telemetry.windSpeed} m/s`, icon: Wind, color: "#f59e0b" },
            { label: "温度", value: `${telemetry.temperature}°C`, icon: Thermometer, color: "#94a3b8" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
              <div className="flex items-center gap-2">
                <Icon size={12} color={color} />
                <span style={{ color: "#6b8299", fontSize: "11px" }}>{label}</span>
              </div>
              <span style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }}>{value}</span>
            </div>
          ))}

          {/* Task Progress */}
          <div className="p-3 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: "#94a3b8", fontSize: "11px" }}>任务进度</span>
              <span style={{ color: "#00b4ff", fontSize: "13px", fontWeight: 700 }}>{selected.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: "#1e2d4a" }}>
              <div className="h-full rounded-full" style={{ width: `${selected.progress}%`, background: "linear-gradient(90deg, #0066ff, #00b4ff)" }} />
            </div>
            <div className="flex justify-between mt-1">
              <span style={{ color: "#4a6080", fontSize: "10px" }}>预计完成: 23min</span>
              <span style={{ color: "#4a6080", fontSize: "10px" }}>已拍: 68 帧</span>
            </div>
          </div>

          {/* Location */}
          <div className="p-3 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} color="#f59e0b" />
              <span style={{ color: "#94a3b8", fontSize: "11px" }}>位置信息</span>
            </div>
            <div style={{ color: "#e2e8f0", fontSize: "11px" }}>纬度: {telemetry.lat.toFixed(6)}°N</div>
            <div style={{ color: "#e2e8f0", fontSize: "11px" }}>经度: {telemetry.lng.toFixed(6)}°E</div>
          </div>
        </div>
      </div>
    </div>
  );
}
