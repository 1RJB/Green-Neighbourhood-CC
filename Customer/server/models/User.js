// models/user.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(10), // Adjust data type as necessary
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATEONLY, // DATEONLY for storing only date without time
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      usertype: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      tableName: "users",
      timestamps: true, // Example: to include timestamps for createdAt and updatedAt
    }
  );
  return User;
};
