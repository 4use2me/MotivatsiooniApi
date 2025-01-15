const {db} =require("../db");
const Utils = require("./utils");
const authenticate = require('../controllers/authMiddleware');
  
// exports.getAll = async (req, res) => {
//     const motivations = await db.motivations.findAll();
//     res.send (motivations.map(({MotivationID, Quote, Likes, UserID}) => {return {MotivationID, Quote, Likes, UserID}}))
// };

exports.getAll = async (req, res) => {
    try {
        const sort = req.query.sort || "asc"; // Võta sorteerimissuund päringust (vaikimisi kasvavalt)
        const motivations = await db.motivations.findAll({
            order: [["Likes", sort]], // Sorteerime meeldimiste arvu järgi
            include: {
                model: db.users, // Ühenda User tabeliga
                as: 'User',
                required: true, 
                attributes: ['UserName'], // Useri tabelist kaasa ainult nimi
            },
        });

        const response = motivations.map(motivation => ({
            MotivationID: motivation.MotivationID,
            Quote: motivation.Quote,
            Likes: motivation.Likes,
            UserID: motivation.UserID,
            UserName: motivation.User?.UserName, // Kaasa UserName
        }));

        res.json(motivations);
    } catch (error) {
        console.error("Viga motivatsioonide laadimisel:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getRandom = async (req, res) => {
    console.log("getRandom method called"); // Kontroll, kas meetod käivitub
    try {
        console.log("Fetching random motivation...");

        const randomMotivation = await db.motivations.findOne({
            order: db.sequelize.random(), // Randomly fetch one record
            include: {
                model: db.users,
                as: 'User',
                required: true,
                attributes: ['UserName'],
            },
        });

        console.log("Random motivation fetched:", randomMotivation);

        // Handle the case where no quotes exist
        if (!randomMotivation) {
            console.error("No motivation found in the database.");
            return res.status(404).send({ error: "No quotes available" });
        }

        // Kontrolli, kas MotivationID eksisteerib ja on korrektne
        if (!randomMotivation.MotivationID) {
            console.error("Invalid motivation ID in result:", randomMotivation);
            return res.status(400).send({ error: "Invalid motivation id." });
        }
        // Return the random quote
        return res.send({
            MotivationID: randomMotivation.MotivationID,
            Quote: randomMotivation.Quote,
            UserID: randomMotivation.UserID,
            Likes: randomMotivation.Likes,
            UserName: randomMotivation.User?.UserName,
        });
    } catch (error) {
        console.error("Error fetching random quote:", error);
        return res.status(500).send({ error: "An error occurred while fetching a random quote" });
    }
};

exports.likeMotivation = async (req, res) => {
    try {
        // Otsime andmebaasist tsitaadi ID põhjal
        const idNumber = parseInt(req.params.id);
        const motivation = await db.motivations.findByPk(idNumber); 

        if (!motivation) {
            return res.status(404).json({ error: "Motivation not found" });
        }

        // Suurendame meeldimiste arvu
        motivation.Likes += 1;

        // Salvestame muudatused andmebaasi
        await motivation.save();

        // Tagastame uuendatud meeldimiste arvu
        res.json({ likes: motivation.Likes });
    } catch (error) {
        console.error("Serveri viga:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

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