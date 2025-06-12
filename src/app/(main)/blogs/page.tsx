import { supabase } from "@/Lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id, title, image_url");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        مطالب بلاگ
      </h1>

      {blogs?.length === 0 ? (
        <p className="text-center text-gray-500">هنوز مطلبی منتشر نشده است.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs?.map((blog) => (
            <li key={blog.id}>
              <div className="overflow-hidden rounded-2xl shadow hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
                {blog.image_url && (
                  <div className="w-full aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {blog.title}
                  </h2>

                  <div className="mt-auto text-left">
                    <Link href={`/blogs/${blog.id}`} className="EditBTN w-fit">
                      ادامه مطلب
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
