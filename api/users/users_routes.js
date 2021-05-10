const express 	= require("express");
const router 	= express.Router();
const UserController = require('./users_controllers');

router.post('/post/signup', UserController.create_user); 

//Signup and Login URL
router.post('/post/login', UserController.user_login);
router.patch('/patch/updateusername',UserController.update_userName);

module.exports = router;