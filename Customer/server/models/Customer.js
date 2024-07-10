module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'customers'
    });

    Customer.associate = (models) => {
        Customer.hasMany(models.Reward, {
            foreignKey: "customerId",
            onDelete: "cascade"
        });
    };

    return Customer;
}
