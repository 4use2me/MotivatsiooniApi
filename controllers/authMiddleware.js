const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Tokeni eraldamine 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ error: 'Token puudub' });
    }

    try {
        // Kontrolli tokenit ja dešifreeri
        const decoded = jwt.verify(token, 'MySecretKey123');
        console.log("Dekodeeritud token:", decoded);
        req.UserID = decoded.UserID;  // Salvestame kasutaja ID, mille JWT tagastas

        if (!req.UserID) {
            console.error('Kasutaja ID puudub tokenist');
            return res.status(401).json({ error: 'Token ei sisalda kasutaja ID-d' });
        }

        console.log('Autentimine õnnestus, kasutaja ID:', req.UserID); // Logige kasutaja ID
        next();  // Jätkame päringut
    } catch (error) {
        console.error('Tokeni dekodeerimise viga:', error);
        res.status(401).json({ error: 'Kehtetu token' });
    }
};

module.exports = authenticate;
