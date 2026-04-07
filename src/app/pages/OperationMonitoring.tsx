import { useState, useEffect, useRef } from "react";  
import {  
  Navigation,  
  Battery,  
  Wind,  
  Thermometer,  
  Signal,  
  AlertTriangle,  
  ArrowUp,  
  ArrowRight,  
  RotateCw,  
  Pause,  
  Play,  
  Square,  
  Radio,  
  Camera,  
  MapPin,  
} from "lucide-react";  
import {  
  AreaChart,  
  Area,  
  XAxis,  
  YAxis,  
  ResponsiveContainer,  
  Tooltip,  
} from "recharts";  
  
const LIVE_VIDEO = "/videos/uav0000117_02622_v.mp4";  
  
type DroneStatus = "active" | "standby" | "warning" | "offline";  
  
interface DroneItem {  
  id: string;  
  task: string;  
  status: DroneStatus;  
  battery: number;  
  speed: number;  
  altitude: number;  
  signal: number;  
  progress: number;  
}  
  
interface AlertItem {  
  id: number;  
  time: string;  
  msg: string;  
  level: "warning" | "info";  
}  
  
interface TelemetryState {  
  battery: number;  
  speed: number;  
  altitude: number;  
  heading: number;  
  lat: number;  
  lng: number;  
  voltage: number;  
  satellites: number;  
  windSpeed: number;  
  temperature: number;  
}  
  
const drones: DroneItem[] = [  
  {  
    id: "UAV-001",  
    task: "路口巡检-朝阳路",  
    status: "active",  
    battery: 82,  
    speed: 8.5,  
    altitude: 120,  
    signal: 95,  
    progress: 68,  
  },  
  {  
    id: "UAV-002",  
    task: "南环快速路监测",  
    status: "active",  
    battery: 65,  
    speed: 10.2,  
    altitude: 100,  
    signal: 88,  
    progress: 45,  
  },  
  {  
    id: "UAV-003",  
    task: "事故现场处置",  
    status: "active",  
    battery: 91,  
    speed: 0,  
    altitude: 150,  
    signal: 92,  
    progress: 30,  
  },  
  {  
    id: "UAV-004",  
    task: "停车场巡检",  
    status: "standby",  
    battery: 100,  
    speed: 0,  
    altitude: 0,  
    signal: 99,  
    progress: 0,  
  },  
  {  
    id: "UAV-005",  
    task: "低电返航",  
    status: "warning",  
    battery: 23,  
    speed: 12,  
    altitude: 80,  
    signal: 71,  
    progress: 85,  
  },  
  {  
    id: "UAV-006",  
    task: "流量统计",  
    status: "active",  
    battery: 74,  
    speed: 7.8,  
    altitude: 110,  
    signal: 85,  
    progress: 55,  
  },  
];  
  
const statusColor: Record<DroneStatus, string> = {  
  active: "#22c55e",  
  standby: "#00b4ff",  
  warning: "#f59e0b",  
  offline: "#4a6080",  
};  
  
const generateChartData = () =>  
  Array.from({ length: 30 }, (_, i) => ({  
    t: i,  
    alt: 100 + Math.sin(i * 0.3) * 20 + Math.random() * 10,  
    spd: 8 + Math.sin(i * 0.5) * 3 + Math.random() * 2,  
  }));  
  
function getBatteryColor(value: number) {  
  if (value > 50) return "#22c55e";  
  if (value > 20) return "#f59e0b";  
  return "#ef4444";  
}  
  
function PanelCard({  
  children,  
  style,  
}: {  
  children: React.ReactNode;  
  style?: React.CSSProperties;  
}) {  
  return (  
    <div  
      className="rounded-xl"  
      style={{  
        background: "#060c1a",  
        border: "1px solid #1e2d4a",  
        ...style,  
      }}  
    >  
      {children}  
    </div>  
  );  
}  
  
