import AdminMenu from "@/Components/AdminMenu";
import AdminManualOrder from "@/Components/AdminOrderForm";
import { cookies } from "next/headers";

export default async function ManualOrderPage() {
  const cookie: any = await cookies();
  const token = cookie.get("token");
  const adminId = token.uid

  const res = await fetch("http://localhost:3000/api/menu");
  const menuItems = await res.json();


  return (
    <div className="p-6 space-y-4">
      <AdminMenu menuItems={menuItems} />
      <AdminManualOrder adminId={adminId} />
    </div>
  );
}
