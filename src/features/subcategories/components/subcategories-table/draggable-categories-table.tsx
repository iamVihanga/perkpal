"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

import { useReorderCategories } from "../../queries/use-reorder-categories";

import type { SelectCategoryT } from "@/lib/zod/categories.zod";

interface DraggableRowProps {
  category: SelectCategoryT;
}

function DraggableRow({ category }: DraggableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${
        isDragging ? "relative z-50" : ""
      } hover:bg-muted/50 border-b`}
    >
      <td className="w-12 p-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded flex items-center justify-center"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </td>
      <td className="p-4 font-medium">{category.name}</td>
      <td className="p-4 text-muted-foreground truncate">
        {category.description?.slice(0, 100) || "No description"}
      </td>
      <td className="p-4 text-muted-foreground">{`${
        category.subcategories?.length || 0
      } Subcategories`}</td>
      <td className="p-4 text-muted-foreground">
        {typeof category?.createdAt === "string"
          ? new Date(category?.createdAt).toLocaleDateString()
          : category.createdAt?.toLocaleDateString() || "N/A"}
      </td>
      <td className="p-4">{/* Action buttons can be added here */}</td>
    </tr>
  );
}

interface DraggableCategoriesTableProps {
  data: SelectCategoryT[];
}

export function DraggableCategoriesTable({
  data
}: DraggableCategoriesTableProps) {
  const [items, setItems] = React.useState<SelectCategoryT[]>(data);
  const { mutate: reorderCategories, isPending } = useReorderCategories();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Update items when data changes
  React.useEffect(() => {
    setItems(data);
  }, [data]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Calculate new priority indices
      const reorderPayload = {
        items: newItems.map((item, index) => ({
          id: item.id,
          displayOrder: index + 1
        }))
      };

      // Call the reorder mutation
      reorderCategories(reorderPayload);
    }
  };

  return (
    <div className="relative">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-12 p-4 text-left text-sm font-medium">
                <span className="sr-only">Drag Handle</span>
              </th>
              <th className="p-4 text-left text-sm font-medium">Name</th>
              <th className="p-4 text-left text-sm font-medium">Description</th>
              <th className="p-4 text-left text-sm font-medium">
                Sub Categories
              </th>
              <th className="p-4 text-left text-sm font-medium">Created At</th>
              <th className="p-4 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((category) => (
                  <DraggableRow key={category.id} category={category} />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      </div>
      {isPending && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Reordering...</div>
        </div>
      )}
    </div>
  );
}
