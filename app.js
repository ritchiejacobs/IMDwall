var mongDb = require('./db');
var express = require('express');
var routes = require('./routes');
var ask = require('./routes/ask');
var moderate = require('./routes/moderate');
var questions = require('./routes/questions');
var http = require('http');
var path = require('path');
var faye = require('faye');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'wMj9SmtvVfNX0w3T38rw'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routing
app.get('/', routes.index);
app.get('/ask', ask.index);

app.get('/questions', questions.index);
app.post('/create', questions.create);
app.get('/update', questions.update);
app.post('/delete', questions.delete);

app.get('/moderate', moderate.index);
app.post('/moderate', moderate.login);

// Faye
var server = http.createServer(app);
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

bayeux.attach(server);
server.listen(app.get('port'));