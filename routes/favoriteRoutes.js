const FavoritesController = require('../controllers/FavoritesController');
const authenticate = require('../controllers/authMiddleware');

module.exports = (app) => { 
    app.route("/favorites")
        .get(FavoritesController.getAll)
    app.route("/favorites/user")
       .post(authenticate, FavoritesController.addFavorite)
       .get(authenticate, FavoritesController.getFavorites)
    app.route("/favorites/user/:id")
       .delete(authenticate, FavoritesController.removeFavorite);
}