import React, { useMemo, useState } from "react";  
import {  
  Search,  
  Play,  
  Info,  
  Download,  
  Trash2,  
  Image as ImageIcon,  
  Video,  
  MapPin,  
  Filter,  
} from "lucide-react";  
  
import { Button } from "../components/ui/button";  
import { Input } from "../components/ui/input";  
import { Card, CardContent } from "../components/ui/card";  
import { Badge } from "../components/ui/badge";  
import { ScrollArea } from "../components/ui/scroll-area";  
import { Separator } from "../components/ui/separator";  
import {  
  Dialog,  
  DialogContent,  
  DialogHeader,  
  DialogTitle,  
  DialogDescription,  
} from "../components/ui/dialog";  
import {  
  Sheet,  
  SheetContent,  
  SheetHeader,  
  SheetTitle,  
  SheetDescription,  
} from "../components/ui/sheet";  
import {  
  AlertDialog,  
  AlertDialogAction,  
  AlertDialogCancel,  
  AlertDialogContent,  
  AlertDialogDescription,  
  AlertDialogFooter,  
  AlertDialogHeader,  
  AlertDialogTitle,  
} from "../components/ui/alert-dialog";  
  
type TaskStatus = "pending" | "processing" | "completed" | "error";  
type VideoStatus = "raw" | "processing" | "framed" | "analyzed" | "completed";  
  
interface FrameImage {  
  id: string;  
  time: number;  
  url: string;  
  width: number;  
  height: number;  
}  
  
interface VideoTask {  
  id: string;  
  name: string;  
  uavId: string;  
  date: string;  
  videoCount: number;  
  status: TaskStatus;  
}  
  
interface VideoItem {  
  id: string;  
  taskId: string;  
  name: string;  
  url: string;  
  thumbnail: string;  
  duration: number;  
  size: string;  
  resolution: string;  
  fps: number;  
  format: string;  
  status: VideoStatus;  
  capturePoint: string;  
  captureTime: string;  
  lng: number;  
  lat: number;  
  altitude: number;  
  heading: number;  
  gimbalPitch: number;  
  speed: number;  
  aiTags: string[];  
  frameImages: FrameImage[];  
}  
  
const mockTasks: VideoTask[] = [  
  {  
    id: "task-001",  
    name: "晨峰路口巡查",  
    uavId: "UAV-001",  
    date: "2026-03-30",  
    videoCount: 5,  
    status: "processing",  
  },  
  {  
    id: "task-002",  
    name: "南环快速路监测",  
    uavId: "UAV-002",  
    date: "2026-03-30",  
    videoCount: 3,  
    status: "completed",  
  },  
  {  
    id: "task-003",  
    name: "老城区违规抓拍",  
    uavId: "UAV-003",  
    date: "2026-03-29",  
    videoCount: 7,  
    status: "completed",  
  },  
  {  
    id: "task-004",  
    name: "停车场巡检",  
    uavId: "UAV-004",  
    date: "2026-03-29",  
    videoCount: 4,  
    status: "pending",  
  },  
  {  
    id: "task-005",  
    name: "夜间交通流量统计",  
    uavId: "UAV-001",  
    date: "2026-03-28",  
    videoCount: 6,  
    status: "error",  
  },  
];  
  
