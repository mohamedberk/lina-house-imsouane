import { NextResponse } from 'next/server'

type StepResult = {
  step: string
  ok: boolean
  status: number
  body: any
}

async function runStep(step: string, path: string, origin: string): Promise<StepResult> {
  try {
    const res = await fetch(`${origin}${path}`, { cache: 'no-store' })
    const body = await res.json().catch(() => ({}))
    return { step, ok: res.ok, status: res.status, body }
  } catch (err: any) {
    return {
      step,
      ok: false,
      status: 0,
      body: { success: false, error: err.message },
    }
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = `${url.protocol}//${url.host}`

  // Order matters: rooms/packages/activities must exist before the homepage
  // endpoint can link them into the featured* relationships.
  const rooms = await runStep('rooms', '/api/seed/rooms', origin)
  const packages = await runStep('packages', '/api/seed/packages', origin)
  const activities = await runStep('activities', '/api/seed/activities', origin)
  const homepage = await runStep('homepage', '/api/seed/homepage', origin)
  const pages = await runStep('pages', '/api/seed/pages', origin)

  const steps = [rooms, packages, activities, homepage, pages]
  const allOk = steps.every((s) => s.ok)

  return NextResponse.json({
    success: allOk,
    message: allOk
      ? 'All seeds completed'
      : 'Some steps failed or skipped — see results below',
    results: steps,
  })
}
