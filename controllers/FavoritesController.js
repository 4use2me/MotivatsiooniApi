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
