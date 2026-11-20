import { NextResponse } from "next/server";
import { deleteNote } from "@/lib/stickies-store";

export const dynamic = "force-dynamic";

/**
 * Deleting needs either the owner token handed back when the note was
 * created (kept in that visitor's browser) or the site owner's admin
 * token. Without one of the two this endpoint would let anyone empty the
 * wall.
 */
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const admin = process.env.STICKIES_ADMIN_TOKEN;
  const header = req.headers.get("authorization") ?? "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
  const isAdmin = Boolean(admin && bearer && bearer === admin);

  const ownerToken = req.headers.get("x-owner-token");

  try {
    const ok = await deleteNote(id, ownerToken, isAdmin);
    if (!ok) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[stickies] delete failed", err);
    return NextResponse.json({ error: "Couldn't delete that note." }, { status: 500 });
  }
}
