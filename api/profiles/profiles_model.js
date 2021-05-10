const mongoose = require('mongoose');

const profilesSchema = mongoose.Schema({
	_id					: mongoose.Schema.Types.ObjectId,
	userCode 			: Number,
	userName 			: { type : String , required : true , unique : true },
	user_Id 			: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	title 				: String,
	fullName			: { type: String },
	firstName			: String,
	middleName 			: String,
	lastName 			: String,
	mobileNum			: { type : String , maxlength : 10 },
	emailId				: String,
	dob 				: String,
	gender 				: { type : String, enum : ['Female' , 'Male' , 'Other'] },
	role 				: String,
	address 			: {
								addressLine1 : String,
								addressLine2 : String,
								city 		 : String,
								state 		 : String,
								pincode 	 : String
							},
	createdAt			: { type   : Date , default : Date.now},
	createdBy 			: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('profiles',profilesSchema);
