import React from "react";

type Props = {
  children: React.ReactNode;
};

const ROUTES = [];

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <header className="w-[95%] max-w-[1200px] m-auto mt-4 h-[60px] bg-[var(--color-MainGreen)]">
        <nav></nav>
      </header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
};

export default MainLayout;
