const {db} =require("../db");
const Utils = require("../utils");

exports.getAll = async (req, res) => {
    const motivations = await db.motivations.findAll();
    res.send (motivations.map(({id, quote}) => {return {id, quote}}))
}

exports.getById = async (req, res) => {
    const motivation = await getMotivation(req, res);
    if (!motivation) { return};
    return res.send(motivation);
    }

exports.create = async (req, res) => {
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
    .location(`${Utils.getBaseURL(req)}/motivations/${createdMotivation.MotivationID}`)
    .send(createdMotivation.MotivationID);
}

exports.editById = async (req, res) => {
    const motivation = await getMotivation(req, res);
    if (!motivation) { return};
    if (!req.body.Quote ||
        !req.body.Date ||
        !req.body.UserID ||
        !req.body.Likes)
    {
        return res.status(400).send({ error: "One or multiple parameters are missing" }); // Kontrolli väljade olemasolu
    }
    motivation.Quote = req.body.Quote
    motivation.Date = req.body.Date
    motivation.UserID = parseInt(req.body.UserID, 10)
    motivation.Likes = parseInt(req.body.Likes, 10)
    await motivation.save();
    returnres.status(200) // Tagasta 200 OK
        .location(`${Utils.getBaseURL(req)}/motivations/${motivation.MotivationID}`)
        .send(motivation);
}

exports.deleteById = async (req, res) => {
    const motivation = await getMotivation(req, res);
    if (!motivation) { return};
    await motivation.destroy(); // Kustuta motivatsioon andmebaasist 
    res.status(204).send({ error: "No content" }); // Tagasta 204 ilma sisuta
}

const getMotivation = async (req, res) => {
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