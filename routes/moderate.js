var mongoose = require('mongoose');
var Question = mongoose.model('Question');
var User = mongoose.model('User');
var isLoggedIn = false;

exports.index = function (req, res)
{
	if(req.session.isLoggedIn)
	{
		Question
				.find()
				.sort({'votes': 'desc'})
				.exec(function(err, questions)
				{
					res.render('moderate', 
					{
						title: 'Moderation page',
						questions: questions,
						isLoggedIn: true
					});
				});
	}
	else
	{
		res.render('moderate', 
		{
			title: 'Moderation page',
			username: ''
		});
	}
};

exports.login = function (req, res)
{
	User
		.findOne({ 
			'username': req.body.username,
			'password': req.body.password
		})
		.exec(function(err, user)
		{
			if(user)
			{
				req.session.isLoggedIn = true;
				res.redirect( '/moderate' );
			}
			else
			{
				res.send({hasError: true});
			}
		});
};