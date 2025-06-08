import React from "react";

export function InfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          padding: 24,
          maxWidth: 400,
          width: "90%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>
          توضیحات ساخت همبرگر
        </h2>
        <p style={{ marginBottom: 20, lineHeight: 1.5, color: "#333" }}>
          - فقط تا ۳ لایه گوشت اضافه کنید.
          <br />
          - فقط ۲ نوع سس مجاز است.
          <br />
          - حداکثر ۳ مورد از پنیر، گوجه، کاهو، خیارشور، پیاز قابل انتخاب است.
          <br />
          - امکان افزودن یک نان اضافه وجود دارد.
          <br />- برای ذخیره همبرگر باید حداقل یک لایه گوشت داشته باشید.
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          فهمیدم
        </button>
      </div>
    </div>
  );
}
