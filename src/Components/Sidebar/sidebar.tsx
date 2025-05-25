import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  selected: string;
  onselect: Dispatch<SetStateAction<"menu">>;
}

function Sidebar({ selected, onselect }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 space-y-2">
      <div
        className={`cursor-pointer p-2 rounded ${selected === "menu" ? "bg-gray-700" : ""}`}
        onClick={() => onselect("menu")}
      >
        مدیریت منو
      </div>
    </div>
  );
};

export default Sidebar;
