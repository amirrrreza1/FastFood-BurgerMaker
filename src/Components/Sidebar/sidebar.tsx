type Props = {
  selected: string;
  onSelect: (key: "menu") => void;
};

const Sidebar = ({ selected, onSelect }: Props) => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 space-y-2">
      <div
        className={`cursor-pointer p-2 rounded ${selected === "menu" ? "bg-gray-700" : ""}`}
        onClick={() => onSelect("menu")}
      >
        مدیریت منو
          </div>
    </div>
  );
};

export default Sidebar;
