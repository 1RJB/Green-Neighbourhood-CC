module.exports = (sequelize, DataTypes) => {
    const Redemption = sequelize.define('Redemption', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rewardId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        redeemedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'redemptions',
    });

    Redemption.associate = (models) => {
        Redemption.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        Redemption.belongsTo(models.Reward, { 
            foreignKey: 'rewardId',
            as: 'reward'
        });
    };

    return Redemption;
};
