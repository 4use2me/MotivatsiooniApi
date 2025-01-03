const {db} =require("../db");
const Utils = require("./utils");
const jwt = require('jsonwebtoken');
const authenticate = require('../controllers/authMiddleware');

exports.getAll = async (req, res) => {
    const users = await db.users.findAll();
    console.log('Leitud kasutajad:', users);
    res.send (users.map(({UserID, UserName, Password}) => {return {UserID, UserName, Password}}))
}

exports.getMe = [authenticate, async (req, res) => {
    try {
        const user = await db.users.findByPk(req.UserID);

        if (!user) {
            return res.status(404).json({ error: "Kasutaja andmeid ei leitud." });
        }

        // Tagasta kasutaja andmed koos parooliga
        res.json({
            UserID: user.UserID,
            UserName: user.UserName,
            Password: user.Password, // Tagasta ka parool
        });
    } catch (error) {
        console.error("Viga kasutaja andmete toomisel:", error);
        res.status(500).json({ error: "Serveri viga." });
    }
}];

exports.getById = async (req, res) => {
    const user = await getUser(req, res);
    if (!user) { return};
    return res.send(user);
}

exports.create = async (req, res) => {
    const { UserName, Password } = req.body;
  
    if (!UserName || !Password) {
      return res.status(400).json({ error: "Kasutajanimi või parool puudub." });
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

exports.editById = [authenticate, async (req, res) => {
    const user = await getUser(req, res);
    if (!user) { return};

    // Kontrolli, kas kasutajal on luba andmeid muuta
    if (user.UserID !== req.UserID && !req.isAdmin) {
        return res.status(403).json({ error: "Sul pole luba andmeid muuta." });
    }

    const { UserName, Password } = req.body;
    if (!UserName || !Password) {
        return res.status(400).json({ error: "One or multiple parameters are missing" });
    }

    user.UserName = req.body.UserName
    user.Password = req.body.Password
    await user.save();
    console.log("Uuendatud andmed", user);
    return res.status(200) // Tagasta 200 OK
        .location(`${Utils.getBaseURL(req)}/users/${user.UserID}`)
        .send(user);
}];

exports.deleteById = async (req, res) => {
    try {
      // Leia kasutaja
      const user = await getUser(req, res);
      if (!user) {
        console.error("Kasutajat ei leitud, kustutamine katkestatud.");
        return;
      }

      // Kontrolli, kas kasutaja objekt on Sequelize instants
      if (typeof user.destroy !== 'function') {
        console.error("Tagastatud objekt ei ole Sequelize instants:", user);
        return res.status(500).json({ error: "Kasutajat ei saa kustutada." });
      }
  
      console.log("Kustutatakse kasutaja ID:", user.UserID);
  
      // Kontrolli, kas `destroy` meetod eksisteerib
      if (typeof user.destroy !== "function") {
        console.error("Kasutaja objektil puudub 'destroy' meetod:", user);
        return res.status(500).json({ message: "Kasutaja kustutamine ebaõnnestus." });
      }
  
      // Kustuta seotud motivatsioonid
      const deletedMotivations = await db.motivations.destroy({
        where: { UserID: user.UserID },
      });
      console.log("Seotud motivatsioonid kustutatud:", deletedMotivations);
  
      // Kustuta kasutaja
      await user.destroy();
      console.log("Kasutaja kustutatud:", user.UserID);
  
      res.status(204).send();
    } catch (error) {
      console.error("Viga kasutaja kustutamisel:", error);
      res.status(500).json({ message: "Viga kasutaja kustutamisel." });
    }
  };
  
  const getUser = async (req, res) => {
    const idNumber = parseInt(req.params.id);
  
    if (isNaN(idNumber)) {
      console.error("Päringus esitatud kasutaja ID on vale:", req.params.id);
      res.status(400).json({ error: "Invalid user ID" });
      return null;
    }
  
    try {
      const user = await db.users.findByPk(idNumber); // Eemaldatud `raw: true`
      if (!user) {
        console.error("Kasutajat ei leitud ID-ga:", idNumber);
        res.status(404).json({ error: "User not found" });
        return null;
      }
  
      console.log("Leitud kasutaja objekt:", user);
      return user;
    } catch (error) {
      console.error("Viga kasutaja otsimisel:", error);
      res.status(500).json({ error: "Serveri viga kasutaja otsimisel." });
      return null;
    }
  };
  