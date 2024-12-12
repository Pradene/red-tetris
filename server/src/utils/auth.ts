import jwt, { JwtPayload } from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = "access_secret"
const REFRESH_TOKEN_SECRET = "refresh_secret"
const ACCESS_TOKEN_EXPIRY = "15m"
const REFRESH_TOKEN_EXPIRY = "7d"

// Generate access token
export const generateAccessToken = (userId: number, username: string): string => {
  return jwt.sign({ id: userId, username: username }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })
}

// Generate refresh token
export const generateRefreshToken = (userId: number, username: string): string => {
  return jwt.sign({ id: userId, username: username }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  })
}

// Verify access token
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET)
  } catch {
    return null
  }
}

// Verify refresh token
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET)
  } catch {
    return null
  }
}