var mongoose = require('mongoose');
var Question = mongoose.model('Question');

// Index: display all questions in database
exports.index = function(request, response) 
{
	Question
		.find()
		.sort({'votes': 'desc'})
		.exec(function(err, questions)
		{
			response.render('questions', 
			{
				title: 'All questions',
				questions: questions
			});
		});
}

// Create
exports.create = function(request, response) 
{
	new Question(
	{
		username: request.body.username,
		question: request.body.question,
		votes: 0
	})
	.save( function(err, question)
	{ 
		response.redirect( '/ask' ); 
	});
}

// Update
exports.update = function(request, response) 
{
	var questionType = request.query.type;
	var questionID = request.query.id;

	Question.findById( questionID, function (err, question)
	{
		switch(questionType)
		{
			case "upvote":
			{
				question.votes += 1;
			}
			break;

			case "downvote":
			{
				question.votes -= 1;
			}
			break;
		}

		question.save( function (err, question)
		{
     		response.redirect( '/questions' );
	    });
	});
}

// Delete
exports.delete = function(request, response) 
{
	var questionID = request.body.id;

	Question.findById( questionID, function ( err, question )
	{
		question.remove( function ( err, question )
		{
			response.redirect( '/moderate' );
		});
	});
}