import { NextResponse } from "next/server";
import { adminConfigured, isAdminRequest, listNotes } from "@/lib/stickies-store";

export const dynamic = "force-dynamic";

/**
 * Admin-only backup of the whole wall.
 *
 *   curl -fO -J https://www.nnisalasdesign.com/api/stickies/export \
 *     -H "Authorization: Bearer $STICKIES_ADMIN_TOKEN"
 *
 * Redis is the only copy of these notes, and nothing about a free-tier
 * store promises to keep them forever, so this exists to make taking a
 * copy a single command.
 *
 * This sits at a static path while sibling note ids are UUIDs, and Next
 * matches a static segment ahead of [id], so it cannot collide.
 */
export async function GET(req: Request) {
  // Said plainly rather than as a blanket 403: with no token set, no
  // request could ever succeed, so there is nothing to probe for and
  // knowing why saves a confusing debugging session.
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "No STICKIES_ADMIN_TOKEN is set on this deployment, so export is disabled." },
      { status: 503 }
    );
  }
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  try {
    const notes = await listNotes();
    const body = JSON.stringify(
      { exported: new Date().toISOString(), count: notes.length, notes },
      null,
      2
    );
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="stickies-${new Date().toISOString().slice(0, 10)}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[stickies] export failed", err);
    return NextResponse.json({ error: "Couldn't read the wall." }, { status: 500 });
  }
}
