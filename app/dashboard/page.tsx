import type { Metadata } from "next";
import Header from "@/component/dashboard/SignInHeader";

export const metadata: Metadata = {
  title: "Dashboard | げーむらんく",
  description: "Develop by ichi10.com",
};

export default function DashboardPage() {
  return (
    <div>
      <Header />
    </div>
  );
}
