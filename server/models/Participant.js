module.exports = (sequelize, DataTypes) => {
    const Participant = sequelize.define("Participant", {
firstName: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(10), // Adjust data type as necessary
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATEONLY, // DATEONLY for storing only date without time
        allowNull: false,
      },
      event: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      status: {
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
