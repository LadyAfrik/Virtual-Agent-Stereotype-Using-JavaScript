import React from "react";  // React library for creating components
import { useSortable } from "@dnd-kit/sortable";  // Hook from dnd-kit for making items sortable
import { CSS } from "@dnd-kit/utilities";  // Utility from dnd-kit to handle drag transform CSS

// 🔁 A draggable/sortable item using @dnd-kit
const SortableItem = ({ id, name, image }) => {
  const {
    attributes,    // Keyboard + screen reader accessibility
    listeners,     // Mouse + touch event listeners
    setNodeRef,    // Ref for the draggable element
    transform,     // Current transform (drag position)
    transition,    // Smooth animation between states
  } = useSortable({ id });

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
      className="flex items-center bg-gray-100 hover:bg-gray-200 p-4 rounded-xl shadow-md mb-3 cursor-grab active:cursor-grabbing transition-colors duration-200"
    >
      <img
        src={image}
        alt={name}
        className="w-14 h-14 rounded-full object-cover mr-4 border border-gray-300"
      />
      <p className="text-lg font-medium text-gray-800">{name}</p>
    </div>
  );
};

export default SortableItem;
