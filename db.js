const { Sequelize, DataTypes } = require("sequelize");

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
        console.error("Connection failed: " + error);
    }
})();

// Mudelid
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.motivations = require("./models/motivation")(sequelize, DataTypes);
db.users = require("./models/user")(sequelize, DataTypes);

// Sync (andmebaasi tabelite sünkroonimine)
const sync = async () => {
    await sequelize.sync({ alter: true });
    console.log("Models have been synchronized successfully.");
};

// Ekspordi db ja sync
module.exports = { db, sync };
