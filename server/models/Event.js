module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'Events'
    });

    Event.associate = (models) => {
        Event.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Event;
}
