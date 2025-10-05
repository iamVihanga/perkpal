// Example usage of DraggableDataTable with different data types

import { DraggableDataTable } from "@/components/table/draggable-data-table";
import { ColumnDef } from "@tanstack/react-table";

// Example 1: Tasks/Todo items
interface Task {
  id: string;
  title: string;
  priority: number;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
}

const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Task Title"
  },
  {
    accessorKey: "priority",
    header: "Priority"
  },
  {
    accessorKey: "status",
    header: "Status"
  }
];

function TasksTable({
  tasks,
  onReorderTasks,
  isReordering
}: {
  tasks: Task[];
  onReorderTasks: (tasks: Task[]) => void;
  isReordering: boolean;
}) {
  return (
    <DraggableDataTable
      columns={taskColumns}
      data={tasks}
      totalItems={tasks.length}
      onReorder={onReorderTasks}
      getItemId={(task) => task.id}
      isReordering={isReordering}
    />
  );
}

// Example 2: Menu items
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  displayOrder: number;
}

const menuColumns: ColumnDef<MenuItem>[] = [
  {
    accessorKey: "name",
    header: "Item Name"
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.getValue("price")}`
  },
  {
    accessorKey: "category",
    header: "Category"
  }
];

function MenuTable({
  menuItems,
  onReorderMenu,
  isReordering
}: {
  menuItems: MenuItem[];
  onReorderMenu: (items: MenuItem[]) => void;
  isReordering: boolean;
}) {
  return (
    <DraggableDataTable
      columns={menuColumns}
      data={menuItems}
      totalItems={menuItems.length}
      onReorder={onReorderMenu}
      getItemId={(item) => item.id}
      isReordering={isReordering}
    />
  );
}

// Example 3: Team members
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  joinDate: Date;
}

const teamColumns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "role",
    header: "Role"
  },
  {
    accessorKey: "email",
    header: "Email"
  }
];

function TeamTable({
  members,
  onReorderTeam,
  isReordering
}: {
  members: TeamMember[];
  onReorderTeam: (members: TeamMember[]) => void;
  isReordering: boolean;
}) {
  return (
    <DraggableDataTable
      columns={teamColumns}
      data={members}
      totalItems={members.length}
      onReorder={onReorderTeam}
      getItemId={(member) => member.id}
      isReordering={isReordering}
    />
  );
}

export { TasksTable, MenuTable, TeamTable };
