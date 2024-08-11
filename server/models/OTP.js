// models/OTP.js
module.exports = (sequelize, DataTypes) => {
    const OTP = sequelize.define(
      "OTP",
      {
        email: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        otp: {
          type: DataTypes.STRING(6), // 6 digits OTP
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        tableName: "otps",
        timestamps: false,
      }
    );
  
    return OTP;
  };
  