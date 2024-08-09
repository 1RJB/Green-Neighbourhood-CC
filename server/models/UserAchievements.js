module.exports = (sequelize, DataTypes) => {
    const UserAchievements = sequelize.define("UserAchievements", {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      achievementId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'achievements',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      earnedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
    }, {
      tableName: 'UserAchievements',
      timestamps: false,
    });
  
    return UserAchievements;
  };
  