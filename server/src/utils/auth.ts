import jwt, { JwtPayload } from "jsonwebtoken"

const ACCESS_TOKEN_EXPIRY = "15m"
const REFRESH_TOKEN_EXPIRY = "7d"

export interface TokenPayload {
  userId: number,
  username: string,
  exp?: number,
  iat?: number
}

// Generate access token
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign({ id: payload.userId, username: payload.username }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })
}

// Generate refresh token
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign({ id: payload.userId, username: payload.username }, process.env.JWT_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  })
}

// Verify access token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
    
  } catch {
    return null
  }
}