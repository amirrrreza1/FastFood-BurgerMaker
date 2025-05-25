"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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

type Ingredient = "meat" | "cheese" | "lettuce";

type LayerItem = {
  id: string;
  type: Ingredient;
};

export default function BurgerBuilderPage() {
  const [layers, setLayers] = useState<LayerItem[]>([]);

  const addLayer = (type: Ingredient) => {
    setLayers((prev) => [...prev, { id: uuidv4(), type }]);
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
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
      {/* Sidebar */}
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

      {/* Canvas */}
      <div className="flex-1">
        <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[0, 5, 5]} intensity={1} />

          <Suspense fallback={null}>
            <BurgerBreadBottom />
            {layers.map((layer, index) => (
              <BurgerLayer key={layer.id} type={layer.type} index={index} />
            ))}
            <BurgerBreadTop y={0.5 + layers.length * 0.3} />
          </Suspense>

          <OrbitControls />
          <Environment preset="sunset" />
        </Canvas>
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
  }
}
