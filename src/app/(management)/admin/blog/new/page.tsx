"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Editor as TinyMCEEditor } from "tinymce";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

export default function NewBlogPage() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const content = editorRef.current?.getContent() || "";
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch("/api/blogs", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/admin/blog");
    } else {
      alert("خطا در ذخیره بلاگ");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto p-6 space-y-6"
    >
      <h1 className="text-3xl font-extrabold text-center mb-6">
        ساخت بلاگ جدید
      </h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="عنوان بلاگ"
        className="Input"
        required
      />

      <div className="w-full">
        <label
          htmlFor="image-upload"
          className="EditBTN hover:scale-100 justify-center"
        >
          <img src="/images/SVG/upload.svg" alt="upload" width={20} />
          {image ? image.name : "آپلود تصویر"}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      <div className="w-full">
        <Editor
          apiKey="xhz3fm1wrv4r3f1trc0ebey5g3ol3cvoy11r6ikit4hqdak1"
          onInit={(_, editor) => {
            editorRef.current = editor;
          }}
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
              "undo redo | blocks | fontfamily fontsize | bold italic underline strikethrough | \
alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | \
forecolor backcolor | link image media table emoticons | removeformat | fullscreen preview code",
            autosave_ask_before_unload: true,
            autosave_interval: "30s",
            autosave_prefix: "tinymce-autosave-{path}{query}-{id}-",
            autosave_restore_when_empty: true,
            image_caption: true,
            image_title: true,
            image_class_list: [
              { title: "Responsive", value: "img-responsive" },
              { title: "Rounded", value: "img-rounded" },
            ],
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
      </div>

      <button type="submit" disabled={loading} className="ConfirmBTN">
        {loading ? "در حال ارسال..." : "ذخیره بلاگ"}
      </button>
    </form>
  );
}
