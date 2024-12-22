module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            MotivationID: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            Date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            UserName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Password: {
                type: DataTypes.STRING,
            }
        }
    );

    console.log(User === sequelize.models.User);
    return User;
}