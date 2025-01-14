const { db } = require("../db");
const authenticate = require("./authMiddleware");

exports.getAll = async (req, res) => {
    const favorites = await db.favorites.findAll();
    res.send (favorites.map(({FavoriteID, MotivationID, UserID}) => {return {FavoriteID, MotivationID, UserID}}))
    
 };

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
        const isAdmin = req.isAdmin; 
        
        if (!UserID) {
            return res.status(400).json({ error: 'User ID is missing' });
        }

        const whereCondition = isAdmin ? {} : { UserID }; // Adminil on võimalus kõiki lemmikuid näha, kasutaja enda omi

        // Otsi lemmikuid, seostades lemmikud Motivations tabeliga
        const favorites = await db.favorites.findAll({
            where: whereCondition, // No filtering for admin, otherwise filter by UserID
            include: {
                model: db.motivations,
                as: 'Motivation',
                required: true,
                attributes: ['MotivationID', 'Quote', 'Likes'], 
            },
        });

        console.log('Favorites fetched:', favorites);

        if (favorites.length === 0) {
            return res.status(404).json({ message: 'Lemmikuid ei leitud' });
        }

        return res.status(200).json({ favorites });
    } catch (error) {
        console.error('Viga lemmikute laadimisel:', error);
        return res.status(500).json({ error: 'Serveri error' });
    }
}];

exports.removeFavorite = [authenticate, async (req, res) => {
    try {
        const UserID = req.UserID; // Kasutaja ID saadakse autentimise middleware'st
        const FavoriteID = parseInt(req.params.id); 

        if (!UserID || isNaN(FavoriteID)) {
            return res.status(400).json({ error: 'Kohustuslikud parameetrid puuduvad' });
        }

        // Otsi Favorite tabelist, kas see tsitaat on kasutaja lemmikute seas
        const favorite = await db.favorites.findOne({
            where: { UserID, FavoriteID },
        });

        if (!favorite) {
            return res.status(404).json({ error: 'Lemmikut ei leitud' });
        }

        // Eemalda lemmik
        await favorite.destroy();

        return res.status(200).json({ message: 'Lemmik edukalt eemaldatud' });
    } catch (error) {
        console.error('Viga lemmiku eemaldamisel:', error);
        return res.status(500).json({ error: 'Serveri viga' });
    }
}];