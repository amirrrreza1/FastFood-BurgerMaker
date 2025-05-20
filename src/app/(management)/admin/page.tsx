"use client";

import { useState } from "react";
import Sidebar from "@/Components/Sidebar/sidebar";
import MenuManager from "@/Components/MenuManager/MenuManager";

const AdminPage = () => {
  const [selectedPage, setSelectedPage] = useState<"menu">("menu");

  return (
    <div className="flex min-h-screen">
      <Sidebar onSelect={setSelectedPage} selected={selectedPage} />
      <div className="flex-1 p-6">
        {selectedPage === "menu" && <MenuManager />}
      </div>
    </div>
  );
};

export default AdminPage;
