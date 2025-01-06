const { db } = require("../db");
const authenticate = require("./authMiddleware");

exports.addFavorite = [authenticate, async (req, res) => {
    try {
        const { MotivationID } = req.body; // Tsitaadi ID, mille kasutaja lisab lemmikutesse
        const UserID = req.UserID; // Kasutaja ID authenticate middleware'st

        if (!MotivationID) {
            return res.status(400).json({ error: "Motivatsiooni ID on nõutav" });
        }

        // Kontrolli, kas tsitaat on juba lemmikutes
        const existingFavorite = await db.favorites.findOne({
            where: { MotivationID, UserID },
        });

        if (existingFavorite) {
            return res.status(400).json({ error: "See tsitaat on juba lemmikutes" });
        }

        // Lisa uus lemmik
        const newFavorite = await db.favorites.create({
            MotivationID,
            UserID,
        });

        res.status(201).json(newFavorite);
    } catch (error) {
        console.error("Viga lemmiku lisamisel:", error);
        res.status(500).json({ error: "Serveri viga" });
    }
}];

exports.getFavorites = [authenticate, async (req, res) => {
    try {
        const UserID = req.UserID; // Kasutaja ID saadakse autentimise middleware'st
        if (!UserID) {
            return res.status(400).json({ error: 'Kasutaja ID puudub' });
        }

        // Otsi kasutaja lemmikuid, seostades lemmikud Motivations tabeliga
        const favorites = await db.Favorite.findAll({
            where: { UserID },
            include: {
                model: db.Motivation,
                attributes: ['MotivationID', 'Quote', 'Likes']
            }
        });

        if (favorites.length === 0) {
            return res.status(404).json({ message: 'Lemmikuid ei leitud' });
        }

        return res.status(200).json({ favorites });
    } catch (error) {
        console.error('Viga lemmikute laadimisel:', error);
        return res.status(500).json({ error: 'Serveri viga' });
    }
}];