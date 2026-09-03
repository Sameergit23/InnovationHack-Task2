import { store } from "../../store/memoryStore";
import { ApiError } from "../../lib/ApiError";
import { newId, now } from "../../lib/id";
import { Project, Task } from "../../types";
import { CreateProjectInput, ListProjectsQuery, UpdateProjectInput } from "./project.schema";

// Validates that every referenced member id maps to a real user.
function assertMembersExist(members: string[]) {
  const missing = members.filter((id) => !store.users.has(id));
  if (missing.length > 0) {
    throw ApiError.unprocessable("Some member ids do not reference existing users", {
      missing,
    });
  }
}

export const projectService = {
  list(query: ListProjectsQuery): Project[] {
    let items = [...store.projects.values()];
    if (query.status) items = items.filter((p) => p.status === query.status);
    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return items.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  },

  get(id: string): Project {
    const project = store.projects.get(id);
    if (!project) throw ApiError.notFound(`Project ${id} not found`);
    return project;
  },

  tasksOf(id: string): Task[] {
    this.get(id); // ensure the project exists (404 otherwise)
    return [...store.tasks.values()].filter((t) => t.projectId === id);
  },

  create(input: CreateProjectInput): Project {
    assertMembersExist(input.members);
    const timestamp = now();
    const project: Project = { id: newId(), ...input, createdAt: timestamp, updatedAt: timestamp };
    store.projects.set(project.id, project);
    return project;
  },

  update(id: string, input: UpdateProjectInput): Project {
    const project = this.get(id);
    if (input.members) assertMembersExist(input.members);
    const updated: Project = { ...project, ...input, updatedAt: now() };
    store.projects.set(id, updated);
    return updated;
  },

  remove(id: string): void {
    this.get(id);
    // Cascade: deleting a project deletes its tasks.
    for (const task of store.tasks.values()) {
      if (task.projectId === id) store.tasks.delete(task.id);
    }
    store.projects.delete(id);
  },
};
