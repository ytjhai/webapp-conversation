import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client, decodePPID, getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  let user, sessionId
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  try {
    const decoded = token ? await decodePPID(token) : getInfo(request)
    user = decoded?.user
    user && !user.startsWith('user') && cookies().set('user_id', user)
    sessionId = decoded?.sessionId
    console.log('Decoded PPID info: ', decoded)
  }
  catch (error) {
    const cookieInfo = getInfo(request)
    user = cookieInfo.user
    sessionId = cookieInfo.sessionId
  }
  try {
    const { data }: any = await client.getConversations(user)
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  }
  catch (error: any) {
    return NextResponse.json({
      data: [],
      error: error.message,
    })
  }
}
