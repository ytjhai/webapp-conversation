import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID, PPID_DECODER_API_KEY, PPID_DECODER_URL } from '@/config'

const userPrefix = `user_${APP_ID}:`

async function decodePPID(ppid: string): Promise<{ user: string; sessionId: string } | null> {
  if (!PPID_DECODER_URL || !PPID_DECODER_API_KEY) {
    console.error('PPID decoder environment variables not configured')
    return null
  }

  try {
    const response = await fetch(`${PPID_DECODER_URL}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PPID_DECODER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ppid })
    })

    if (!response.ok) {
      console.error('Failed to decode PPID:', response.statusText)
      return null
    }

    const data = await response.json()
    return {
      user: data.user_id || `${userPrefix}${ppid}`,
      sessionId: data.sessionId || ppid,
    }
  } catch (error) {
    console.error('Error decoding PPID:', error)
    return null
  }
}

export const getInfo = (request: NextRequest) => {
  // const { token } = await request.json()
  // let decodedInfo: any

  // if (token) {
  //   decodedInfo = await decodePPID(token)
  //   console.log('Decoded PPID successfully:', decodedInfo)
  // }

  const sessionId = request.cookies.get('session_id')?.value || v4()
  // Modify user here to call request.cookies
  // request.cookies user cookie is set after verifying PPID
  const user = request.cookies.get('user_id')?.value || `${userPrefix}${sessionId}`
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string, userId?: string) => {
  if (userId)
    return { 'Set-Cookie': `session_id=${sessionId}; user_id=${userId}` }
  else
    return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
