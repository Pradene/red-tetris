import { DataTypes, Model } from "sequelize"
import sequelize from "../index" // Assumes a configured Sequelize instance

class User extends Model {
  public id!: number
  public username!: string
  public password!: string

  // Timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [3, 20], // Min 3, Max 20 characters
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    tableName: "users",
    modelName: "User",
  }
)

export default User