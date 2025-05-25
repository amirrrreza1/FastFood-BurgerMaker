"use client";

import { useState } from "react";
import Sidebar from "@/Components/Sidebar/sidebar";
import MenuManager from "@/Components/MenuManager/MenuManager";
import Cart from "@/Components/Cart/Cart";

const AdminPage = () => {
  const [selectedPage, setSelectedPage] = useState<"menu">("menu");

  return (
    <div className="flex min-h-screen">
      <Sidebar onselect={setSelectedPage} selected={selectedPage} />
      <div className="flex-1 p-6">
        {selectedPage === "menu" && <MenuManager />}
      </div>
      <Cart/>
    </div>
  );
};

export default AdminPage;
