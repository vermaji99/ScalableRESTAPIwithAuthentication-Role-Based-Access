import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const base = "http://localhost:4000/api/v1";

const rand = Math.random().toString(36).slice(2, 8);
const emailUser = `user_${rand}@example.com`;
const emailAdmin = `admin_${rand}@example.com`;
const password = "Str0ngPass!";

const assert = (cond, msg) => {
  if (!cond) {
    throw new Error(`ASSERTION FAILED: ${msg}`);
  }
};

async function http(method, path, body, token) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

async function main() {
  // Register normal user
  let r = await http("POST", "/auth/register", { email: emailUser, password });
  if (r.status !== 201) {
    console.error("Register user failed payload:", JSON.stringify(r.json));
  }
  assert(r.status === 201, `register user status ${r.status}`);

  // Login normal user
  r = await http("POST", "/auth/login", { email: emailUser, password });
  assert(r.status === 200, `login user status ${r.status}`);
  const tokenUser = r.json.data?.token;
  assert(tokenUser, "missing token for user");

  // Create a task as user
  r = await http("POST", "/tasks", { title: "Task A", description: "by user" }, tokenUser);
  assert(r.status === 201, `create task status ${r.status}`);
  const taskIdUser = r.json.data?.id;
  assert(taskIdUser, "missing created task id");

  // List tasks as user (should include own task)
  r = await http("GET", "/tasks", null, tokenUser);
  assert(r.status === 200, `list user tasks status ${r.status}`);
  const listUser = r.json.data || [];
  assert(listUser.find((t) => t.id === taskIdUser), "user task not in own list");

  // Register would-be admin
  r = await http("POST", "/auth/register", { email: emailAdmin, password });
  assert(r.status === 201, `register admin status ${r.status}`);

  // Promote to admin via Prisma (bootstrap)
  await prisma.user.update({ where: { email: emailAdmin }, data: { role: "admin" } });

  // Login admin
  r = await http("POST", "/auth/login", { email: emailAdmin, password });
  assert(r.status === 200, `login admin status ${r.status}`);
  const tokenAdmin = r.json.data?.token;
  assert(tokenAdmin, "missing token for admin");

  // Admin lists all users
  r = await http("GET", "/users", null, tokenAdmin);
  assert(r.status === 200, `admin list users status ${r.status}`);
  assert(Array.isArray(r.json.data), "admin list users not array");

  // Admin sees all tasks (should include user's task)
  r = await http("GET", "/tasks", null, tokenAdmin);
  assert(r.status === 200, `admin list tasks status ${r.status}`);
  const listAll = r.json.data || [];
  assert(listAll.find((t) => t.id === taskIdUser), "admin list missing user's task");

  // Create admin-owned task
  r = await http("POST", "/tasks", { title: "Task B", description: "by admin" }, tokenAdmin);
  assert(r.status === 201, `admin create task status ${r.status}`);
  const taskIdAdmin = r.json.data?.id;
  assert(taskIdAdmin, "missing admin task id");

  // Try to fetch admin task as user (should be forbidden)
  r = await http("GET", `/tasks/${taskIdAdmin}`, null, tokenUser);
  assert(r.status === 403, `user reading admin task should be 403, got ${r.status}`);

  // Cleanup: delete tasks as admin
  await http("DELETE", `/tasks/${taskIdUser}`, null, tokenAdmin);
  await http("DELETE", `/tasks/${taskIdAdmin}`, null, tokenAdmin);

  console.log("SMOKE TEST PASSED");
}

main()
  .catch((e) => {
    console.error("SMOKE TEST FAILED:", e.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
