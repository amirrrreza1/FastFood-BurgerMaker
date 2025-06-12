"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Editor as TinyMCEEditor } from "tinymce";
import { supabase } from "@/Lib/supabase";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

export default function EditBlogPage() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const blogId = id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogId) return;

    let cancelled = false;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${blogId}`);
        if (!res.ok) throw new Error("خطا در بارگذاری مطلب");
        const data = await res.json();

        if (!cancelled) {
          setTitle(data.title);
          setContent(data.content);
          setImageUrl(data.image_url || null);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    };

    fetchBlog();

    return () => {
      cancelled = true;
    };
  }, [blogId]);
  
  async function uploadImage(file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      throw new Error("خطا در آپلود تصویر");
    }

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${fileName}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let newImageUrl = imageUrl;

      if (imageFile) {
        newImageUrl = await uploadImage(imageFile);
      }

      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: editorRef.current?.getContent() || content ,
          image_url: newImageUrl,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "خطا در بروزرسانی مطلب");
      }

      router.push("/admin/blog");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto p-6 space-y-6"
    >
      <h1 className="text-3xl font-extrabold text-center mb-6">ویرایش بلاگ</h1>

      {error && (
        <div className="p-3 text-red-700 bg-red-100 rounded text-center font-medium">
          {error}
        </div>
      )}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="عنوان بلاگ"
        className="Input"
        required
      />

      <div className="w-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="تصویر بلاگ"
            className="w-full max-w-md h-52 object-cover rounded-2xl shadow-md mx-auto mb-4"
          />
        ) : (
          <p className="text-gray-500 mb-4 text-center">
            تصویری برای این بلاگ وجود ندارد.
          </p>
        )}

        <label
          htmlFor="image-upload"
          className="EditBTN hover:scale-100 justify-center"
        >
          <img src="/images/SVG/upload.svg" alt="upload" width={20} />
          {imageFile ? imageFile.name : "تغییر تصویر"}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      <Editor
        apiKey="xhz3fm1wrv4r3f1trc0ebey5g3ol3cvoy11r6ikit4hqdak1"
        onInit={(_, editor) => (editorRef.current = editor)}
        initialValue={content} // ✅ فقط یک بار مقدار اولیه را ست می‌کند
        init={{
          height: 380,
          directionality: "rtl",
          language: "fa",
          menubar: "file edit view insert format tools table help",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
            "emoticons",
            "codesample",
            "autosave",
          ],
          toolbar:
            "undo redo | blocks | fontfamily fontsize | bold italic underline strikethrough | " +
            "alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | " +
            "forecolor backcolor | link image media table emoticons | removeformat | fullscreen preview code",
          autosave_ask_before_unload: true,
          autosave_interval: "30s",
          autosave_restore_when_empty: true,
          image_caption: true,
          image_title: true,
          file_picker_types: "image media",
          content_style: `
            body {
              font-family: 'Shabnam', sans-serif;
              font-size: 16px;
              line-height: 1.8;
              direction: rtl;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          `,
          branding: false,
          fontsize_formats: "12px 14px 16px 18px 20px 24px 28px 32px 36px",
        }}
      />

      <button type="submit" disabled={loading} className="ConfirmBTN">
        {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
    </form>
  );
}
