import { useState } from "react";
import {
  Brain,
  Upload,
  Play,
  Pause,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart2,
  Layers,
  Search,
  Filter,
  X,
  Download,
  RefreshCw,
  Eye,
  Cpu,
  Zap,
  HardDrive,
  Activity,
  Tag,
  Calendar,
  Plus,
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

type ModelStatus = "deployed" | "idle" | "training" | "failed";

interface Model {
  id: string;
  name: string;
  type: string;
  version: string;
  accuracy: number;
  fps: number;
  size: string;
  status: ModelStatus;
  deployedTo: string[];
  tags: string[];
  updatedAt: string;
  description: string;
  precision: number;
  recall: number;
  classes: string[];
  inferenceTime: number;
}

const models: Model[] = [
  {
    id: "M001", name: "TrafficFlow-YOLOv8", type: "目标检测", version: "v3.2.1",
    accuracy: 94.5, fps: 60, size: "128 MB", status: "deployed",
    deployedTo: ["UAV-001", "UAV-002", "UAV-006"],
    tags: ["交通流量", "车辆检测", "实时"], updatedAt: "2026-03-28",
    description: "基于YOLOv8优化的交通流量检测模型，支持实时车辆类型识别、流量统计和速度估算。",
    precision: 95.2, recall: 93.8,
    classes: ["轿车", "货车", "摩托车", "公交车", "行人", "自行车"],
    inferenceTime: 16,
  },
  {
    id: "M002", name: "ViolationDetect-v2", type: "行为识别", version: "v2.1.0",
    accuracy: 91.2, fps: 30, size: "256 MB", status: "deployed",
    deployedTo: ["UAV-003", "UAV-007"],
    tags: ["违规检测", "闯红灯", "违停"],
    updatedAt: "2026-03-15", description: "交通违规行为自动识别模型，可检测闯红灯、逆行、压线、违规停车等多种违法行为。",
    precision: 90.5, recall: 91.8,
    classes: ["闯红灯", "逆行", "压线", "违规停车", "超速", "加塞"],
    inferenceTime: 33,
  },
  {
    id: "M003", name: "IncidentDetect-RT", type: "事故检测", version: "v1.5.2",
    accuracy: 89.7, fps: 25, size: "192 MB", status: "idle",
    deployedTo: [],
    tags: ["事故检测", "紧急响应", "实时"],
    updatedAt: "2026-03-10", description: "道路交通事故实时检测模型，基于多帧分析技术，可快速识别碰撞、追尾等事故场景。",
    precision: 88.2, recall: 91.3,
    classes: ["追尾事故", "侧碰", "追尾", "行人事故", "连环事故"],
    inferenceTime: 40,
  },
  {
    id: "M004", name: "ParkingAnalyzer-Pro", type: "场景分析", version: "v4.0.0",
    accuracy: 96.8, fps: 45, size: "98 MB", status: "deployed",
    deployedTo: ["UAV-004"],
    tags: ["停车分析", "占用检测", "统计"],
    updatedAt: "2026-03-25", description: "停车场占用状态智能分析模型，实时统计车位占用率、停车时长和违规停车情况。",
    precision: 97.1, recall: 96.4,
    classes: ["空车位", "占用车位", "违规停放", "残障车位"],
    inferenceTime: 22,
  },
  {
    id: "M005", name: "CrowdDensity-Net", type: "密度估算", version: "v2.3.0",
    accuracy: 88.4, fps: 20, size: "312 MB", status: "training",
    deployedTo: [],
    tags: ["人群密度", "行人计数", "热力图"],
    updatedAt: "2026-03-30", description: "人群密度估算神经网络，支持大规模行人计数、密度热力图生成，适用于路口疏导场景。",
    precision: 87.9, recall: 88.9,
    classes: ["行人", "骑行者", "密集人群"],
    inferenceTime: 50,
  },
  {
    id: "M006", name: "LicensePlate-OCR", type: "文字识别", version: "v5.1.0",
    accuracy: 98.2, fps: 90, size: "45 MB", status: "failed",
    deployedTo: [],
    tags: ["车牌识别", "OCR", "高精度"],
    updatedAt: "2026-03-20", description: "高精度车牌识别OCR模型，支持多种车牌类型，在复杂光照和运动条件下保持高识别率。",
    precision: 98.5, recall: 97.9,
    classes: ["普通车牌", "新能源车牌", "临牌", "军牌"],
    inferenceTime: 11,
  },
];

const statusConfig: Record<ModelStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  deployed: { label: "已部署", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: <CheckCircle size={11} /> },
  idle: { label: "待部署", color: "#00b4ff", bg: "rgba(0,180,255,0.1)", icon: <Clock size={11} /> },
  training: { label: "训练中", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: <RefreshCw size={11} /> },
  failed: { label: "异常", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: <AlertCircle size={11} /> },
};