export function OperationMonitoring() {  
  const [selected, setSelected] = useState<DroneItem>(drones[0]);  
  const [playing, setPlaying] = useState(true);  
  const videoRef = useRef<HTMLVideoElement | null>(null);  
  
  const [telemetry, setTelemetry] = useState<TelemetryState>({  
    battery: drones[0].battery,  
    speed: drones[0].speed,  
    altitude: drones[0].altitude,  
    heading: 45,  
    lat: 30.5928,  
    lng: 114.3055,  
    voltage: 24.8,  
    satellites: 14,  
    windSpeed: 3.2,  
    temperature: 22,  
  });  
  
  const [chartData, setChartData] = useState(generateChartData());  
  
  const [alerts] = useState<AlertItem[]>([  
    { id: 1, time: "10:32:45", msg: "UAV-005 电量低于 25%，建议返航", level: "warning" },  
    { id: 2, time: "10:28:12", msg: "UAV-003 进入禁飞区域边界，请注意", level: "warning" },  
    { id: 3, time: "10:15:00", msg: "UAV-001 任务开始执行", level: "info" },  
    { id: 4, time: "10:10:33", msg: "系统初始化完成，所有无人机就绪", level: "info" },  
  ]);  
  
  useEffect(() => {  
    const timer = setInterval(() => {  
      setTelemetry((prev) => ({  
        ...prev,  
        battery: Math.max(0, prev.battery - 0.05),  
        speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 0.4),  
        altitude: Math.max(0, prev.altitude + (Math.random() - 0.5) * 1.5),  
        heading: (prev.heading + 0.4) % 360,  
        lat: prev.lat + (Math.random() - 0.5) * 0.00005,  
        lng: prev.lng + (Math.random() - 0.5) * 0.00005,  
      }));  
  
      setChartData((prev) => [  
        ...prev.slice(1),  
        {  
          t: prev[prev.length - 1].t + 1,  
          alt: 100 + Math.random() * 35,  
          spd: 6 + Math.random() * 6,  
        },  
      ]);  
    }, 1000);  
  
    return () => clearInterval(timer);  
  }, []);  
  
  useEffect(() => {  
    setTelemetry((prev) => ({  
      ...prev,  
      battery: selected.battery,  
      speed: selected.speed,  
      altitude: selected.altitude,  
    }));  
  }, [selected]);  
  
  useEffect(() => {  
    const video = videoRef.current;  
    if (!video) return;  
  
    if (playing) {  
      video.play().catch(() => {});  
    } else {  
      video.pause();  
    }  
  }, [playing, selected]);  
  
  return (  
    <div  
      className="flex h-full min-h-0 overflow-hidden"  
      style={{ background: "#080d1a" }}  
    >  
      {/* 左侧 */}  
      <div  
        className="flex h-full min-h-0 shrink-0 flex-col"  
        style={{  
          width: "260px",  
          background: "#0b1120",  
          borderRight: "1px solid #1e2d4a",  
        }}  
      >  
        <div  
          className="shrink-0 px-4 py-4"  
          style={{ borderBottom: "1px solid #1e2d4a" }}  
        >  
          <h2  
            style={{  
              color: "#e2e8f0",  
              fontSize: "18px",  
              fontWeight: 700,  
              lineHeight: 1.2,  
            }}  
          >  
            作业态势监控  
          </h2>  
          <p  
            style={{  
              color: "#6b8299",  
              fontSize: "12px",  
              marginTop: "4px",  
            }}  
          >  
            实时无人机状态  
          </p>  
        </div>  
  
        <div className="min-h-0 flex flex-1 flex-col p-3">  
          {/* 无人机列表 */}  
          <div className="min-h-0 flex-[3] overflow-y-auto pr-1 space-y-3">  
            {drones.map((drone) => (  
              <button  
                key={drone.id}  
                onClick={() => setSelected(drone)}  
                className="w-full rounded-xl p-4 text-left transition-all"  
                style={{  
                  background:  
                    selected.id === drone.id ? "rgba(0,100,200,0.16)" : "#060c1a",  
                  border: `1px solid ${  
                    selected.id === drone.id  
                      ? "rgba(0,180,255,0.4)"  
                      : "#1e2d4a"  
                  }`,  
                }}  
              >  
                <div className="mb-2 flex items-center gap-2">  
                  <div  
                    className="h-2.5 w-2.5 rounded-full shrink-0"  
                    style={{  
                      background: statusColor[drone.status],  
                      boxShadow: `0 0 8px ${statusColor[drone.status]}`,  
                    }}  
                  />  
                  <span  
                    style={{  
                      color: "#e2e8f0",  
                      fontSize: "15px",  
                      fontWeight: 700,  
                    }}  
                  >  
                    {drone.id}  
                  </span>  
                  {drone.status === "warning" && (  
                    <AlertTriangle size={13} color="#f59e0b" />  
                  )}  
                </div>  
  
                <div  
                  className="truncate mb-3"  
                  style={{  
                    color: "#6b8299",  
                    fontSize: "12px",  
                    lineHeight: 1.4,  
                  }}  
                >  
                  {drone.task}  
                </div>  
  
                <div className="flex items-center gap-2">  
                  <div  
                    className="h-1.5 flex-1 rounded-full"  
                    style={{ background: "#1e2d4a" }}  
                  >  
                    <div  
                      className="h-full rounded-full"  
                      style={{  
                        width: `${drone.battery}%`,  
                        background: getBatteryColor(drone.battery),  
                      }}  
                    />  
                  </div>  
                  <span  
                    style={{  
                      color: "#6b8299",  
                      fontSize: "11px",  
                      minWidth: "34px",  
                      textAlign: "right",  
                    }}  
                  >  
                    {drone.battery}%  
                  </span>  
                </div>  
  
                <div className="mt-2 flex items-center justify-between">  
                  <span style={{ color: "#6b8299", fontSize: "11px" }}>  
                    {drone.speed.toFixed(1)} m/s  
                  </span>  
                  <span style={{ color: "#6b8299", fontSize: "11px" }}>  
                    {drone.altitude}m  
                  </span>  
                  <Signal  
                    size={12}  
                    color={drone.signal > 80 ? "#22c55e" : "#f59e0b"}  
                  />  
                </div>  
              </button>  
            ))}  
          </div>  
  
          {/* 告警区 */}  
          <div  
            className="mt-4 min-h-0 flex-[2] overflow-hidden rounded-xl"  
            style={{  
              border: "1px solid #1e2d4a",  
              background: "#060c1a",  
            }}  
          >  
            <div  
              className="px-4 py-3 flex items-center gap-2 shrink-0"  
              style={{ borderBottom: "1px solid #1e2d4a" }}  
            >  
              <AlertTriangle size={14} color="#f59e0b" />  
              <span  
                style={{  
                  color: "#f59e0b",  
                  fontSize: "14px",  
                  fontWeight: 700,  
                }}  
              >  
                告警信息  
              </span>  
            </div>  
  
            <div className="h-full overflow-y-auto px-3 py-3 space-y-2">  
              {alerts.map((a) => (  
                <div  
                  key={a.id}  
                  className="rounded-xl px-3 py-3"  
                  style={{  
                    background: "#08111f",  
                    border: `1px solid ${  
                      a.level === "warning"  
                        ? "rgba(245,158,11,0.25)"  
                        : "#1e2d4a"  
                    }`,  
                  }}  
                >  
                  <div className="flex items-center justify-between mb-2">  
                    <span  
                      style={{  
                        color: a.level === "warning" ? "#f59e0b" : "#6b8299",  
                        fontSize: "12px",  
                        fontWeight: 600,  
                      }}  
                    >  
                      {a.time}  
                    </span>  
                    <span  
                      style={{  
                        color: a.level === "warning" ? "#fca5a5" : "#38bdf8",  
                        fontSize: "11px",  
                        padding: "2px 8px",  
                        borderRadius: "999px",  
                        border:  
                          a.level === "warning"  
                            ? "1px solid rgba(239,68,68,0.3)"  
                            : "1px solid rgba(56,189,248,0.3)",  
                        background:  
                          a.level === "warning"  
                            ? "rgba(239,68,68,0.08)"  
                            : "rgba(56,189,248,0.08)",  
                      }}  
                    >  
                      {a.level === "warning" ? "警告" : "提示"}  
                    </span>  
                  </div>  
                  <div  
                    style={{  
                      color: "#cbd5e1",  
                      fontSize: "12px",  
                      lineHeight: 1.55,  
                    }}  
                  >  
                    {a.msg}  
                  </div>  
                </div>  
              ))}  
            </div>  
          </div>  
        </div>  
      </div>  
  
      {/* 中间 */}  
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">  
        {/* 实时视频区域 */}  
        <div className="relative min-h-0 flex-1 overflow-hidden">  
          <video  
            ref={videoRef}  
            key={selected.id}  
            src={LIVE_VIDEO}  
            autoPlay  
            loop  
            muted  
            playsInline  
            className="h-full w-full object-cover"  
            style={{ opacity: 0.78 }}  
          />  
  
          {/* HUD */}  
          <div className="absolute inset-0 pointer-events-none">  
            {/* 准星 */}  
            <div className="absolute inset-0 flex items-center justify-center">  
              <svg width="64" height="64" style={{ opacity: 0.42 }}>  
                <circle  
                  cx="32"  
                  cy="32"  
                  r="21"  
                  fill="none"  
                  stroke="#00b4ff"  
                  strokeWidth="1"  
                  strokeDasharray="4,2"  
                />  
                <line x1="32" y1="8" x2="32" y2="18" stroke="#00b4ff" strokeWidth="1" />  
                <line x1="32" y1="46" x2="32" y2="56" stroke="#00b4ff" strokeWidth="1" />  
                <line x1="8" y1="32" x2="18" y2="32" stroke="#00b4ff" strokeWidth="1" />  
                <line x1="46" y1="32" x2="56" y2="32" stroke="#00b4ff" strokeWidth="1" />  
              </svg>  
            </div>  
  
            {/* 左上角 LIVE */}  
            <div className="absolute left-3 top-3 flex items-center gap-2">  
              <div  
                className="flex items-center gap-1.5 rounded px-2.5 py-1"  
                style={{  
                  background: "rgba(0,0,0,0.72)",  
                  border: "1px solid rgba(0,180,255,0.3)",  
                }}  
              >  
                <div  
                  className="h-2 w-2 rounded-full animate-pulse"  
                  style={{ background: "#ef4444" }}  
                />  
                <span  
                  style={{  
                    color: "#ef4444",  
                    fontSize: "12px",  
                    fontWeight: 700,  
                  }}  
                >  
                  LIVE  
                </span>  
              </div>  
  
              <div  
                className="rounded px-2.5 py-1"  
                style={{ background: "rgba(0,0,0,0.72)" }}  
              >  
                <span style={{ color: "#e2e8f0", fontSize: "12px" }}>  
                  {selected.id}  
                </span>  
              </div>  
            </div>  
  
            {/* 底部遥测条 */}  
            <div  
              className="absolute bottom-0 left-0 right-0 px-4 py-3"  
              style={{  
                background: "linear-gradient(transparent, rgba(8,13,26,0.96))",  
              }}  
            >  
              <div className="flex flex-wrap items-center gap-6">  
                {[  
                  { label: "高度", value: `${telemetry.altitude.toFixed(0)}m`, icon: ArrowUp },  
                  { label: "速度", value: `${telemetry.speed.toFixed(1)}m/s`, icon: Navigation },  
                  { label: "朝向", value: `${telemetry.heading.toFixed(0)}°`, icon: ArrowRight },  
                  { label: "纬度", value: telemetry.lat.toFixed(4), icon: MapPin },  
                  { label: "经度", value: telemetry.lng.toFixed(4), icon: MapPin },  
                  { label: "信号", value: `${selected.signal}%`, icon: Signal },  
                ].map(({ label, value, icon: Icon }) => (  
                  <div key={label} className="flex items-center gap-1.5">  
                    <Icon size={12} color="#00b4ff" />  
                    <span style={{ color: "#6b8299", fontSize: "11px" }}>  
                      {label}:  
                    </span>  
                    <span  
                      style={{  
                        color: "#e2e8f0",  
                        fontSize: "12px",  
                        fontWeight: 600,  
                      }}  
                    >  
                      {value}  
                    </span>  
                  </div>  
                ))}  
              </div>  
            </div>  
          </div>  
  
          {/* 右上角：时间+按钮，已合并，不会重叠 */}  
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">  
            <div  
              className="rounded px-2.5 py-1"  
              style={{  
                background: "rgba(0,0,0,0.72)",  
                color: "#94a3b8",  
                fontSize: "11px",  
                border: "1px solid #1e2d4a",  
              }}  
            >  
              {new Date().toLocaleTimeString("zh-CN")}  
            </div>  
  
            <button  
              onClick={() => setPlaying(!playing)}  
              className="flex h-9 w-9 items-center justify-center rounded-lg"  
              style={{  
                background: "rgba(0,0,0,0.72)",  
                border: "1px solid rgba(0,180,255,0.3)",  
                color: "#e2e8f0",  
              }}  
            >  
              {playing ? <Pause size={15} /> : <Play size={15} />}  
            </button>  
  
            <button  
              className="flex h-9 w-9 items-center justify-center rounded-lg"  
              style={{  
                background: "rgba(0,0,0,0.72)",  
                border: "1px solid rgba(239,68,68,0.3)",  
                color: "#ef4444",  
              }}  
            >  
              <Square size={15} />  
            </button>  
  
            <button  
              className="flex h-9 w-9 items-center justify-center rounded-lg"  
              style={{  
                background: "rgba(0,0,0,0.72)",  
                border: "1px solid #1e2d4a",  
                color: "#6b8299",  
              }}  
            >  
              <Camera size={15} />  
            </button>  
          </div>  
        </div>  
  
        {/* 底部图表 */}  
        <div  
          className="shrink-0 px-4 py-3"  
          style={{  
            background: "#0b1120",  
            borderTop: "1px solid #1e2d4a",  
            height: "170px",  
          }}  
        >  
          <div className="mb-2 flex items-center gap-5">  
            <div className="flex items-center gap-1.5">  
              <div  
                className="h-2.5 w-2.5 rounded-full"  
                style={{ background: "#00b4ff" }}  
              />  
              <span style={{ color: "#6b8299", fontSize: "12px" }}>  
                飞行高度 (m)  
              </span>  
            </div>  
            <div className="flex items-center gap-1.5">  
              <div  
                className="h-2.5 w-2.5 rounded-full"  
                style={{ background: "#22c55e" }}  
              />  
              <span style={{ color: "#6b8299", fontSize: "12px" }}>  
                飞行速度 (m/s)  
              </span>  
            </div>  
          </div>  
  
          <ResponsiveContainer width="100%" height={115}>  
            <AreaChart  
              data={chartData}  
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}  
            >  
              <defs>  
                <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">  
                  <stop offset="5%" stopColor="#00b4ff" stopOpacity={0.28} />  
                  <stop offset="95%" stopColor="#00b4ff" stopOpacity={0} />  
                </linearGradient>  
                <linearGradient id="spdGrad" x1="0" y1="0" x2="0" y2="1">  
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.22} />  
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />  
                </linearGradient>  
              </defs>  
  
              <XAxis dataKey="t" hide />  
              <YAxis hide />  
  
              <Tooltip  
                contentStyle={{  
                  background: "#0b1120",  
                  border: "1px solid #1e2d4a",  
                  fontSize: "11px",  
                  borderRadius: "8px",  
                }}  
                labelStyle={{ color: "#6b8299" }}  
                itemStyle={{ color: "#e2e8f0" }}  
              />  
  
              <Area  
                type="monotone"  
                dataKey="alt"  
                stroke="#00b4ff"  
                fill="url(#altGrad)"  
                strokeWidth={1.8}  
                dot={false}  
              />  
              <Area  
                type="monotone"  
                dataKey="spd"  
                stroke="#22c55e"  
                fill="url(#spdGrad)"  
                strokeWidth={1.8}  
                dot={false}  
              />  
            </AreaChart>  
          </ResponsiveContainer>  
        </div>  
      </div>  
  
      {/* 右侧 */}  
      <div  
        className="h-full min-h-0 shrink-0 overflow-y-auto"  
        style={{  
          width: "270px",  
          background: "#0b1120",  
          borderLeft: "1px solid #1e2d4a",  
        }}  
      >  
        <div  
          className="p-4"  
          style={{ borderBottom: "1px solid #1e2d4a" }}  
        >  
          <h3  
            style={{  
              color: "#00b4ff",  
              fontSize: "16px",  
              fontWeight: 700,  
            }}  
          >  
            遥测数据  
          </h3>  
          <div  
            style={{  
              color: "#6b8299",  
              fontSize: "12px",  
              marginTop: "4px",  
            }}  
          >  
            {selected.id} · {selected.task}  
          </div>  
        </div>  
  
        <div className="p-4 space-y-3">  
          {/* 电池 */}  
          <PanelCard>  
            <div className="p-4">  
              <div className="mb-3 flex items-center justify-between">  
                <div className="flex items-center gap-2">  
                  <Battery size={15} color={getBatteryColor(telemetry.battery)} />  
                  <span style={{ color: "#94a3b8", fontSize: "13px" }}>  
                    电池状态  
                  </span>  
                </div>  
                <span  
                  style={{  
                    color: getBatteryColor(telemetry.battery),  
                    fontSize: "22px",  
                    fontWeight: 700,  
                  }}  
                >  
                  {telemetry.battery.toFixed(0)}%  
                </span>  
              </div>  
  
              <div  
                className="h-2 rounded-full"  
                style={{ background: "#1e2d4a" }}  
              >  
                <div  
                  className="h-full rounded-full transition-all"  
                  style={{  
                    width: `${telemetry.battery}%`,  
                    background: getBatteryColor(telemetry.battery),  
                  }}  
                />  
              </div>  
  
              <div className="mt-2 flex justify-between">  
                <span style={{ color: "#6b8299", fontSize: "11px" }}>  
                  电压: {telemetry.voltage}V  
                </span>  
                <span style={{ color: "#6b8299", fontSize: "11px" }}>  
                  预计剩余: 24min  
                </span>  
              </div>  
            </div>  
          </PanelCard>  
  
          {[  
            {  
              label: "飞行高度",  
              value: `${telemetry.altitude.toFixed(1)} m`,  
              icon: ArrowUp,  
              color: "#00b4ff",  
            },  
            {  
              label: "飞行速度",  
              value: `${telemetry.speed.toFixed(2)} m/s`,  
              icon: Navigation,  
              color: "#22c55e",  
            },  
            {  
              label: "机头朝向",  
              value: `${telemetry.heading.toFixed(1)}°`,  
              icon: RotateCw,  
              color: "#a855f7",  
            },  
            {  
              label: "信号强度",  
              value: `${selected.signal}%`,  
              icon: Signal,  
              color: "#00b4ff",  
            },  
            {  
              label: "GPS卫星",  
              value: `${telemetry.satellites} 颗`,  
              icon: Radio,  
              color: "#22c55e",  
            },  
            {  
              label: "风速",  
              value: `${telemetry.windSpeed} m/s`,  
              icon: Wind,  
              color: "#f59e0b",  
            },  
            {  
              label: "温度",  
              value: `${telemetry.temperature}°C`,  
              icon: Thermometer,  
              color: "#94a3b8",  
            },  
          ].map(({ label, value, icon: Icon, color }) => (  
            <PanelCard key={label}>  
              <div className="flex items-center justify-between px-4 py-3">  
                <div className="flex items-center gap-2">  
                  <Icon size={14} color={color} />  
                  <span style={{ color: "#6b8299", fontSize: "13px" }}>  
                    {label}  
                  </span>  
                </div>  
                <span  
                  style={{  
                    color: "#e2e8f0",  
                    fontSize: "14px",  
                    fontWeight: 600,  
                  }}  
                >  
                  {value}  
                </span>  
              </div>  
            </PanelCard>  
          ))}  
  
          {/* 任务进度 */}  
          <PanelCard>  
            <div className="p-4">  
              <div className="mb-3 flex items-center justify-between">  
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>  
                  任务进度  
                </span>  
                <span  
                  style={{  
                    color: "#00b4ff",  
                    fontSize: "22px",  
                    fontWeight: 700,  
                  }}  
                >  
                  {selected.progress}%  
                </span>  
              </div>  
  
              <div  
                className="h-2 rounded-full"  
                style={{ background: "#1e2d4a" }}  
              >  
                <div  
                  className="h-full rounded-full"  
                  style={{  
                    width: `${selected.progress}%`,  
                    background: "linear-gradient(90deg, #0066ff, #00b4ff)",  
                  }}  
                />  
              </div>  
  
              <div className="mt-2 flex justify-between">  
                <span style={{ color: "#6b8299", fontSize: "11px" }}>  
                  预计完成: 23min  
                </span>  
                <span style={{ color: "#6b8299", fontSize: "11px" }}>  
                  已拍: 68 帧  
                </span>  
              </div>  
            </div>  
          </PanelCard>  
  
          {/* 位置信息 */}  
          <PanelCard>  
            <div className="p-4">  
              <div className="mb-3 flex items-center gap-2">  
                <MapPin size={14} color="#f59e0b" />  
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>  
                  位置信息  
                </span>  
              </div>  
              <div style={{ color: "#e2e8f0", fontSize: "13px", lineHeight: 1.7 }}>  
                纬度: {telemetry.lat.toFixed(6)}°N  
              </div>  
              <div style={{ color: "#e2e8f0", fontSize: "13px", lineHeight: 1.7 }}>  
                经度: {telemetry.lng.toFixed(6)}°E  
              </div>  
            </div>  
          </PanelCard>  
        </div>  
      </div>  
    </div>  
  );  
}  
  
export default OperationMonitoring;  
