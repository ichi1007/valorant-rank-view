export const dynamic = "force-static";
import { redirect } from "next/navigation";

export default function Page() {
  // クエリパラメータ形式にリダイレクト
  redirect("/docs?sec=startguide");
}
