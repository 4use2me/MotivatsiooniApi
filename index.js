const app = require('express')();
const port = 8080;
const yamljs = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = yamljs.load("./docs/swagger.yaml");
var express = require('express');

app.use("/docs", swaggerUI.serve,swaggerUI.setup(swaggerDoc));
app.use(express.json());

// Methods of quotes
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

// Methods of users  
const users =[
    {
        ID: 1,
        MotivationID:1,
        Date: "25.11.2024",
        UserName: "Aigi",
        Password: "Aigi123"
    },
    {
        ID: 2,
        MotivationID:2,
        Date: "26.11.2024",
        UserName: "Pia",
        Password: "Pia321"
    }
]
app.get("/users", (req, res) => { res.send (users)})  

app.get("/users/:id", (req, res) => {
    if (typeof users[req.params.id - 1] === "undefined") {
        return res.status(404).send("User not found.")
    }
    if (req.params.id === null) {
        return res.status(400).send
        ({error: "Invalid user ID"});
    }
    res.send(users[req.params.id - 1])
})

app.put("/users/:id", (req, res) => {
    const id = parseInt(req.params.id, 10); // Saad ID URL-i parameetritest
    const userIndex = users.findIndex(u => u.ID === id); // Leia objekt ID alusel

    if (userIndex === -1) {
        return res.status(404).send({ error: "User not found" }); // Kui tsitaati pole, tagasta 404
    }

    if (!req.body.MotivationID || !req.body.Date || !req.body.UserName || !req.body.Password) {
        return res.status(400).send({ error: "One or multiple parameters are missing" }); // Kontrolli väljade olemasolu
    }

    const updatedUser = {
        ID: id, // ID jääb samaks
        MotivationID: parseInt(req.body.MotivationID, 10),
        Date: req.body.Date,
        UserName: req.body.UserName, 
        Password: req.body.Password 
    };

    users[userIndex] = updatedUser; // Asenda olemasolev objekt uuendatuga

    res.status(200) // Tagasta 200 OK
        .location(`${getBaseURL(req)}/users/${id}`)
        .send(updatedUser);
});

// Methods of ownerships  
const ownerships =[
    {
        ID: 1,
        MotivationID:1,
        UserID: 1  
    },
    {
        ID: 2,
        MotivationID:2,
        UserID: 1  
    }
]

app.get("/ownerships", (req, res) => { res.send (ownerships)}) 

app.get("/ownership/:id", (req, res) => {
    if (typeof ownerships[req.params.id - 1] === "undefined") {
        return res.status(404).send("Ownership not found.")
    }
    if (req.params.id === null) {
        return res.status(400).send
        ({error: "Invalid ownership ID"});
    }
    res.send(ownerships[req.params.id - 1])
})

app.listen(port, () => { console.log(`Api on saadaval aadressil: http://localhost:${port}`);});

function getBaseURL(req) {
    return req.connection && req.connection.encrypted ?
    "https" : "http" + `//${req.headers.host}` ;
}

//Add new user
app.post("/users", (req, res) => {
    const { User, MotivationID, Date, UserName, Password } = req.body;

    // Check for missing fields
    if (!User || !MotivationID || !Date || !UserName || !Password) {
        console.log({ User, MotivationID, Date, UserName, Password });
        return res.status(400).send({
            error: "One or multiple parameters are missing"
        });
    }

    // Parse MotivationID as integer
    const motivationID = parseInt(MotivationID, 10);
    if (isNaN(motivationID)) {
        return res.status(400).send({
            error: "MotivationID must be an integer"
        });
    }

    // Create new user object
    const newUser = {
        ID: users.length + 1, // Incremental ID
        User,
        MotivationID: motivationID,
        Date,
        UserName,
        Password
    };

    // Add the user to the users array
    users.push(newUser);

    // Respond with created user
    res.status(201)
        .location(`${getBaseURL(req)}/users/${newUser.ID}`)
        .send(newUser);
});