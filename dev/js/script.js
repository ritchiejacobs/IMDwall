var client = new Faye.Client('/faye');

// Ask
if( $('.ask').length != 0 )
{
	$('.ask').hide();
	$('.site-nav-ask').on('click', function() 
	{
		$('.ask').slideToggle(300);
	})
}

// Forms
$('form').on('submit', submitHandler);

function submitHandler(e) 
{
	var _this = $(this);
	var formArr = $(this).find('input[type="text"], input[type="password"], textarea').toArray();
	var formError = formValidator(formArr);

	$('.error').remove();

	if( formError )
	{
		$(this).prepend( $('<div class="form-group error">') );
		$('.error').append( $('<p>').text( formError ) );
	}
	else
	{
		if( $(this).attr('class') == "ask-form" || $(this).attr('class') == "ask-form-invert" )
		{
			$.post('/create', {
				username: $('#username').val(),
				question: $('#question').val()
			}).done(function(data) {
				client.publish('/getQuestions', {});
			});
		}
		else if( $(this).attr('class') == "login-form" )
		{
			$.post('/moderate', {
				username: $('#username').val(),
				password: $('#password').val()
			}).done(function(data) {
				if(data.hasError)
				{
					formError = "Wrong username and password combination.";
					_this.prepend( $('<div class="form-group error">') );
					$('.error').append( $('<p>').text( formError ) );
				}
				else
				{
					var content = $(data)[5];
					$('.ask-container').replaceWith(content);
					$('.delete').on('click', clickHandler);
				}
			});
		}

		$(formArr[0]).val('');
		$(formArr[1]).val('');
	}

	return false;
}

// Form validation
function formValidator(arr) 
{
	var errorMessage = "";

	for( var i = 0; i < arr.length; i++  ) 
	{
		if( $(arr[i]).val() == "" )
		{
			errorMessage =  "Please enter your " + $(arr[i]).attr('id') + ".";
			return errorMessage;
		}
	}

	return false;
}

// Upvote / Downvote / Delete
$('.voteUp, .voteDown, .delete').on('click', clickHandler);

function clickHandler(e) 
{
	var voteType = $(this).text();
	var questionID = $(this).parents('.list-group-item').attr('id');
	var ajaxUrl = "";
	var ajaxType = "get";
	var ajaxData = "";

	$(this).off('click', clickHandler);

	if(voteType == "vote up")
	{
		voteType = "upvote";
	}
	else if(voteType == "vote down")
	{
		voteType = "downvote"
	}

	ajaxUrl = "update?type="+voteType+"&id="+questionID+"";

	if(voteType == "delete")
	{
		ajaxUrl = "/delete";
		ajaxType = "post";
		ajaxData = {id: questionID};
	}

	$.ajax({
		type: ajaxType,
		url: ajaxUrl,
		data: ajaxData
	})
		.done(function() 
		{
			client.publish('/getQuestions', {});
		});

	return false;
}

// Faye subscriptions
client.subscribe('/getQuestions', function(message) 
{
	if( $('.list-group').length != 0 )
	{
		var url = "/" + $('.list-group').attr('id');
		$.get(url).done(function(data) 
		{
			var newQuestions = $(data).find('.list-group').children();
			$('.list-group').empty()
							.append(newQuestions);

			$('.voteUp, .voteDown, .delete').on('click', clickHandler);
		});
	}
});