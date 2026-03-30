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

  const filtered = taskList.filter(
    (t) =>
      t.date === selectedDate &&
      (filterStatus === "all" || t.status === filterStatus)
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
                >
                  <div className="flex items-start justify-between">
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
    </div>
  );
}
