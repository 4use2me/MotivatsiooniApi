const app = require('express')();
const port = 8080;
const yamljs = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = yamljs.load("./docs/swagger.yaml");
var express = require('express');

app.use("/docs", swaggerUI.serve,swaggerUI.setup(swaggerDoc));
app.use(express.json());


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
    if (typeof quotes[req.params.id - 1] === "undefined") {
        return res.status(404).send("Quote not found.")
    }
    if (req.params.id === null) {
        return res.status(400).send
        ({error: "Invalid quote ID"});
    }
    res.send(quotes[req.params.id - 1])
})

app.post("/quotes", (req, res) => {
    if (!req.body.Quote ||
    !req.body.Date ||
    !req.body.UserID ||
    !req.body.Likes) 
    {   
        console.log(req.body.Quote)
        console.log(req.body.Date)
        console.log(req.body.UserID)
        console.log(req.body.Likes)
        return res.status(400).send
        ({error: "One or multiple parameters are missing"});
    }
    // Teisenda UserID ja Likes integeriteks
    const userID = parseInt(req.body.UserID, 10);
    const likes = parseInt(req.body.Likes, 10);
    // Kontrolli, kas teisendamine õnnestus
    if (isNaN(userID) || isNaN(likes)) {
        return res.status(400).send({
            error: "UserID and Likes must be integers"
        });
    }

    let quote = {
        ID: quotes.length + 1,
        Quote: req.body.Quote,
        Date: req.body.Date,
        UserID: userID,
        Likes: likes 
    }
    quotes.push(quote)
    res.status(201)
    .location(`${getBaseURL(req)}/quotes/${quotes.length}`)
    .send(quote);
})

app.put("/quotes/:id", (req, res) => {
    const id = parseInt(req.params.id, 10); // Saad ID URL-i parameetritest
    const quoteIndex = quotes.findIndex(q => q.ID === id); // Leia objekt ID alusel

    if (quoteIndex === -1) {
        return res.status(404).send({ error: "Quote not found" }); // Kui tsitaati pole, tagasta 404
    }

    if (!req.body.Quote || !req.body.Date || !req.body.UserID || !req.body.Likes) {
        return res.status(400).send({ error: "One or multiple parameters are missing" }); // Kontrolli väljade olemasolu
    }

    const updatedQuote = {
        ID: id, // ID jääb samaks
        Quote: req.body.Quote,
        Date: req.body.Date,
        UserID: parseInt(req.body.UserID, 10), // Konverteeri string integeriks
        Likes: parseInt(req.body.Likes, 10)   // Konverteeri string integeriks
    };

    quotes[quoteIndex] = updatedQuote; // Asenda olemasolev objekt uuendatuga

    res.status(200) // Tagasta 200 OK
        .location(`${getBaseURL(req)}/quotes/${id}`)
        .send(updatedQuote);
});

app.delete("/quotes/:id", (req, res) => {
    const id = parseInt(req.params.id, 10); // Saad ID URL-i parameetritest
    const quoteIndex = quotes.findIndex(q => q.ID === id); // Leia õige objekt ID alusel

    if (quoteIndex === -1) {
        return res.status(404).send({ error: "Quote not found" }); // Kui tsitaati pole, tagasta 404
    }

    quotes.splice(quoteIndex, 1); // Kustuta tsitaat
    res.status(204).send({ error: "No content" }); // Tagasta 204 ilma sisuta
});


app.listen(port, () => { console.log(`Api on saadaval aadressil: http://localhost:${port}`);});

function getBaseURL(req) {
    return req.connection && req.connection.encrypted ?
    "https" : "http" + `//${req.headers.host}` ;
}