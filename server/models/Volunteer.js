module.exports = (sequelize, DataTypes) => {
  const Volunteer = sequelize.define("Volunteer", {
    dateAvailable: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    serviceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50] // Ensure there's at least one character
      }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    timeAvailable: {
      type: DataTypes.TIME,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    imageFile: {
      type: DataTypes.STRING(255), // Increased size to accommodate longer filenames
      allowNull: true
    },
    contactInfo: {
      type: DataTypes.STRING(255), // Increased size for more flexibility
      allowNull: true
    },
    
  }, {
    tableName: 'volunteers',
    timestamps: true,
  });

  Volunteer.associate = (models) => {
    Volunteer.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
  };

  return Volunteer;
};
