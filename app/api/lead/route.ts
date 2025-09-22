import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));
    console.log('[lead]', data);
    // TODO: integrare CRM / email
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }
}
