const {db} =require("../db");
const Utils = require("./utils");

exports.getAll = async (req, res) => {
    const motivations = await db.motivations.findAll();
    res.send (motivations.map(({MotivationID, Quote, Likes, UserID}) => {return {MotivationID, Quote, Likes, UserID}}))
}

exports.getById = async (req, res) => {
    const motivation = await getMotivation(req, res);
    if (!motivation) { return};
    return res.send(motivation);
    }

exports.create = async (req, res) => {
    if (!req.body.Quote ||
    !req.body.Likes ||
    !req.body.UserID) 
    {   
        console.log(req.body.Quote)
        console.log(req.body.Likes)
        console.log(req.body.UserID)
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
        Likes: likes,
        UserID: userID
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
        !req.body.UserID)
    {
        return res.status(400).send({ error: "One or multiple parameters are missing" }); // Kontrolli väljade olemasolu
    }
    motivation.Quote = req.body.Quote
    motivation.Likes = parseInt(req.body.Likes, 10)
    motivation.UserID = parseInt(req.body.UserID, 10)
    await motivation.save();
    return res.status(200) // Tagasta 200 OK
        .location(`${Utils.getBaseURL(req)}/motivations/${motivation.MotivationID}`)
        .send(motivation);
}

exports.deleteById = async (req, res) => {
    const motivation = await getMotivation(req, res);
    if (!motivation) { return};
    await motivation.destroy(); // Kustuta motivatsioon andmebaasist 
    res.status(204).send(); // Tagasta 204 ilma sisuta
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