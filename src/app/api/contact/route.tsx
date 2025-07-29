// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/business/contacts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ error, message: 'Failed to submit to backend' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Submitted to Django successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', detail: error }, { status: 500 });
  }
}
