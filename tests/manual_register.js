const base = "http://localhost:4000/api/v1";

(async () => {
  const email = `user_${Date.now()}@example.com`;
  const res = await fetch(`${base}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "Str0ngPass!" })
  });
  const text = await res.text();
  console.log("status:", res.status);
  console.log(text);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
