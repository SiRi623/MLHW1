import { createBrowserRouter, redirect } from "react-router";
import { Root } from "./Root";
import { Login } from "./pages/Login";
import { ResourceMap } from "./pages/ResourceMap";
import { VideoManagement } from "./pages/VideoManagement";
import { OperationMonitoring } from "./pages/OperationMonitoring";
import { PlannedOperations } from "./pages/PlannedOperations";
import { RoutePlanning } from "./pages/RoutePlanning";
import { AIModelLibrary } from "./pages/AIModelLibrary";
import { SystemSettings } from "./pages/SystemSettings";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        loader: () => redirect("/map"),
      },
      { path: "map", Component: ResourceMap },
      { path: "videos", Component: VideoManagement },
      { path: "monitoring", Component: OperationMonitoring },
      { path: "planned-ops", Component: PlannedOperations },
      { path: "route-planning", Component: RoutePlanning },
      { path: "ai-models", Component: AIModelLibrary },
      { path: "settings", Component: SystemSettings },
    ],
  },
]);
