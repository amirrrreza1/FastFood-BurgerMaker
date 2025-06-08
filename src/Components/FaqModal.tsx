"use client";

import React from "react";

type Props = {
  isOpen: boolean;
  mode: "add" | "edit";
  question: string;
  answer: string;
  loading: boolean;
  onClose: () => void;
  onChangeQuestion: (value: string) => void;
  onChangeAnswer: (value: string) => void;
  onSave: () => void;
};

export default function FaqModal({
  isOpen,
  mode,
  question,
  answer,
  loading,
  onClose,
  onChangeQuestion,
  onChangeAnswer,
  onSave,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-modal-title"
      onClick={() => onClose()}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative mx-auto
                      max-h-[90vh] overflow-y-auto
                      sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="faq-modal-title"
          className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 text-center"
        >
          {mode === "add" ? "افزودن سوال جدید" : "ویرایش سوال"}
        </h3>

        <input
          type="text"
          placeholder="سوال"
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     rounded-md px-4 py-3 mb-5 text-base
                     transition-colors duration-200
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={question}
          onChange={(e) => onChangeQuestion(e.target.value)}
          disabled={loading}
          autoFocus
          aria-label="سوال"
        />
        <textarea
          placeholder="پاسخ"
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     rounded-md px-4 py-3 mb-6 text-base resize-y min-h-[120px]
                     transition-colors duration-200
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={answer}
          onChange={(e) => onChangeAnswer(e.target.value)}
          disabled={loading}
          rows={5}
          aria-label="پاسخ"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            انصراف
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className={`px-5 py-2 rounded-md text-white transition-colors duration-150
              ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
              }`}
          >
            {loading ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
}
