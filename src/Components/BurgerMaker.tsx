"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import {
  Suspense,
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  use,
} from "react";

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
import { supabase } from "@/Lib/supabase";
// import { supabase } from "@/Lib/supabase"; // This line is removed to fix the erro

// --- DATA & TYPES ---
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

type LayerItem = { id: string; type: Ingredient };
type NotificationType = "error" | "warning" | "info" | "success";
type NotificationState = {
  message: string;
  title: string;
  type: NotificationType;
} | null;

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
const calories: Record<Ingredient, number> = {
  meat: 250,
  cheese: 100,
  lettuce: 5,
  tomato: 10,
  pickle: 5,
  onion: 10,
  ketchup: 20,
  mustard: 15,
  mayo: 90,
  hot: 25,
  bread: 150,
};
const ingredientInfo = [
  { type: "meat", label: "افزودن گوشت", color: "bg-red-500 hover:bg-red-600" },
  {
    type: "cheese",
    label: "افزودن پنیر",
    color: "bg-yellow-400 hover:bg-yellow-500",
  },
  {
    type: "lettuce",
    label: "افزودن کاهو",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    type: "tomato",
    label: "افزودن گوجه",
    color: "bg-red-400 hover:bg-red-500",
  },
  {
    type: "pickle",
    label: "افزودن خیارشور",
    color: "bg-lime-500 hover:bg-lime-600",
  },
  {
    type: "onion",
    label: "افزودن پیاز",
    color: "bg-purple-400 hover:bg-purple-500",
  },
  {
    type: "ketchup",
    label: "افزودن سس قرمز",
    color: "bg-red-600 hover:bg-red-700",
  },
  {
    type: "mustard",
    label: "افزودن سس خردل",
    color: "bg-yellow-600 hover:bg-yellow-700",
  },
  {
    type: "mayo",
    label: "افزودن سس سفید",
    color: "bg-gray-200 text-black hover:bg-gray-300",
  },
  {
    type: "hot",
    label: "افزودن سس تند",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    type: "bread",
    label: "افزودن نان اضافه",
    color: "bg-yellow-800 hover:bg-yellow-900",
  },
];

