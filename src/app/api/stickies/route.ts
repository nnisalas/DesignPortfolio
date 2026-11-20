import { NextResponse } from "next/server";
import { addNote, isConfigured, isShared, listNotes, rateLimitOk, sanitise } from "@/lib/stickies-store";

// The wall must reflect writes immediately, so nothing here is cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(req: Request) {
  // ?diag=1 reports which Redis-ish variable NAMES this deployment can
  // see, and nothing else -- no values, ever. Connecting a store in the
  // dashboard does not tell you what it injected or into which
  // environment, and that is exactly what has to be confirmed here.
  if (new URL(req.url).searchParams.get("diag") === "1") {
    return NextResponse.json(
      {
        buildSawNames: Object.keys(process.env)
          .filter((k) => /REDIS|UPSTASH|^KV_/i.test(k))
          .sort(),
        shared: isShared(),
        nodeEnv: process.env.NODE_ENV,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const notes = await listNotes();
    return NextResponse.json(
      { notes, shared: isShared() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[stickies] list failed", err);
    return NextResponse.json({ error: "Couldn't load the wall." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // In production the dev file fallback is refused rather than attempted:
  // Vercel's filesystem is read-only, so writing would throw and surface
  // as an opaque 500. Until a Redis store is connected, say so plainly.
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "The wall isn't connected to its database yet — check back soon!" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const result = sanitise(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  try {
    if (!(await rateLimitOk(clientIp(req)))) {
      return NextResponse.json(
        { error: "That's a few notes in a row — try again in a little while." },
        { status: 429 }
      );
    }
    const ownerToken = await addNote(result.note);
    return NextResponse.json({ note: result.note, ownerToken }, { status: 201 });
  } catch (err) {
    console.error("[stickies] create failed", err);
    return NextResponse.json({ error: "Couldn't save your note." }, { status: 500 });
  }
}
