// OpenAPI 3.0 specification for the Users, Projects & Tasks API.
// Served interactively via Swagger UI at GET /api/docs and as raw JSON at
// GET /api/openapi.json. This doubles as the Task 2 API documentation.

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Users, Projects & Tasks API",
    version: "1.0.0",
    description:
      "REST API powering user, project and task data for the DevBoard dashboard. Built for Task 2 of the Innovation Hacks Full Stack Internship.",
  },
  servers: [{ url: "/api", description: "API root" }],
  tags: [
    { name: "Health" },
    { name: "Users" },
    { name: "Projects" },
    { name: "Tasks" },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "u1" },
          name: { type: "string", example: "Saim Rehman" },
          email: { type: "string", format: "email", example: "saim@devboard.dev" },
          role: { type: "string", example: "Full Stack Developer" },
          avatarColor: { type: "string", example: "#6366f1" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string", example: "p1" },
          name: { type: "string", example: "Atlas Design System" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "on-hold", "completed"] },
          members: { type: "array", items: { type: "string" }, example: ["u1", "u2"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string", example: "t1" },
          title: { type: "string", example: "Ship Button primitives" },
          description: { type: "string" },
          projectId: { type: "string", example: "p1" },
          assigneeId: { type: "string", nullable: true, example: "u2" },
          status: { type: "string", enum: ["todo", "in-progress", "done"] },
          priority: { type: "string", enum: ["low", "medium", "high"] },
          dueDate: { type: "string", nullable: true, example: "2026-08-24" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              message: { type: "string" },
              details: { type: "array", items: { type: "object" } },
            },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: { "200": { description: "Service is healthy" } },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        responses: { "200": { description: "Array of users" } },
      },
      post: {
        tags: ["Users"],
        summary: "Create a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  role: { type: "string" },
                  avatarColor: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User created" },
          "409": { description: "Email already exists", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "422": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/users/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: { tags: ["Users"], summary: "Get a user by id", responses: { "200": { description: "The user" }, "404": { description: "Not found" } } },
      put: { tags: ["Users"], summary: "Update a user", responses: { "200": { description: "Updated user" }, "404": { description: "Not found" }, "422": { description: "Validation failed" } } },
      delete: { tags: ["Users"], summary: "Delete a user", responses: { "204": { description: "Deleted" }, "404": { description: "Not found" } } },
    },
    "/projects": {
      get: {
        tags: ["Projects"],
        summary: "List projects",
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "on-hold", "completed"] } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: { "200": { description: "Array of projects" } },
      },
      post: {
        tags: ["Projects"],
        summary: "Create a project",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["active", "on-hold", "completed"] },
                  members: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Project created" }, "422": { description: "Validation failed" } },
      },
    },
    "/projects/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: { tags: ["Projects"], summary: "Get a project by id", responses: { "200": { description: "The project" }, "404": { description: "Not found" } } },
      put: { tags: ["Projects"], summary: "Update a project", responses: { "200": { description: "Updated project" }, "404": { description: "Not found" } } },
      delete: { tags: ["Projects"], summary: "Delete a project (cascades to its tasks)", responses: { "204": { description: "Deleted" }, "404": { description: "Not found" } } },
    },
    "/projects/{id}/tasks": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: { tags: ["Projects"], summary: "List tasks for a project", responses: { "200": { description: "Array of tasks" }, "404": { description: "Project not found" } } },
    },
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List tasks",
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["todo", "in-progress", "done"] } },
          { name: "priority", in: "query", schema: { type: "string", enum: ["low", "medium", "high"] } },
          { name: "projectId", in: "query", schema: { type: "string" } },
          { name: "assigneeId", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: { "200": { description: "Array of tasks" } },
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "projectId"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  projectId: { type: "string" },
                  assigneeId: { type: "string", nullable: true },
                  status: { type: "string", enum: ["todo", "in-progress", "done"] },
                  priority: { type: "string", enum: ["low", "medium", "high"] },
                  dueDate: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Task created" }, "422": { description: "Validation failed / bad reference" } },
      },
    },
    "/tasks/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: { tags: ["Tasks"], summary: "Get a task by id", responses: { "200": { description: "The task" }, "404": { description: "Not found" } } },
      put: { tags: ["Tasks"], summary: "Update a task", responses: { "200": { description: "Updated task" }, "404": { description: "Not found" } } },
      delete: { tags: ["Tasks"], summary: "Delete a task", responses: { "204": { description: "Deleted" }, "404": { description: "Not found" } } },
    },
    "/tasks/{id}/status": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      patch: {
        tags: ["Tasks"],
        summary: "Update a task's status",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: { status: { type: "string", enum: ["todo", "in-progress", "done"] } },
              },
            },
          },
        },
        responses: { "200": { description: "Updated task" }, "404": { description: "Not found" }, "422": { description: "Validation failed" } },
      },
    },
  },
} as const;
