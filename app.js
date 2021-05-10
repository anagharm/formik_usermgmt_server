const express 			= require ('express');
const app 				= express();
const morgan 			= require('morgan');// morgan call next function if problem occure
const bodyParser 		= require('body-parser');// this package use to formate json data 
const mongoose 			= require ('mongoose');
const globalVariable 	= require("./nodemon.js");
var path 				= require('path');
var cookieParser 		= require('cookie-parser');
var cors 				= require('cors');

const dbname 			= globalVariable.dbname;
global.JWT_KEY 			= globalVariable.JWT_KEY;


/*Include all the Routes Used*/
const usersRoutes 				= require("./api/users/users_routes.js");
const profileRoutes 			= require("./api/profiles/profiles_routes.js");

// mongoose.connect('mongodb://localhost/'+dbname,{
mongoose.connect('mongodb://localhost/'+dbname,{
	useNewUrlParser: true,
	useUnifiedTopology: true
})
mongoose.promise =global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));// urlencode true and false simple-body url data
app.use(bodyParser.json());// it show json data in good manner

app.options('*', cors()) 
app.use(cors());
/*Call the URL for Routes*/

app.use("/api/user",usersRoutes);
app.use("/api/profile",profileRoutes);

// handle all other request which not found 
app.use((req, res, next) => {
	const error = new Error('Not Found Manual ERROR');
	error.status = 404;
	next(error);
		// when we get 404 error it send to next 
});

// it will handel all error in the application
app.use((error, req, res, next) => {
	// 500 type error is used when we use database
	res.status(error.status || 500);
	res.json({
		error:{
			message:error.message
		}
	})
});

module.exports = app;