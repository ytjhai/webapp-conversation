import { type NextRequest } from 'next/server'

const PPID_DECODER_URL = process.env.PPID_DECODER_URL
const PPID_DECODER_API_KEY = process.env.PPID_DECODER_API_KEY

export interface PPIDDecoderResponse {
  success: boolean
  userId?: string
  error?: string
}

export async function decodePPID(ppid: string): Promise<PPIDDecoderResponse> {
  if (!PPID_DECODER_URL || !PPID_DECODER_API_KEY) {
    console.error('PPID decoder configuration missing')
    return { success: false, error: 'PPID decoder not configured' }
  }

  try {
    const response = await fetch(PPID_DECODER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PPID_DECODER_API_KEY}`,
      },
      body: JSON.stringify({ ppid }),
    })

    if (!response.ok) {
      return { success: false, error: `Decoder returned ${response.status}` }
    }

    const data = await response.json()
    
    if (data.userId) {
      return { success: true, userId: data.userId }
    }

    return { success: false, error: 'No userId in response' }
  } catch (error) {
    console.error('PPID decode error:', error)
    return { success: false, error: 'Failed to decode PPID' }
  }
}

export async function extractPPIDFromRequest(request: NextRequest): Promise<string | null> {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  
  if (token) {
    return token
  }
  
  const ppidCookie = request.cookies.get('ppid')?.value
  return ppidCookie || null
}