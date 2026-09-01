// Shared domain types. These mirror the shapes the Task 1 dashboard expects
// and that the Task 3 database layer will persist.

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ProjectStatus = "active" | "on-hold" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  members: string[]; // user ids
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // ISO date
  createdAt: string;
  updatedAt: string;
}
