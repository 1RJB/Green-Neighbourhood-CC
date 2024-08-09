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
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            birthday: {
                type: DataTypes.DATEONLY,
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
            points: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            }
        },
        {
            tableName: "users",
            timestamps: true,
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Redemption, { foreignKey: 'userId', as: 'redemptions' });
        User.belongsToMany(models.Achievement, {
          through: 'UserAchievements',
          as: 'achievements',
          foreignKey: 'userId',
          otherKey: 'achievementId'
        });
      };
      

    return User;
};
