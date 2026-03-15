import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { docxBase64, filename } = (await req.json()) as {
      docxBase64: string
      filename: string
    }

    if (!docxBase64 || !filename) {
      return NextResponse.json({ error: 'Missing docxBase64 or filename' }, { status: 400 })
    }

    const buffer = Buffer.from(docxBase64, 'base64')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Download failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
