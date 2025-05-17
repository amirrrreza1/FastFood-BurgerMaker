// components/MenuItemCard.tsx
import { MenuItem } from "@/Lib/menu";

const fallbackImage = "/images/placeholder-food.jpg";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const imageSrc = item.image === "" ? fallbackImage : item.image;

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-md ${
        item.available ? "bg-white" : "bg-gray-200 opacity-70 cursor-not-allowed"
      }`}
    >
      <img
        src={imageSrc}
        alt={item.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-bold">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
        <div className="mt-1 text-xs text-gray-500">کالری: {item.calories}</div>
        <div className="mt-2 font-semibold text-amber-600">
          {item.price.toLocaleString()} تومان
        </div>
      </div>

      {!item.available && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
          ناموجود
        </div>
      )}
    </div>
  );
}
