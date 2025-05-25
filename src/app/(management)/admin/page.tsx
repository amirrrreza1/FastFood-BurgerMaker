import { redirect } from "next/navigation";

// app/admin/page.tsx
export default function AdminDashboardPage() {
  redirect("/admin/menu");
}
