import { FAQ } from "@/types";
import { cookies } from "next/headers";

export default async function FAQPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${baseUrl}/api/faq`, {
    next: { tags: ["faq"] }, // تعریف تگ برای revalidation دستی
    headers: {
      cookie: cookies().toString(),
    },
  });

  const faqs: FAQ[] = await res.json();

  return (
    <div
      className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6"
      style={{ minHeight: `calc(100vh - 280px)` }}
    >
      <h1 className="text-3xl font-bold text-center text-gray-800">
        سوالات متداول
      </h1>

      {faqs.map((faq) => (
        <details
          key={faq.id}
          className="group border border-gray-200 rounded-lg shadow-sm px-5 py-4 bg-white transition-all"
        >
          <summary className="flex items-center justify-between cursor-pointer text-gray-800 font-medium text-base sm:text-lg transition-colors group-hover:text-[var(--color-primary)]">
            {faq.question}
            <svg
              className="w-5 h-5 text-gray-500 transition-transform duration-300 group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
