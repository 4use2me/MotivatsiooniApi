module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
      "User",
      {
          UserID: {
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
      }
  );
  
  User.associate = (models) => {
    User.hasMany(models.motivations, {
        foreignKey: 'UserID',
        as: 'Motivations',
    });
};

  console.log(User === sequelize.models.User);
  return User;
};