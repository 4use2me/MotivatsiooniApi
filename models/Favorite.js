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
                allowNull: false,
            },
            UserID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        }
    );

    Favorite.associate = (models) => {
        Favorite.belongsTo(models.motivations, {
            foreignKey: 'MotivationID',
            as: 'Motivation', // Must match the alias used in `getFavorites` include
        });
    };
    return Favorite;
}