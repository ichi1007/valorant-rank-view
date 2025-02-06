import type { Metadata } from "next";
import { SidebarComponent } from "./Sidebar";

export const metadata: Metadata = {
  title: "Dashboard | げーむらんく",
  description: "Develop by ichi10.com",
};

export default function DashboardPage() {
  return (
    <div>
      <SidebarComponent />
    </div>
  );
}
