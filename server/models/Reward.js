module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define("Reward", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
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
        category: {
            type: DataTypes.ENUM('Vouchers', 'Gift_Cards', 'Health_And_Wellness', 'Workshops', 'Career_Development', 'Recognition', 'Others'),
            allowNull: false
        },
        maxEachRedeem: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maxTotalRedeem: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imageFile: {
            type: DataTypes.STRING(20)
        }
    },
        {
            tableName: 'rewards'
        });

    Reward.associate = (models) => {
        Reward.belongsTo(models.Staff, {
            foreignKey: "staffId",
            as: 'staff'
        });
        Reward.hasMany(models.Redemption, {
            foreignKey: 'rewardId',
            as: 'redemptions'
        });
    };

    return Reward;
};
