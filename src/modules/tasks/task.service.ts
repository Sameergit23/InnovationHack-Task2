import { store } from "../../store/memoryStore";
import { ApiError } from "../../lib/ApiError";
import { newId, now } from "../../lib/id";
import { Task, TaskStatus } from "../../types";
import { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "./task.schema";

// Referential integrity: a task must belong to a real project and, if it has
// an assignee, that assignee must be a real user.
function assertReferences(projectId?: string, assigneeId?: string | null) {
  if (projectId && !store.projects.has(projectId)) {
    throw ApiError.unprocessable(`projectId "${projectId}" does not reference an existing project`);
  }
  if (assigneeId && !store.users.has(assigneeId)) {
    throw ApiError.unprocessable(`assigneeId "${assigneeId}" does not reference an existing user`);
  }
}

export const taskService = {
  list(query: ListTasksQuery): Task[] {
    let items = [...store.tasks.values()];
    if (query.status) items = items.filter((t) => t.status === query.status);
    if (query.priority) items = items.filter((t) => t.priority === query.priority);
    if (query.projectId) items = items.filter((t) => t.projectId === query.projectId);
    if (query.assigneeId) items = items.filter((t) => t.assigneeId === query.assigneeId);
    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  get(id: string): Task {
    const task = store.tasks.get(id);
    if (!task) throw ApiError.notFound(`Task ${id} not found`);
    return task;
  },

  create(input: CreateTaskInput): Task {
    assertReferences(input.projectId, input.assigneeId);
    const timestamp = now();
    const task: Task = { id: newId(), ...input, createdAt: timestamp, updatedAt: timestamp };
    store.tasks.set(task.id, task);
    return task;
  },

  update(id: string, input: UpdateTaskInput): Task {
    const task = this.get(id);
    assertReferences(input.projectId, input.assigneeId);
    const updated: Task = { ...task, ...input, updatedAt: now() };
    store.tasks.set(id, updated);
    return updated;
  },

  // Dedicated status transition used by PATCH /tasks/:id/status.
  updateStatus(id: string, status: TaskStatus): Task {
    const task = this.get(id);
    const updated: Task = { ...task, status, updatedAt: now() };
    store.tasks.set(id, updated);
    return updated;
  },

  remove(id: string): void {
    this.get(id);
    store.tasks.delete(id);
  },
};
