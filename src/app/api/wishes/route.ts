import { connection } from "next/server";
import { redis } from "@/lib/redis";

export type Wish = {
  id: string;
  name: string;
  message: string;
  ts: number;
};

const unavailable = () =>
  Response.json(
    { error: "The wishes wall isn't connected to its database yet." },
    { status: 503 },
  );

export async function GET() {
  await connection();
  if (!redis) return unavailable();
  const wishes = await redis.lrange<Wish>("wishes", 0, 59);
  return Response.json({ wishes });
}

export async function POST(request: Request) {
  if (!redis) return unavailable();

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rlKey = `rl:${ip}`;
  const hits = await redis.incr(rlKey);
  if (hits === 1) await redis.expire(rlKey, 3600);
  if (hits > 6) {
    return Response.json(
      { error: "You've sent a lot of replies in the last hour. Try again a little later." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "That reply couldn't be read. Refresh and try again." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 60);
  const message = String(body.message ?? "").trim().slice(0, 280);
  const attending = body.attending !== false;
  const guests = Math.min(10, Math.max(1, Number(body.guests) || 1));
  const excuse = String(body.excuse ?? "").trim().slice(0, 200);

  if (!name) return Response.json({ error: "Add your name so the families know who's coming." }, { status: 400 });
  if (!attending && !excuse) {
    return Response.json({ error: "Every excuse is accepted, but we do need one." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const ts = Date.now();

  await redis.lpush("rsvps", { id, name, attending, guests: attending ? guests : 0, excuse: attending ? "" : excuse, message, ts });

  let wish: Wish | null = null;
  if (message) {
    wish = { id, name, message, ts };
    await redis.lpush("wishes", wish);
    await redis.ltrim("wishes", 0, 499);
  }

  return Response.json({ ok: true, wish });
}
