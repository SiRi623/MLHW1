import { useState } from "react";
import {
  Video,
  Play,
  Download,
  Trash2,
  Image,
  Info,
  Search,
  Filter,
  ChevronDown,
  X,
  FileVideo,
  Clock,
  Calendar,
  MapPin,
  HardDrive,
  Layers,
  CheckCircle,
  AlertCircle,
  Eye,
  Film,
} from "lucide-react";

const TRAFFIC_IMG = "https://images.unsplash.com/photo-1686924877564-746d9b7316b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwdHJhZmZpYyUyMGludGVyc2VjdGlvbiUyMGFlcmlhbCUyMHRvcCUyMHZpZXd8ZW58MXx8fHwxNzc0ODY4MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080";
const DRONE_IMG = "https://images.unsplash.com/photo-1718925896582-764bd87bda6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMHN1cnZlaWxsYW5jZSUyMHVyYmFuJTIwdHJhZmZpYyUyMG1vbml0b3Jpbmd8ZW58MXx8fHwxNzc0ODY4MzEyfDA&ixlib=rb-4.1.0&q=80&w=1080";

const tasks = [
  { id: "T001", name: "晨峰路口巡查", date: "2026-03-30", drone: "UAV-001", count: 5 },
  { id: "T002", name: "南环快速路监测", date: "2026-03-30", drone: "UAV-002", count: 3 },
  { id: "T003", name: "老城区违规抓拍", date: "2026-03-29", drone: "UAV-003", count: 7 },
  { id: "T004", name: "停车场巡检", date: "2026-03-29", drone: "UAV-004", count: 4 },
  { id: "T005", name: "夜间交通流量统计", date: "2026-03-28", drone: "UAV-001", count: 6 },
];

