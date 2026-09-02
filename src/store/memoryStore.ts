import { Project, Task, User } from "../types";
import { seedProjects, seedTasks, seedUsers } from "./seed";

// ---------------------------------------------------------------------------
// In-memory data store for Task 2.
//
// Each entity lives in a Map keyed by id. This is intentionally the *only*
// place that knows how data is stored, so Task 3 can replace these Maps with
// MongoDB collections without touching the services, controllers or routes.
// Data resets on restart, which is expected for this stage.
// ---------------------------------------------------------------------------

class MemoryStore {
  users = new Map<string, User>();
  projects = new Map<string, Project>();
  tasks = new Map<string, Task>();

  constructor() {
    this.reset();
  }

  reset() {
    this.users.clear();
    this.projects.clear();
    this.tasks.clear();
    seedUsers.forEach((u) => this.users.set(u.id, u));
    seedProjects.forEach((p) => this.projects.set(p.id, p));
    seedTasks.forEach((t) => this.tasks.set(t.id, t));
  }
}

export const store = new MemoryStore();
