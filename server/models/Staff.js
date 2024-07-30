module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define("Staff", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'staffs'
    });

    Staff.associate = (models) => {
        Staff.hasMany(models.Reward, {
            foreignKey: "staffId",
            onDelete: "cascade"
        });
    };

    return Staff;
}
