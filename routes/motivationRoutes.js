const MotivationsController = require ('../controllers/MotivationsController');

module.exports = (app) => { 
    app.route("/motivations")
       .get(MotivationsController.getAll)   
       .post(MotivationsController.create)
    app.route("/motivations/:id")
        .get(MotivationsController.getById)
        .put(MotivationsController.editById)
        .delete(MotivationsController.deleteById)
}