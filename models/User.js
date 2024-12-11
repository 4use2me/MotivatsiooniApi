module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "UserID",
            },
            UserName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Password: {
                type: DataTypes.STRING,
            },
            MotivationID: {
                type: DataTypes.INTEGER,
            }
        }
    );

    console.log(User === sequelize.models.User);
    return User;
}