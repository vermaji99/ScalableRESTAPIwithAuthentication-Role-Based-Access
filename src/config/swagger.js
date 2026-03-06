import swaggerUi from "swagger-ui-express";
const version = process.env.npm_package_version || "1.0.0";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Express Prisma API",
    version,
    description: "API with JWT auth, RBAC, tasks CRUD"
  },
  servers: [{ url: "/api/v1" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["admin", "user"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["todo", "in_progress", "done"] },
          dueDate: { type: "string", format: "date-time", nullable: true },
          ownerId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": {
      post: {
        tags: ["auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: { "201": { description: "Created" }, "400": { description: "Bad Request" } }
      }
    },
    "/auth/login": {
      post: {
        tags: ["auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } }
      }
    },
    "/tasks": {
      get: {
        tags: ["tasks"],
        responses: { "200": { description: "OK" } }
      },
      post: {
        tags: ["tasks"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["todo", "in_progress", "done"] },
                  dueDate: { type: "string", format: "date-time", nullable: true }
                },
                required: ["title"]
              }
            }
          }
        },
        responses: { "201": { description: "Created" } }
      }
    },
    "/tasks/{id}": {
      get: {
        tags: ["tasks"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not Found" } }
      },
      patch: {
        tags: ["tasks"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["todo", "in_progress", "done"] },
                  dueDate: { type: "string", format: "date-time", nullable: true }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      },
      put: {
        tags: ["tasks"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["todo", "in_progress", "done"] },
                  dueDate: { type: "string", format: "date-time", nullable: true }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      },
      delete: {
        tags: ["tasks"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "204": { description: "No Content" } }
      }
    },
    "/users": {
      get: {
        tags: ["admin"],
        responses: { "200": { description: "OK" }, "403": { description: "Forbidden" } }
      }
    }
  }
};

export const setupSwagger = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
};
