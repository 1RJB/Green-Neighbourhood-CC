// models/ForgotOTP.js
module.exports = (sequelize, DataTypes) => {
    const ForgotOTP = sequelize.define(
      "ForgotOTP",
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
        tableName: "forgot_otps",
        timestamps: false,
      }
    );
  
    return ForgotOTP;
  };
  