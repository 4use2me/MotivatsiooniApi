const {db} =require("../db");
const Utils = require("../utils");

exports.getAll = async (req, res) => {
    const users = await db.motivations.findAll();
    res.send (users.map(({id,username}) => {return {id, username}}))
}

exports.getById = async (req, res) => {
    const user = await getUser(req, res);
    if (!user) { return};
    return res.send(user);
    }

exports.create = async (req, res) => {
        const { User, Date, UserName, Password } = req.body;

    // Check for missing fields
    if (!User || !Date || !UserName || !Password) {
        console.log({ User, Date, UserName, Password });
        return res.status(400).send({
            error: "One or multiple parameters are missing"
        });
    }

    // Create new user object
    const newUser = {
        User,
        Date,
        UserName,
        Password
    };

    const createdUser = await db.users.create(newUser);

    // Respond with created user
    res.status(201)
        .location(`${Utils.getBaseURL(req)}/users/${createdUser.UserID}`)
        .send(createdUser.UserID);
}

exports.editById = async (req, res) => {
    const user = await getUser(req, res);
    if (!user) { return};
    if (!req.body.User ||
        !req.body.Date ||
        !req.body.MotivationID ||
        !req.body.UserName)
    {
        return res.status(400).send({ error: "One or multiple parameters are missing" }); // Kontrolli väljade olemasolu
    }
    user.User = req.body.User
    user.Date = req.body.Date
    user.MotivationID = parseInt(req.body.MotivationID, 10)
    user.UserName = parseInt(req.body.UserName, 10)
    await user.save();
    returnres.status(200) // Tagasta 200 OK
        .location(`${Utils.getBaseURL(req)}/users/${user.UserID}`)
        .send(user);
}

exports.deleteById = async (req, res) => {
    const user = await getUser(req, res);
    if (!user) { return};
    await user.destroy(); // Kustuta motivatsioon andmebaasist 
    res.status(204).send({ error: "No content" }); // Tagasta 204 ilma sisuta
}

const getUser = async (req, res) => {
    const idNumber = parseInt(req.params.UserID);
    if (isNaN(idNumber)) {
        res.status(400).send({error: "Invalid user ID"});
        return null;
    }
    const user = await db.users.findByPk(idNumber); 
    if (!user) {
        res.status(404).send({error: "User not found"});
        return null;
    }
    return user;
}