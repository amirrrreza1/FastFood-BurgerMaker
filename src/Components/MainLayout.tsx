import Link from "next/link";
import React from "react";
import CartModalButton from "./CartModal";
import { cookies } from "next/headers";
import NavLinks from "./NavLinks";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  const token = (await cookies()).get("token")?.value;

  return (
    <>
      <header className="w-full bg-[#A58A01] sticky top-0 z-50">
        <div className="w-full max-w-[1200px] m-auto flex items-center justify-between h-[60px] px-5 flex-wrap gap-y-2">
          <section className="flex items-center gap-4 flex-wrap">
            <Link href="/">
              <img
                src="/images/Logo.png"
                alt="logo"
                className="hover:scale-105 h-[50px] transition-all duration-300"
              />
            </Link>
          </section>

          {/* Auth & Cart */}
          <section className="flex items-center gap-3 sm:gap-4 text-sm">
            <Link href="/login" className="CustomBTN whitespace-nowrap">
              {token ? "داشبورد" : "ورود | ثبت‌نام"}
            </Link>
            <CartModalButton />
          </section>
        </div>
      </header>
      <NavLinks />

      <main>{children}</main>
      <footer className="w-full bg-[#A58A01] text-white p-5 mt-10 h-[140px]">
        <div className="w-full max-w-[1200px] mx-auto mb-5 flex flex-col-reverse md:flex-row justify-between items-center gap-3">
          <div>
            طراحی و توسعه توسط <strong>امیررضا آذریون</strong>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link href={"#top"} className="CustomBTN">
              بازگشت به بالا
            </Link>
          </div>
        </div>
        <div className="max-w-[1200px] m-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-2">
            <h3 className="text-lg font-semibold mb-2"> ارتباط با من :</h3>
            <div className="flex gap-4 text-2xl">
              <Link
                href="https://t.me/amirreza_work"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <img
                  src="/images/SVG/telegram.svg"
                  width={30}
                  className="SocialIconFooter"
                  alt="telegram"
                />
              </Link>
              <Link
                href="https://github.com/amirrrreza1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub
      "
              >
                <img
                  src="/images/SVG/github.svg"
                  width={30}
                  className="SocialIconFooter"
                  alt="github"
                />
              </Link>

              <Link
                href="https://www.linkedin.com/in/amirrrreza1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <img
                  src="/images/SVG/linkedin.svg"
                  width={30}
                  className="SocialIconFooter"
                  alt="linkedin"
                />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
