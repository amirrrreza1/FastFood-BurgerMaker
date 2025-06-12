import { supabase } from "@/Lib/supabase";

export default async function BlogDetailPage({ params }: any) {
  const { id } = await params;

  const blogId = Number(id);
  if (isNaN(blogId)) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-md text-center">
        شناسه نامعتبر است.
      </div>
    );
  }

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", blogId)
    .single();

  const iframeContent = `
    <html dir="rtl">
      <head>
        <style>
          body {
            font-family: Shabnam;
          }
        </style>
      </head>
      <body>
        ${blog.content || "<p>محتوایی برای نمایش وجود ندارد.</p>"}
      </body>
    </html>
  `;

  if (error) {
    console.error(error);
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-md text-center">
        خطا در دریافت مطلب.
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-gray-700 bg-gray-100 p-4 rounded-md text-center">
        بلاگ مورد نظر پیدا نشد.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          {blog.title}
        </h1>
        <p className="text-sm text-gray-500">
          {new Date(blog.created_at || blog.updated_at).toLocaleDateString(
            "fa-IR",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </p>
      </div>

      {blog.image_url ? (
        <div className="w-full overflow-hidden rounded-lg shadow-md">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
          تصویری موجود نیست
        </div>
      )}
      <iframe
        srcDoc={iframeContent}
        className="w-full h-[600px] border rounded-md p-2"
        dir="rtl"
        sandbox=""
      ></iframe>
    </div>
  );
}
