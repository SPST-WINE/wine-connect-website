import { NextResponse } from "next/server";

// Se qualcuno chiama POST su /admin/wines/upload-image, reindirizziamo all'API corretta.
export async function POST(req: Request) {
  return NextResponse.redirect(
    new URL("/api/admin/wines/upload-image", req.url),
    307 // preserva metodo e body
  );
}

// Blocco eventuali GET/altro con 405
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
