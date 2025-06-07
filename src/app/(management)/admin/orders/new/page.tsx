// app/admin/manual-order/page.tsx

import AdminMenu from "@/Components/AdminMenu";
import AdminManualOrder from "@/Components/AdminOrderForm";
import { cookies } from "next/headers";

export default async function ManualOrderPage() {
  const cookie: any = await cookies();
  const token = cookie.get("token");
  console.log(token);
  const adminId = token; // جایگزین با مقدار واقعی

  // گرفتن منو از API
  const res = await fetch("http://localhost:3000/api/menu");

  const menuItems = await res.json();

  console.log(menuItems);

  return (
    <div className="p-6">
      <AdminMenu menuItems={menuItems} />
      <AdminManualOrder adminId={adminId} />
    </div>
  );
}
