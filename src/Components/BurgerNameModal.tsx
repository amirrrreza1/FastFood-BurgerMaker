import React from "react";

export function NameModal({
  open,
  onClose,
  burgerName,
  setBurgerName,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  burgerName: string;
  setBurgerName: React.Dispatch<React.SetStateAction<string>>;
  onSave: () => void;
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
          نام همبرگر
        </h2>
        <input
          type="text"
          placeholder="نام همبرگر را وارد کنید"
          value={burgerName}
          onChange={(e) => setBurgerName(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 20,
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#ccc",
              color: "black",
              border: "none",
              borderRadius: 4,
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "48%",
            }}
          >
            انصراف
          </button>
          <button
            onClick={onSave}
            style={{
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 4,
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "48%",
            }}
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
}
