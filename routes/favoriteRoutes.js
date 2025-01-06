const FavoritesController = require('../controllers/FavoritesController');
const authenticate = require('../controllers/authMiddleware');

module.exports = (app) => { 
    app.route("/favorites")
       .post(authenticate, FavoritesController.addFavorite)
       .get(authenticate, FavoritesController.getFavorites);
}