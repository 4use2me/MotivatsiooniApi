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

//Methods of motivations
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

// Methods of users  
// const users =[
//     {
//         ID: 1,
//         MotivationID:1,
//         Date: "25.11.2024",
//         UserName: "Aigi",
//         Password: "Aigi123"
//     },
//     {
//         ID: 2,
//         MotivationID:2,
//         Date: "26.11.2024",
//         UserName: "Pia",
//         Password: "Pia321"
//     }
// ]

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
