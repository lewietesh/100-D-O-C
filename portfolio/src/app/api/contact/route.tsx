// src/app/api/contact/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('📨 New contact form submission:', body);

  // TODO: Save to DB or send email here

  return NextResponse.json({ message: 'Form submitted successfully' }, { status: 200 });
}
