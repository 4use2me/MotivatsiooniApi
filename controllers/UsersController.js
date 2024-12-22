const {db} =require("../db");
const Utils = require("./utils");
const jwt = require('jsonwebtoken');

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
    const { UserName, Password } = req.body;
  
    if (!UserName || !Password) {
      return res.status(400).json({ error: "One or multiple parameters are missing" });
    }
  
    try {
      const existingUser = await db.users.findOne({ where: { UserName } });
      if (existingUser) {
        return res.status(409).json({ error: "Kasutajanimi on juba kasutusel." });
      }
  
      const newUser = await db.users.create({ UserName, Password });
      res.status(201).json({ message: "Kasutaja registreeritud edukalt.", user: newUser });
    } catch (error) {
      console.error("Viga kasutaja loomisel:", error);
      res.status(500).json({ error: "Serveri viga." });
    }
}      

exports.login = async (req, res) => {
    const { UserName, Password } = req.body;

    if (!UserName || !Password) {
        return res.status(400).json({ error: 'Kasutajanimi ja parool on kohustuslikud' });
    }

    try {
        // Leia kasutaja andmebaasist
        const user = await db.users.findOne({
            where: { UserName },
        });
        console.log("Kasutaja ID andmebaasist:", user?.UserID);

        if (user) {
            const isPasswordValid = user.Password === Password;  // Võiks kasutada bcrypti parooli kontrolliks

            if (isPasswordValid) {
                // Kontrolli, kas kasutaja on admin
                const isAdmin = UserName === 'admin';
                // Generaadi token
                const token = jwt.sign({ UserID: user.UserID, isAdmin }, 'MySecretKey123', { expiresIn: '1h' });

                // Saatke token vastusesse
                console.log("Generated token:", token);
                res.json({
                    message: 'Logimine õnnestus',
                    user: { UserName: user.UserName, isAdmin },
                    token, // Tokeni saatmine koos vastusega
                });
            } else {
                res.status(401).json({ error: 'Vale kasutajanimi või parool' });
            }
        } else {
            res.status(401).json({ error: 'Vale kasutajanimi või parool' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Serveri viga' });
    }
};

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
