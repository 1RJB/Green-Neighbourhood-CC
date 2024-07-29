module.exports = (sequelize, DataTypes) => {
    const Redemption = sequelize.define('Redemption', {
        customerId: {
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
    }, {
        tableName: 'redemptions',
    });

    Redemption.associate = (models) => {
        Redemption.belongsTo(models.Customer, { foreignKey: 'customerId' });
        Redemption.belongsTo(models.Reward, { foreignKey: 'rewardId' });
    };

    return Redemption;
};
