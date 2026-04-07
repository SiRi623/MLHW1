import { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Battery,
  Navigation,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Radio,
} from "lucide-react";
// 无人机设备状态数据
const drones = [
  { id: "UAV-001", name: "无人机-001", battery: 82, signal: 95, status: "online" },
  { id: "UAV-002", name: "无人机-002", battery: 65, signal: 88, status: "online" },
  { id: "UAV-003", name: "无人机-003", battery: 91, signal: 92, status: "online" },
  { id: "UAV-004", name: "无人机-004", battery: 100, signal: 99, status: "online" },
  { id: "UAV-006", name: "无人机-006", battery: 74, signal: 85, status: "online" },
  { id: "UAV-007", name: "无人机-007", battery: 85, signal: 90, status: "online" },
];

type TaskStatus = "scheduled" | "running" | "completed" | "failed" | "paused";

const tasks: {
  id: string;
  name: string;
  drone: string;
  station: string;
  startTime: string;
  endTime: string;
  date: string;
  repeat: string;
  status: TaskStatus;
  weather: "sunny" | "cloudy" | "rainy";
  progress: number;
  route: string;
}[] = [
  { id: "PT001", name: "朝阳路-晨峰巡查", drone: "UAV-001", station: "BS-01", startTime: "07:30", endTime: "09:00", date: "2026-03-30", repeat: "工作日", status: "running", weather: "sunny", progress: 68, route: "RT-001" },
  { id: "PT002", name: "南环快速路监测", drone: "UAV-002", station: "BS-02", startTime: "10:00", endTime: "11:30", date: "2026-03-30", repeat: "每日", status: "scheduled", weather: "cloudy", progress: 0, route: "RT-002" },
  { id: "PT003", name: "老城区违规抓拍", drone: "UAV-003", station: "BS-01", startTime: "14:00", endTime: "16:00", date: "2026-03-30", repeat: "每日", status: "scheduled", weather: "sunny", progress: 0, route: "RT-003" },
  { id: "PT004", name: "夕峰路口疏导", drone: "UAV-006", station: "BS-03", startTime: "17:30", endTime: "19:00", date: "2026-03-30", repeat: "工作日", status: "scheduled", weather: "sunny", progress: 0, route: "RT-004" },
  { id: "PT005", name: "夜间停车巡逻", drone: "UAV-004", station: "BS-02", startTime: "22:00", endTime: "23:30", date: "2026-03-30", repeat: "每日", status: "paused", weather: "cloudy", progress: 0, route: "RT-005" },
  { id: "PT006", name: "早高峰全域扫描", drone: "UAV-007", station: "BS-03", startTime: "08:00", endTime: "09:30", date: "2026-03-29", repeat: "工作日", status: "completed", weather: "sunny", progress: 100, route: "RT-001" },
  { id: "PT007", name: "晚间事故巡查", drone: "UAV-001", station: "BS-01", startTime: "20:00", endTime: "21:00", date: "2026-03-29", repeat: "非周期", status: "failed", weather: "rainy", progress: 42, route: "RT-002" },
];
// 任务执行日志
interface ExecutionLog {
  id: number;
  taskId: string;
  startTime: string;
  endTime: string;
  result: "成功" | "失败" | "部分成功";
  reason?: string;
}

