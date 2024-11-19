const app = require('express')();
const port = 8080;

const swaggerUI = require
('swagger-ui-express');
const swaggerDoc = require("./docs/swagger.json");
app.use("/docs", swaggerUI.serve,
swaggerUI.setup(swaggerDoc));
Tabnine | Edit | Test | Explain | Document | Ask
app.listen(port, () => { console.log(`Api
on saadaval aadressil: http://localhost:${port}`);});

app.listen(port, () => {console.log(`Api on saadaval aadressil: http://localhost:${port}/`)});