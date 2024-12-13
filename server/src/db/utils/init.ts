import sequelize from "../index"

const initializeDb = async () => {
	try {
		await sequelize.authenticate() // Check the database connection
		console.log("Database connection established.")

		await sequelize.sync({ force: true }) // Use `{ force: true }` to drop and recreate tables
		console.log("Database synced successfully.")

	} catch (error) {
		console.error("Error initializing the database:", error)
	}
}

export default initializeDb