// Update your Event model (event.js)

module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
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
        },
        eventDate: {
            type: DataTypes.DATEONLY // Date without time
        },
        eventTime: {
            type: DataTypes.TIME // Time without date
        }, 
        category: {
            type: DataTypes.ENUM('Sustainable', 'Sports', 'Community', 'Workshop', 'Other'),
            allowNull: false
        }
    }, {
        tableName: 'events'
    });

    Event.associate = (models) => {
        Event.belongsTo(models.Staff, {
            foreignKey: "staffId",
            as: 'staff'
        });
    };

    return Event;
};

