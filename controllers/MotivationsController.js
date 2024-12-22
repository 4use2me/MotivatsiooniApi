const {db} =require("../db");
const Utils = require("./utils");
const authenticate = require('../controllers/authMiddleware');

exports.getAll = async (req, res) => {
    const motivations = await db.motivations.findAll();
    res.send (motivations.map(({MotivationID, Quote, Likes, UserID}) => {return {MotivationID, Quote, Likes, UserID}}))
}

exports.getUsersMotivations = [authenticate, async (req, res) => {
    try {
        if (req.isAdmin) {
            // Kui kasutaja on admin, tagasta kõik motivatsioonid
            const allMotivations = await db.motivations.findAll();
            console.log("Kõik motivatsioonid andmebaasist:", allMotivations);

            if (allMotivations.length === 0) {
                return res.status(404).json({ message: 'Motivatsioone ei leitud' });
            }

            return res.status(200).json({ motivations: allMotivations });
        }

        // Kui kasutaja pole admin, tagasta ainult tema motivatsioonid
        const UserID = req.UserID; // Kasutame authenticate middleware'is määratud userId-d
        if (!UserID) {
            console.error('Kasutaja ID on määramata');
            return res.status(400).json({ error: 'Kasutaja ID puudub' });
        }

        const userMotivations = await db.motivations.findAll({
            where: { UserID: UserID }, // Filtreerime motivatsioonid kasutaja järgi
        });
        console.log("Kasutaja motivatsioonid andmebaasist:", userMotivations);

        if (userMotivations.length === 0) {
            return res.status(404).json({ message: 'Motivatsioone ei leitud' });
        }

        return res.status(200).json({ motivations: userMotivations });
    } catch (error) {
        console.error('Viga motivatsioonide andmete pärimisel:', error);
        return res.status(500).json({ error: 'Serveri viga' });
    }
}];

exports.create = [authenticate, async (req, res) => {
  try {
    const { Quote, Likes } = req.body;
    const UserID = req.UserID; // Kasutaja ID saadakse autentimise middleware'st

    if (!Quote) {
      return res.status(400).json({ error: 'Tsitaat on kohustuslik' });
    }

    // Kontrolli, kas tsitaat juba eksisteerib
    const existingMotivation = await db.motivations.findOne({
        where: { Quote },
      });
  
      if (existingMotivation) {
        return res.status(400).json({ error: 'Sama tsitaat on juba olemas.' });
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

exports.getById = async (req, res) => {
    const motivation = await getMotivation(req, res);
    if (!motivation) { return};
    return res.send(motivation);
}

exports.editById = [authenticate, async (req, res) => {
    const motivation = await getMotivation(req, res);
    if (!motivation) { return; }

    // Kontrolli, kas kasutajal on luba seda tsitaati muuta
    if (motivation.UserID !== req.UserID && !req.isAdmin) {
        return res.status(403).json({ error: "Sul pole luba seda tsitaati muuta." });
    }

    const { Quote, Likes } = req.body;
    if (!Quote) {
        return res.status(400).json({ error: "Tsitaadi tekst on kohustuslik." });
    }

    // Uuenda tsitaadi andmeid
    motivation.Quote = Quote;
    //motivation.Likes = Likes || motivation.Likes; // Kui Likes on vajalik, lisa see siin
    await motivation.save();

    console.log("Uuendatud motivatsioon:", motivation);

    return res.status(200).json(motivation); // Tagasta uuendatud tsitaat
}];
    
exports.deleteById = [authenticate, async (req, res) => {
    console.log('Päringu parameetrid:', req.params);
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        return res.status(400).send({ error: "Invalid motivation ID" });
    }

    const motivation = await db.motivations.findByPk(idNumber);
    if (!motivation) {
        return res.status(404).send({ error: "Motivation not found" });
    }

    // Kontrollige, kas kasutajal on luba seda tsitaati kustutada
    if (motivation.UserID !== req.UserID && !req.isAdmin) {
        return res.status(403).json({ error: "Sul pole luba seda tsitaati kustutada." });
    }

    await motivation.destroy(); // Kustuta tsitaat
    console.log("Kustutatud motivatsioon ID-ga:", idNumber);

    return res.status(204).send(); // Tagasta 204 ilma sisuta
}];

const getMotivation = async (req, res) => {
    const idNumber = parseInt(req.params.id);
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