const app = require('express')();
const port = 8080;

const swaggerUI = require
('swagger-ui-express');
const swaggerDoc = require("./docs/swagger.json");
app.use("/docs", swaggerUI.serve,
swaggerUI.setup(swaggerDoc));

const quotes =[
    {
        ID: 1,
        Quote:"esimene tsitaat",
        Date: "25.11.2024",
        UserID: 1,
        Likes: 10
    },
    {
        ID: 2,
        Quote:"teine tsitaat",
        Date: "25.11.2024",
        UserID: 1,
        Likes: 9
    }
]
app.get("/quotes", (req, res) => { res.send (quotes)})

app.get("/quotes/:id", (req, res) => {
    res.send(quotes[req.params.id])
})

app.listen(port, () => { console.log(`Api on saadaval aadressil: http://localhost:${port}`);});

