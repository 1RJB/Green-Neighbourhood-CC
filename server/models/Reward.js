module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define("Reward", {
        title: {
            type: DataTypes.STRING(100),
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
        Reward.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Reward;
}
