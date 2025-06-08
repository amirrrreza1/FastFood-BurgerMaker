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
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import IntroModal from "./BurgerIntroModal";

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
    color: "bg-gray-400 text-black hover:bg-gray-500",
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
  const Router = useRouter();
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
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
    };

    fetchUserID();
  }, []); // FIX: Added empty dependency array to run useEffect only once.

  const screenshotRef = useRef<{ takeScreenshot: () => string }>(null); // NEW: Define limits for specific ingredients

  const ingredientLimits: Partial<Record<Ingredient, number>> = {
    meat: 3,
    cheese: 2,
    lettuce: 1,
    tomato: 1,
    pickle: 1,
    bread: 1,
    hot: 1,
    ketchup: 1,
    mustard: 1,
    mayo: 1,
    onion: 1,
  };
  const sauceTypes: Ingredient[] = ["ketchup", "mustard", "mayo", "hot"];
  const MAX_SAUCES = 3;

  const handleSaveAttempt = () => {
    if (isSaving) return; // FIX: The modal will no longer open if this condition is met.

    if (!layers.some((l) => l.type === "meat")) {
      toast.error("برای ذخیره، باید حداقل یک لایه گوشت اضافه کنید.");
      return; // This prevents the code below from running.
    }

    setShowNameModal(true);
  };

  const handleFinalSave = async () => {
    if (!screenshotRef.current || !burgerName.trim()) {
      toast.error("لطفا یک نام برای همبرگر خود انتخاب کنید.");
      return;
    }

    setIsSaving(true);
    setShowNameModal(false);
    toast.info("در حال ذخیره...");

    const dataUrl = screenshotRef.current.takeScreenshot();
    const file = dataURLtoFile(dataUrl, `burger-${Date.now()}.png`);
    const filePath = `burgers/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("burgers")
      .upload(filePath, file);

    if (uploadError) {
      setIsSaving(false);
      toast.error("مشکلی در ذخیره عکس پیش آمد.");
      return; // Stop execution on error
    }

    const { data } = supabase.storage.from("burgers").getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    const { error: dbError } = await supabase.from("custom_burgers").insert({
      name: burgerName,
      user_id: userID,
      layers: layers.map((l) => l.type),
      image_url: imageUrl,
      total_price: totalPrice,
      total_calories: totalCalories,
    });

    if (dbError) {
      setIsSaving(false);
      toast.error("ثبت اطلاعات همبرگر با مشکل مواجه شد.");
      return; // Stop execution on error
    }

    setIsSaving(false);
    toast.success("همبرگر شما با موفقیت ذخیره شد!");
    setBurgerName("");
    Router.push("/profile/myburgers");
  };

  const addLayer = (type: Ingredient) => {
    // FIX: Updated ingredient limiting logic
    // 1. Check for total sauce limit
    const sauceCount = layers.filter((l) => sauceTypes.includes(l.type)).length;
    if (sauceTypes.includes(type) && sauceCount >= MAX_SAUCES) {
      toast.warn(`حداکثر می‌توانید ${MAX_SAUCES} سس اضافه کنید.`);
      return; // Stop the function
    } // 2. Check for individual ingredient limits

    const limit = ingredientLimits[type];
    if (limit) {
      const currentCount = layers.filter((l) => l.type === type).length;
      if (currentCount >= limit) {
        const label = getLabel(type); // Get the Persian label
        toast.warn(`بیشتر از ${limit} عدد ${label} نمی‌توانید اضافه کنید.`);
        return; // Stop the function
      }
    } // If no limits were hit, add the layer

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

  const bottomBunTopY = 0.25;
  let accumulatedHeight = bottomBunTopY;

  return (
    <>
      <IntroModal />
      <div className="flex flex-col md:flex-row h-screen w-full text-white relative">
        <NameModal
          open={showNameModal}
          onClose={() => setShowNameModal(false)}
          burgerName={burgerName}
          setBurgerName={setBurgerName}
          onSave={handleFinalSave}
        />
        <div className="w-full md:w-96 p-4 flex flex-col shadow-lg overflow-y-auto">
          <p className="text-center text-gray-400 mb-4">
            همبرگر خود را بسازید 🍔
          </p>
          <div className="flex flex-col gap-4 mb-4 text-center">
            <div className="bg-gray-200 p-1 rounded-lg">
              <div className="text-sm text-black">قیمت نهایی</div>
              <div className="text-xl font-bold text-green-600">
                {totalPrice.toLocaleString()}
                <span className="text-xs">تومان</span>
              </div>
            </div>
            <div className="bg-gray-200 p-1 rounded-lg">
              <div className="text-sm text-black">کالری کل</div>
              <div className="text-xl font-bold text-orange-400 flex justify-center items-center">
                <span className="text-xs">Kcal</span>
                <span className=""> {totalCalories.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mb-4">
            {ingredientInfo.map((ing) => (
              <button
                key={ing.type}
                onClick={() => addLayer(ing.type as Ingredient)}
                className={`text-white py-2 rounded-lg w-full text-sm transition-transform transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${ing.color}`}
              >
                {ing.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleSaveAttempt}
            disabled={isSaving}
            className="ConfirmBTN w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "در حال ذخیره..." : " ذخیره همبرگر"}
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
        <div className="w-full bg-gray-400 h-full min-h-[300px] md:min-h-0 flex justify-center items-center">
          <Canvas
            camera={{ position: [0, 5, 12], fov: 50 }}
            gl={{ preserveDrawingBuffer: true }}
            className="!w-[95%] !h-[95%] lg:!w-[60%] lg:!h-[60%] bg-white rounded-2xl"
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Suspense fallback={null}>
              <BurgerBreadBottom />
              {layers.map((layer, index) => (
                <BurgerLayer key={layer.id} type={layer.type} index={index} />
              ))}
              <BurgerBreadTop y={layers.length * 0.3} />
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
    </>
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
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-6 rounded-lg shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          یک نام برای همبرگر خود انتخاب کنید
        </h2>
        <input
          type="text"
          value={burgerName}
          onChange={(e) => setBurgerName(e.target.value)}
          placeholder="مثلا: قهرمان دوبل"
          className="w-full p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="CancelBTN">
            انصراف
          </button>
          <button onClick={onSave} className="ConfirmBTN">
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
  const layerHeight = type === "meat" ? 0.2 : 0.15;
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
export function BurgerBreadTop({ y }: { y: number }) {
  const topY = y + 0.15;

  return (
    <group position={[0, topY, 0]}>
      {/* نیم‌کره بالا */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d5a85e" roughness={0.5} />
      </mesh>

      {/* کف صاف برای بستن کره از پایین */}
      <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial color="#d5a85e" roughness={0.5} />
      </mesh>
    </group>
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
      className="flex items-center justify-between bg-gray-200 p-2 rounded-lg shadow-inner"
    >
      <div className="flex items-center">
        <button
          {...attributes}
          {...listeners}
          className="mr-2 text-gray-500 hover:text-gray-800 touch-none cursor-grab"
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
        <span className="font-medium text-black">
          {index + 1}. {getLabel(layer.type)}
        </span>
      </div>
      <button
        onClick={() => removeLayer(layer.id)}
        className="text-red-400 hover:text-red-300 font-bold text-lg cursor-pointer"
      >
        &times;
      </button>
    </div>
  );
}
