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
        },
        collectBy: {
            type: DataTypes.DATE,
            defaultValue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Collected', 'Expired'),
            defaultValue: 'Pending',
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
