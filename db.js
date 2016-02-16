var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Question = new Schema({
	username: String,
    question: String,
    votes: Number
});

var User = new Schema({
	username: String,
    password: String,
});

mongoose.model( 'Question', Question );
mongoose.model( 'User', User );

mongoose.connect( 'mongodb://localhost/IMDwall' )

// Create admin
var User = mongoose.model('User');
var adminName = "admin";
var adminPass = "password";

mongoose.connection.on('open', function()
{
	User
		.findOne({
			'username': adminName,
			'password': adminPass
		})
		.exec(function(err, user)
		{
			if(!user)
			{
				console.log("not exists");
				new User(
				{
					username: adminName,
					password: adminPass,
				})
				.save( function(err, user)
				{
				});
			}
		});
});
