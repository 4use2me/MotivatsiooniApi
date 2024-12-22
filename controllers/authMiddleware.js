const jwt = require('jsonwebtoken');
const { db } = require('../db'); // Kontrolli andmebaasiühendust

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>' eraldamine
    
    if (!token) {
        return res.status(401).json({ error: 'Token puudub' });
    }

    try {
        // Kontrolli tokenit ja dešifreeri
        const decoded = jwt.verify(token, 'MySecretKey123');
        console.log("Dekodeeritud token:", decoded);

        req.UserID = decoded.UserID; // Salvestame kasutaja ID tokenist
        req.isAdmin = decoded.isAdmin || false; // Admini staatus tokenist

        // Otsi kasutaja andmebaasist, et veenduda tema olemasolus
        const user = await db.users.findByPk(req.UserID);
        if (!user) {
            return res.status(404).json({ error: 'Kasutaja ei leitud' });
        }

        // Võimalik lisakontroll (kui admini staatust tahad kinnitada ka andmebaasist)
        if (user.UserName === 'admin') {
            req.isAdmin = true;
        }

        console.log(`Autentimine õnnestus: kasutaja ID: ${req.UserID}, admin: ${req.isAdmin}`);
        next(); // Jätka päringuga
    } catch (error) {
        console.error('Tokeni dekodeerimise viga:', error);
        return res.status(401).json({ error: 'Kehtetu või aegunud token' });
    }
};

module.exports = authenticate;
