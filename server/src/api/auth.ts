import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs"

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth"

import User from "../db/models/User"

const router = express.Router()

router.get("/hello", (req: Request, res: Response) => {
  res.json({message: "Hello World"})
})

// Login route
router.post("/login",
  body("username")
    .trim()
    .isLength({ min: 3, max: 20})
    .isAlphanumeric()
    .escape(),
  body("password").trim().escape(),
  async (req: Request, res: Response) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.error("Error during validation", errors)
    res.status(400).json({ errors: errors.array() })
    return
  }

  const { username, password } = req.body

  try {
    const user = await User.findOne({ where: { username: username }})
    if (!user) {
      res.status(400).json({ message: "User doesn't exist" })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (isPasswordValid === false) {
      res.status(400).json({ message: "Password is not valid "})
      return
    }

    const accesToken = generateAccessToken(user.id, user.username)
    const refreshToken = generateRefreshToken(user.id, user.username)

    res.json({ message: "Login successfully", accesToken, refreshToken })

  } catch (error: any) {
    console.error("Error during login", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// Register route
router.post("/register",
  body("username")
    .trim()
    .isLength({ min: 3, max: 20})
    .isAlphanumeric()
    .escape(),
  body("password"),
  async (req: Request, res: Response) => {
  
  console.log(req.body)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.error("Error during validation", errors)
    res.status(400).json({ errors: errors.array() })
    return
  }

  const { username, password } = req.body

  try {
    const existingUser = await User.findOne({ where: { username: username }})
    if (existingUser) {
      res.status(400).json({ message: "Username already taken"})
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ 
      username: username,
      password: hashedPassword
    })

    res.status(201).json({ 
      message: "User register successfully", 
      user: {
        id: user.id,
        username: user.username
      }
    })

  } catch (error: any) {
    console.error("Error during registration", error)
    
    if (error.name === "SequelizeValidateError") {
      res.status(400).json({ message: "Invalid data", details: error.errors })
      return
    }

    res.status(500).json({ message: "Internal Server Error" })
  }
})

// Refresh token route
router.post("/refresh", (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if(!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" })
    return
  }

  const payload = verifyRefreshToken(refreshToken)
  if (!payload) {
    res.status(403).json({ message: "Invalid refresh token" })
    return
  }

  // const newAccessToken = generateAccessToken()
  // res.json({ accessToken: newAccessToken })
})

export default router