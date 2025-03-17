import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, name, image }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

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
      className="flex items-center bg-gray-200 p-3 rounded-md shadow mb-2 cursor-pointer"
    >
      <img src={image} alt={name} className="w-16 h-16 rounded-full mr-4" />
      <p className="text-lg font-medium">{name}</p>
    </div>
  );
};

export default SortableItem;
