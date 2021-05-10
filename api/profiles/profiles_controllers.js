const mongoose			= require("mongoose");
const Profile           = require("./profiles_model.js");
var axios               = require('axios');
const globalVariable    = require("../../nodemon.js");

exports.updateUserDetails = (req,res,next) => {
	Profile.findOne({userCode : req.body.userCode})
		   .then(user => {
		   		if(user){
		   			Profile.updateOne(
		   						{ userCode : req.body.userCode },
		   						{
		   							$set : {
												userName 			: req.body.mobileNo,
												title 				: req.body.title,
												fullName			: req.body.title + " " +req.body.firstName + " " + req.body.lastName,
												firstName			: req.body.firstName,
												middleName 			: req.body.middleName,
												lastName 			: req.body.lastName,
												fullMName			: req.body.firstMName + " " + req.body.lastMName,
												firstMName			: req.body.firstMName,
												middleMName 		: req.body.middleMName,
												lastMName 			: req.body.lastMName,
												mobNum				: req.body.mobileNo,
												emailId				: req.body.emailId,
												dob 				: req.body.dob,
												location 			: {
																		addressLine1	: req.body.addressLine1,
																		addressLine2 	: req.body.addressLine2,
																		pincode 	 	: req.body.pincode,
																		cityCode	 	: req.body.cityCode,
																		blockCode		: req.body.blockCode,
																		districtCode	: req.body.districtCode,
																		divisionCode	: req.body.divisionCode,
																		state 			: "Maharashtra",
																		country 		: "India",
																	 },
												gender 				: req.body.gender,
												role 				: req.body.role,
		   									}
		   						}
		   					)
		   				   .then(data =>{
		   				   		if(data.nModified != 1){
				                    res.status(200).json({
				                                            errorCode   : 5,
				                                            errorMsg    : "NOTUPDATE - Profile",
				                                            response    :  ""
				                                        });
				                }else{
				                	if(user.mobNum !== req.body.mobileNo || user.role !== req.body.role){
					                    axios({
												method  : 'patch',
												url     : globalVariable.APIURL+"/api/user/patch/updateusername",
												data    : {
																mobileNo  : req.body.mobileNo,
																userCode  : req.body.userCode,
																role 	  : req.body.role
														  }
										})
			                           .then(data=>{
			                                if(data.data.message !== 'User Mobile Number Updated'){
			                                    res.status(200).json({
			                                                            errorCode   : 5,
			                                                            errorMsg    : "NOTUPDATE - User",
			                                                            response    :  ""
			                                                        });
			                                }else{
			                                    res.status(200).json({
			                                                            errorCode   : 0,
			                                                            errorMsg    : "UPDATED - User",
			                                                            response    :  "" 
			                                                        });
			                                }
			                           })
			                           .catch(err =>{
			                                console.log(err);
			                                res.status(500).json({
			                                    error: err
			                                });
			                            })
				                	}else{
				                		res.status(200).json({
	                                                            errorCode   : 0,
	                                                            errorMsg    : "UPDATED - Profile",
	                                                            response    :  "" 
	                                                        });
				                	}
				                }
		   				   })
		   				   .catch(err =>{
					            console.log(err);
					            res.status(500).json({
					                error: err.message
					            });
					        });
		   		}else{
		   			res.status(200).json({
                                            errorCode   : 1,
                                            errorMsg    : "User Not Found",
                                            response    :  ""
                                        });	
		   		}
		   })
		   .catch(err =>{
	            console.log(err);
	            res.status(500).json({
	                error: err
	            });
	        });
};
exports.listOfUsers = (req,res,next) => {
	Profile.aggregate([
						{
							$project : {
											userCode 		: 1,
											name 			: "$fullName",
											mobileNumber	: "$mobNum",
											role 			: "$role",
											workStatus  	: "$workAreaAllocated",
											workArea 		: {
																	$switch:{
																		branches : [
																			{ case : { $eq: [ "$role", "Divisional Consultant" ] } , then : "$workArea.divisionsString"},
																			{ case : { $eq: [ "$role", "District Consultant" ] } , then : "$workArea.districtsString"},
																			{ case : { $eq: [ "$role", "Block Cluster Consultant" ] } , then : "$workArea.blockClusterName"},
																			{ case : { $eq: [ "$role", "Block Consultant" ] } , then : "$workArea.blocksString"},
																			{ case : { $eq: [ "$role", "GP Cluster Consultant" ] } , then : "$workArea.gpClusterName"},
																			{ case : { $eq: [ "$role", "GP Consultant" ] } , then : "$workArea.gpsString"},
																		],
																		default : "All"
																	}
																},
									}
						}
			])
			.then(users=>{
				if(users.length > 0){
					res.status(200).json({
                                            errorCode   : 0,
                                            errorMsg    : "User Details",
                                            response    :  users
                                        });
				}else{
					res.status(200).json({
                                            errorCode   : 1,
                                            errorMsg    : "Data Not Found",
                                            response    :  ""
                                        });
				}
			})
			.catch(err =>{
	            console.log(err);
	            res.status(500).json({
	                error: err
	            });
	        });
};
exports.viewuserdetails = (req,res,next) =>{
	console.log("viewuserdetails ",req.params.usercode)
	Profile.findOne({userCode : parseInt(req.params.usercode)})
		   .then(user=>{
		   		console.log("user",user)
		   		if(user){
		   			res.status(200).json({
                                            errorCode   : 0,
                                            errorMsg    : "User Found",
                                            response    :  user
                                        });
		   		}else{
		   			res.status(200).json({
                                            errorCode   : 1,
                                            errorMsg    : "User Not Found",
                                            response    :  ""
                                        });
		   		}
		   })
		   .catch(err =>{
	            console.log(err);
	            res.status(500).json({
	                error: err
	            });
	        });
};
