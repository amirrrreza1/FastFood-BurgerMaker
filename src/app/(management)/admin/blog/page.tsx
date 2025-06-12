"use client";

import { supabase } from "@/Lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این عملیات قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "لغو",
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (!error) {
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
        Swal.fire("حذف شد!", "مطلب با موفقیت حذف شد.", "success");
      } else {
        Swal.fire("خطا!", "مشکلی در حذف مطلب پیش آمد.", "error");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-1 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-3">
        <h1 className="text-3xl font-bold text-gray-800 text-center">مدیریت مطالب بلاگ</h1>
        <Link
          href="/admin/blog/new"
          className="EditBTN justify-center"
        >
          افزودن مطلب جدید
        </Link>
      </div>

      {blogs?.length === 0 ? (
        <p className="text-center text-gray-500">
          هیچ مطلبی هنوز ثبت نشده است.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl shadow mx-auto">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-center">عنوان</th>
                <th className="px-4 py-3 text-center">تاریخ</th>
                <th className="px-4 py-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">{blog.title}</td>
                  <td className="px-4 py-3 text-center">
                    {new Date(blog.created_at).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3 flex justify-center items-center gap-2 text-center">
                    <Link
                      href={`/admin/blog/edit/${blog.id}`}
                      className="EditBTN justify-center"
                    >
                      ویرایش
                    </Link>
                    <button
                      className="DeleteBTN"
                      onClick={() => handleDelete(blog.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
