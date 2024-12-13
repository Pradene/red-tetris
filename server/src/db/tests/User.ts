import sequelize from "../index"
import User from "../models/User"
import bcrypt from "bcryptjs"

const testUserCreation = async () => {
	try {
		// Sync database (create tables if they don't exist)
		await sequelize.sync({ force: true }) // `force: true` drops existing tables
		console.log("Database synchronized.")

		// Hash password before saving
		const hashedPassword = await bcrypt.hash("securepassword", 10)

		// Create a new user
		const user = await User.create({
			username: "testuser",
			password: hashedPassword,
		})

		console.log("User created:", user.toJSON())
	} catch (error) {
		console.error("Error creating user:", error)
	} finally {
		await sequelize.close() // Close the database connection
	}
}

testUserCreation()
