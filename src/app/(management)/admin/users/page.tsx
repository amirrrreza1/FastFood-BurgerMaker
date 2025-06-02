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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">مدیریت کاربران</h2>

      {users.map((user) => (
        <h2 key={user.id}>{user.subscription_number}</h2>
      ))}
    </div>
  );
}
