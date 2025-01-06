const FavoritesController = require('../controllers/FavoritesController');

module.exports = (app) => { 
    app.route("/favorites")
       .post(FavoritesController.addFavorite)
}