module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define(
        "Favorite",
        {
            FavoriteID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "FavoriteID",
            },
            MotivationID: {
                type: DataTypes.INTEGER,
            },
            UserID: {
                type: DataTypes.INTEGER,
            }
        }
    );

    console.log(Favorite === sequelize.models.Favorite);
    return Favorite;
}