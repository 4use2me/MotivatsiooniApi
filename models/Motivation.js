module.exports = (sequelize, DataTypes) => {
    const Motivation = sequelize.define(
        "Motivation",
        {
            ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            Quote: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            UserID: {
                type: DataTypes.INTEGER,
            },
            Likes: {
                type: DataTypes.INTEGER,
            }
        }
    );

    console.log(Motivation === sequelize.models.Motivation);
    return Motivation;
}