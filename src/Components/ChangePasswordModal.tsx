"use client";

import { supabase } from "@/Lib/supabase";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ChangePasswordModal() {
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);

  useEffect(() => {
    if (showModal) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    if (loading) return;
    setShowModal(false);
    setTimeout(() => {
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      setNewPasswordVisible(false);
      setRepeatPasswordVisible(false);
    }, 300);
  };

  const handleChangePassword = async () => {
    if (!supabase) {
      toast.error("Supabase client is not available.");
      return;
    }

    if (!currentPassword || !newPassword || !repeatPassword) {
      toast.error("لطفاً همه فیلدها را پر کنید");
      return;
    }

    if (newPassword !== repeatPassword) {
      toast.error("رمزهای جدید با هم مطابقت ندارند");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    setLoading(true);

    try {
      const userData = await fetch("/api/auth/userEmail", {
        method: "GET",
        headers: { "X-api-key": "secret" },
      });

      if (!userData.ok) throw new Error("خطا در دریافت اطلاعات کاربر");

      const { email } = await userData.json();
      if (!email) throw new Error("کاربر یافت نشد");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("رمز فعلی اشتباه است");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("رمز عبور با موفقیت تغییر یافت");
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "خطا در تغییر رمز عبور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={openModal} className="EditBTN">
        تغییر رمز عبور
      </button>

      {isAnimating && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-out ${
            showModal ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <div
            className={`relative w-full max-w-md bg-white rounded-2xl shadow-xl transition-all duration-300 ease-out ${
              showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                تغییر رمز عبور
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Close modal"
              >
                <img src="/images/svg/close.svg" alt="close" width={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="password"
                placeholder="رمز فعلی"
                className="Input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {/* New Password with Icon */}
              <div className="relative">
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  placeholder="رمز جدید"
                  className="Input w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400 hover:text-gray-600 rounded-lg"
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  aria-label="Toggle new password visibility"
                >
                  <img
                    src={
                      newPasswordVisible
                        ? "/images/svg/eye-hide.svg"
                        : "/images/svg/eye-show.svg"
                    }
                    alt="eye"
                    width={20}
                  />
                </button>
              </div>
              {/* Repeat Password with Icon */}
              <div className="relative">
                <input
                  type={repeatPasswordVisible ? "text" : "password"}
                  placeholder="تکرار رمز جدید"
                  className="Input"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400 hover:text-gray-600 rounded-lg"
                  onClick={() =>
                    setRepeatPasswordVisible(!repeatPasswordVisible)
                  }
                  aria-label="Toggle repeat password visibility"
                >
                  <img
                    src={
                      repeatPasswordVisible
                        ? "/images/svg/eye-hide.svg"
                        : "/images/svg/eye-show.svg"
                    }
                    alt="eye"
                    width={20}
                  />{" "}
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="ConfirmBTN w-full"
              >
                {loading ? (
                  <>
                    <span>در حال تغییر...</span>
                  </>
                ) : (
                  "تغییر رمز"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
