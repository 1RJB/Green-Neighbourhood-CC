module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define("Reward", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageFile: {
            type: DataTypes.STRING(20)
        }
    }, {
        tableName: 'rewards'
    });

    Reward.associate = (models) => {
        Reward.belongsTo(models.Customer, {
            foreignKey: "customerId",
            as: 'customer'
        });
        Reward.hasMany(models.Redemption, {
            foreignKey: 'rewardId'
        });
    };

    return Reward;
}