const initialExecutionLogs: ExecutionLog[] = [
  { id: 1, taskId: "PT001", startTime: "2026-03-30 07:30:00", endTime: "2026-03-30 08:45:00", result: "成功" },
  { id: 2, taskId: "PT001", startTime: "2026-03-29 07:30:00", endTime: "2026-03-29 08:50:00", result: "成功" },
  { id: 3, taskId: "PT002", startTime: "2026-03-30 10:00:00", endTime: "2026-03-30 11:25:00", result: "成功" },
  { id: 4, taskId: "PT002", startTime: "2026-03-29 10:00:00", endTime: "2026-03-29 11:15:00", result: "失败", reason: "天气原因" },
  { id: 5, taskId: "PT003", startTime: "2026-03-30 14:00:00", endTime: "2026-03-30 15:30:00", result: "成功" },
  { id: 6, taskId: "PT007", startTime: "2026-03-29 20:00:00", endTime: "2026-03-29 20:45:00", result: "部分成功", reason: "中途信号中断" },
];
const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  running: { label: "执行中", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  scheduled: { label: "待执行", color: "#00b4ff", bg: "rgba(0,180,255,0.1)" },
  completed: { label: "已完成", color: "#6b8299", bg: "rgba(107,130,153,0.1)" },
  failed: { label: "失败", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  paused: { label: "已暂停", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
};

const weatherIcon: Record<string, React.ReactNode> = {
  sunny: <Sun size={12} color="#f59e0b" />,
  cloudy: <Cloud size={12} color="#94a3b8" />,
  rainy: <CloudRain size={12} color="#60a5fa" />,
};

const weatherLabel: Record<string, string> = { sunny: "晴", cloudy: "多云", rainy: "雨" };
const WeatherIcon = ({ w }: { w: string }) => <>{weatherIcon[w]}</>;

export function PlannedOperations() {
  const [taskList, setTaskList] = useState(tasks);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-03-30");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newTask, setNewTask] = useState({
    name: "",
    drone: "UAV-001",
    station: "BS-01",
    startTime: "09:00",
    endTime: "10:30",
    date: "2026-03-31",
    repeat: "非周期",
    route: "RT-001",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);
  const [editingTask, setEditingTask] = useState<typeof tasks[0] | null>(null);
  const [executionLogs, setExecutionLogs] = useState(initialExecutionLogs);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isBatchMode, setIsBatchMode] = useState(false);

  const filtered = taskList.filter(
    (t) =>
      t.date === selectedDate &&
      (filterStatus === "all" || t.status === filterStatus) &&
      t.name.includes(searchKeyword)
  );

const handleCreate = () => {
  const task = {
    ...newTask,
    id: `PT${String(taskList.length + 1).padStart(3, "0")}`,
    status: "scheduled" as TaskStatus,
    weather: "sunny" as "sunny",
    progress: 0,
  };
  setTaskList((p) => [...p, task]);
  
  // 添加创建日志（需要把 executionLogs 改成 useState）
  const newLog: ExecutionLog = {
    id: executionLogs.length + 1,
    taskId: task.id,
    startTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    endTime: "",
    result: "部分成功",
    reason: "任务已创建，等待执行",
  };
  setExecutionLogs((prev) => [...prev, newLog]);
  
  setShowCreate(false);
  setNewTask({ name: "", drone: "UAV-001", station: "BS-01", startTime: "09:00", endTime: "10:30", date: "2026-03-31", repeat: "非周期", route: "RT-001" });
};

  const toggleTask = (id: string) => {
    setTaskList((p) =>
      p.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "running" ? "paused" : t.status === "paused" ? "running" : t.status }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTaskList((p) => p.filter((t) => t.id !== id));
  };

  // Timeline hours
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // 检查天气是否适合作业
  const isWeatherSuitable = (weather: string): boolean => {
    // 雨天不适合作业
    if (weather === "rainy") return false;
    // 多云和晴天适合
    return true;
  };

  // 检查无人机设备状态
  const checkDroneStatus = (droneId: string): { ok: boolean; reason?: string } => {
    // 模拟设备状态检查
    const drone = drones.find(d => d.id === droneId);
    if (!drone) return { ok: false, reason: "无人机不存在" };
    if (drone.battery < 30) return { ok: false, reason: "电量不足" };
    if (drone.signal < 50) return { ok: false, reason: "信号弱" };
    return { ok: true };
  };

// 自动执行任务检查
  const canAutoExecute = (task: typeof tasks[0]): { ok: boolean; reason?: string } => {
    // 检查天气
    if (!isWeatherSuitable(task.weather)) {
      return { ok: false, reason: "天气条件不适合作业" };
    }
    // 检查设备状态
    const droneStatus = checkDroneStatus(task.drone);
    if (!droneStatus.ok) {
      return droneStatus;
    }
    return { ok: true };
  };
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#080d1a" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ background: "#0b1120", borderBottom: "1px solid #1e2d4a" }}
      >
        <div>
          <h2 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 700 }}>计划作业</h2>
          <p style={{ color: "#4a6080", fontSize: "12px" }}>无人机定时调度管理</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Nav */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
            <button onClick={() => setSelectedDate("2026-03-29")} style={{ color: "#4a6080" }}>
              <ChevronLeft size={14} />
            </button>
            <Calendar size={13} color="#00b4ff" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent outline-none"
              style={{ color: "#e2e8f0", fontSize: "13px" }}
            />
            <button onClick={() => setSelectedDate("2026-03-31")} style={{ color: "#4a6080" }}>
              <ChevronRight size={14} />
            </button>
          </div>
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg outline-none"
            style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "12px" }}
          >
            <option value="all">全部状态</option>
            {Object.entries(statusConfig).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          {/* 搜索框 */}
          <input
            type="text"
            placeholder="搜索任务名称..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="px-3 py-2 rounded-lg outline-none"
            style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "12px", width: "150px" }}
          />
          
          {/* 清除按钮 */}
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword("")}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#4a6080" }}
            >
              <X size={12} />
            </button>
          )}
          {/* 批量操作按钮 */}
            <button
              onClick={() => {
                setIsBatchMode(!isBatchMode);
                setSelectedTaskIds([]);
              }}
              className="px-3 py-2 rounded-lg flex items-center gap-2"
              style={{
                background: isBatchMode ? "rgba(0,180,255,0.2)" : "#060c1a",
                border: `1px solid ${isBatchMode ? "#00b4ff" : "#1e2d4a"}`,
                color: isBatchMode ? "#00b4ff" : "#6b8299",
                fontSize: "12px"
              }}
            >
              <CheckCircle size={14} /> 批量操作
            </button>

            {isBatchMode && (
              <>
                <button
                  onClick={() => {
                    if (selectedTaskIds.length === 0) return;
                    if (confirm(`确定删除 ${selectedTaskIds.length} 个任务吗？`)) {
                      setTaskList((prev) => prev.filter((t) => !selectedTaskIds.includes(t.id)));
                      setSelectedTaskIds([]);
                      setIsBatchMode(false);
                    }
                  }}
                  className="px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "12px" }}
                >
                  <Trash2 size={14} /> 删除选中 ({selectedTaskIds.length})
                </button>
                <button
                  onClick={() => {
                    if (selectedTaskIds.length === 0) return;
                    setTaskList((prev) =>
                      prev.map((t) =>
                        selectedTaskIds.includes(t.id) && (t.status === "scheduled" || t.status === "paused" || t.status === "running")
                          ? { ...t, status: t.status === "running" ? "paused" : "running" }
                          : t
                      )
                    );
                    setSelectedTaskIds([]);
                    setIsBatchMode(false);
                  }}
                  className="px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: "12px" }}
                >
                  <Play size={14} /> 批量执行/暂停 ({selectedTaskIds.length})
                </button>
              </>
            )}
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}
          >
            <Plus size={14} /> 新建计划
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Timeline */}
        <div className="flex-1 overflow-auto p-5">
          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[
              { label: "今日任务", value: filtered.length, color: "#00b4ff" },
              { label: "执行中", value: filtered.filter((t) => t.status === "running").length, color: "#22c55e" },
              { label: "待执行", value: filtered.filter((t) => t.status === "scheduled").length, color: "#00b4ff" },
              { label: "已完成", value: taskList.filter((t) => t.status === "completed").length, color: "#6b8299" },
              { label: "异常", value: taskList.filter((t) => t.status === "failed").length, color: "#ef4444" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-4 rounded-xl text-center" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
                <div style={{ color, fontSize: "24px", fontWeight: 700 }}>{value}</div>
                <div style={{ color: "#4a6080", fontSize: "12px", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Timeline Chart */}
          <div className="rounded-xl overflow-hidden mb-5" style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid #1e2d4a" }}>
              <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>作业时间轴</span>
              <span style={{ color: "#4a6080", fontSize: "11px", marginLeft: "8px" }}>{selectedDate}</span>
            </div>
            <div className="p-4 overflow-x-auto">
              {/* Hour labels */}
              <div className="flex gap-0 mb-2" style={{ paddingLeft: "100px" }}>
                {hours.filter((h) => h % 2 === 0).map((h) => (
                  <div key={h} style={{ width: "8.33%", color: "#4a6080", fontSize: "10px", textAlign: "center" }}>
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}
              </div>
              {/* Drone rows */}
              {["UAV-001", "UAV-002", "UAV-003", "UAV-004", "UAV-006", "UAV-007"].map((droneId) => {
                const droneTasks = taskList.filter((t) => t.drone === droneId && t.date === selectedDate);
                return (
                  <div key={droneId} className="flex items-center gap-0 mb-2">
                    <div style={{ width: "100px", color: "#6b8299", fontSize: "11px", flexShrink: 0 }}>{droneId}</div>
                    <div className="relative flex-1 h-7 rounded" style={{ background: "#060c1a" }}>
                      {droneTasks.map((t) => {
                        const [sh, sm] = t.startTime.split(":").map(Number);
                        const [eh, em] = t.endTime.split(":").map(Number);
                        const start = ((sh * 60 + sm) / (24 * 60)) * 100;
                        const width = (((eh * 60 + em) - (sh * 60 + sm)) / (24 * 60)) * 100;
                        return (
                          <div
                            key={t.id}
                            className="absolute inset-y-1 rounded flex items-center px-1.5"
                            style={{
                              left: `${start}%`,
                              width: `${width}%`,
                              background: statusConfig[t.status].bg,
                              border: `1px solid ${statusConfig[t.status].color}44`,
                              overflow: "hidden",
                            }}
                            title={t.name}
                          >
                            <span style={{ color: statusConfig[t.status].color, fontSize: "9px", whiteSpace: "nowrap", overflow: "hidden" }}>
                              {t.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

                  {/* Task List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-16 text-center" style={{ color: "#4a6080" }}>
              <Calendar size={40} className="mx-auto mb-3" opacity={0.3} />
              <p>当日无计划任务</p>
            </div>
          ) : (
            filtered.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl"
                style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-start justify-between">
                  {isBatchMode && (
                    <input
                      type="checkbox"
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTaskIds((prev) => [...prev, task.id]);
                        } else {
                          setSelectedTaskIds((prev) => prev.filter((id) => id !== task.id));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 mt-3 mr-2 rounded"
                      style={{ accentColor: "#00b4ff" }}
                    />
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: statusConfig[task.status].bg, border: `1px solid ${statusConfig[task.status].color}44` }}
                    >
                      <Navigation size={16} color={statusConfig[task.status].color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>{task.name}</span>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{ background: statusConfig[task.status].bg, color: statusConfig[task.status].color, fontSize: "10px" }}
                        >
                          {statusConfig[task.status].label}
                        </span>
                        {/* 自动调度标识 */}
                        {task.status === "scheduled" && canAutoExecute(task).ok && (
                          <div className="flex items-center gap-1">
                            <RotateCcw size={10} color="#00b4ff" />
                            <span style={{ color: "#00b4ff", fontSize: "9px" }}>自动调度</span>
                          </div>
                        )}
                        {task.status === "scheduled" && !canAutoExecute(task).ok && (
                          <div className="flex items-center gap-1">
                            <AlertCircle size={10} color="#f59e0b" />
                            <span style={{ color: "#f59e0b", fontSize: "9px" }}>
                              {canAutoExecute(task).reason}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span style={{ color: "#4a6080", fontSize: "11px" }}>🛸 {task.drone}</span>
                        <span style={{ color: "#4a6080", fontSize: "11px" }}>📡 {task.station}</span>
                        <span style={{ color: "#4a6080", fontSize: "11px" }}>🛤️ {task.route}</span>
                        <div className="flex items-center gap-1">
                          <WeatherIcon w={task.weather} />
                          <span style={{ color: "#4a6080", fontSize: "11px" }}>{weatherLabel[task.weather]}</span>
                        </div>
                        <span style={{ color: "#4a6080", fontSize: "11px" }}>🔁 {task.repeat}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <div className="text-right">
                      <div style={{ color: "#e2e8f0", fontSize: "12px" }}>{task.startTime} — {task.endTime}</div>
                      <div style={{ color: "#4a6080", fontSize: "10px" }}>{task.date}</div>
                    </div>
                    {(task.status === "running" || task.status === "paused" || task.status === "scheduled") && (
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: task.status === "running" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)", border: "1px solid #1e2d4a" }}
                      >
                        {task.status === "running" ? <Pause size={12} color="#f59e0b" /> : <Play size={12} color="#22c55e" />}
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      <Trash2 size={12} color="#ef4444" />
                    </button>
                  </div>
                </div>
                {/* Progress */}
                {(task.status === "running" || task.status === "completed") && (
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span style={{ color: "#4a6080", fontSize: "10px" }}>执行进度</span>
                      <span style={{ color: "#00b4ff", fontSize: "10px" }}>{task.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "#1e2d4a" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${task.progress}%`, background: "linear-gradient(90deg, #0066ff, #00b4ff)" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

        {/* Weather Sidebar */}
        <div
          className="flex-shrink-0 p-4 overflow-y-auto"
          style={{ width: "220px", background: "#0b1120", borderLeft: "1px solid #1e2d4a" }}
        >
          <div className="mb-4">
            <h3 style={{ color: "#00b4ff", fontSize: "13px", fontWeight: 600 }}>天气状况</h3>
            <p style={{ color: "#4a6080", fontSize: "11px" }}>作业条件评估</p>
          </div>
          <div className="p-4 rounded-xl mb-4 text-center" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
            <Sun size={36} color="#f59e0b" className="mx-auto mb-2" />
            <div style={{ color: "#e2e8f0", fontSize: "22px", fontWeight: 700 }}>晴</div>
            <div style={{ color: "#4a6080", fontSize: "12px" }}>18°C — 适宜作业</div>
          </div>
          {[
            { icon: Wind, label: "风速", value: "3.2 m/s", ok: true },
            { icon: Cloud, label: "云量", value: "15%", ok: true },
            { icon: Battery, label: "能见度", value: "8 km", ok: true },
            { icon: Radio, label: "信号干扰", value: "低", ok: true },
          ].map(({ icon: Icon, label, value, ok }) => (
            <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg mb-2" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
              <div className="flex items-center gap-2">
                <Icon size={12} color="#6b8299" />
                <span style={{ color: "#6b8299", fontSize: "11px" }}>{label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ color: "#e2e8f0", fontSize: "11px" }}>{value}</span>
                {ok ? <CheckCircle size={10} color="#22c55e" /> : <AlertCircle size={10} color="#ef4444" />}
              </div>
            </div>
          ))}
          <div
            className="mt-4 px-3 py-3 rounded-xl"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={13} color="#22c55e" />
              <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 600 }}>适宜作业</span>
            </div>
            <p style={{ color: "#4a6080", fontSize: "10px", lineHeight: "1.5" }}>
              当前天气条件良好，风速低于预警阈值，能见度高，适合无人机执行巡查任务。
            </p>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(4,8,16,0.85)" }}
          onClick={() => setShowCreate(false)}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{ width: "520px", background: "#0b1120", border: "1px solid #1e2d4a" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
              <h3 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 700 }}>新建计划任务</h3>
              <button onClick={() => setShowCreate(false)} style={{ color: "#4a6080" }}><X size={18} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: "任务名称", key: "name", type: "text", placeholder: "请输入任务名称", full: true },
                { label: "执行日期", key: "date", type: "date" },
                { label: "开始时间", key: "startTime", type: "time" },
                { label: "结束时间", key: "endTime", type: "time" },
              ].map(({ label, key, type, placeholder, full }) => (
                <div key={key} className={full ? "col-span-2" : ""}>
                  <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>{label}</label>
                  <input
                    type={type}
                    value={newTask[key as keyof typeof newTask]}
                    onChange={(e) => setNewTask((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                  />
                </div>
              ))}
              {[
                { label: "无人机", key: "drone", options: ["UAV-001", "UAV-002", "UAV-003", "UAV-004", "UAV-006", "UAV-007"] },
                { label: "地面站", key: "station", options: ["BS-01", "BS-02", "BS-03"] },
                { label: "执行航线", key: "route", options: ["RT-001", "RT-002", "RT-003", "RT-004", "RT-005"] },
                { label: "重复周期", key: "repeat", options: ["非周期", "每日", "工作日", "每周", "每月"] },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>{label}</label>
                  <select
                    value={newTask[key as keyof typeof newTask]}
                    onChange={(e) => setNewTask((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                  >
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #1e2d4a" }}>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "13px" }}>
                取消
              </button>
              <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}>
                <Save size={13} /> 保存计划
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 任务详情弹窗 */}
      {selectedTask && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{ width: "420px", background: "#0b1120", border: "1px solid #1e2d4a" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid #1e2d4a", background: "#060c1a" }}
            >
              <div className="flex items-center gap-2">
                <Navigation size={16} color={statusConfig[selectedTask.status].color} />
                <h3 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 700 }}>{selectedTask.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#4a6080" }}
              >
                <X size={14} />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-4">
              {/* 状态 */}
              <div className="flex items-center justify-between">
                <span style={{ color: "#6b8299", fontSize: "12px" }}>执行状态</span>
                <span
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ background: statusConfig[selectedTask.status].bg, color: statusConfig[selectedTask.status].color }}
                >
                  {statusConfig[selectedTask.status].label}
                </span>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div style={{ color: "#6b8299", fontSize: "11px" }}>无人机</div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 500 }}>{selectedTask.drone}</div>
                </div>
                <div>
                  <div style={{ color: "#6b8299", fontSize: "11px" }}>地面站</div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 500 }}>{selectedTask.station}</div>
                </div>
                <div>
                  <div style={{ color: "#6b8299", fontSize: "11px" }}>执行航线</div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 500 }}>{selectedTask.route}</div>
                </div>
                <div>
                  <div style={{ color: "#6b8299", fontSize: "11px" }}>重复周期</div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 500 }}>{selectedTask.repeat}</div>
                </div>
              </div>

              {/* 时间 */}
              <div className="flex items-center gap-4 pt-2" style={{ borderTop: "1px solid #1e2d4a" }}>
                <div>
                  <div style={{ color: "#6b8299", fontSize: "11px" }}>执行日期</div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 500 }}>{selectedTask.date}</div>
                </div>
                <div>
                  <div style={{ color: "#6b8299", fontSize: "11px" }}>时间段</div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 500 }}>{selectedTask.startTime} — {selectedTask.endTime}</div>
                </div>
              </div>

              {/* 天气和进度 */}
              <div className="flex items-center gap-4">
                <div>
                  <div style={{ color: "#6b8299", fontSize: "11px" }}>天气条件</div>
                  <div className="flex items-center gap-1 mt-1">
                    <WeatherIcon w={selectedTask.weather} />
                    <span style={{ color: "#e2e8f0", fontSize: "13px" }}>{weatherLabel[selectedTask.weather]}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div style={{ color: "#6b8299", fontSize: "11px" }}>执行进度</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 rounded-full" style={{ background: "#1e2d4a" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${selectedTask.progress}%`, background: "linear-gradient(90deg, #0066ff, #00b4ff)" }}
                      />
                    </div>
                    <span style={{ color: "#00b4ff", fontSize: "12px" }}>{selectedTask.progress}%</span>
                  </div>
                </div>
              </div>

              {/* 自动调度状态 */}
              <div
                className="mt-2 p-3 rounded-lg"
                style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}
              >
                <div className="flex items-center gap-2">
                  <RotateCcw size={12} color="#00b4ff" />
                  <span style={{ color: "#00b4ff", fontSize: "11px", fontWeight: 500 }}>自动调度状态</span>
                </div>
                <div className="mt-1">
                  {(() => {
                    const check = canAutoExecute(selectedTask);
                    if (check.ok) {
                      return <span style={{ color: "#22c55e", fontSize: "12px" }}>✅ 条件满足，可自动执行</span>;
                    } else {
                      return <span style={{ color: "#f59e0b", fontSize: "12px" }}>⚠️ {check.reason}</span>;
                    }
                  })()}
                </div>
              </div>
            </div>
                          {/* 执行日志 */}
              <div
                className="mt-2 rounded-lg overflow-hidden"
                style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}
              >
                <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid #1e2d4a" }}>
                  <Clock size={12} color="#00b4ff" />
                  <span style={{ color: "#00b4ff", fontSize: "11px", fontWeight: 500 }}>执行日志</span>
                </div>
                <div className="p-2 max-h-32 overflow-y-auto">
                  {(() => {
                    const logs = executionLogs.filter(log => log.taskId === selectedTask.id);
                    if (logs.length === 0) {
                      return (
                        <div className="text-center py-3" style={{ color: "#4a6080", fontSize: "11px" }}>
                          暂无执行记录
                        </div>
                      );
                    }
                    return logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between px-2 py-1.5 border-b last:border-0"
                        style={{ borderColor: "#1e2d4a" }}
                      >
                        <div className="flex-1">
                          <div style={{ color: "#94a3b8", fontSize: "10px" }}>
                            {log.startTime} — {log.endTime}
                          </div>
                          {log.reason && (
                            <div style={{ color: "#4a6080", fontSize: "9px" }}>{log.reason}</div>
                          )}
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px]"
                          style={{
                            background: log.result === "成功" ? "rgba(34,197,94,0.15)" : log.result === "失败" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                            color: log.result === "成功" ? "#22c55e" : log.result === "失败" ? "#ef4444" : "#f59e0b",
                          }}
                        >
                          {log.result}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            {/* 底部按钮 */}
            <div className="flex gap-3 px-6 py-4" style={{ borderTop: "1px solid #1e2d4a" }}>
              <button
                onClick={() => setSelectedTask(null)}
                className="flex-1 py-2 rounded-lg"
                style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#94a3b8", fontSize: "13px" }}
              >
                关闭
              </button>
              <button
                onClick={() => {
                 const taskToEdit = selectedTask;
                  setSelectedTask(null);
                  setTimeout(() => {
                    setEditingTask(taskToEdit);
                  }, 200);
                }}
                className="flex-1 py-2 rounded-lg"
                style={{ background: "#0b1120", border: "1px solid #00b4ff", color: "#00b4ff", fontSize: "13px" }}
              >
                编辑
              </button>
              {selectedTask.status === "scheduled" && (
                <button
                  onClick={() => {
                    toggleTask(selectedTask.id);
                    setSelectedTask(null);
                  }}
                  className="flex-1 py-2 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}
                >
                  开始执行
                </button>
              )}
            </div>
                  {/* 编辑任务弹窗 */}
          {editingTask && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ background: "rgba(0,0,0,0.7)" }}
              onClick={() => setEditingTask(null)}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{ width: "520px", background: "#0b1120", border: "1px solid #1e2d4a" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1e2d4a", background: "#060c1a" }}>
                  <h3 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 700 }}>编辑任务</h3>
                  <button onClick={() => setEditingTask(null)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#0b1120", border: "1px solid #1e2d4a", color: "#4a6080" }}>
                    <X size={14} />
                  </button>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>任务名称</label>
                    <input
                      type="text"
                      value={editingTask.name}
                      onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>无人机</label>
                    <select
                      value={editingTask.drone}
                      onChange={(e) => setEditingTask({ ...editingTask, drone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                    >
                      <option value="UAV-001">UAV-001</option>
                      <option value="UAV-002">UAV-002</option>
                      <option value="UAV-003">UAV-003</option>
                      <option value="UAV-004">UAV-004</option>
                      <option value="UAV-006">UAV-006</option>
                      <option value="UAV-007">UAV-007</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>地面站</label>
                    <select
                      value={editingTask.station}
                      onChange={(e) => setEditingTask({ ...editingTask, station: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                    >
                      <option value="BS-01">BS-01</option>
                      <option value="BS-02">BS-02</option>
                      <option value="BS-03">BS-03</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>执行航线</label>
                    <select
                      value={editingTask.route}
                      onChange={(e) => setEditingTask({ ...editingTask, route: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                    >
                      <option value="RT-001">RT-001</option>
                      <option value="RT-002">RT-002</option>
                      <option value="RT-003">RT-003</option>
                      <option value="RT-004">RT-004</option>
                      <option value="RT-005">RT-005</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>执行日期</label>
                    <input
                      type="date"
                      value={editingTask.date}
                      onChange={(e) => setEditingTask({ ...editingTask, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>重复周期</label>
                    <select
                      value={editingTask.repeat}
                      onChange={(e) => setEditingTask({ ...editingTask, repeat: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                    >
                      <option value="非周期">非周期</option>
                      <option value="每日">每日</option>
                      <option value="工作日">工作日</option>
                      <option value="每周">每周</option>
                      <option value="每月">每月</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>开始时间</label>
                    <input
                      type="time"
                      value={editingTask.startTime}
                      onChange={(e) => setEditingTask({ ...editingTask, startTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ color: "#6b8299", fontSize: "11px", display: "block", marginBottom: "6px" }}>结束时间</label>
                    <input
                      type="time"
                      value={editingTask.endTime}
                      onChange={(e) => setEditingTask({ ...editingTask, endTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#e2e8f0", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 px-6 py-4" style={{ borderTop: "1px solid #1e2d4a" }}>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="flex-1 py-2 rounded-lg"
                    style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#94a3b8", fontSize: "13px" }}
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      // 更新任务列表
                      setTaskList((prev) =>
                        prev.map((t) => (t.id === editingTask.id ? { ...editingTask } : t))
                      );
                      setEditingTask(null);
                      // 显示成功提示
                      alert(`任务 "${editingTask.name}" 已更新`);
                    }}
                    className="flex-1 py-2 rounded-lg"
                    style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "13px" }}
                  >
                    <Save size={13} className="inline mr-1" /> 保存修改
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
