import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs"

import { generateAccessToken, generateRefreshToken, TokenPayload, verifyToken } from "../../utils/auth"

import User from "../../db/models/User"

const router = express.Router()

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

		const payload: TokenPayload = {
			id: user.id,
			username: user.username
		}

		const accessToken = generateAccessToken(payload)
		const refreshToken = generateRefreshToken(payload)

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 1000 * 60 * 15
		})

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 1000 * 60 * 60 * 24 * 7
		})

		res.json({
			message: "Login successfully",
			user: {
				id: user.id,
				username: user.username
			}
		})

	} catch (error: any) {
		console.error("Error during login", error)
		res.status(500).json({ message: "Internal Server Error" })
	}
})

router.post("/logout",
	async (req: Request, res: Response) => {
		res.clearCookie("accessToken")
		res.clearCookie("refreshToken")

		res.status(200).json({ message: "Logged out successfully"})
	}
)

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
router.get("/token", (req: Request, res: Response) => {
	const token = req.cookies?.refreshToken
	if(!token) {
		res.status(400).json({ message: "Refresh token is required" })
		return
	}

	const payload = verifyToken(token)
	if (!payload) {
		res.status(403).json({ message: "Invalid refresh token" })
		return
	}

	const currenttime = Date.now() / 1000
	const tokenExp = payload.exp || 0
	const timeUntilExp = tokenExp - currenttime

	if (timeUntilExp < 0) {
		res.status(401).json({ message: "Unauthorizes" })
		return
	}

	const accessToken = generateAccessToken(payload)
	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 1000 * 60 * 15
	})

	res.json({
		message: "Token refreshed",
		user: {
			id: payload.id,
			username: payload.username
		}
	})
})

export default router