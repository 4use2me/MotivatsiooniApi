const MotivationsController = require ('../controllers/MotivationsController');
const authenticate = require('../controllers/authMiddleware');

module.exports = (app) => { 
   app.route("/motivations")
      .get(MotivationsController.getAll)   
      .post(MotivationsController.create)
   app.route("/motivations/random")
      .get(MotivationsController.getRandom)
   app.route('/motivations/user') // Motivatsioonid, mis kuuluvad sisseloginud kasutajale
      .get(authenticate, MotivationsController.getUsersMotivations);
   app.route("/motivations/:id")
      .get(MotivationsController.getById)
      .put(MotivationsController.editById)
      .delete(MotivationsController.deleteById)
}