"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  lastName: string | null;
  phoneNum: number | null;
  subscription_number: number | null;
  created_at: string;
  is_active?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        const json = await res.json();

        if (!res.ok) {
          toast.error(json.error || "خطا در دریافت کاربران");
        } else {
          setUsers(json.users);
        }
      } catch (err) {
        toast.error("مشکلی در ارتباط با سرور پیش آمده است");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleActive = async (
    userId: string,
    currentStatus: boolean | undefined
  ) => {
    const newStatus = !currentStatus;
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: newStatus }),
    });

    if (!res.ok) {
      toast.error("خطا در تغییر وضعیت کاربر");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: newStatus } : u))
    );
    toast.success(`وضعیت کاربر با موفقیت ${newStatus ? "فعال" : "غیرفعال"} شد`);
  };

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phoneNum?.toString().includes(query) ||
      user.subscription_number?.toString().includes(query)
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">مدیریت کاربران</h2>

      <input
        type="text"
        placeholder="جستجو بر اساس نام، ایمیل، شماره و..."
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">نام</th>
                <th className="p-2 border">نام خانوادگی</th>
                <th className="p-2 border">ایمیل</th>
                <th className="p-2 border">شماره همراه</th>
                <th className="p-2 border">شماره اشتراک</th>
                <th className="p-2 border">تاریخ ساخت</th>
                <th className="p-2 border">فعال؟</th>
                <th className="p-2 border">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.lastName}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.phoneNum}</td>
                  <td className="p-2 border">{user.subscription_number}</td>
                  <td className="p-2 border">
                    {new Date(user.created_at).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="p-2 border text-center">
                    {user.is_active ? "✅" : "❌"}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      className={`px-3 py-1 rounded ${
                        user.is_active ? "bg-red-500" : "bg-green-500"
                      } text-white`}
                      onClick={() =>
                        handleToggleActive(user.id, user.is_active)
                      }
                    >
                      {user.is_active ? "غیرفعال کردن" : "فعال‌سازی"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="text-center mt-4">کاربری یافت نشد.</p>
          )}
        </div>
      )}
    </div>
  );
}