const mockVideos: VideoItem[] = [  
  {  
    id: "video-001",  
    taskId: "task-001",  
    name: "T001_录像_001.mp4",  
    url: "/videos/uav0000339_00001_v.mp4",  
    thumbnail:  
      "/pictures/0000001.jpg",  
    duration: 426,  
    size: "1.2 GB",  
    resolution: "1920×1080",  
    fps: 24,  
    format: "mp4",  
    status: "processing",  
    capturePoint: "路口A",  
    captureTime: "08:43",  
    lng: 116.397428,  
    lat: 39.90923,  
    altitude: 120,  
    heading: 85,  
    gimbalPitch: -45,  
    speed: 8.5,  
    aiTags: [ "路口车流监测"],  
    frameImages: [],  
  },  
  {  
    id: "video-002",  
    taskId: "task-001",  
    name: "T001_录像_002.mp4",  
    url: "/videos/uav0000117_02622_v.mp4",  
    thumbnail:  
      "/pictures/0000002.jpg",  
    duration: 1142,  
    size: "0.9 GB",  
    resolution: "3840×2160",  
    fps: 30,  
    format: "mp4",  
    status: "raw",  
    capturePoint: "路口B",  
    captureTime: "09:30",  
    lng: 116.401,  
    lat: 39.913,  
    altitude: 150,  
    heading: 102,  
    gimbalPitch: -35,  
    speed: 9.2,  
    aiTags: ["信号灯区域监测"],  
    frameImages: [],  
  },  
  {  
    id: "video-003",  
    taskId: "task-001",  
    name: "T001_录像_003.mp4",  
    url: "/videos/uav0000117_02622_v.mp4",  
    thumbnail:  
      "/pictures/0000003.jpg",  
    duration: 674,  
    size: "1.4 GB",  
    resolution: "2704×1520",  
    fps: 60,  
    format: "mp4",  
    status: "analyzed",  
    capturePoint: "干道C",  
    captureTime: "10:48",  
    lng: 116.408,  
    lat: 39.915,  
    altitude: 130,  
    heading: 120,  
    gimbalPitch: -50,  
    speed: 11.3,  
    aiTags: ["疑似违停", "车流量高峰"],  
    frameImages: [],  
  },  
  {  
    id: "video-004",  
    taskId: "task-001",  
    name: "T001_录像_004.mp4",  
    url: "/videos/uav0000117_02622_v.mp4",  
    thumbnail:  
      "/pictures/0000004.jpg",  
    duration: 408,  
    size: "0.8 GB",  
    resolution: "1920×1080",  
    fps: 24,  
    format: "mp4",  
    status: "framed",  
    capturePoint: "环路D",  
    captureTime: "11:13",  
    lng: 116.389,  
    lat: 39.901,  
    altitude: 110,  
    heading: 95,  
    gimbalPitch: -40,  
    speed: 7.6,  
    aiTags: ["已抽帧", "车道监测"],  
    frameImages: [  
      {  
        id: "f-1",  
        time: 10,  
        url: "https://picsum.photos/seed/frame1/800/450",  
        width: 800,  
        height: 450,  
      },  
      {  
        id: "f-2",  
        time: 20,  
        url: "https://picsum.photos/seed/frame2/800/450",  
        width: 800,  
        height: 450,  
      },  
    ],  
  },  
  {  
    id: "video-005",  
    taskId: "task-001",  
    name: "T001_录像_005.mp4",  
    url: "/videos/uav0000117_02622_v.mp4",  
    thumbnail:  
      "/pictures/0000005.jpg",  
    duration: 866,  
    size: "1.9 GB",  
    resolution: "3840×2160",  
    fps: 30,  
    format: "mp4",  
    status: "raw",  
    capturePoint: "路口A",  
    captureTime: "12:37",  
    lng: 116.397428,  
    lat: 39.90923,  
    altitude: 160,  
    heading: 88,  
    gimbalPitch: -55,  
    speed: 10.1,  
    aiTags: ["待分析"],  
    frameImages: [],  
  },  
  {  
    id: "video-006",  
    taskId: "task-002",  
    name: "T002_录像_001.mp4",  
    url: "/videos/uav0000117_02622_v.mp4",  
    thumbnail:  
      "/pictures/0000006.jpg",  
    duration: 700,  
    size: "1.1 GB",  
    resolution: "1920×1080",  
    fps: 30,  
    format: "mp4",  
    status: "completed",  
    capturePoint: "快速路入口",  
    captureTime: "07:20",  
    lng: 116.45,  
    lat: 39.92,  
    altitude: 180,  
    heading: 135,  
    gimbalPitch: -45,  
    speed: 12.8,  
    aiTags: ["高架车流监测"],  
    frameImages: [],  
  },  
];  
  
const taskStatusMap: Record<TaskStatus, { label: string; className: string }> = {  
  pending: {  
    label: "待处理",  
    className: "bg-slate-500/15 text-slate-300 border-slate-500/30",  
  },  
  processing: {  
    label: "处理中",  
    className: "bg-amber-500/15 text-amber-300 border-amber-500/30",  
  },  
  completed: {  
    label: "已完成",  
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",  
  },  
  error: {  
    label: "异常",  
    className: "bg-red-500/15 text-red-300 border-red-500/30",  
  },  
};  
  
