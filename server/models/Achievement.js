module.exports = (sequelize, DataTypes) => {
    const Achievement = sequelize.define("Achievement", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('first_redemption', 'first_event_registration', 'first_event_participation', 'first_volunteer', 'other'),
            allowNull: false
        },
        imageFile: {
            type: DataTypes.STRING(100)
        }
    }, {
        tableName: 'achievements'
    });

    Achievement.associate = (models) => {
        Achievement.belongsToMany(models.User, {
          through: 'UserAchievements',
          as: 'users',
          foreignKey: 'achievementId',
          otherKey: 'userId'
        });
      };      

    return Achievement;
};
