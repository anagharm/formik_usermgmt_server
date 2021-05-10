const mongoose			= require("mongoose");
const bcrypt			= require("bcrypt");
const jwt				= require("jsonwebtoken");
const globalVariable 	= require("../../nodemon.js");
const User 				= require('./users_model');
const moment            = require("moment");
const Profile           = require("../profiles/profiles_model.js");

exports.create_user = (req,res,next) => {
    User.findOne({emails      : req.body.email})
        .then(user=>{
            if(user){
                res.status(200).json({
                                        errorCode   : 1,
                                        errorMsg    : "Email Id Already Exists",
                                        response    :  ""
                                    });
            }else{
                //old
                User.find()
                    .sort({"userCode" : -1})
                    .limit(1)
                    .then(usr => {
                        const user = new User({
                                        _id         : new mongoose.Types.ObjectId(),
                                        userCode    : (usr && usr[0] && usr[0].userCode) ? usr[0].userCode + 1 : 10001,
                                        userName    : req.body.email,
                                        fullName    : req.body.firstName + " " + req.body.lastName, 
                                        emails      : req.body.email,
                                        // role         : req.body.role,
                                        password    : req.body.password,
                                        verified    : true, 
                                    });
                        user.save()
                            .then(user => {
                                const profile = new Profile({
                                    _id         : new mongoose.Types.ObjectId(),
                                    userCode    : user.userCode,
                                    userName    : req.body.email,
                                    user_Id     : user._id,
                                    fullName    : req.body.firstName + " " + req.body.lastName, 
                                    firstName   : req.body.firstName,
                                    lastName    : req.body.lastName,
                                    emailId     : req.body.email,
                                });
                                profile.save()
                                       .then(data => {
                                            res.status(200).json({
                                                            errorCode   : 0,
                                                            errorMsg    : "User created",
                                                            response    :  {
                                                                                "userCode" : user.userCode,
                                                                                "userName" : data.fullName,
                                                                            }
                                                        });     
                                       })
                                       .catch(err=>{
                                            console.log("Profile Error ",err.message)
                                            res.status(500).json({
                                                        error: err.message
                                                    });
                                        })          
                            })
                            .catch(err=>{
                                console.log("User Error ",err.message)
                                res.status(500).json({
                                            error: err.message
                                        });
                            })          
                    })
                    .catch(err=>{
                        console.log("User Find Error ",err.message)

                        res.status(500).json({
                                    error: err.message
                                });
                    })
                //end
            }
        })
        .catch(err=>{
            console.log("User Find Outer Error ",err.message)
            res.status(500).json({
                        error: err.message
                    });
        })
};

exports.user_login = (req,res,next)=>{
    var selector = { $or: [ { userName: req.body.userCode } , { userCode : parseInt(req.body.userCode) } ] } ;
    User.findOne(selector)
    .exec()
    .then(user => {
        if(user){
            var pwd = user.password;
            if(user.password === req.body.password){
               const token = jwt.sign({
                            userCode : req.body.userCode,
                            userId   :  user._id ,
                            password : req.body.password,
                            date     : new Date()
                        },
                            globalVariable.JWT_KEY,
                        {
                            expiresIn: "365 days"
                        });
                        User.updateOne(
                        { 
                            "userCode":req.body.userCode
                        },
                        {
                            $push : {
                                "loginTokens" : {
                                    when: new Date(),
                                    hashedToken : token
                                }
                            }
                        }
                        )
                        .exec()
                        .then(updateUser=>{
                            if(updateUser.nModified == 1){
                                return res.status(200).json({
                                                                errorCode   : 0,
                                                                errorMsg    : "AUTH - SUCCESSFULLY",
                                                                response    :  {
                                                                                    token               : token,
                                                                                    userCode            : user.userCode,
                                                                                    mobileNo            : user.userName,
                                                                                    fullName            : user.fullName,
                                                                                    role                : user.role
                                                                                }
                                                            });                              
                            }
                        })
                        .catch(err=>{
                            console.log("500 err ",err);
                            res.status(500).json(err.message);
                        });
            }else{
                res.status(200).json({message:"Please verify your password"});
            }
        }else{
            console.log("401 Error - User Not FounD");
            res.status(200).json({message:"User is not registered"});
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.update_userName = (req,res,next) => {
    User.updateOne(
                    { userCode : req.body.userCode },
                    {
                        $set : {
                                    userName : req.body.mobileNo,
                                    role     : req.body.role
                                }
                    }
                )
        .then(data=>{
            if(data.nModified != 1){
                res.status(200).json({message : "User Mobile Number Not Updated"})
            }else{
                res.status(200).json({message : "User Mobile Number Updated"})
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};