const videoStatusMap: Record<VideoStatus, { label: string; className: string }> = {  
  raw: {  
    label: "未处理",  
    className: "bg-slate-500/15 text-slate-300 border-slate-500/30",  
  },  
  processing: {  
    label: "处理中",  
    className: "bg-amber-500/15 text-amber-300 border-amber-500/30",  
  },  
  framed: {  
    label: "已抽帧",  
    className: "bg-sky-500/15 text-sky-300 border-sky-500/30",  
  },  
  analyzed: {  
    label: "已分析",  
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",  
  },  
  completed: {  
    label: "已完成",  
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",  
  },  
};  
  
function formatDuration(totalSeconds: number) {  
  const h = Math.floor(totalSeconds / 3600);  
  const m = Math.floor((totalSeconds % 3600) / 60);  
  const s = totalSeconds % 60;  
  
  if (h > 0) {  
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(  
      s  
    ).padStart(2, "0")}`;  
  }  
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;  
}  
  
function buildMockFrames(videoId: string, count: number): FrameImage[] {  
  return Array.from({ length: count }).map((_, index) => ({  
    id: `${videoId}-frame-${index + 1}`,  
    time: (index + 1) * 5,  
    url: `/pictures/frame_${videoId}_${index + 1}.jpg`,  
    width: 800,  
    height: 450,  
  }));  
}  
  
export function VideoManagement() {  
  const [tasks] = useState<VideoTask[]>(mockTasks);  
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos);  
  
  const [selectedTaskId, setSelectedTaskId] = useState<string>(mockTasks[0]?.id || "");  
  const [keyword, setKeyword] = useState("");  
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);  
  
  const [playerOpen, setPlayerOpen] = useState(false);  
  const [infoOpen, setInfoOpen] = useState(false);  
  const [extractOpen, setExtractOpen] = useState(false);  
  const [deleteOpen, setDeleteOpen] = useState(false);  
  
  const [extractInterval, setExtractInterval] = useState("5");  
  const [extractCount, setExtractCount] = useState("6");  
  const [extracting, setExtracting] = useState(false);  
  
  const selectedTask = useMemo(  
    () => tasks.find((task) => task.id === selectedTaskId) || null,  
    [tasks, selectedTaskId]  
  );  
  
  const filteredVideos = useMemo(() => {  
    return videos.filter((video) => {  
      const matchTask = video.taskId === selectedTaskId;  
      const matchKeyword =  
        !keyword ||  
        video.name.toLowerCase().includes(keyword.toLowerCase()) ||  
        video.capturePoint.toLowerCase().includes(keyword.toLowerCase()) ||  
        video.aiTags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase()));  
      return matchTask && matchKeyword;  
    });  
  }, [videos, selectedTaskId, keyword]);  
  
  const handlePlay = (video: VideoItem) => {  
    setSelectedVideo(video);  
    setPlayerOpen(true);  
  };  
  
  const handleViewInfo = (video: VideoItem) => {  
    setSelectedVideo(video);  
    setInfoOpen(true);  
  };  
  
  const handleOpenExtract = (video: VideoItem) => {  
    setSelectedVideo(video);  
    setExtractInterval("5");  
    setExtractCount("6");  
    setExtractOpen(true);  
  };  
  
  const handleDownload = (video: VideoItem) => {  
    const link = document.createElement("a");  
    link.href = video.url;  
    link.download = video.name;  
    link.target = "_blank";  
    document.body.appendChild(link);  
    link.click();  
    document.body.removeChild(link);  
  };  
  
  const handleAskDelete = (video: VideoItem) => {  
    setSelectedVideo(video);  
    setDeleteOpen(true);  
  };  
  
  const handleConfirmDelete = () => {  
    if (!selectedVideo) return;  
    setVideos((prev) => prev.filter((item) => item.id !== selectedVideo.id));  
    setDeleteOpen(false);  
    setSelectedVideo(null);  
  };  
  
  const handleExtractFrames = async () => {  
    if (!selectedVideo) return;  
  
    setExtracting(true);  
    await new Promise((resolve) => setTimeout(resolve, 1000));  
  
    const count = Math.max(1, Number(extractCount) || 6);  
    const frames = buildMockFrames(selectedVideo.id, count);  
  
    setVideos((prev) =>  
      prev.map((item) =>  
        item.id === selectedVideo.id  
          ? {  
              ...item,  
              status: "framed",  
              frameImages: frames,  
            }  
          : item  
      )  
    );  
  
    setSelectedVideo((prev) =>  
      prev  
        ? {  
            ...prev,  
            status: "framed",  
            frameImages: frames,  
          }  
        : prev  
    );  
  
    setExtracting(false);  
  };  
  
  return (  
    <div className="h-full min-h-screen bg-[#020817] text-white">  
      <div className="flex h-full">  
        {/* 左侧任务列表 */}  
        <aside className="w-[290px] shrink-0 border-r border-cyan-900/30 bg-[#031126]">  
          <div className="px-5 py-5">  
            <div className="mb-4 flex items-center justify-between">  
              <div>  
                <h2 className="text-lg font-semibold text-white">任务列表</h2>  
                <p className="text-sm text-slate-400">共 {tasks.length} 个任务</p>  
              </div>  
            </div>  
  
            <div className="relative mb-4">  
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />  
              <Input  
                placeholder="搜索任务..."  
                className="border-cyan-900/40 bg-[#06142a] pl-9 text-slate-200 placeholder:text-slate-500"  
              />  
            </div>  
  
            <ScrollArea className="h-[calc(100vh-180px)] pr-2">  
              <div className="space-y-3">  
                {tasks.map((task) => {  
                  const active = task.id === selectedTaskId;  
                  return (  
                    <button  
                      key={task.id}  
                      onClick={() => setSelectedTaskId(task.id)}  
                      className={`w-full rounded-xl border p-4 text-left transition-all ${  
                        active  
                          ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"  
                          : "border-cyan-950/40 bg-[#051226] hover:border-cyan-800/40 hover:bg-[#08182f]"  
                      }`}  
                    >  
                      <div className="mb-2 flex items-start justify-between gap-2">  
                        <div className="line-clamp-1 text-sm font-semibold text-white">  
                          {task.name}  
                        </div>  
                        <Badge  
                          variant="outline"  
                          className={taskStatusMap[task.status].className}  
                        >  
                          {taskStatusMap[task.status].label}  
                        </Badge>  
                      </div>  
  
                      <div className="space-y-1 text-xs text-slate-400">  
                        <div>{task.uavId}</div>  
                        <div>{task.date}</div>  
                        <div>{task.videoCount} 个视频</div>  
                      </div>  
                    </button>  
                  );  
                })}  
              </div>  
            </ScrollArea>  
          </div>  
        </aside>  
  
        {/* 右侧内容区 */}  
        <main className="flex min-w-0 flex-1 flex-col">  
          {/* 顶部工具栏 */}  
          <div className="border-b border-cyan-900/30 bg-[#020b1d]/95 px-6 py-4 backdrop-blur">  
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">  
              <div>  
                <div className="mb-1 text-xl font-semibold text-white">  
                  {selectedTask?.name || "视频管理"}  
                </div>  
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">  
                  <span>{selectedTask?.uavId}</span>  
                  <span>•</span>  
                  <span>{selectedTask?.date}</span>  
                  <span>•</span>  
                  <span>共 {filteredVideos.length} 个视频</span>  
                </div>  
              </div>  
  
              <div className="flex flex-col gap-3 md:flex-row">  
                <div className="relative min-w-[280px]">  
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />  
                  <Input  
                    value={keyword}  
                    onChange={(e) => setKeyword(e.target.value)}  
                    placeholder="搜索视频名称 / 点位 / AI标签"  
                    className="border-cyan-900/40 bg-[#06142a] pl-9 text-slate-200 placeholder:text-slate-500"  
                  />  
                </div>  
  
                <Button  
                  variant="outline"  
                  className="border-cyan-900/40 bg-[#06142a] text-slate-200 hover:bg-[#0a1b33]"  
                >  
                  <Filter className="mr-2 h-4 w-4" />  
                  筛选  
                </Button>  
              </div>  
            </div>  
          </div>  
  
          {/* 视频列表 */}  
          <div className="min-h-0 flex-1 overflow-hidden px-6 py-6">  
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">  
              {filteredVideos.length === 0 ? (  
                <div className="flex h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-900/40 bg-[#051226] text-center">  
                  <Video className="mb-4 h-12 w-12 text-slate-600" />  
                  <div className="mb-2 text-lg font-medium text-slate-300">暂无视频数据</div>  
                  <div className="text-sm text-slate-500">  
                    当前任务下没有匹配的视频，请尝试切换任务或修改搜索条件  
                  </div>  
                </div>  
              ) : (  
                <div className="grid grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-2">  
                  {filteredVideos.map((video) => (  
                    <Card  
                      key={video.id}  
                      className="overflow-hidden border-cyan-900/30 bg-[#041126] text-white shadow-none"  
                    >  
                      <CardContent className="p-0">  
                        {/* 缩略图 */}  
                        <div className="relative aspect-video overflow-hidden bg-slate-900">  
                          <img  
                            src={video.thumbnail}  
                            alt={video.name}  
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"  
                          />  
  
                          <div className="absolute left-3 top-3">  
                            <Badge  
                              variant="outline"  
                              className={videoStatusMap[video.status]?.className}  
                            >  
                              {videoStatusMap[video.status]?.label || video.status}  
                            </Badge>  
                          </div>  
  
                          <button  
                            onClick={() => handlePlay(video)}  
                            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cyan-500/80 text-white shadow-lg transition hover:scale-105 hover:bg-cyan-400"  
                          >  
                            <Play className="ml-1 h-7 w-7 fill-current" />  
                          </button>  
  
                          <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">  
                            {formatDuration(video.duration)}  
                          </div>  
                        </div>  
  
                        {/* 内容 */}  
                        <div className="space-y-4 p-4">  
                          <div>  
                            <div className="mb-2 line-clamp-1 text-base font-semibold text-white">  
                              {video.name}  
                            </div>  
  
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">  
                              <span>{video.resolution}</span>  
                              <span>{video.fps}fps</span>  
                              <span>{video.size}</span>  
                            </div>  
                          </div>  
  
                          <div className="space-y-2 text-sm text-slate-400">  
                            <div className="flex items-center gap-2">  
                              <MapPin className="h-4 w-4 text-cyan-400" />  
                              <span>{video.capturePoint}</span>  
                              <span className="text-slate-600">•</span>  
                              <span>{video.captureTime}</span>  
                            </div>  
  
                            <div className="flex flex-wrap gap-2">  
                              {video.aiTags.map((tag) => (  
                                <Badge  
                                  key={tag}  
                                  variant="outline"  
                                  className="border-cyan-900/40 bg-cyan-500/10 text-cyan-300"  
                                >  
                                  {tag}  
                                </Badge>  
                              ))}  
                            </div>  
                          </div>  
  
                          <Separator className="bg-cyan-950/40" />  
  
                          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1">  
                            <Button  
                              size="sm"  
                              onClick={() => handlePlay(video)}  
                              className="h-8 px-2.5 text-xs bg-cyan-600 text-white hover:bg-cyan-500"  
                            >  
                              <Play className="mr-1 h-3.5 w-3.5" />  
                              播放  
                            </Button>  
  
                            <Button  
                              size="sm"  
                              variant="outline"  
                              onClick={() => handleViewInfo(video)}  
                              className="h-8 px-2.5 text-xs border-cyan-900/40 bg-transparent text-slate-200 hover:bg-[#0a1b33]"  
                            >  
                              <Info className="mr-1 h-3.5 w-3.5" />  
                              属性  
                            </Button>  
  
                            <Button  
                              size="sm"  
                              variant="outline"  
                              onClick={() => handleOpenExtract(video)}  
                              className="h-8 px-2.5 text-xs border-cyan-900/40 bg-transparent text-slate-200 hover:bg-[#0a1b33]"  
                            >  
                              <ImageIcon className="mr-1 h-3.5 w-3.5" />  
                              抽帧  
                            </Button>  
  
                            <Button  
                              size="sm"  
                              variant="outline"  
                              onClick={() => handleDownload(video)}  
                              className="h-8 px-2.5 text-xs border-cyan-900/40 bg-transparent text-slate-200 hover:bg-[#0a1b33]"  
                            >  
                              <Download className="mr-1 h-3.5 w-3.5" />  
                              下载  
                            </Button>  
  
                            <Button  
                              size="sm"  
                              variant="outline"  
                              onClick={() => handleAskDelete(video)}  
                              className="h-8 px-2.5 text-xs border-red-900/50 bg-transparent text-red-300 hover:bg-red-500/10 hover:text-red-200"  
                            >  
                              <Trash2 className="mr-1 h-3.5 w-3.5" />  
                              删除  
                            </Button>  
                          </div>  
                        </div>  
                      </CardContent>  
                    </Card>  
                  ))}  
                </div>  
              )}  
            </ScrollArea>  
          </div>  
        </main>  
      </div>  
  
      {/* 播放弹窗 */}  
      <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>  
        <DialogContent className="max-w-6xl border-cyan-900/30 bg-[#031126] text-white">  
          <DialogHeader>  
            <DialogTitle>{selectedVideo?.name}</DialogTitle>  
            <DialogDescription className="text-slate-400">  
              所属任务：{selectedTask?.name} ｜ 拍摄点位：{selectedVideo?.capturePoint}  
            </DialogDescription>  
          </DialogHeader>  
  
          {selectedVideo && (  
            <div className="space-y-4">  
              <div className="overflow-hidden rounded-xl border border-cyan-900/30 bg-black">  
                <video  
                  key={selectedVideo.url}  
                  src={selectedVideo.url}  
                  controls  
                  className="max-h-[70vh] w-full bg-black"  
                />  
              </div>  
  
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-300 md:grid-cols-4">  
                <div className="rounded-lg border border-cyan-900/30 bg-[#041126] p-3">  
                  <div className="mb-1 text-slate-500">分辨率</div>  
                  <div>{selectedVideo.resolution}</div>  
                </div>  
                <div className="rounded-lg border border-cyan-900/30 bg-[#041126] p-3">  
                  <div className="mb-1 text-slate-500">帧率</div>  
                  <div>{selectedVideo.fps} fps</div>  
                </div>  
                <div className="rounded-lg border border-cyan-900/30 bg-[#041126] p-3">  
                  <div className="mb-1 text-slate-500">文件大小</div>  
                  <div>{selectedVideo.size}</div>  
                </div>  
                <div className="rounded-lg border border-cyan-900/30 bg-[#041126] p-3">  
                  <div className="mb-1 text-slate-500">视频时长</div>  
                  <div>{formatDuration(selectedVideo.duration)}</div>  
                </div>  
              </div>  
            </div>  
          )}  
        </DialogContent>  
      </Dialog>  
  
      {/* 属性抽屉 */}  
      <Sheet open={infoOpen} onOpenChange={setInfoOpen}>  
        <SheetContent  
          side="right"  
          className="w-[460px] border-cyan-900/30 bg-[#031126] text-white sm:max-w-[460px]"  
        >  
          <SheetHeader>  
            <SheetTitle className="text-white">视频属性</SheetTitle>  
            <SheetDescription className="text-slate-400">  
              查看视频基础信息、空间属性与业务属性  
            </SheetDescription>  
          </SheetHeader>  
  
          {selectedVideo && (  
            <div className="mt-6 space-y-6">  
              <div className="overflow-hidden rounded-xl border border-cyan-900/30">  
                <img  
                  src={selectedVideo.thumbnail}  
                  alt={selectedVideo.name}  
                  className="aspect-video w-full object-cover"  
                />  
              </div>  
  
              <div className="space-y-5 text-sm">  
                <section>  
                  <div className="mb-3 text-base font-semibold text-white">基础属性</div>  
                  <div className="grid grid-cols-2 gap-3">  
                    <InfoItem label="视频名称" value={selectedVideo.name} />  
                    <InfoItem label="所属任务" value={selectedTask?.name || "-"} />  
                    <InfoItem label="视频格式" value={selectedVideo.format} />  
                    <InfoItem label="文件大小" value={selectedVideo.size} />  
                    <InfoItem label="时长" value={formatDuration(selectedVideo.duration)} />  
                    <InfoItem label="分辨率" value={selectedVideo.resolution} />  
                    <InfoItem label="帧率" value={`${selectedVideo.fps} fps`} />  
                    <InfoItem label="拍摄时间" value={selectedVideo.captureTime} />  
                  </div>  
                </section>  
  
                <Separator className="bg-cyan-950/40" />  
  
                <section>  
                  <div className="mb-3 text-base font-semibold text-white">空间属性</div>  
                  <div className="grid grid-cols-2 gap-3">  
                    <InfoItem label="拍摄点位" value={selectedVideo.capturePoint} />  
                    <InfoItem label="经度" value={String(selectedVideo.lng)} />  
                    <InfoItem label="纬度" value={String(selectedVideo.lat)} />  
                    <InfoItem label="航高" value={`${selectedVideo.altitude} m`} />  
                    <InfoItem label="航向" value={`${selectedVideo.heading}°`} />  
                    <InfoItem label="云台俯仰角" value={`${selectedVideo.gimbalPitch}°`} />  
                    <InfoItem label="飞行速度" value={`${selectedVideo.speed} m/s`} />  
                  </div>  
                </section>  
  
                <Separator className="bg-cyan-950/40" />  
  
                <section>  
                  <div className="mb-3 text-base font-semibold text-white">业务属性</div>  
                  <div className="space-y-3">  
                    <InfoItem  
                      label="视频状态"  
                      value={videoStatusMap[selectedVideo.status]?.label || selectedVideo.status}  
                    />  
                    <InfoItem  
                      label="抽帧数量"  
                      value={`${selectedVideo.frameImages?.length || 0} 张`}  
                    />  
                    <div className="rounded-lg border border-cyan-900/30 bg-[#041126] p-3">  
                      <div className="mb-2 text-slate-400">AI标签</div>  
                      <div className="flex flex-wrap gap-2">  
                        {selectedVideo.aiTags.length ? (  
                          selectedVideo.aiTags.map((tag) => (  
                            <Badge  
                              key={tag}  
                              variant="outline"  
                              className="border-cyan-900/40 bg-cyan-500/10 text-cyan-300"  
                            >  
                              {tag}  
                            </Badge>  
                          ))  
                        ) : (  
                          <span className="text-slate-500">暂无标签</span>  
                        )}  
                      </div>  
                    </div>  
                  </div>  
                </section>  
              </div>  
            </div>  
          )}  
        </SheetContent>  
      </Sheet>  
  
      {/* 抽帧弹窗 */}  
      <Dialog open={extractOpen} onOpenChange={setExtractOpen}>  
        <DialogContent className="!w-[92vw] !max-w-[1400px] !h-[88vh] overflow-hidden border-cyan-900/30 bg-[#031126] text-white">  
          <DialogHeader>  
            <DialogTitle>视频抽帧</DialogTitle>  
            <DialogDescription className="text-slate-400">  
              设置抽帧参数并查看抽帧结果  
            </DialogDescription>  
          </DialogHeader>  
  
          {selectedVideo && (  
            <div className="grid h-full gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">  
              {/* 左侧设置 */}  
              <div className="min-w-0 space-y-4 rounded-xl border border-cyan-900/30 bg-[#041126] p-4">  
                <div>  
                  <div className="mb-2 text-sm text-slate-400">视频名称</div>  
                  <div className="line-clamp-2 text-sm font-medium text-white">  
                    {selectedVideo.name}  
                  </div>  
                </div>  
  
                <Separator className="bg-cyan-950/40" />  
  
                <div>  
                  <label className="mb-2 block text-sm text-slate-300">抽帧间隔（秒）</label>  
                  <Input  
                    value={extractInterval}  
                    onChange={(e) => setExtractInterval(e.target.value)}  
                    placeholder="例如 5"  
                    className="border-cyan-900/40 bg-[#06142a] text-slate-200"  
                  />  
                </div>  
  
                <div>  
                  <label className="mb-2 block text-sm text-slate-300">抽帧数量</label>  
                  <Input  
                    value={extractCount}  
                    onChange={(e) => setExtractCount(e.target.value)}  
                    placeholder="例如 6"  
                    className="border-cyan-900/40 bg-[#06142a] text-slate-200"  
                  />  
                </div>  
  
                <div className="grid grid-cols-2 gap-3 pt-2">  
                  <Button  
                    onClick={handleExtractFrames}  
                    disabled={extracting}  
                    className="bg-cyan-600 text-white hover:bg-cyan-500"  
                  >  
                    {extracting ? "抽帧中..." : "开始抽帧"}  
                  </Button>  
                  <Button  
                    variant="outline"  
                    onClick={() => setExtractOpen(false)}  
                    className="border-cyan-900/40 bg-transparent text-slate-200 hover:bg-[#0a1b33]"  
                  >  
                    关闭  
                  </Button>  
                </div>  
  
                <div className="rounded-lg border border-cyan-900/30 bg-[#06142a] p-3 text-xs text-slate-400">  
                  当前为前端页面骨架版：这里使用 mock 图片模拟抽帧结果。后续可替换为  
                  canvas 真实抽帧。  
                </div>  
              </div>  
  
              {/* 右侧结果 */}  
              <div className="min-w-0 rounded-xl border border-cyan-900/30 bg-[#041126] p-4">  
                <div className="mb-4 flex items-center justify-between">  
                  <div>  
                    <div className="text-base font-semibold text-white">抽帧结果</div>  
                    <div className="text-sm text-slate-400">  
                      共 {selectedVideo.frameImages?.length || 0} 张图片  
                    </div>  
                  </div>  
                </div>  
  
                {selectedVideo.frameImages?.length ? (  
                  <ScrollArea className="h-[58vh] pr-3">  
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">  
                      {selectedVideo.frameImages.map((frame) => (  
                        <div  
                          key={frame.id}  
                          className="overflow-hidden rounded-lg border border-cyan-900/30 bg-[#06142a]"  
                        >  
                          <img  
                            src={frame.url}  
                            alt={`frame-${frame.time}`}  
                            className="aspect-video w-full object-cover"  
                          />  
                          <div className="space-y-1 p-3 text-sm text-slate-300">  
                            <div>时间点：{formatDuration(frame.time)}</div>  
                            <div>  
                              尺寸：{frame.width} × {frame.height}  
                            </div>  
                            <div className="pt-2">  
                              <Button  
                                size="sm"  
                                variant="outline"  
                                className="border-cyan-900/40 bg-transparent text-slate-200 hover:bg-[#0a1b33]"  
                                onClick={() => {  
                                  const link = document.createElement("a");  
                                  link.href = frame.url;  
                                  link.download = `${selectedVideo.name}_${frame.time}.jpg`;  
                                  link.click();  
                                }}  
                              >  
                                <Download className="mr-1 h-4 w-4" />  
                                下载图片  
                              </Button>  
                            </div>  
                          </div>  
                        </div>  
                      ))}  
                    </div>  
                  </ScrollArea>  
                ) : (  
                  <div className="flex h-[58vh] flex-col items-center justify-center rounded-xl border border-dashed border-cyan-900/40 bg-[#06142a] text-center">  
                    <ImageIcon className="mb-4 h-10 w-10 text-slate-600" />  
                    <div className="mb-2 text-slate-300">暂无抽帧结果</div>  
                    <div className="text-sm text-slate-500">  
                      请先设置参数并点击“开始抽帧”  
                    </div>  
                  </div>  
                )}  
              </div>  
            </div>  
          )}  
        </DialogContent>  
      </Dialog>  
  
      {/* 删除确认 */}  
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>  
        <AlertDialogContent className="border-cyan-900/30 bg-[#031126] text-white">  
          <AlertDialogHeader>  
            <AlertDialogTitle>确认删除该视频？</AlertDialogTitle>  
            <AlertDialogDescription className="text-slate-400">  
              删除后将无法恢复。当前视频：  
              <span className="ml-1 font-medium text-white">{selectedVideo?.name}</span>  
            </AlertDialogDescription>  
          </AlertDialogHeader>  
          <AlertDialogFooter>  
            <AlertDialogCancel className="border-cyan-900/40 bg-transparent text-slate-200 hover:bg-[#0a1b33]">  
              取消  
            </AlertDialogCancel>  
            <AlertDialogAction  
              onClick={handleConfirmDelete}  
              className="bg-red-600 text-white hover:bg-red-500"  
            >  
              确认删除  
            </AlertDialogAction>  
          </AlertDialogFooter>  
        </AlertDialogContent>  
      </AlertDialog>  
    </div>  
  );  
}  
  
function InfoItem({ label, value }: { label: string; value: string }) {  
  return (  
    <div className="rounded-lg border border-cyan-900/30 bg-[#041126] p-3">  
      <div className="mb-1 text-slate-400">{label}</div>  
      <div className="break-all text-white">{value || "-"}</div>  
    </div>  
  );  
}  
