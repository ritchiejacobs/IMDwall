var mongoose = require('mongoose');
var Question = mongoose.model('Question');

exports.index = function(request, response)
{
	Question
		.find()
		.sort({'votes': 'desc'})
		.exec(function(err, questions)
		{
			response.render('index', 
			{
				title: 'All questions',
				questions: questions
			});
		});
};