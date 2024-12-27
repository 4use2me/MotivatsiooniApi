const UsersController = require('../controllers/UsersController');
const authenticate = require('../controllers/authMiddleware');

module.exports = (app) => { 
    app.route("/users")
       .get(UsersController.getAll)   
       .post(UsersController.create)
    app.route('/users/me')
       .get(authenticate, UsersController.getMe);
    app.route("/users/:id")
        .get(UsersController.getById)
        .put(authenticate, UsersController.editById)
        .delete(UsersController.deleteById)
    app.route("/login")
        .post(UsersController.login)
}