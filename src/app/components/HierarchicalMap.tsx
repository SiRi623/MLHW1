import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  ChevronLeft,
  Clock,
  Home,
  Layers,
  Navigation,
  Radio,
} from "lucide-react";

/**
 * 地图层级数据结构
 */
interface MapLocation {
  id: string;
  label: string;
  imagePath: string;
  breadcrumb: string[];
  points: MapPoint[];
  parentId?: string;
}

interface MapPoint {
  id: string;
  x: number; // 百分比 0-100
  y: number; // 百分比 0-100
  label: string;
  targetMapId?: string; // 如果有关联的下一级地图，记录其id
  description?: string;
  icon?: "location" | "building" | "poi";
}

type DroneStatus = "active" | "standby" | "warning" | "offline";

interface Drone {
  id: string;
  x: number;
  y: number;
  status: DroneStatus;
  battery: number;
  task: string;
  altitude: number;
}

interface Station {
  id: string;
  x: number;
  y: number;
  name: string;
  online: boolean;
}

interface ShootingPoint {
  id: string;
  x: number;
  y: number;
  type: "traffic" | "accident" | "parking";
  label: string;
}

interface DataTypeStat {
  label: string;
  count: number;
  color: string;
  change: string;
}

type BusinessSelection =
  | {
      type: "drone";
      title: string;
      description: string;
      meta: string[];
    }
  | {
      type: "station" | "shooting";
      title: string;
      description: string;
      meta: string[];
    };

const initialDrones: Drone[] = [
  { id: "UAV-001", x: 58, y: 45, status: "active", battery: 82, task: "路口巡检", altitude: 120 },
  { id: "UAV-002", x: 44, y: 40, status: "active", battery: 65, task: "交通监测", altitude: 100 },
  { id: "UAV-003", x: 74, y: 70, status: "active", battery: 91, task: "事故处置", altitude: 150 },
  { id: "UAV-004", x: 36, y: 92, status: "standby", battery: 100, task: "待命", altitude: 0 },
  { id: "UAV-005", x: 24, y: 60, status: "warning", battery: 23, task: "低电返航", altitude: 80 },
  { id: "UAV-006", x: 68, y: 38, status: "active", battery: 74, task: "流量统计", altitude: 110 },
];

const stations: Station[] = [
  { id: "BS-01", x: 20, y: 28, name: "北区基站", online: true },
  { id: "BS-02", x: 58, y: 68, name: "南区基站", online: true },
  { id: "BS-03", x: 82, y: 24, name: "东区基站", online: true },
  { id: "BS-04", x: 38, y: 84, name: "西区基站", online: false },
];

const shootingPoints: ShootingPoint[] = [
  { id: "SP-01", x: 40, y: 46, type: "traffic", label: "路口A" },
  { id: "SP-02", x: 52, y: 34, type: "accident", label: "事故点B" },
  { id: "SP-03", x: 66, y: 58, type: "traffic", label: "路口C" },
  { id: "SP-04", x: 30, y: 66, type: "parking", label: "停车场D" },
];

const dataTypeStats: DataTypeStat[] = [
  { label: "交通流量", count: 1248, color: "#00b4ff", change: "+12%" },
  { label: "违规行为", count: 87, color: "#f59e0b", change: "+5%" },
  { label: "事故记录", count: 23, color: "#ef4444", change: "-8%" },
  { label: "停车违规", count: 342, color: "#a855f7", change: "+18%" },
];

const statusColors: Record<DroneStatus, string> = {
  active: "#22c55e",
  standby: "#0ea5e9",
  warning: "#fbbf24",
  offline: "#78716c",
};

const shootingTypeColors: Record<ShootingPoint["type"], string> = {
  traffic: "#0ea5e9",
  accident: "#f87171",
  parking: "#d946ef",
};

/**
 * 地图数据配置 - 定义所有地图层级和点位
 */
