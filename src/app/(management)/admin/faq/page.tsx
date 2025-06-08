"use client";

import FaqModal from "@/Components/FaqModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type FAQ = {
  id: number;
  question: string;
  answer: string;
  saved?: boolean;
};

type ModalState = {
  isOpen: boolean;
  mode: "add" | "edit";
  faqToEdit?: FAQ | null;
};

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [changedFaqIds, setChangedFaqIds] = useState<Set<number>>(new Set());

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    mode: "add",
    faqToEdit: null,
  });
  const [form, setForm] = useState({ question: "", answer: "", saved: false });
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/faq")
      .then((res) => res.json())
      .then((data) => {
        const filtered = Array.isArray(data)
          ? data.filter((faq) => faq !== null && faq.id !== undefined)
          : [];
        setFaqs(filtered);
      })
      .catch(() => toast.error("خطا در دریافت سوالات"));
  }, []);

  const openAddModal = () => {
    setForm({ question: "", answer: "", saved: false });
    setModal({ isOpen: true, mode: "add" });
  };

  const openEditModal = (faq: FAQ) => {
    setForm({ question: faq.question, answer: faq.answer, saved: false });
    setModal({ isOpen: true, mode: "edit", faqToEdit: faq });
  };

  const closeModal = () => {
    setModal({ isOpen: false, mode: "add", faqToEdit: null });
    setForm({ question: "", answer: "", saved: false });
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("لطفا سوال و پاسخ را وارد کنید");
      return;
    }
    setLoadingSave(true);

    try {
      if (modal.mode === "add") {
        // افزودن سوال جدید
        const res = await fetch("/api/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();

        if (res.ok && data && Array.isArray(data) && data.length > 0) {
          const newFaq = { ...data[0], saved: false }; // new FAQ with saved false
          setFaqs((prev) => [...prev, newFaq]);
          toast.success("سوال جدید افزوده شد");
          closeModal();
        } else {
          toast.error(data?.error || "خطا در افزودن سوال جدید", {
            autoClose: 5000,
          });
        }
      } else if (modal.mode === "edit" && modal.faqToEdit) {
        // ویرایش سوال موجود
        const res = await fetch(`/api/faq/${modal.faqToEdit.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          setFaqs((prev) =>
            prev.map((f) =>
              f.id === modal.faqToEdit!.id
                ? {
                    ...f,
                    question: form.question,
                    answer: form.answer,
                    saved: false,
                  }
                : f
            )
          );
          toast.success("ویرایش با موفقیت انجام شد");
          closeModal();
        } else {
          toast.error("خطا در ویرایش سوال");
        }
      }
    } catch {
      toast.error("خطا در ذخیره سازی");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این سوال حذف خواهد شد.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "لغو",
    });

    if (!confirm.isConfirmed) return;

    setLoadingDeleteId(id);
    try {
      const res = await fetch(`/api/faq/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        toast.success("سوال حذف شد");
      } else {
        toast.error("خطا در حذف سوال");
      }
    } catch {
      toast.error("خطا در حذف سوال");
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const handleRevalidate = async () => {
    const unsavedFaqs = faqs.filter((faq) => faq.saved === false);

    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
      });

      if (!res.ok) {
        toast.error("خطا در revalidate");
        return;
      }
      if (unsavedFaqs.length === 0) {
        toast.info("تغییری برای ذخیره وجود ندارد");
        return;
      }
      let success = true;
      for (const faq of unsavedFaqs) {
        const res = await fetch(`/api/faq/${faq.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: faq.question,
            answer: faq.answer,
            saved: true,
          }),
        });

        if (!res.ok) {
          success = false;
          toast.error(`خطا در ذخیره سوال با آیدی ${faq.id}`);
        }
      }

      if (success) {
        setFaqs((prev) =>
          prev.map((faq) =>
            faq.saved === false ? { ...faq, saved: true } : faq
          )
        );
        toast.success("همه تغییرات ذخیره شدند");
      }
    } catch (error) {
      toast.error("خطای شبکه در ذخیره تغییرات");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10 md:mt-0">
      <h2 className="text-3xl font-extrabold border-b border-gray-300 pb-3 mb-6 text-gray-800">
        مدیریت سوالات متداول
      </h2>
      <div className="flex justify-center md:justify-start items-center gap-4 mb-5">
        <button onClick={handleRevalidate} className="EditBTN">
          ذخیره تغییرات
        </button>
        <button onClick={openAddModal} className="ConfirmBTN">
          افزودن سوال جدید
        </button>
      </div>

      <div className="space-y-5">
        {faqs.length === 0 && (
          <p className="text-center text-gray-500">سوالی موجود نیست.</p>
        )}
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white shadow-md rounded-lg p-5 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow relative"
          >
            <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {faq.question}
            </div>
            <div className="whitespace-pre-wrap text-gray-700 mb-4 leading-relaxed">
              {faq.answer}
            </div>
            <div className="flex flex-row justify-end gap-3 sm:gap-2 text-sm">
              <button
                onClick={() => openEditModal(faq)}
                className="EditBTN w-fit sm:w-fit justify-center"
              >
                ویرایش
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                disabled={loadingDeleteId === faq.id}
                className="DeleteBTN w-fit"
              >
                {loadingDeleteId === faq.id ? "در حال حذف..." : "حذف"}
              </button>
            </div>
            <div className="flex  items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {" "}
              {faq.saved === false && (
                <span className="w-3 h-3 block bg-orange-500 border border-orange-400 rounded-full absolute top-2 left-2"></span>
              )}
            </div>
          </div>
        ))}
      </div>

      <FaqModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        question={form.question}
        answer={form.answer}
        loading={loadingSave}
        onClose={closeModal}
        onChangeQuestion={(val) => setForm((f) => ({ ...f, question: val }))}
        onChangeAnswer={(val) => setForm((f) => ({ ...f, answer: val }))}
        onSave={handleSave}
      />
    </div>
  );
}
