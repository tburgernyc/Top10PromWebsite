import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, createServerActionClient } from '@/lib/supabase'

/**
 * Build a cookie adapter compatible with createServerActionClient
 * using the read-only cookies from an incoming NextRequest.
 */
function getRequestCookieAdapter(req: NextRequest) {
  return {
    get: (name: string) => {
      const cookie = req.cookies.get(name)
      return cookie ? { value: cookie.value } : undefined
    },
    set: () => {}, // read-only in route handler context
    delete: () => {},
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { occasion, date, time, store_id, name, email, phone, notes } = body

    // Validate required fields
    if (!occasion || !date || !time || !store_id || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the current user (optional — guests can book too)
    const authClient = createServerActionClient(getRequestCookieAdapter(req))
    const { data: { user } } = await authClient.auth.getUser()

    // Split name into first/last for the schema's separate columns
    const nameParts = String(name).trim().split(/\s+/)
    const firstName = nameParts[0] ?? name
    const lastName = nameParts.slice(1).join(' ') || null

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        customer_id: user?.id ?? null,     // schema column name
        occasion,
        appointment_date: date,
        appointment_time: time,
        store_id,
        first_name: firstName,             // schema column name
        last_name: lastName,               // schema column name
        guest_email: email,                // schema column name
        guest_phone: phone ?? null,        // schema column name
        special_requests: notes ?? null,   // schema column name
        status: 'confirmed',               // valid enum: confirmed | completed | cancelled | no_show
      })
      .select('id, occasion, appointment_date, appointment_time, store_name, status')
      .single()

    if (error) {
      console.error('Appointment insert error:', error.code, error.message)
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
    }

    return NextResponse.json({ success: true, appointment: data }, { status: 201 })
  } catch (error) {
    console.error('Appointments route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const authClient = createServerActionClient(getRequestCookieAdapter(req))
    const { data: { user } } = await authClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('id, occasion, appointment_date, appointment_time, store_name, store_id, party_size, status, special_requests')
      .eq('customer_id', user.id)
      .order('appointment_date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
    }

    return NextResponse.json({ appointments: data })
  } catch (error) {
    console.error('Appointments GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
