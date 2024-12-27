
module.exports = (sequelize, DataTypes) => {
    const Motivation = sequelize.define(
        "Motivation",
        {
            MotivationID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "MotivationID",
            },
            Quote: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Likes: {
                type: DataTypes.INTEGER,
            },
            UserID: {
                type: DataTypes.INTEGER,
            }
        }
    );

    console.log(Motivation === sequelize.models.Motivation);
    return Motivation;
}
