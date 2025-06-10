"use client";

import LoadingSpinner from "@/Components/Loading";
import { UserProfile } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";



export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleChangeRole = async (userId: string, newRole: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (!res.ok) {
      toast.error("خطا در تغییر نقش کاربر");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    toast.success(
      `کاربر با موفقیت به ${
        newRole === "admin" ? "ادمین" : "کاربر عادی"
      } تغییر یافت`
    );
  };

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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">مدیریت کاربران</h2>

      <input
        type="text"
        placeholder="جستجو بر اساس نام، ایمیل، شماره و..."
        className="w-full p-2 border rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <LoadingSpinner text="در حال بارگذاری کاربران..." />
      ) : filteredUsers.length === 0 ? (
        <p className="text-center">کاربری یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* نمایش جدول در سایزهای بزرگ */}
          <table className="hidden lg:table w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">نام</th>
                <th className="p-2 border">نام خانوادگی</th>
                <th className="p-2 border">ایمیل</th>
                <th className="p-2 border">شماره همراه</th>
                <th className="p-2 border">شماره اشتراک</th>
                <th className="p-2 border">تاریخ ساخت</th>
                <th className="p-2 border">فعال؟</th>
                <th className="p-2 border">نقش</th>
                <th className="p-2 border">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="p-2 border text-center">{user.name || "-"}</td>
                  <td className="p-2 border text-center">
                    {user.lastName || "-"}
                  </td>
                  <td className="p-2 border text-center">
                    {user.email || "-"}
                  </td>
                  <td className="p-2 border text-center">
                    {user.phoneNum || "-"}
                  </td>
                  <td className="p-2 border text-center">
                    {user.subscription_number || "-"}
                  </td>
                  <td className="p-2 border text-center">
                    {new Date(user.created_at).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="p-2 border text-center">
                    {user.is_active ? "✅" : "❌"}
                  </td>
                  <td className="p-2 border text-center">
                    {user.role === "admin" ? "ادمین" : "کاربر عادی"}
                  </td>
                  <td className="p-2 border text-center flex flex-col gap-2 ">
                    <button
                      className={` ${user.is_active ? "DeleteBTN" : "EditBTN"}`}
                      onClick={() =>
                        handleToggleActive(user.id, user.is_active)
                      }
                    >
                      {user.is_active ? "غیرفعال کردن" : "فعال‌سازی"}
                    </button>
                    {user.role === "admin" ? (
                      <button
                        className="CancelBTN flex justify-center mt-2 w-full"
                        onClick={() => handleChangeRole(user.id, "user")}
                      >
                        تغییر به کاربر عادی
                      </button>
                    ) : (
                      <button
                        className="EditBTN flex justify-center mt-2 w-full"
                        onClick={() => handleChangeRole(user.id, "admin")}
                      >
                        ارتقا به ادمین
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* نمایش کارت‌ها در موبایل */}
          <div className="lg:hidden flex flex-col gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
              >
                <div>
                  <strong>نام:</strong> {user.name || "-"}
                </div>
                <div>
                  <strong>نام خانوادگی:</strong> {user.lastName || "-"}
                </div>
                <div>
                  <strong>ایمیل:</strong> {user.email || "-"}
                </div>
                <div>
                  <strong>شماره همراه:</strong> {user.phoneNum || "-"}
                </div>
                <div>
                  <strong>شماره اشتراک:</strong>{" "}
                  {user.subscription_number || "-"}
                </div>
                <div>
                  <strong>تاریخ ساخت:</strong>{" "}
                  {new Date(user.created_at).toLocaleDateString("fa-IR")}
                </div>
                <div>
                  <strong>فعال:</strong>{" "}
                  {user.is_active ? (
                    <span className="text-green-600">✅</span>
                  ) : (
                    <span className="text-red-600">❌</span>
                  )}
                </div>
                <div>
                  <strong>ادمین:</strong>{" "}
                  {user.role === "admin" ? (
                    <span className="text-green-600">✅</span>
                  ) : (
                    <span className="text-red-600">❌</span>
                  )}
                </div>
                <div>
                  <button
                    className={`w-full ${
                      user.is_active ? "DeleteBTN" : "ConfirmBTN"
                    } text-white`}
                    onClick={() => handleToggleActive(user.id, user.is_active)}
                  >
                    {user.is_active ? "غیرفعال کردن" : "فعال‌سازی"}
                  </button>
                  {user.role === "admin" ? (
                    <button
                      className="CancelBTN w-full flex justify-center mt-2"
                      onClick={() => handleChangeRole(user.id, "user")}
                    >
                      تغییر به کاربر عادی
                    </button>
                  ) : (
                    <button
                      className="EditBTN w-full flex justify-center mt-2"
                      onClick={() => handleChangeRole(user.id, "admin")}
                    >
                      ارتقا به ادمین
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
