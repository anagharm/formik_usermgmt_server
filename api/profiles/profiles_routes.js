const express 		 	= require("express");
const router 		 	= express.Router();
const ProfileController = require('./profiles_controllers');

router.patch('/patch/updateuserdetails', ProfileController.updateUserDetails); 
router.get('/get/listofusers', ProfileController.listOfUsers);
router.get('/get/viewuserdetails/:usercode',ProfileController.viewuserdetails);

module.exports = router;