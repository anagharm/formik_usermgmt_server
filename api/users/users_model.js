const mongoose = require('mongoose');
const Joi 	   = require('joi');
const userSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
	createdAt	: { type : Date , default : Date.now },
	password 	: { type : String , required : true },
	userCode 	: { type : Number , required : true , unique : true , min : 10001 , max : 19999 },
	userName	: { type : String , required : true , unique : true },
	fullName 	: { type : String },
	emails		: { type : String , required : true , unique : true},
	verified	: { type : Boolean },
	role 		: { type : String },
	loginTokens : [
					{
						when : Date,
						hashedToken : String
					}
				]
});

module.exports = mongoose.model('users',userSchema);
