import { Outlet, Navigate } from "react-router";
import { Layout } from "./components/Layout";

export function Root() {
  const isLoggedIn = sessionStorage.getItem("drone_user");
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