// --- MAIN COMPONENT ---
export default function BurgerBuilderComponent() {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [notification, setNotification] = useState<NotificationState>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [burgerName, setBurgerName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const fetchUserID = async () => {
      const res = await fetch("/api/auth/userID");
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to load user ID");
      setUserID(data.user_id);
      console.log(data.user_id);
    };

    fetchUserID();
  });

  const screenshotRef = useRef<{ takeScreenshot: () => string }>(null);

  const handleSaveAttempt = () => {
    if (isSaving) return;
    if (!layers.some((l) => l.type === "meat")) {
      return setNotification({
        title: "خطا",
        message: "برای ذخیره، باید حداقل یک لایه گوشت اضافه کنید.",
        type: "error",
      });
    }
    setShowNameModal(true);
  };

  const handleFinalSave = async () => {
    if (!screenshotRef.current || !burgerName.trim()) {
      setNotification({
        title: "خطا",
        message: "لطفا یک نام برای همبرگر خود انتخاب کنید.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    setShowNameModal(false);
    setNotification({
      title: "در حال ذخیره...",
      message: "لطفا چند لحظه صبر کنید...",
      type: "info",
    });

    const dataUrl = screenshotRef.current.takeScreenshot();
    const file = dataURLtoFile(dataUrl, `burger-${Date.now()}.png`);
    const filePath = `burgers/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("burgers")
      .upload(filePath, file);

    if (uploadError) {
      setIsSaving(false);
      return setNotification({
        title: "خطا در آپلود",
        message: "مشکلی در ذخیره عکس پیش آمد.",
        type: "error",
      });
    }

    const { data } = supabase.storage.from("burgers").getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    const { error: dbError } = await supabase.from("custom_burgers").insert({
      name: burgerName,
      user_id: userID, // Replace with actual user ID from auth
      layers: layers.map((l) => l.type),
      image_url: imageUrl,
      total_price: totalPrice,
      total_calories: totalCalories,
    });

    if (dbError) {
      setIsSaving(false);
      return setNotification({
        title: "خطای دیتابیس",
        message: "ثبت اطلاعات همبرگر با مشکل مواجه شد.",
        type: "error",
      });
    }

    setIsSaving(false);
    setNotification({
      title: "موفق!",
      message: "همبرگر شما با موفقیت ذخیره شد!",
      type: "success",
    });
    setBurgerName("");
  };

  const addLayer = (type: Ingredient) => {
    const sauceTypes: Ingredient[] = ["ketchup", "mustard", "mayo", "hot"];
    const sauceCount = layers.filter((l) => sauceTypes.includes(l.type)).length;
    if (sauceTypes.includes(type) && sauceCount >= 2) {
      return setNotification({
        title: "محدودیت!",
        message: "فقط ۲ نوع سس می‌توانید انتخاب کنید.",
        type: "warning",
      });
    }
    const newLayer = { id: `layer-${Date.now()}-${Math.random()}`, type };
    setLayers((prev) => [...prev, newLayer]);
    setTotalPrice((prev) => prev + prices[type]);
    setTotalCalories((prev) => prev + calories[type]);
  };

  const removeLayer = (id: string) => {
    const layerToRemove = layers.find((l) => l.id === id);
    if (layerToRemove) {
      setLayers((prev) => prev.filter((layer) => layer.id !== id));
      setTotalPrice((prev) => prev - prices[layerToRemove.type]);
      setTotalCalories((prev) => prev - calories[layerToRemove.type]);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setLayers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-800 text-white font-sans relative">
      <Notification
        notification={notification}
        onClear={() => setNotification(null)}
      />
      <NameModal
        open={showNameModal}
        onClose={() => setShowNameModal(false)}
        burgerName={burgerName}
        setBurgerName={setBurgerName}
        onSave={handleFinalSave}
      />
      <div className="w-full md:w-96 bg-gray-900 p-4 flex flex-col shadow-lg overflow-y-auto">
        <h1 className="text-3xl font-bold mb-1 text-center text-yellow-400">
          Burger Builder
        </h1>
        <p className="text-center text-gray-400 mb-4">
          همبرگر خود را بسازید 🍔
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">قیمت نهایی</div>
            <div className="text-xl font-bold text-green-400">
              {totalPrice.toLocaleString()}{" "}
              <span className="text-xs">تومان</span>
            </div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">کالری کل</div>
            <div className="text-xl font-bold text-orange-400">
              {totalCalories.toLocaleString()}{" "}
              <span className="text-xs">Kcal</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {ingredientInfo.map((ing) => (
            <button
              key={ing.type}
              onClick={() => addLayer(ing.type as Ingredient)}
              className={`text-white py-2 px-3 rounded-lg w-full text-sm font-semibold transition-transform transform hover:scale-105 active:scale-95 shadow-md ${ing.color}`}
            >
              {ing.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleSaveAttempt}
          disabled={isSaving}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-lg transition-transform transform hover:scale-105 active:scale-95 shadow-lg mb-4 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isSaving ? "در حال ذخیره..." : "📸 ذخیره همبرگر"}
        </button>
        <div className="flex-grow min-h-[150px]">
          <h3 className="font-bold text-lg mb-2 text-gray-300">لایه‌ها:</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={layers.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {layers.length > 0 ? (
                  layers.map((layer, index) => (
                    <SortableItem
                      key={layer.id}
                      layer={layer}
                      index={index}
                      removeLayer={removeLayer}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    هنوز لایه‌ای اضافه نشده است.
                  </p>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <div className="flex-1 w-full h-full min-h-[300px] md:min-h-0 bg-gray-700">
        <Canvas
          camera={{ position: [0, 5, 12], fov: 50 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Suspense fallback={null}>
            <BurgerBreadBottom />
            {layers.map((layer, index) => (
              <BurgerLayer key={layer.id} type={layer.type} index={index} />
            ))}
            <BurgerBreadTop y={0.5 + layers.length * 0.3} />
            <ScreenshotHelper ref={screenshotRef} />
          </Suspense>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
          <Environment preset="sunset" background={false} />
        </Canvas>
      </div>
    </div>
  );
}

// --- HELPER & UI COMPONENTS ---
function Notification({
  notification,
  onClear,
}: {
  notification: NotificationState;
  onClear: () => void;
}) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => onClear(), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClear]);
  if (!notification) return null;
  const colors = {
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    success: "bg-green-500",
  };
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex justify-center p-4">
      <div
        className={`flex items-center justify-between w-full max-w-md p-4 text-white rounded-lg shadow-2xl ${
          colors[notification.type]
        }`}
      >
        <div>
          <p className="font-bold">{notification.title}</p>
          <p className="text-sm">{notification.message}</p>
        </div>
        <button
          onClick={onClear}
          className="ml-4 text-2xl font-semibold leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

const NameModal = ({
  open,
  onClose,
  burgerName,
  setBurgerName,
  onSave,
}: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">
          یک نام برای همبرگر خود انتخاب کنید
        </h2>
        <input
          type="text"
          value={burgerName}
          onChange={(e) => setBurgerName(e.target.value)}
          placeholder="مثلا: قهرمان دوبل"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
          >
            انصراف
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
};

const ScreenshotHelper = forwardRef((props, ref) => {
  const { gl, scene, camera } = useThree();
  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL();
    },
  }));
  return null;
});

function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Invalid data URL");
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

// --- 3D MODEL COMPONENTS ---
function BurgerBreadBottom() {
  return (
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[1.5, 1.4, 0.5, 64]} />
      <meshStandardMaterial color="#d5a85e" roughness={0.6} />
    </mesh>
  );
}
function BurgerLayer({ type, index }: { type: Ingredient; index: number }) {
  const yPos = 0.35 + index * 0.25;
  const colors = {
    meat: "#8B4513",
    cheese: "#FFD700",
    lettuce: "#2E8B57",
    tomato: "#E53935",
    pickle: "#6B8E23",
    onion: "#E1BEE7",
    ketchup: "#BF2A2A",
    mustard: "#FBC02D",
    mayo: "#F5F5F5",
    hot: "#FF4500",
    bread: "#E0A865",
  };
  const layerHeight = type === "meat" ? 0.25 : 0.1;
  const radius = type === "lettuce" ? 1.5 : 1.4;
  return (
    <mesh position={[0, yPos, 0]}>
      <cylinderGeometry args={[radius, radius, layerHeight, 64]} />
      <meshStandardMaterial
        color={colors[type]}
        roughness={type === "meat" ? 0.8 : 0.4}
      />
    </mesh>
  );
}
function BurgerBreadTop({ y }: { y: number }) {
  const topY = y + 0.1;
  return (
    <mesh position={[0, topY, 0]}>
      <sphereGeometry args={[1.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#d5a85e" roughness={0.5} />
    </mesh>
  );
}

// --- DRAGGABLE LIST ITEM COMPONENT ---

const getLabel = (type: Ingredient): string => {
  const labels: Record<Ingredient, string> = {
    meat: "گوشت",
    cheese: "پنیر",
    lettuce: "کاهو",
    tomato: "گوجه",
    pickle: "خیارشور",
    onion: "پیاز",
    ketchup: "سس قرمز",
    mustard: "سس خردل",
    mayo: "سس سفید",
    hot: "سس تند",
    bread: "نان اضافه",
  };
  return labels[type] || "ناشناخته";
};

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
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between bg-gray-700 p-2 rounded-lg shadow-inner cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center">
        <button
          {...attributes}
          {...listeners}
          className="mr-2 text-gray-400 hover:text-white touch-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </button>
        <span className="font-medium text-gray-200">
          {index + 1}. {getLabel(layer.type)}
        </span>
      </div>
      <button
        onClick={() => removeLayer(layer.id)}
        className="text-red-400 hover:text-red-300 font-bold text-lg"
      >
        &times;
      </button>
    </div>
  );
}
