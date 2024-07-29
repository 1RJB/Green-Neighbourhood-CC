module.exports = (sequelize, DataTypes) => {
    const Participant = sequelize.define("Participant", {
        Fname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        Lname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        gender: {
            type: DataTypes.ENUM('male', 'female'),
            allowNull: false
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: false
        },
        event: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'participants'
    });

    Participant.associate = (models) => {
        Participant.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Participant;
};
