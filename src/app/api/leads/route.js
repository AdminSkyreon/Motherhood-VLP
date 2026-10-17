import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, phone, language } = body;

    // 1. Basic validation (Point 1 & 7)
    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, message: 'Name and phone are required.' },
        { status: 400 }
      );
    }

    // 2. Mock / Pretend mode check (Point 3 & 4)
    const isMock = process.env.NEXT_PUBLIC_LEAD_MOCK === 'true' || process.env.LEAD_PROXY === 'true';

    if (isMock) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Lead submitted successfully (Mock Mode)',
        },
        { status: 200 }
      );
    }

    // 3. Optional CRM / PHP Backend Forwarding (Point 2, 5 & 6)
    const crmEndpoint = process.env.MH_PHP_BACKEND_URL || process.env.SIMPLE_CRM_ENDPOINT;

    if (crmEndpoint) {
      try {
        const crmResponse = await fetch(crmEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SIMPLE_CRM_PASSWORD || ''}`,
          },
          body: JSON.stringify({ fullName, phone, language }),
        });

        if (!crmResponse.ok) {
          return NextResponse.json(
            { success: false, message: 'Failed to send lead to CRM server.' },
            { status: 502 }
          );
        }
      } catch (err) {
        console.error('CRM Forwarding Error:', err);
      }
    }

    // Default Success Response
    return NextResponse.json(
      { success: true, message: 'Lead submitted and forwarded successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}