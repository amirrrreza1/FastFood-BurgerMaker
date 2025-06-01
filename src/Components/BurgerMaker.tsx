"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import Swal from "sweetalert2";

const prices: Record<Ingredient, number> = {
  meat: 30000,
  cheese: 10000,
  lettuce: 5000,
  tomato: 5000,
  pickle: 5000,
  onion: 4000,
  ketchup: 2000,
  mustard: 2000,
  mayo: 2000,
  hot: 3000,
  bread: 8000,
};

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ScreenshotHelper from "./ScreenshotHelper";
import { supabase } from "@/Lib/supabase";

type Ingredient =
  | "meat"
  | "cheese"
  | "lettuce"
  | "tomato"
  | "pickle"
  | "onion"
  | "ketchup"
  | "mustard"
  | "mayo"
  | "hot"
  | "bread";

type LayerItem = {
  id: any;
  type: Ingredient;
};

export default function BurgerBuilderComponent() {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleScreenshot = async () => {
    if (!layers.some((l) => l.type === "meat")) {
      return Swal.fire(
        "خطا",
        "برای ذخیره عکس، باید حداقل یک لایه گوشت اضافه کنید",
        "error"
      );
    }

    if (screenshotRef.current) {
      const dataUrl = screenshotRef.current.takeScreenshot();

      const file = dataURLtoFile(dataUrl, `burger-${Date.now()}.png`);
      const filePath = `burgers/${Date.now()}.png`;

      const { data, error: uploadError } = await supabase.storage
        .from("burgers")
        .upload(filePath, file);

      if (uploadError) {
        return Swal.fire("خطا", "خطا در ذخیره‌سازی عکس", "error");
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/burgers/${filePath}`;

      const res = await fetch("/api/auth/userID");
      const user = await res.json();
      console.log(user);
      if (!res.ok) {
        return Swal.fire("خطا", "خطا در دریافت شناسه کاربر", "error");
      }
      const { error } = await supabase.from("custom_burgers").insert({
        name: `همبرگر ${Date.now()}`,
        user_id: user.user_id,
        layers: layers.map((l) => l.type),
        image_url: imageUrl,
        total_price: totalPrice,
      });

      if (error) {
        return Swal.fire(
          "خطا",
          "ثبت همبرگر در دیتابیس با مشکل مواجه شد",
          "error"
        );
      }

      Swal.fire("موفق!", "همبرگر با موفقیت ذخیره شد", "success");
    }
  };

  const screenshotRef = useRef<{ takeScreenshot: () => string }>(null);

  const sauceTypes: Ingredient[] = ["ketchup", "mustard", "mayo", "hot"];

  const addLayer = (type: Ingredient) => {
    const sauceCount = layers.filter((l) => sauceTypes.includes(l.type)).length;
    const meatCount = layers.filter((l) => l.type === "meat").length;
    const veggieCount = layers.filter((l) =>
      ["cheese", "lettuce", "tomato", "pickle", "onion"].includes(l.type)
    ).length;

    if (sauceTypes.includes(type) && sauceCount >= 2) {
      return Swal.fire(
        "محدودیت!",
        "فقط ۲ نوع سس می‌توانید انتخاب کنید",
        "warning"
      );
    }

    if (type === "meat" && meatCount >= 3) {
      return Swal.fire("محدودیت!", "حداکثر ۳ لایه گوشت مجاز است", "warning");
    }

    if (type === "bread" && layers.some((l) => l.type === "bread")) {
      return Swal.fire(
        "محدودیت!",
        "فقط یک نان اضافه می‌توانید انتخاب کنید",
        "warning"
      );
    }

    if (
      ["cheese", "lettuce", "tomato", "pickle", "onion"].includes(type) &&
      veggieCount >= 3
    ) {
      return Swal.fire(
        "محدودیت!",
        "فقط ۳ مورد از سبزیجات/پنیر/گوجه مجاز است",
        "warning"
      );
    }

    setLayers([...layers, { id: Date.now(), type }]);
    setTotalPrice((prev) => prev + prices[type]);
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    const removed = layers.find((l) => l.id === id);
    if (removed) {
      setTotalPrice((prev) => prev - prices[removed.type]);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = layers.findIndex((l) => l.id === active.id);
      const newIndex = layers.findIndex((l) => l.id === over.id);
      setLayers((layers) => arrayMove(layers, oldIndex, newIndex));
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="absolute top-0 left-0 bg-gray-200 p-4 text-center z-5">
        قیمت نهایی: {totalPrice.toLocaleString()} تومان
      </div>

      <div className="w-1/4 bg-gray-100 p-4 space-y-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">ساخت همبرگر 🍔</h2>

        <button
          onClick={() => addLayer("meat")}
          className="bg-red-400 text-white py-2 px-4 rounded w-full"
        >
          افزودن گوشت
        </button>
        <button
          onClick={() => addLayer("cheese")}
          className="bg-yellow-400 text-white py-2 px-4 rounded w-full"
        >
          افزودن پنیر
        </button>
        <button
          onClick={() => addLayer("lettuce")}
          className="bg-green-400 text-white py-2 px-4 rounded w-full"
        >
          افزودن کاهو
        </button>
        <button
          onClick={() => addLayer("tomato")}
          className="bg-red-500 text-white py-2 px-4 rounded w-full"
        >
          افزودن گوجه
        </button>
        <button
          onClick={() => addLayer("pickle")}
          className="bg-lime-400 text-white py-2 px-4 rounded w-full"
        >
          افزودن خیارشور
        </button>
        <button
          onClick={() => addLayer("onion")}
          className="bg-purple-300 text-white py-2 px-4 rounded w-full"
        >
          افزودن پیاز
        </button>
        <button
          onClick={() => addLayer("ketchup")}
          className="bg-red-600 text-white py-2 px-4 rounded w-full"
        >
          افزودن سس قرمز
        </button>
        <button
          onClick={() => addLayer("mustard")}
          className="bg-yellow-600 text-white py-2 px-4 rounded w-full"
        >
          افزودن سس خردل
        </button>
        <button
          onClick={() => addLayer("mayo")}
          className="bg-gray-200 text-black py-2 px-4 rounded w-full"
        >
          افزودن سس سفید
        </button>
        <button
          onClick={() => addLayer("hot")}
          className="bg-orange-600 text-white py-2 px-4 rounded w-full"
        >
          افزودن سس تند
        </button>
        <button
          onClick={() => addLayer("bread")}
          className="bg-yellow-800 text-white py-2 px-4 rounded w-full"
        >
          افزودن نان اضافه
        </button>
        <button
          onClick={handleScreenshot}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          📸 ذخیره عکس همبرگر
        </button>

        <div className="mt-6 space-y-2">
          <h3 className="font-semibold">لایه‌ها:</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={layers.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {layers.map((layer, index) => (
                <SortableItem
                  key={layer.id}
                  layer={layer}
                  index={index}
                  removeLayer={removeLayer}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="flex-1">
        <div className="relative w-full h-full bg-red-300">
          <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[0, 5, 5]} intensity={1} />
            <Suspense fallback={<span>در حال بارگذاری...</span>}>
              <BurgerBreadBottom />
              {layers.map((layer, index) => (
                <BurgerLayer key={layer.id} type={layer.type} index={index} />
              ))}
              <BurgerBreadTop y={0.5 + layers.length * 0.3} />
              <ScreenshotHelper ref={screenshotRef} />
            </Suspense>
            <OrbitControls />
            <Environment preset="sunset" />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

// 🍞 نان پایین
function BurgerBreadBottom() {
  return (
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />
      <meshStandardMaterial color="#d5a85e" />
    </mesh>
  );
}

// 🧀 لایه‌ها
function BurgerLayer({ type, index }: { type: Ingredient; index: number }) {
  const height = 0.5 + index * 0.3;

  const getColor = () => {
    switch (type) {
      case "meat":
        return "#8b4513";
      case "cheese":
        return "#ffcc00";
      case "lettuce":
        return "#4caf50";
      case "tomato":
        return "#e53935";
      case "pickle":
        return "#9ccc65";
      case "onion":
        return "#e1bee7";
      case "ketchup":
        return "#d32f2f";
      case "mustard":
        return "#fbc02d";
      case "mayo":
        return "#f5f5f5";
      case "hot":
        return "#f44336";
      case "bread":
        return "#f4a261";
    }
  };

  return (
    <mesh position={[0, height, 0]}>
      <cylinderGeometry args={[1.4, 1.4, 0.2, 32]} />
      <meshStandardMaterial color={getColor()} />
    </mesh>
  );
}

// 🍞 نان بالا
function BurgerBreadTop({ y }: { y: number }) {
  return (
    <mesh position={[0, y + 0.3, 0]}>
      <cylinderGeometry args={[1.6, 1.6, 0.5, 32]} />
      <meshStandardMaterial color="#d5a85e" />
    </mesh>
  );
}

// 🧲 آیتم قابل کشیدن
function SortableItem({
  layer,
  index,
  removeLayer,
}: {
  layer: LayerItem;
  index: number;
  removeLayer: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between bg-white p-2 rounded shadow text-sm"
    >
      <span>
        {index + 1}. {getLabel(layer.type)}
      </span>
      <button
        onClick={() => removeLayer(layer.id)}
        className="text-red-600 hover:text-red-800"
      >
        ❌
      </button>
    </div>
  );
}

// 🎯 تبدیل نوع به متن
function getLabel(type: Ingredient) {
  switch (type) {
    case "meat":
      return "گوشت";
    case "cheese":
      return "پنیر";
    case "lettuce":
      return "کاهو";
    case "tomato":
      return "گوجه";
    case "pickle":
      return "خیارشور";
    case "onion":
      return "پیاز";
    case "ketchup":
      return "سس قرمز";
    case "mustard":
      return "سس خردل";
    case "mayo":
      return "سس سفید";
    case "hot":
      return "سس تند";
    case "bread":
      return "نان اضافه";
  }
}

function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) u8arr[n] = bstr.charCodeAt(n);

  return new File([u8arr], filename, { type: mime });
}
