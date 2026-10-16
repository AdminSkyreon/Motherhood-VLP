import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, language } = body;

    // Validation 
    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, message: 'Name and phone are required.' },
        { status: 400 }
      );
    }

    // Check Mock / Pretend Mode 
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

    // MH PHP Backend / SimpleCRM Forwarding Logic 
    const crmEndpoint = process.env.MH_PHP_BACKEND_URL || process.env.SIMPLE_CRM_ENDPOINT;

    if (crmEndpoint) {
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
    }

    return NextResponse.json(
      { success: true, message: 'Lead submitted and forwarded successfully' },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}