const mapHierarchy: Record<string, MapLocation> = {
  city: {
    id: "city",
    label: "城市总览",
    imagePath: "/picture/1.png",
    breadcrumb: ["资源地图", "城市总览"],
    points: [
      {
        id: "point-hefei-university",
        x: 56,
        y: 49,
        label: "合肥工业大学翡翠湖校区",
        targetMapId: "university",
        description: "校园位置",
        icon: "building",
      },
      {
        id: "point-feiyu-lake",
        x: 48.5,
        y: 52.5,
        label: "翡翠湖风景区",
        targetMapId: "lake",
        description: "风景区位置",
        icon: "location",
      },
      {
        id: "point-hotel",
        x: 76.5,
        y: 78,
        label: "格林豪泰酒店",
        targetMapId: "hotel",
        description: "酒店位置",
        icon: "poi",
      },
      {
        id: "point-pharmacy",
        x: 33,
        y: 99,
        label: "肥西县悦为康大药房",
        targetMapId: "pharmacy",
        description: "药房位置",
        icon: "poi",
      },
    ],
  },
  university: {
    id: "university",
    label: "合肥工业大学翡翠湖校区",
    imagePath: "/picture/2_hfut.png",
    breadcrumb: ["资源地图", "城市", "合肥工业大学翡翠湖校区"],
    parentId: "city",
    points: [],
  },
  lake: {
    id: "lake",
    label: "翡翠湖风景区",
    imagePath: "/picture/3_feicuihu.png",
    breadcrumb: ["资源地图", "城市", "翡翠湖风景区"],
    parentId: "city",
    points: [],
  },
  hotel: {
    id: "hotel",
    label: "格林豪泰酒店",
    imagePath: "/picture/4_gelin.png",
    breadcrumb: ["资源地图", "城市", "格林豪泰酒店"],
    parentId: "city",
    points: [],
  },
  pharmacy: {
    id: "pharmacy",
    label: "肥西县悦为康大药房",
    imagePath: "/picture/5_yaofang.png",
    breadcrumb: ["资源地图", "城市", "肥西县悦为康大药房"],
    parentId: "city",
    points: [],
  },
};

/**
 * 点位标记组件
 */
interface PointMarkerProps {
  point: MapPoint;
  onPointClick: (point: MapPoint) => void;
  isHovering: boolean;
  onHover: (hovering: boolean) => void;
}

