const { Sequelize, DataTypes} = require("sequelize");  
const sequelize = new Sequelize(process.env.DB_DATANAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOSTNAME,
    dialect: "mariadb",
    logging: console.log,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Connection failed: " + error)
    }
})();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.motivations = require("./models/Motivation")(sequelize, DataTypes);
db.users = require("./models/User")(sequelize, DataTypes);
db.favorites = require("./models/Favorite")(sequelize, DataTypes);

const sync = (async () => {
    await sequelize.sync({ alter: false});
    console.log("models have been synchronized successfully.")
    });

    module.exports = {db, sync};