"use client";

import { FAQ } from "@/types";
import { useState } from "react";

type Props = {
  faq: Partial<FAQ>;
  loading: boolean;
  onClose: () => void;
  onSave: (updatedFaq: Partial<FAQ>) => void;
};

export default function FAQEditModal({ faq, loading, onClose, onSave }: Props) {
  const [edited, setEdited] = useState<Partial<FAQ>>(faq);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {faq?.id ? "ویرایش سوال" : "افزودن سوال جدید"}
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        <input
          className="w-full border px-3 py-2 rounded text-sm"
          value={edited.question || ""}
          onChange={(e) =>
            setEdited((p) => ({ ...p, question: e.target.value }))
          }
          placeholder="سوال"
          disabled={loading}
        />

        <textarea
          className="w-full border px-3 py-2 rounded text-sm"
          value={edited.answer || ""}
          onChange={(e) => setEdited((p) => ({ ...p, answer: e.target.value }))}
          placeholder="پاسخ"
          disabled={loading}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => onSave(edited)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {loading ? "در حال ذخیره..." : faq.id ? "ذخیره" : "افزودن"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded disabled:opacity-50"
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}