const generateVideos = (taskId: string, count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${taskId}-V${String(i + 1).padStart(3, "0")}`,
    name: `${taskId}_录像_${String(i + 1).padStart(3, "0")}.mp4`,
    duration: `${Math.floor(Math.random() * 20 + 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    size: `${(Math.random() * 2 + 0.5).toFixed(1)} GB`,
    resolution: ["1920×1080", "3840×2160", "2704×1520"][i % 3],
    fps: [24, 30, 60][i % 3],
    location: ["路口A", "路口B", "干道C", "环路D"][i % 4],
    time: `${String(8 + i).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    thumbnail: i % 2 === 0 ? TRAFFIC_IMG : DRONE_IMG,
    frames: Math.floor(Math.random() * 20 + 5),
    status: i === 0 ? "processing" : "ready",
  }));

export function VideoManagement() {
  const [selectedTask, setSelectedTask] = useState(tasks[0]);
  const [selectedVideo, setSelectedVideo] = useState<ReturnType<typeof generateVideos>[0] | null>(null);
  const [modal, setModal] = useState<"play" | "info" | "frames" | null>(null);
  const [search, setSearch] = useState("");
  const [extractingFrames, setExtractingFrames] = useState(false);
  const [framesExtracted, setFramesExtracted] = useState(false);
  const [selectedFrames, setSelectedFrames] = useState<number[]>([]);

  const videos = generateVideos(selectedTask.id, selectedTask.count).filter(
    (v) => !search || v.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleExtractFrames = async () => {
    setExtractingFrames(true);
    await new Promise((r) => setTimeout(r, 2000));
    setExtractingFrames(false);
    setFramesExtracted(true);
  };

  const mockFrames = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    time: `${String(Math.floor(i * 30 / 60)).padStart(2, "0")}:${String(i * 30 % 60).padStart(2, "0")}`,
    thumbnail: i % 2 === 0 ? TRAFFIC_IMG : DRONE_IMG,
  }));

  return (
    <div className="flex h-full" style={{ background: "#080d1a" }}>
      {/* Task List */}
      <div
        className="flex-shrink-0"
        style={{ width: "240px", background: "#0b1120", borderRight: "1px solid #1e2d4a" }}
      >
        <div className="p-4" style={{ borderBottom: "1px solid #1e2d4a" }}>
          <h2 style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>任务列表</h2>
          <p style={{ color: "#4a6080", fontSize: "11px", marginTop: "2px" }}>共 {tasks.length} 个任务</p>
        </div>
        <div className="p-3 space-y-1.5">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => { setSelectedTask(task); setSelectedVideo(null); }}
              className="w-full text-left p-3 rounded-lg transition-all"
              style={{
                background: selectedTask.id === task.id ? "rgba(0,100,200,0.15)" : "#060c1a",
                border: `1px solid ${selectedTask.id === task.id ? "rgba(0,180,255,0.3)" : "#1e2d4a"}`,
              }}
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: selectedTask.id === task.id ? "rgba(0,100,200,0.3)" : "#0a1628" }}
                >
                  <FileVideo size={14} color={selectedTask.id === task.id ? "#00b4ff" : "#4a6080"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }} className="truncate">{task.name}</div>
                  <div style={{ color: "#4a6080", fontSize: "10px", marginTop: "2px" }}>
                    {task.drone} · {task.count} 个视频
                  </div>
                  <div style={{ color: "#4a6080", fontSize: "10px" }}>{task.date}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Video List */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div
          className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
          style={{ background: "#0b1120", borderBottom: "1px solid #1e2d4a" }}
        >
          <div style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }} className="flex-shrink-0">
            {selectedTask.name}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1" style={{ background: "#060c1a", border: "1px solid #1e2d4a", maxWidth: "300px" }}>
            <Search size={12} color="#4a6080" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索视频..."
              className="flex-1 bg-transparent outline-none"
              style={{ color: "#e2e8f0", fontSize: "12px" }}
            />
          </div>
          <div style={{ color: "#4a6080", fontSize: "12px" }}>
            共 {videos.length} 个视频
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 overflow-auto p-5">
          <div className="grid grid-cols-3 gap-4" style={{ minWidth: 0 }}>
            {videos.map((video) => (
              <div
                key={video.id}
                className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
                style={{
                  background: "#0b1120",
                  border: `1px solid ${selectedVideo?.id === video.id ? "rgba(0,180,255,0.4)" : "#1e2d4a"}`,
                  boxShadow: selectedVideo?.id === video.id ? "0 0 20px rgba(0,100,200,0.2)" : "none",
                }}
                onClick={() => setSelectedVideo(selectedVideo?.id === video.id ? null : video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img src={video.thumbnail} alt="" className="w-full h-full object-cover" style={{ opacity: 0.7 }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedVideo(video); setModal("play"); }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(0,100,200,0.8)", boxShadow: "0 0 20px rgba(0,100,200,0.6)" }}
                    >
                      <Play size={16} color="#fff" fill="#fff" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "10px" }}>
                    {video.duration}
                  </div>
                  {video.status === "processing" && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.8)", color: "#fff", fontSize: "9px" }}>
                      处理中
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }} className="truncate">{video.name}</div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span style={{ color: "#4a6080", fontSize: "10px" }}>{video.resolution}</span>
                    <span style={{ color: "#4a6080", fontSize: "10px" }}>{video.fps}fps</span>
                    <span style={{ color: "#4a6080", fontSize: "10px" }}>{video.size}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={9} color="#4a6080" />
                    <span style={{ color: "#4a6080", fontSize: "10px" }}>{video.location} · {video.time}</span>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1.5 mt-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedVideo(video); setModal("play"); }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                      style={{ background: "rgba(0,100,200,0.2)", border: "1px solid rgba(0,180,255,0.3)", color: "#00b4ff", fontSize: "10px" }}
                    >
                      <Play size={9} fill="#00b4ff" /> 播放
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedVideo(video); setModal("info"); }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "10px" }}
                    >
                      <Info size={9} /> 属性
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedVideo(video); setFramesExtracted(false); setModal("frames"); }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "10px" }}
                    >
                      <Film size={9} /> 抽帧
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                      style={{ background: "#060c1a", border: "1px solid #1e2d4a", color: "#6b8299", fontSize: "10px" }}
                    >
                      <Download size={9} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "10px" }}
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && selectedVideo && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(4,8,16,0.85)" }}
          onClick={() => setModal(null)}
        >
          <div
            className="relative"
            style={{ maxWidth: modal === "frames" ? "900px" : "760px", width: "95%", maxHeight: "90vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#0b1120", border: "1px solid #1e2d4a" }}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid #1e2d4a" }}
              >
                <div className="flex items-center gap-2">
                  {modal === "play" && <Play size={15} color="#00b4ff" />}
                  {modal === "info" && <Info size={15} color="#00b4ff" />}
                  {modal === "frames" && <Film size={15} color="#00b4ff" />}
                  <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>
                    {modal === "play" ? "视频播放" : modal === "info" ? "视频属性" : "视频抽帧"}
                  </span>
                  <span style={{ color: "#4a6080", fontSize: "12px" }}>— {selectedVideo.name}</span>
                </div>
                <button onClick={() => setModal(null)} style={{ color: "#4a6080" }}>
                  <X size={18} />
                </button>
              </div>

              {/* Play Modal */}
              {modal === "play" && (
                <div>
                  <div className="relative" style={{ aspectRatio: "16/9", background: "#000" }}>
                    <img src={selectedVideo.thumbnail} alt="" className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Play size={48} color="#fff" opacity={0.8} />
                      <p style={{ color: "#6b8299", fontSize: "13px", marginTop: "12px" }}>演示模式 · 实际部署后播放真实视频流</p>
                    </div>
                    {/* Player Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.9))" }}>
                      <div className="w-full h-1 rounded-full mb-3" style={{ background: "#1e2d4a" }}>
                        <div className="h-full rounded-full" style={{ width: "35%", background: "#00b4ff" }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button style={{ color: "#fff" }}><Play size={16} fill="#fff" /></button>
                          <span style={{ color: "#94a3b8", fontSize: "12px" }}>03:42 / {selectedVideo.duration}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={{ color: "#94a3b8", fontSize: "12px" }}>{selectedVideo.resolution}</span>
                          <Layers size={14} color="#94a3b8" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Modal */}
              {modal === "info" && (
                <div className="p-5 grid grid-cols-2 gap-4">
                  {[
                    { label: "文件名称", value: selectedVideo.name, icon: FileVideo },
                    { label: "视频时长", value: selectedVideo.duration, icon: Clock },
                    { label: "文件大小", value: selectedVideo.size, icon: HardDrive },
                    { label: "分辨率", value: selectedVideo.resolution, icon: Eye },
                    { label: "帧率", value: `${selectedVideo.fps} fps`, icon: Film },
                    { label: "拍摄地点", value: selectedVideo.location, icon: MapPin },
                    { label: "拍摄时间", value: `${selectedTask.date} ${selectedVideo.time}`, icon: Calendar },
                    { label: "执行无人机", value: selectedTask.drone, icon: Video },
                    { label: "所属任务", value: selectedTask.name, icon: CheckCircle },
                    { label: "抽帧数量", value: `${selectedVideo.frames} 帧`, icon: Image },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#0a1628" }}>
                        <Icon size={14} color="#00b4ff" />
                      </div>
                      <div>
                        <div style={{ color: "#4a6080", fontSize: "10px" }}>{label}</div>
                        <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Frames Modal */}
              {modal === "frames" && (
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 p-3 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
                      <div style={{ color: "#4a6080", fontSize: "11px" }}>抽帧间隔</div>
                      <div style={{ color: "#e2e8f0", fontSize: "13px" }}>每 30 秒</div>
                    </div>
                    <div className="flex-1 p-3 rounded-lg" style={{ background: "#060c1a", border: "1px solid #1e2d4a" }}>
                      <div style={{ color: "#4a6080", fontSize: "11px" }}>预计帧数</div>
                      <div style={{ color: "#e2e8f0", fontSize: "13px" }}>12 帧</div>
                    </div>
                    <button
                      onClick={handleExtractFrames}
                      disabled={extractingFrames || framesExtracted}
                      className="px-4 py-3 rounded-lg flex items-center gap-2"
                      style={{
                        background: framesExtracted ? "rgba(34,197,94,0.2)" : "linear-gradient(135deg, #0055cc, #00b4ff)",
                        border: framesExtracted ? "1px solid rgba(34,197,94,0.4)" : "none",
                        color: framesExtracted ? "#22c55e" : "#fff",
                        fontSize: "13px",
                        cursor: extractingFrames || framesExtracted ? "default" : "pointer",
                      }}
                    >
                      {extractingFrames ? (
                        <>
                          <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          抽帧中...
                        </>
                      ) : framesExtracted ? (
                        <><CheckCircle size={14} /> 已完成</>
                      ) : (
                        <><Film size={14} /> 开始抽帧</>
                      )}
                    </button>
                  </div>
                  {framesExtracted && (
                    <div className="grid grid-cols-4 gap-3">
                      {mockFrames.map((frame) => (
                        <div
                          key={frame.id}
                          className="rounded-lg overflow-hidden cursor-pointer transition-all"
                          style={{
                            border: `1px solid ${selectedFrames.includes(frame.id) ? "rgba(0,180,255,0.5)" : "#1e2d4a"}`,
                            boxShadow: selectedFrames.includes(frame.id) ? "0 0 10px rgba(0,100,200,0.3)" : "none",
                          }}
                          onClick={() =>
                            setSelectedFrames((p) =>
                              p.includes(frame.id) ? p.filter((f) => f !== frame.id) : [...p, frame.id]
                            )
                          }
                        >
                          <div className="relative aspect-video">
                            <img src={frame.thumbnail} alt="" className="w-full h-full object-cover" />
                            {selectedFrames.includes(frame.id) && (
                              <div className="absolute top-1 right-1">
                                <CheckCircle size={14} color="#00b4ff" fill="rgba(0,100,200,0.7)" />
                              </div>
                            )}
                          </div>
                          <div className="px-2 py-1" style={{ background: "#060c1a" }}>
                            <span style={{ color: "#4a6080", fontSize: "9px" }}>帧 {String(frame.id + 1).padStart(2, "0")} · {frame.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {framesExtracted && selectedFrames.length > 0 && (
                    <div className="flex justify-end mt-4">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg"
                        style={{ background: "linear-gradient(135deg, #0055cc, #00b4ff)", color: "#fff", fontSize: "12px" }}
                      >
                        <Download size={13} /> 下载选中帧 ({selectedFrames.length})
                      </button>
                    </div>
                  )}
                  {!framesExtracted && !extractingFrames && (
                    <div
                      className="py-16 flex flex-col items-center gap-3"
                      style={{ color: "#4a6080" }}
                    >
                      <Film size={40} opacity={0.3} />
                      <p style={{ fontSize: "13px" }}>点击"开始抽帧"从视频中提取关键帧图片</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
