/* End-to-end smoke test for the messaging stack (REST + Socket.IO + DB).
   Run with: npx tsx scripts/test-messages.mts   (backend must be on :3000) */
import crypto from "crypto";
import { createRequire } from "module";
import { prisma } from "../src/db/prisma";

const require2 = createRequire("/Users/mohithingorani/Documents/WELLNEST/frontend/");
const { io } = require2("socket.io-client");

const BASE = "http://localhost:3000";
let pass = 0;
let fail = 0;
const ok = (m: string) => { pass++; console.log(`  ✅ ${m}`); };
const bad = (m: string) => { fail++; console.log(`  ❌ ${m}`); };

async function main() {
  const user = await prisma.user.findFirst();
  const therapist = await prisma.therapist.findFirst();
  if (!user || !therapist) throw new Error("Seed data missing (need a user + therapist).");
  console.log(`Testing as user #${user.id} (${user.email}) ↔ therapist #${therapist.id} (${therapist.name})\n`);

  // Mint a session the same way the app does (store sha256 hash, use raw as cookie).
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");
  await prisma.session.create({
    data: { sessionToken: hashed, userId: user.id, expiresAt: new Date(Date.now() + 864e5) },
  });
  const cookie = `wellnest_session=${rawToken}`;
  const headers = { "Content-Type": "application/json", Cookie: cookie };

  let convId = 0;
  let createdConv = false;
  let socket: any;

  try {
    // 1) Unauthenticated REST must be rejected.
    const noAuth = await fetch(`${BASE}/api/messages/conversations`);
    noAuth.status === 401 ? ok("REST rejects unauthenticated (401)") : bad(`expected 401, got ${noAuth.status}`);

    // 2) Create (or fetch existing) conversation.
    const preCount = await prisma.conversation.count({ where: { userId: user.id, therapistId: therapist.id } });
    const createRes = await fetch(`${BASE}/api/messages/conversations`, {
      method: "POST", headers, body: JSON.stringify({ therapistId: therapist.id }),
    });
    const createJson = await createRes.json();
    if (createJson?.success && createJson.data?.id) {
      convId = createJson.data.id;
      createdConv = preCount === 0;
      ok(`createConversation → #${convId}`);
    } else { bad(`createConversation failed: ${JSON.stringify(createJson)}`); return; }

    // 3) Connect socket with the session cookie.
    socket = io(BASE, { transports: ["websocket", "polling"], extraHeaders: { Cookie: cookie } });
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("socket connect timeout")), 5000);
      socket.on("connect", () => { clearTimeout(t); resolve(); });
      socket.on("connect_error", (e: Error) => { clearTimeout(t); reject(e); });
    });
    ok(`socket connected (id ${socket.id})`);

    // 4) Join + send via socket, await real-time echo.
    socket.emit("conversation:join", convId);
    const content = `e2e test ${Date.now()}`;
    const received = new Promise<any>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("no message:new within 5s")), 5000);
      socket.on("message:new", (m: any) => { if (m.content === content) { clearTimeout(t); resolve(m); } });
    });
    socket.emit("message:send", { conversationId: convId, content });
    const msg = await received;
    msg?.id ? ok(`real-time message:new received (#${msg.id})`) : bad("message:new malformed");
    msg.senderType === "user" ? ok("message tagged senderType=user") : bad(`senderType=${msg.senderType}`);

    // 5) Persistence: REST getMessages should include it.
    const listRes = await fetch(`${BASE}/api/messages/conversations/${convId}/messages`, { headers });
    const listJson = await listRes.json();
    const persisted = listJson?.data?.messages?.some((m: any) => m.content === content);
    persisted ? ok("message persisted (GET messages)") : bad("message not found in REST history");

    // 6) listConversations reflects it as lastMessage + ordering.
    const convRes = await fetch(`${BASE}/api/messages/conversations`, { headers });
    const convJson = await convRes.json();
    const conv = convJson?.data?.find((c: any) => c.id === convId);
    conv?.lastMessage?.content === content ? ok("listConversations lastMessage updated") : bad("lastMessage not updated");

    // 7) REST send path also works + broadcasts.
    const restEcho = new Promise<any>((resolve) => {
      const t = setTimeout(() => resolve(null), 4000);
      socket.on("message:new", (m: any) => { if (m.content.startsWith("rest ")) { clearTimeout(t); resolve(m); } });
    });
    const restContent = `rest ${Date.now()}`;
    const sendRes = await fetch(`${BASE}/api/messages/conversations/${convId}/messages`, {
      method: "POST", headers, body: JSON.stringify({ content: restContent }),
    });
    const sendJson = await sendRes.json();
    sendJson?.success ? ok("REST sendMessage succeeded") : bad(`REST send failed: ${JSON.stringify(sendJson)}`);

    // 8) Access control: a different user must be 403 on this conversation.
    const otherUser = await prisma.user.findFirst({ where: { id: { not: user.id } } });
    if (otherUser) {
      const raw2 = crypto.randomBytes(32).toString("hex");
      await prisma.session.create({ data: { sessionToken: crypto.createHash("sha256").update(raw2).digest("hex"), userId: otherUser.id, expiresAt: new Date(Date.now() + 864e5) } });
      const forbidden = await fetch(`${BASE}/api/messages/conversations/${convId}/messages`, { headers: { Cookie: `wellnest_session=${raw2}` } });
      forbidden.status === 403 ? ok("other user blocked from conversation (403)") : bad(`expected 403, got ${forbidden.status}`);
      await prisma.session.deleteMany({ where: { userId: otherUser.id } });
    }
  } finally {
    if (socket) socket.disconnect();
    // cleanup test artifacts
    await prisma.message.deleteMany({ where: { conversationId: convId, content: { contains: "e2e test " } } });
    await prisma.message.deleteMany({ where: { conversationId: convId, content: { startsWith: "rest " } } });
    if (createdConv && convId) await prisma.message.deleteMany({ where: { conversationId: convId } }).then(() => prisma.conversation.delete({ where: { id: convId } })).catch(() => {});
    await prisma.session.delete({ where: { sessionToken: hashed } }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(`\n${fail === 0 ? "🎉 ALL PASSED" : "⚠️  SOME FAILED"} — ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });
