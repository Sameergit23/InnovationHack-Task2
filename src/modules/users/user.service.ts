import { store } from "../../store/memoryStore";
import { ApiError } from "../../lib/ApiError";
import { newId, now } from "../../lib/id";
import { User } from "../../types";
import { CreateUserInput, UpdateUserInput } from "./user.schema";

function assertEmailUnique(email: string, ignoreId?: string) {
  const clash = [...store.users.values()].find(
    (u) => u.email === email && u.id !== ignoreId
  );
  if (clash) throw ApiError.conflict(`A user with email "${email}" already exists`);
}

export const userService = {
  list(): User[] {
    return [...store.users.values()].sort((a, b) => a.name.localeCompare(b.name));
  },

  get(id: string): User {
    const user = store.users.get(id);
    if (!user) throw ApiError.notFound(`User ${id} not found`);
    return user;
  },

  create(input: CreateUserInput): User {
    assertEmailUnique(input.email);
    const timestamp = now();
    const user: User = { id: newId(), ...input, createdAt: timestamp, updatedAt: timestamp };
    store.users.set(user.id, user);
    return user;
  },

  update(id: string, input: UpdateUserInput): User {
    const user = this.get(id);
    if (input.email) assertEmailUnique(input.email, id);
    const updated: User = { ...user, ...input, updatedAt: now() };
    store.users.set(id, updated);
    return updated;
  },

  remove(id: string): void {
    this.get(id); // throws 404 if missing
    // Unassign this user from any tasks so we don't leave dangling references.
    for (const task of store.tasks.values()) {
      if (task.assigneeId === id) {
        store.tasks.set(task.id, { ...task, assigneeId: null, updatedAt: now() });
      }
    }
    // Remove from project member lists.
    for (const project of store.projects.values()) {
      if (project.members.includes(id)) {
        store.projects.set(project.id, {
          ...project,
          members: project.members.filter((m) => m !== id),
          updatedAt: now(),
        });
      }
    }
    store.users.delete(id);
  },
};
