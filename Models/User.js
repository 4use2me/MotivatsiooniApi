module.exports = (sequelize, DataTypes) => {
    const Motivation = sequelize.define(
        "Motivation",
        {
            ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            UserName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            MotivatinID: {
                type: DataTypes.INTEGER,
            },
            Password: {
                type: DataTypes.STRING,
            }
        }
    );

    console.log(Motivation === sequelize.models.Motivation);
    return Motivation;
}