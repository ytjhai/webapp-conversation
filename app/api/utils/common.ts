import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID, PPID_DECODER_URL, PPID_DECODER_API_KEY } from '@/config'

const userPrefix = `user_${APP_ID}:`

// Helper: Decode PPID via external service
async function decodePPID(ppid: string): Promise<{ user: string; sessionId: string } | null> {
  if (!PPID_DECODER_URL || !PPID_DECODER_API_KEY) {
    console.warn('PPID decoder not configured, skipping PPID resolution')
    return null
  }

  try {
    const response = await fetch(PPID_DECODER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PPID_DECODER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ppid }),
    })

    if (!response.ok) {
      console.error('Failed to decode PPID:', response.statusText)
      return null
    }

    const data = await response.json()
    return {
      user: data.user_id || `${userPrefix}${ppid}`,
      sessionId: data.session_id || ppid,
    }
  }
  catch (error) {
    console.error('Error decoding PPID:', error)
    return null
  }
}

// Main: Unified user resolution (PPID → Session fallback)
export const getInfo = async (request: NextRequest) => {
  // Try PPID-based resolution first
  const ppid = request.nextUrl.searchParams.get('ppid')
  if (ppid) {
    const ppidResult = await decodePPID(ppid)
    if (ppidResult) {
      return ppidResult
    }
  }

  // Fallback to session-based resolution
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = userPrefix + sessionId
  return { sessionId, user }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