function PointMarker({
  point,
  onPointClick,
  isHovering,
  onHover,
}: PointMarkerProps) {
  return (
    <div
      className="absolute w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={() => onPointClick(point)}
    >
      {/* 外层脉冲圆环 */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-red-400 transition-all duration-300 ${
          isHovering ? "scale-150 opacity-100" : "scale-100 opacity-60"
        }`}
        style={{
          animation: isHovering ? "pulse 1.5s ease-in-out infinite" : "none",
        }}
      />

      {/* 中心点 */}
      <div
        className={`absolute inset-2 rounded-full transition-all duration-300 ${
          isHovering ? "bg-yellow-400 scale-110" : "bg-red-400"
        }`}
      />

      {/* 标签 - 悬停显示 */}
      {isHovering && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded whitespace-nowrap z-20 border border-red-400 text-sm shadow-lg">
          {point.label}
          {point.targetMapId && (
            <div className="text-xs text-red-300 mt-1">点击进入</div>
          )}
        </div>
      )}

      {/* 全局样式 */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * 面包屑导航组件
 */
interface BreadcrumbProps {
  items: string[];
  onNavigate: (index: number) => void;
}

function BreadcrumbNavigation({ items, onNavigate }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm mb-4 flex-wrap">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(index)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {item}
          </button>
          {index < items.length - 1 && (
            <span className="text-gray-500">/</span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * 地图详情面板组件
 */
interface DetailPanelProps {
  point: MapPoint | null;
  onClose: () => void;
  onNavigate?: () => void;
  canNavigate?: boolean;
}

function DetailPanel({
  point,
  onClose,
  onNavigate,
  canNavigate,
}: DetailPanelProps) {
  if (!point) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-blue-400 rounded-lg p-4 max-w-xs z-30 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-blue-400 font-semibold text-base">
            {point.label}
          </h3>
          {point.description && (
            <p className="text-gray-400 text-sm mt-1">{point.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {canNavigate && onNavigate && (
        <button
          onClick={onNavigate}
          className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition-colors"
        >
          进入详情地图
        </button>
      )}
    </div>
  );
}

interface BusinessDetailPanelProps {
  selected: BusinessSelection | null;
  onClose: () => void;
}

function BusinessDetailPanel({ selected, onClose }: BusinessDetailPanelProps) {
  if (!selected) return null;

  const titleColor =
    selected.type === "drone"
      ? "text-green-400"
      : selected.type === "station"
        ? "text-blue-400"
        : "text-purple-400";

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 border border-cyan-700 rounded-lg p-4 max-w-xs z-30 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className={`font-semibold text-base ${titleColor}`}>{selected.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{selected.description}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>
      <div className="space-y-1">
        {selected.meta.map((line) => (
          <div key={line} className="text-xs text-gray-300">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 主地图分层组件
 */
export function HierarchicalMap() {
  const [currentMapId, setCurrentMapId] = useState<string>("city");
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessSelection | null>(null);
  const [showLayer, setShowLayer] = useState({
    drones: true,
    stations: true,
    shootingPoints: true,
    routes: true,
  });
  const [dronePositions, setDronePositions] = useState<Drone[]>(initialDrones);
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);

  const currentMap = mapHierarchy[currentMapId];
  const isCityLevel = currentMapId === "city";

  useEffect(() => {
    const timer = setInterval(() => {
      setDronePositions((prev) =>
        prev.map((drone) => {
          if (drone.status !== "active") {
            return drone;
          }

          return {
            ...drone,
            x: Math.max(5, Math.min(95, drone.x + (Math.random() - 0.5) * 1.2)),
            y: Math.max(5, Math.min(95, drone.y + (Math.random() - 0.5) * 1.2)),
          };
        })
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const taskStats = useMemo(() => {
    const active = dronePositions.filter((d) => d.status === "active").length;
    const planned = dronePositions.filter((d) => d.status === "standby").length;
    const abnormal = dronePositions.filter((d) => d.status === "warning" || d.status === "offline").length;
    return { active, planned, abnormal };
  }, [dronePositions]);

  /**
   * 处理点位点击
   */
  const handlePointClick = (point: MapPoint) => {
    setSelectedBusiness(null);
    setSelectedPoint(point);
  };

  /**
   * 处理导航到下一级地图
   */
  const handleNavigateToPoint = () => {
    if (selectedPoint?.targetMapId) {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentMapId(selectedPoint.targetMapId!);
        setSelectedPoint(null);
        setSelectedBusiness(null);
        setFadeOut(false);
      }, 300);
    }
  };

  /**
   * 返回上一级地图
   */
  const handleGoBack = () => {
    if (currentMap.parentId) {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentMapId(currentMap.parentId!);
        setSelectedPoint(null);
        setSelectedBusiness(null);
        setFadeOut(false);
      }, 300);
    }
  };

  /**
   * 处理面包屑导航
   */
  const handleBreadcrumbNavigate = (index: number) => {
    // 根据面包屑项找到对应的地图
    const breadcrumbToMapId: Record<string, string> = {
      城市总览: "city",
      "合肥工业大学翡翠湖校区": "university",
      "翡翠湖风景区": "lake",
      "格林豪泰酒店": "hotel",
      "肥西县悦为康大药房": "pharmacy",
    };

    const targetMapId =
      breadcrumbToMapId[currentMap.breadcrumb[index]] || currentMapId;

    if (targetMapId !== currentMapId) {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentMapId(targetMapId);
        setSelectedPoint(null);
        setSelectedBusiness(null);
        setFadeOut(false);
      }, 300);
    }
  };

  const handleGoHome = () => {
    setFadeOut(true);
    setTimeout(() => {
      setCurrentMapId("city");
      setSelectedPoint(null);
      setSelectedBusiness(null);
      setFadeOut(false);
    }, 300);
  };

  const handleSelectDrone = (drone: Drone) => {
    const nextSelectedId = selectedDroneId === drone.id ? null : drone.id;
    setSelectedDroneId(nextSelectedId);

    if (!nextSelectedId) {
      setSelectedBusiness(null);
      return;
    }

    setSelectedPoint(null);
    setSelectedBusiness({
      type: "drone",
      title: drone.id,
      description: drone.task,
      meta: [`状态: ${drone.status}`, `高度: ${drone.altitude}m`, `电量: ${drone.battery}%`],
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-950 text-white">
      {/* 顶部控制栏 */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {currentMapId !== "city" && (
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ChevronLeft size={18} />
                <span>返回上一级</span>
              </button>
            )}
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Home size={18} />
              <span>返回首页</span>
            </button>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold text-blue-400">
              {currentMap.label}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              共 {currentMap.points.length} 个位置点
            </p>
          </div>
        </div>

        {/* 面包屑导航 */}
        <BreadcrumbNavigation
          items={currentMap.breadcrumb}
          onNavigate={handleBreadcrumbNavigate}
        />
      </div>

      {/* 地图容器 */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {/* 地图底图 */}
        <img
          src={currentMap.imagePath}
          alt={currentMap.label}
          className={`w-full h-full object-cover transition-all duration-300 ${
            fadeOut ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
          }`}
        />

        {/* 左侧综合面板 */}
        <div className="absolute top-4 left-4 bottom-4 z-30 w-64 bg-gray-900/95 border border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-gray-700 flex-shrink-0">
            <div className="text-cyan-400 text-sm font-semibold">面板</div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {isCityLevel ? "城市级业务图层可见" : "当前为子地图，业务图层已隐藏"}
            </div>
          </div>

          <div className="p-3 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={14} className="text-cyan-400" />
              <span className="text-cyan-400 text-xs font-semibold">图层控制</span>
            </div>
            <div className="space-y-2">
              {[
                { key: "drones", label: "无人机", color: "#22c55e" },
                { key: "stations", label: "基站", color: "#a855f7" },
                { key: "shootingPoints", label: "拍摄点位", color: "#fbbf24" },
                { key: "routes", label: "航线轨迹", color: "#d946ef" },
              ].map((item) => (
                <button
                  key={item.key}
                  disabled={!isCityLevel}
                  onClick={() => setShowLayer((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded border border-gray-700 hover:border-cyan-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-xs text-gray-200">{item.label}</span>
                  </div>
                  <span className={`text-xs ${showLayer[item.key as keyof typeof showLayer] ? "text-cyan-400" : "text-gray-500"}`}>
                    {showLayer[item.key as keyof typeof showLayer] ? "显示" : "隐藏"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-b border-gray-700 flex-shrink-0">
            <div className="text-cyan-400 text-xs font-semibold mb-2">数据类型统计</div>
            <div className="flex flex-col gap-1.5">
              {dataTypeStats.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-2 py-1.5 rounded bg-gray-950/80 border border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-[11px] text-gray-300">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold" style={{ color: item.color }}>{item.count}</div>
                    <div className="text-[10px]" style={{ color: item.change.startsWith("+") ? "#22c55e" : "#ef4444" }}>
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <span className="text-cyan-400 text-xs font-semibold">无人机列表</span>
              <span className="text-[11px] text-gray-400">{taskStats.active}/{dronePositions.length} 在线</span>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              {dronePositions.map((drone, idx) => (
                <button
                  key={drone.id}
                  disabled={!isCityLevel || !showLayer.drones}
                  onClick={() => handleSelectDrone(drone)}
                  className={`w-full px-2 py-1.5 rounded border text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed block ${
                    idx < dronePositions.length - 1 ? "mb-1.5" : ""
                  }`}
                  style={{
                    borderColor: selectedDroneId === drone.id ? "rgba(0,180,255,0.5)" : "#374151",
                    background: selectedDroneId === drone.id ? "rgba(0,180,255,0.12)" : "rgba(2,6,23,0.7)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: statusColors[drone.status] }} />
                      <span className="text-[11px] text-gray-100 font-medium">{drone.id}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{drone.battery}%</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{drone.task}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 城市级状态统计 */}
        {isCityLevel && (
          <div className="absolute top-4 right-4 z-30 space-y-2">
            {[
              { icon: CheckCircle, label: "作业中", count: taskStats.active, color: "#22c55e" },
              { icon: Clock, label: "计划中", count: taskStats.planned, color: "#00b4ff" },
              { icon: AlertTriangle, label: "异常", count: taskStats.abnormal, color: "#f59e0b" },
            ].map(({ icon: Icon, label, count, color }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/95 border border-gray-700">
                <Icon size={12} style={{ color }} />
                <span className="text-xs text-gray-300">{label}</span>
                <span className="text-sm font-bold" style={{ color }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 城市级航线轨迹 */}
        {isCityLevel && showLayer.routes && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <path
              d={`M ${dronePositions[0].x}% ${dronePositions[0].y}% L ${stations[0].x}% ${stations[0].y}%`}
              stroke="#22c55e"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.45"
            />
            <path
              d={`M ${dronePositions[1].x}% ${dronePositions[1].y}% L ${stations[2].x}% ${stations[2].y}%`}
              stroke="#22c55e"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.45"
            />
            <polygon
              points="40,46 52,34 66,58 30,66"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1"
              strokeDasharray="6,3"
              opacity="0.35"
            />
          </svg>
        )}

        {/* 点位标记层 */}
        <div className="absolute inset-0 z-20">
          {currentMap.points.map((point) => (
            <PointMarker
              key={point.id}
              point={point}
              onPointClick={handlePointClick}
              isHovering={hoveredPointId === point.id}
              onHover={(hovering) =>
                setHoveredPointId(hovering ? point.id : null)
              }
            />
          ))}

          {/* 城市级基站 */}
          {isCityLevel && showLayer.stations &&
            stations.map((station) => (
              <button
                key={station.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${station.x}%`, top: `${station.y}%` }}
                onClick={() => {
                  setSelectedPoint(null);
                  setSelectedBusiness({
                    type: "station",
                    title: station.name,
                    description: station.online ? "基站在线" : "基站离线",
                    meta: [`基站编号: ${station.id}`, `连接状态: ${station.online ? "在线" : "离线"}`],
                  });
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center border-4"
                  style={{
                    background: station.online ? `rgba(168, 85, 247, 0.95)` : `rgba(71, 85, 105, 0.9)`,
                    borderColor: station.online ? "#a855f7" : "#78716c",
                    boxShadow: station.online ? `0 0 16px rgba(168, 85, 247, 0.95), inset 0 0 8px rgba(255,255,255,0.4)` : "none",
                  }}
                >
                  <Radio size={15} className="text-white" />
                </div>
              </button>
            ))}

          {/* 城市级拍摄点位 */}
          {isCityLevel && showLayer.shootingPoints &&
            shootingPoints.map((sp) => (
              <button
                key={sp.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
                onClick={() => {
                  setSelectedPoint(null);
                  setSelectedBusiness({
                    type: "shooting",
                    title: sp.label,
                    description: "拍摄点位",
                    meta: [`点位编号: ${sp.id}`, `点位类型: ${sp.type}`],
                  });
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center border-2"
                  style={{
                    background: shootingTypeColors[sp.type],
                    boxShadow: `0 0 16px ${shootingTypeColors[sp.type]}ff, inset 0 0 6px rgba(255,255,255,0.5)`,
                    borderColor: "rgba(255,255,255,0.8)",
                  }}
                >
                  <Camera size={11} className="text-white font-bold" />
                </div>
              </button>
            ))}

          {/* 城市级无人机 */}
          {isCityLevel && showLayer.drones &&
            dronePositions.map((drone) => (
              <button
                key={drone.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${drone.x}%`, top: `${drone.y}%` }}
                onClick={() => handleSelectDrone(drone)}
              >
                <div className="relative">
                  {drone.status === "active" && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: `${statusColors[drone.status]}44`, transform: "scale(2.2)" }}
                    />
                  )}
                  <div
                    className="w-10 h-10 rounded-full border-5 flex items-center justify-center relative z-10"
                    style={{
                      borderColor: statusColors[drone.status],
                      background: `${statusColors[drone.status]}cc`,
                      boxShadow: `0 0 20px ${statusColors[drone.status]}ff, inset 0 0 10px ${statusColors[drone.status]}80`,
                    }}
                  >
                    <Navigation size={14} style={{ color: "white", fontWeight: "bold" }} />
                  </div>
                </div>
              </button>
            ))}
        </div>

        {/* 加载指示器 */}
        {fadeOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* 详情面板 */}
      <DetailPanel
        point={selectedPoint}
        onClose={() => setSelectedPoint(null)}
        onNavigate={handleNavigateToPoint}
        canNavigate={!!selectedPoint?.targetMapId}
      />

      <BusinessDetailPanel selected={selectedBusiness} onClose={() => setSelectedBusiness(null)} />

      {/* 图例 */}
      <div className="bg-gray-900 border-t border-gray-700 px-4 py-3 text-xs">
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-gray-400">分层入口点位</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-gray-400">选中点位</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-red-400 bg-transparent" />
            <span className="text-gray-400">可点击区域</span>
          </div>
          {isCityLevel && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-gray-400">无人机</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-gray-400">基站</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-gray-400">拍摄点位</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
