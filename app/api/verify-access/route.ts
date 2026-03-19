export async function POST(request: Request) {
  const body = await request.json()
  const code: string = body?.code ?? ''

  const validCodes = (process.env.ACCESS_CODES ?? '')
    .split(',')
    .map(c => c.trim())
    .filter(Boolean)

  const valid = validCodes.length > 0 && validCodes.includes(code.trim())

  return Response.json({ valid })
}
