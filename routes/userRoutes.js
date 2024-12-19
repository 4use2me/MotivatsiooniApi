const UsersController = require('../controllers/UsersController');
module.exports = (app) => { 
    app.route("/users")
       .get(UsersController.getAll)   
       .post(UsersController.create)
    app.route("/users/:id")
        .get(UsersController.getById)
        .put(UsersController.editById)
        .delete(UsersController.deleteById)
    app.route("/login")
        .post(UsersController.login)
}