import AdminSidebar from "@/Components/AdminSidebar";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6">
        {children}
        <ToastContainer position="top-center" />
      </main>
    </div>
  );
}
