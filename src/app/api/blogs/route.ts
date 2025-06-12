import { NextResponse } from "next/server";
import { supabase } from "@/Lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { error: "عنوان و محتوا الزامی هستند." },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    if (imageFile && imageFile.name) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${fileName}`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, buffer, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("خطا در آپلود عکس:", uploadError);
        return NextResponse.json(
          { error: "خطا در آپلود عکس" },
          { status: 500 }
        );
      }
    }

    // درج اطلاعات بلاگ در جدول blogs
    const { data, error: insertError } = await supabase
      .from("blogs")
      .insert({
        title,
        content,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (insertError) {
      console.error("خطا در ثبت بلاگ:", insertError);
      return NextResponse.json({ error: "خطا در ثبت بلاگ" }, { status: 500 });
    }

    return NextResponse.json({
      message: "بلاگ با موفقیت ذخیره شد",
      blog: data,
    });
  } catch (error) {
    console.error("خطای کلی:", error);
    return NextResponse.json({ error: "خطا در سرور" }, { status: 500 });
  }
}
