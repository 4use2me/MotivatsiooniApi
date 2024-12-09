require('dotenv').config();

const port = process.env.PORT || 8080;
const host = 'localhost';
const express = require('express');
const app = express();

const cors = require('cors');
const yamljs = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = yamljs.load("./docs/swagger.yaml");


app.use(cors());
app.use("/docs", swaggerUI.serve,swaggerUI.setup(swaggerDoc));
app.use(express.json());

// Methods of motivations
// const motivations =[
//     {
//         ID: 1,
//         Quote:"esimene tsitaat",
//         Date: "25.11.2024",
//         UserID: 1,
//         Likes: 10
//     },
//     {
//         ID: 2,
//         Quote:"teine tsitaat",
//         Date: "25.11.2024",
//         UserID: 2,
//         Likes: 9
//     }
// ]

app.get("/motivations", async (req, res) => { 
    const motivations = await db.motivations.findAll();
    res.send (motivations.map(({id, quote}) => {return {id, quote}}))
})

app.get("/motivations/:id", async (req, res) => {
    const motivation = await getMotivation(req, res);
    if (!motivation) { return};
    return res.send(motivation);
    }
)

app.post("/motivations", async (req, res) => {
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

    let newMotivation = {
        Quote: req.body.Quote,
        Date: req.body.Date,
        UserID: userID,
        Likes: likes 
    }
    const createdMotivation = await db.motivations.create(newMotivation);
    res.status(201)
    .location(`${getBaseURL(req)}/motivations/${createdMotivation.MotivationID}`)
    .send(createdMotivation.MotivationID);
})

app.put("/motivations/:id", (req, res) => {
    const id = parseInt(req.params.id, 10); // Saad ID URL-i parameetritest
    const motivationIndex = motivations.findIndex(q => q.ID === id); // Leia objekt ID alusel

    if (motivationIndex === -1) {
        return res.status(404).send({ error: "Motivation not found" }); // Kui motivatsiooni pole, tagasta 404
    }

    if (!req.body.Quote || !req.body.Date || !req.body.UserID || !req.body.Likes) {
        return res.status(400).send({ error: "One or multiple parameters are missing" }); // Kontrolli väljade olemasolu
    }

    const updatedMotivation = {
        ID: id, // ID jääb samaks
        Quote: req.body.Quote,
        Date: req.body.Date,
        UserID: parseInt(req.body.UserID, 10), // Konverteeri string integeriks
        Likes: parseInt(req.body.Likes, 10)   // Konverteeri string integeriks
    };

    motivations[motivationIndex] = updatedMotivation; // Asenda olemasolev objekt uuendatuga

    res.status(200) // Tagasta 200 OK
        .location(`${getBaseURL(req)}/motivations/${id}`)
        .send(updatedMotivation);
});

app.delete("/motivations/:id", (req, res) => {
    const id = parseInt(req.params.id, 10); // Saad ID URL-i parameetritest
    const motivationIndex = motivations.findIndex(q => q.ID === id); // Leia õige objekt ID alusel

    if (motivationIndex === -1) {
        return res.status(404).send({ error: "Motivation not found" }); // Kui motivatsiooni pole, tagasta 404
    }

    motivations.splice(motivationIndex, 1); // Kustuta motivatsioon 
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

app.put("/users/:id", (req, res) => {
    const id = parseInt(req.params.id, 10); // Saad ID URL-i parameetritest
    const userIndex = users.findIndex(u => u.ID === id); // Leia objekt ID alusel

    if (userIndex === -1) {
        return res.status(404).send({ error: "User not found" }); // Kui kasutajat pole, tagasta 404
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


//Delete an user
app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id, 10); // Saad ID URL-i parameetritest
    const userIndex = users.findIndex(u => u.ID === id); // Leia õige objekt ID alusel

    if (userIndex === -1) {
        return res.status(404).send({ error: "User not found" }); // Kui kasutajat pole, tagasta 404
    }

    users.splice(userIndex, 1); // Kustuta kasutaja
    res.status(204).send({ error: "No content" }); // Tagasta 204 ilma sisuta
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

//Add new ownership
app.post("/ownerships", (req, res) => {
    if (!req.body.UserID ||
    !req.body.MotivationID) 
    {   
        console.log(req.body.UserID)
        console.log(req.body.MotivationID)
        return res.status(400).send
        ({error: "One or multiple parameters are missing"});
    }
    // Teisenda UserID ja MotivationID integeriteks
    const userID = parseInt(req.body.UserID, 10);
    const motivationID = parseInt(req.body.MotivationID, 10);
    // Kontrolli, kas teisendamine õnnestus
    if (isNaN(userID) || isNaN(motivationID)) {
        return res.status(400).send({
            error: "UserID and MotivationID must be integers"
        });
    }

    let ownership = {
        ID: ownerships.length + 1,
        UserID: userID,
        MotivationID: motivationID 
    }
    ownerships.push(ownership)
    res.status(201)
    .location(`${getBaseURL(req)}/ownerships/${ownerships.length}`)
    .send(ownership);
})

//Delete an ownership
app.delete("/ownerships/:id", (req, res) => {
    const id = parseInt(req.params.id, 10); // Saad ID URL-i parameetritest
    const ownershipIndex = ownerships.findIndex(q => q.ID === id); // Leia õige objekt ID alusel

    if (ownershipIndex === -1) {
        return res.status(404).send({ error: "Ownership not found" }); // Kui objekti pole, tagasta 404
    }

    ownerships.splice(ownershipIndex, 1); // Kustuta objekt
    res.status(204).send({ error: "No content" }); // Tagasta 204 ilma sisuta
});

app.listen(port, () => { console.log(`Api on saadaval aadressil: http://localhost:${port}`);});

function getBaseURL(req) {
    return req.connection && req.connection.encrypted ?
    "https" : "http" + `//${req.headers.host}` ;
}

async function getMotivation(req, res) {
    const idNumber = parseInt(req.params.MotivationID);
    if (isNaN(idNumber)) {
        res.status(400).send({error: "Invalid motivation ID"});
        return null;
    }
    const motivation = await db.motivations.findByPk(idNumber); 
    if (!motivation) {
        res.status(404).send({error: "Motivation not found"});
        return null;
    }
    return motivation;
}
