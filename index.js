require('dotenv').config();

const port = process.env.PORT || 8080;
const host = 'localhost';
const express = require('express');
const { db, sync } = require('./db'); // Impordi db ja sync
const app = express();
const cors = require('cors');
const yamljs = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = yamljs.load("./docs/swagger.yaml");

app.use(cors());
app.use("/docs", swaggerUI.serve,swaggerUI.setup(swaggerDoc));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send(`Server running. Documentation at <a href="http://${host}:${port}/docs">/docs</a>`);
})

require("./routes/motivationRoutes")(app);
require("./routes/userRoutes")(app);
require("./routes/favoriteRoutes")(app);

app.listen(port, async () => { 
    if (process.env.SYNC === "true") {
        await sync();
    }
    console.log(`Api on saadaval aadressil: http://localhost:${port}`);
});
