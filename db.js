const { Sequelize, DataTypes} = require("sequelize");  
const sequelize = new Sequelize(process.env.DB_DATANAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOSTNAME,
    dialect: "mariadb",
    logging: console.log,
});


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./models/User")(sequelize, DataTypes);
db.motivations = require("./models/Motivation")(sequelize, DataTypes);
db.favorites = require("./models/Favorite")(sequelize, DataTypes);



Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Connection failed: " + error)
    }
})();


const sync = (async () => {
    await sequelize.sync({ alter: false});
    console.log("models have been synchronized successfully.")
    });

    module.exports = {db, sync};