export function AIModelLibrary() {
  const [selected, setSelected] = useState<Model | null>(models[0]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showDeploy, setShowDeploy] = useState(false);
  const [selectedDrones, setSelectedDrones] = useState<string[]>([]);
  const [deployingModel, setDeployingModel] = useState<Model | null>(null);
  const [modelList, setModelList] = useState(models);

  const filteredModels = modelList.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.tags.some((t) => t.includes(search));
    const matchType = filterType === "all" || m.type === filterType;
    return matchSearch && matchType;
  });

  const types = ["all", ...Array.from(new Set(models.map((m) => m.type)))];

  const handleDeploy = async () => {
    if (!deployingModel || selectedDrones.length === 0) return;
    await new Promise((r) => setTimeout(r, 1500));
    setModelList((p) =>
      p.map((m) =>
        m.id === deployingModel.id
          ? { ...m, status: "deployed" as ModelStatus, deployedTo: selectedDrones }
          : m
      )
    );
    if (selected?.id === deployingModel.id) {
      setSelected((p) => p ? { ...p, status: "deployed", deployedTo: selectedDrones } : p);
    }
    setShowDeploy(false);
    setSelectedDrones([]);
    setDeployingModel(null);
  };

  const radarData = selected
    ? [
        { subject: "准确率", A: selected.accuracy },
        { subject: "精确率", A: selected.precision },
        { subject: "召回率", A: selected.recall },
        { subject: "速度", A: Math.min(100, selected.fps) },
        { subject: "轻量化", A: Math.max(0, 100 - parseFloat(selected.size)) },
      ]
    : [];

  return (
    <div className="flex h-full" style={{ background: "#080d1a" }}>
      {/* Left Panel */}
      <div
        className="flex-shrink-0 flex flex-col"
        style={{ width: "280px", background: "#0b1120", borderRight: "1px solid #1e2d4a" }}
      >
        <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <h2 style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>AI 模型库</h2>
          <p style={{ color: "#4a6080", fontSize: "11px" }}>{models.length} 个模型 · {models.filter((m) => m.status === "deployed").length} 已部署</p>
        </div>
        {/* Search & Filter */}
        <div className="p-3 space-y-2" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
            <Search size={12} color="#4a6080" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索模型..."
              className="flex-1 bg-transparent outline-none"
              style={{ color: "#e2e8f0", fontSize: "12px" }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="px-2 py-1 rounded-md transition-colors"
                style={{
                  background: filterType === t ? "rgba(0,100,200,0.3)" : "#060c1a",
                  border: `1px solid ${filterType === t ? "rgba(0,180,255,0.4)" : "#1e2d4a"}`,
                  color: filterType === t ? "#00b4ff" : "#6b8299",
                  fontSize: "10px",
                }}
              >
                {t === "all" ? "全部" : t}
              </button>
            ))}
          </div>
        </div>
        {/* Model List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelected(model)}
              className="w-full text-left p-3 rounded-xl transition-all"
              style={{
                background: selected?.id === model.id ? "rgba(0,100,200,0.15)" : "#060c1a",
                border: `1px solid ${selected?.id === model.id ? "rgba(0,180,255,0.4)" : "#1e2d4a"}`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 700 }} className="truncate">{model.name}</div>
                  <div style={{ color: "#4a6080", fontSize: "10px" }}>{model.type} · {model.version}</div>
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                  style={{ background: statusConfig[model.status].bg, color: statusConfig[model.status].color, fontSize: "9px" }}
                >
                  {statusConfig[model.status].icon}
                  {statusConfig[model.status].label}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: 600 }}>{model.accuracy}%</span>
                <span style={{ color: "#4a6080", fontSize: "10px" }}>{model.fps}fps</span>
                <span style={{ color: "#4a6080", fontSize: "10px" }}>{model.size}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {model.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 rounded" style={{ background: "rgba(0,100,200,0.15)", color: "#6b8299", fontSize: "9px" }}>{tag}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
        <div className="p-3" style={{ borderTop: "1px solid #1e2d4a" }}>
          <button
            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2"
            style={{ background: "rgba(0,100,200,0.15)", border: "1px solid rgba(0,180,255,0.3)", color: "#00b4ff", fontSize: "12px" }}
          >
            <Plus size={13} /> 导入新模型
          </button>
        </div>
      </div>

      {/* Model Detail */}
      {selected ? (
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div
            className="flex items-start justify-between px-6 py-5"
            style={{ background: "#0b1120", borderBottom: "1px solid #1e2d4a" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #0044aa, #00b4ff)", boxShadow: "0 0 20px rgba(0,180,255,0.3)" }}
              >
                <Brain size={28} color="#fff" />
              </div>
              <div>
                <h2 style={{ color: "#e2e8f0", fontSize: "18px", fontWeight: 700 }}>{selected.name}</h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span style={{ color: "#4a6080", fontSize: "12px" }}>{selected.type}</span>
                  <span style={{ color: "#4a6080", fontSize: "12px" }}>·</span>
                  <span style={{ color: "#00b4ff", fontSize: "12px" }}>{selected.version}</span>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: statusConfig[selected.status].bg, color: statusConfig[selected.status].color, fontSize: "11px" }}
                  >
                    {statusConfig[selected.status].icon}
                    {statusConfig[selected.status].label}
                  </div>
                </div>
                <p style={{ color: "#6b8299", fontSize: "12px", marginTop: "6px", maxWidth: "500px", lineHeight: "1.6" }}>
                  {selected.description}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "12px" }}>
                <Download size={13} /> 导出
              </button>
              <button
                onClick={() => { setDeployingModel(selected); setSelectedDrones(selected.deployedTo); setShowDeploy(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "12px" }}
              >
                <Upload size={13} /> 部署模型
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <div className="col-span-2 space-y-5">
              {/* Key Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "准确率", value: `${selected.accuracy}%`, color: "#22c55e", icon: CheckCircle },
                  { label: "精确率", value: `${selected.precision}%`, color: "#00b4ff", icon: Eye },
                  { label: "召回率", value: `${selected.recall}%`, color: "#a855f7", icon: Activity },
                  { label: "推理时间", value: `${selected.inferenceTime}ms`, color: "#f59e0b", icon: Zap },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="p-4 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={13} color={color} />
                      <span style={{ color: "#6b8299", fontSize: "11px" }}>{label}</span>
                    </div>
                    <div style={{ color, fontSize: "22px", fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Accuracy Bar */}
              <div className="p-5 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                <h4 style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>各类别识别准确率</h4>
                <div className="space-y-3">
                  {selected.classes.map((cls, i) => {
                    const acc = selected.accuracy - (Math.random() * 8) + (i % 3) * 2;
                    return (
                      <div key={cls} className="flex items-center gap-3">
                        <span style={{ color: "#6b8299", fontSize: "11px", width: "80px", flexShrink: 0 }}>{cls}</span>
                        <div className="flex-1 h-2 rounded-full" style={{ background: "#1e2d4a" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(80, Math.min(99, acc))}%`,
                              background: `linear-gradient(90deg, #0066ff, #00b4ff)`,
                            }}
                          />
                        </div>
                        <span style={{ color: "#00b4ff", fontSize: "11px", width: "40px", textAlign: "right" }}>
                          {Math.max(80, Math.min(99, acc)).toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tech Info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "推理帧率", value: `${selected.fps} FPS`, icon: Zap },
                  { label: "模型大小", value: selected.size, icon: HardDrive },
                  { label: "已部署设备", value: `${selected.deployedTo.length} 台`, icon: Cpu },
                  { label: "最近更新", value: selected.updatedAt, icon: Calendar },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#0a1628" }}>
                      <Icon size={15} color="#00b4ff" />
                    </div>
                    <div>
                      <div style={{ color: "#4a6080", fontSize: "10px" }}>{label}</div>
                      <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deployed Drones */}
              {selected.deployedTo.length > 0 && (
                <div className="p-5 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                  <h4 style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>已部署无人机</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.deployedTo.map((d) => (
                      <div
                        key={d}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                        style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
                        <span style={{ color: "#22c55e", fontSize: "11px" }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Radar Chart + Tags */}
            <div className="space-y-5">
              <div className="p-5 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                <h4 style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>性能雷达图</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1e2d4a" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#4a6080", fontSize: 10 }} />
                    <Radar dataKey="A" stroke="#00b4ff" fill="#00b4ff" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-xl" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                <h4 style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>模型标签</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(0,100,200,0.15)", border: "1px solid rgba(0,180,255,0.25)", color: "#00b4ff", fontSize: "11px" }}
                    >
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center" style={{ color: "#4a6080" }}>
          <div className="text-center">
            <Brain size={48} className="mx-auto mb-3" opacity={0.3} />
            <p>选择模型以查看详情</p>
          </div>
        </div>
      )}

      {/* Deploy Modal */}
      {showDeploy && deployingModel && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(4,8,16,0.85)" }}
          onClick={() => setShowDeploy(false)}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{ width: "460px", background: "#0b1120", border: "1px solid #1e2d4a" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
              <h3 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 700 }}>部署模型</h3>
              <button onClick={() => setShowDeploy(false)} style={{ color: "#4a6080" }}><X size={18} /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
                <Brain size={20} color="#00b4ff" />
                <div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>{deployingModel.name}</div>
                  <div style={{ color: "#4a6080", fontSize: "11px" }}>{deployingModel.type} · {deployingModel.version}</div>
                </div>
              </div>
              <p style={{ color: "#6b8299", fontSize: "12px", marginBottom: "16px" }}>选择要部署此模型的无人机：</p>
              <div className="grid grid-cols-2 gap-2">
                {["UAV-001", "UAV-002", "UAV-003", "UAV-004", "UAV-006", "UAV-007"].map((drone) => (
                  <button
                    key={drone}
                    onClick={() =>
                      setSelectedDrones((p) =>
                        p.includes(drone) ? p.filter((d) => d !== drone) : [...p, drone]
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all"
                    style={{
                      background: selectedDrones.includes(drone) ? "rgba(34,197,94,0.1)" : "#060c1a",
                      border: `1px solid ${selectedDrones.includes(drone) ? "rgba(34,197,94,0.4)" : "#1e2d4a"}`,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center"
                      style={{
                        background: selectedDrones.includes(drone) ? "#22c55e" : "#1e2d4a",
                        border: `1px solid ${selectedDrones.includes(drone) ? "#22c55e" : "#2a3d5a"}`,
                      }}
                    >
                      {selectedDrones.includes(drone) && <CheckCircle size={10} color="#fff" />}
                    </div>
                    <span style={{ color: selectedDrones.includes(drone) ? "#22c55e" : "#6b8299", fontSize: "12px" }}>{drone}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #1e2d4a" }}>
              <button onClick={() => setShowDeploy(false)} className="px-4 py-2 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "13px" }}>
                取消
              </button>
              <button
                onClick={handleDeploy}
                disabled={selectedDrones.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  background: selectedDrones.length > 0 ? "linear-gradient(135deg, #0055cc, #00b4ff)" : "#1e2d4a",
                  color: selectedDrones.length > 0 ? "#fff" : "#4a6080",
                  fontSize: "13px",
                  cursor: selectedDrones.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <Upload size={13} /> 确认部署 ({selectedDrones.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
