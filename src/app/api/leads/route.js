import { NextResponse } from 'next/server';
import { createSimpleCrmLead, isSimpleCrmConfigured } from '@/lib/simplecrm';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Dono formats handle karne ke liye (direct body ho ya body.form ho)
    const form = body.form || body;
    const nameValue = form?.fullName || form?.name || body?.fullName || body?.name;
    const phoneValue = form?.phone || body?.phone;

    // 1. Basic validation
    if (!nameValue || !phoneValue) {
      return NextResponse.json(
        { success: false, message: 'Name and phone are required.' },
        { status: 400 }
      );
    }

    // Normalize form object
    const normalizedForm = { 
      ...form, 
      name: nameValue,
      fullName: nameValue,
      phone: phoneValue 
    };

    const ctx = {
      form: normalizedForm,
      campaign: body.campaign || {},
      meta: body.meta || { pageUrl: request.headers.get('referer') || '' },
    };

    const leadData = body.lead || {
      unitnameC: 'Motherhood_Hospital_General',
      websiteCode: 'MHVLP'
    };

    // 2. Mock Mode Check
    const isMock = process.env.NEXT_PUBLIC_LEAD_MOCK === 'true' || process.env.NEXT_PUBLIC_LEAD_PROXY === 'true';
    if (isMock) {
      return NextResponse.json(
        { success: true, message: 'Lead submitted successfully (Mock Mode)', requestId: 'MOCK1234' },
        { status: 200 }
      );
    }

    // 3. Forward to SimpleCRM
    if (isSimpleCrmConfigured()) {
      try {
        const result = await createSimpleCrmLead(ctx, leadData);
        return NextResponse.json(
          { success: true, message: 'Lead submitted and forwarded to CRM successfully', requestId: result.requestId },
          { status: 200 }
        );
      } catch (err) {
        console.error('SimpleCRM Error:', err);
        return NextResponse.json(
          { success: false, message: err.message || 'Failed to send lead to CRM server.' },
          { status: 502 }
        );
      }
    }

    // Default Success Response if CRM credentials are not yet added in .env
    return NextResponse.json(
      { success: true, message: 'Lead submitted successfully', requestId: 'DEF1234' },
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