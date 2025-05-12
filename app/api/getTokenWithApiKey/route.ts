import { type NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

// Environment variables (ensure these are set in your .env.local or deployment environment)
const AUTHORIZED_IPAD_API_KEY = process.env.AUTHORIZED_IPAD_API_KEY
const JWT_SIGNING_SECRET = process.env.JWT_SIGNING_SECRET // This should be a strong, random string
const JWT_ISSUER = process.env.JWT_ISSUER || 'urn:jessi-frontend:issuer'
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'urn:jessi-ipad-app:audience'
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || '24h' // e.g., '2h', '7d'

type RequestPayload = {
  apiKey?: string
  email?: string
  fullName?: string
}

type TokenPayload = {
  email: string
  fullName?: string
  // You can add other standard claims or custom claims as needed
  // iat, exp, iss, aud will be handled by jose or set explicitly
}

export async function POST(request: NextRequest) {
  if (!AUTHORIZED_IPAD_API_KEY) {
    console.error('Server misconfiguration: AUTHORIZED_IPAD_API_KEY is not set.')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
  if (!JWT_SIGNING_SECRET) {
    console.error('Server misconfiguration: JWT_SIGNING_SECRET is not set.')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  let payload: RequestPayload
  try {
    payload = await request.json()
  }
  catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const { apiKey, email, fullName } = payload

  // 1. Verify API Key
  if (!apiKey || apiKey !== AUTHORIZED_IPAD_API_KEY)
    return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 })


  // 2. Validate required fields
  if (!email)
    return NextResponse.json({ error: 'Bad Request: Missing email' }, { status: 400 })

  // 3. Prepare JWT payload
  const tokenPayload: TokenPayload = { email }
  if (fullName)
    tokenPayload.fullName = fullName

  try {
    // We need to convert the plain string secret into a format jose can use (JWK or Uint8Array)
    // For HS256, a Uint8Array is simplest.
    const secretKey = new TextEncoder().encode(JWT_SIGNING_SECRET)

    // 4. Create and sign the JWT
    const jwt = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'HS256' }) // Deterministic algorithm
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime(JWT_EXPIRATION_TIME) // Set expiration (e.g., "2h", "7d")
      .sign(secretKey)

    return NextResponse.json({ token: jwt }, { status: 200 })
  }
  catch (error) {
    console.error('Error signing JWT:', error)
    return NextResponse.json({ error: 'Internal Server Error: Could not generate token' }, { status: 500 })
  }
}
