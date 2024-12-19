const {db} =require("../db");
const Utils = require("./utils");
const authenticate = require('../controllers/authMiddleware');

exports.getAll = async (req, res) => {
    const motivations = await db.motivations.findAll();
    res.send (motivations.map(({MotivationID, Quote, Likes, UserID}) => {return {MotivationID, Quote, Likes, UserID}}))
}

exports.getUsersMotivations = [authenticate, async (req, res) => {
    try {
        // Eeldame, et token on kontrollitud ja kasutaja on autentitud
        // Tokenist saame userId ja selle järgi otsime motivatsioonid

        const UserID = req.UserID;  // Kasutame authenticate middleware'is määratud userId-d
        if (!UserID) {
            console.error('Kasutaja ID on määramata');
            return res.status(400).json({ error: 'Kasutaja ID puudub' });
        }

        // Leia ainult selle kasutaja motivatsioonid
        const motivations = await db.motivations.findAll({
            where: { UserID: req.UserID } // Filtreerime motivatsioonid kasutaja järgi
        });
        console.log("Motivatsioonid andmebaasist:", motivations);

        if (motivations.length === 0) {
            return res.status(404).json({ message: 'Motivatsioone ei leitud' });
        }

        // Tagasta motivatsioonide nimekiri
        res.status(200).json({ motivations });
    } catch (error) {
        console.error('Viga motivatsioonide andmete pärimisel:', error);
        res.status(500).json({ error: 'Serveri viga' });
    }
}];

exports.getById = async (req, res) => {
    const motivation = await getMotivation(req, res);
    if (!motivation) { return};
    return res.send(motivation);
    }

exports.create = [authenticate, async (req, res) => {
  try {
    const { Quote, Likes } = req.body;
    const UserID = req.UserID; // Kasutaja ID saadakse autentimise middleware'st

    if (!Quote) {
      return res.status(400).json({ error: 'Tsitaat on kohustuslik' });
    }

    const newMotivation = await db.motivations.create({
      Quote,
      Likes: Likes || 1, // Kui Likes pole määratud, siis vaikimisi 1
      UserID, // Seotakse sisseloginud kasutajaga
    });

    res.status(201).json(newMotivation);
  } catch (error) {
    console.error('Viga motivatsiooni loomisel:', error);
    res.status(500).json({ error: 'Serveri viga' });
  }
}];

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