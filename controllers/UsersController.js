const {db} =require("../db");
const Utils = require("./utils");

exports.getAll = async (req, res) => {
    const users = await db.users.findAll();
    console.log('Leitud kasutajad:', users);
    res.send (users.map(({UserID, UserName, Password, MotivationID}) => {return {UserID, UserName, Password, MotivationID}}))
}
exports.getById = async (req, res) => {
    const user = await getUser(req, res);
    if (!user) { return};
    return res.send(user);
    }

exports.create = async (req, res) => {
    if (
    !req.body.UserName ||
    !req.body.Password) 
    {   
        return res.status(400).send
        ({error: "One or multiple parameters are missing"});
    }

    let newUser = {
        UserName: req.body.UserName,
        Password: req.body.Password
    }
    const createdUser = await db.users.create(newUser);
    res.status(201)
    .location(`${Utils.getBaseURL(req)}/users/${createdUser.UserID}`)
    .send(createdUser.UserID);
}

exports.editById = async (req, res) => {
    const user = await getUser(req, res);
    if (!user) { return};
    if (!req.body.UserName ||
        !req.body.Password)
    {
        return res.status(400).send({ error: "One or multiple parameters are missing" }); // Kontrolli väljade olemasolu
    }
    user.MotivationID = parseInt(req.body.MotivationID, 10)
    user.UserName = req.body.UserName
    user.Password = req.body.Password
    await user.save();
    return res.status(200) // Tagasta 200 OK
        .location(`${Utils.getBaseURL(req)}/users/${user.UserID}`)
        .send(user);
}

exports.deleteById = async (req, res) => {
    const user = await getUser(req, res);
    if (!user) { return};
    await user.destroy(); // Kustuta andmebaasist 
    res.status(204).send(); // Tagasta 204 ilma sisuta
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
