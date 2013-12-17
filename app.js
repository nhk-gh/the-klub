
/**
 * Module dependencies.
 */

var   express = require('express')
    , routes = require('./routes/routes')
    , login = require('./routes/login_routes')
    , photo_routes = require('./routes/photo_routes')
    , http = require('http')
    , path = require('path');

var app = express();

// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
/*
app.use(function(req, res, next){
    if (req.session.user == null){

        //console.log('!!!!!  Route: ' + req.path);

        switch(req.path) {
            case '/addcomment':
            case '/addPhoto':
            case '/editPhoto':
            case '/deletePhoto':
            case '/newgenre':
            case '/editprofile':
               // res.render('index', {title:"Klub° Photo Gallery", loggedUser:req.session.user, returnTo:'2'});
                return;
        }
    }
    next();

});
*/
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('/home/ubuntu/klub-imgs', {maxAge: 31557600000}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post("/register", login.register);
app.post("/login", login.login);
app.post("/logout", login.logout);
app.post("/passwordreminder", login.passwordReminder);

app.get("/countrieslist", login.countriesList);
app.post("/editprofile", login.editprofile);

app.get('/', routes.index);
app.get('/sidebar', routes.sidebar);
app.get('/thumbs', routes.thumbs1);
app.get('/randomPhoto', routes.randomPhoto);
app.get('/singlePhoto', routes.singlePhoto1);
app.get('/deletePhoto', routes.deletePhoto);
app.post('/addComment', routes.addComment);

app.get("/addPhoto", photo_routes.addPhoto);
app.post("/addPhoto", photo_routes.addPhoto);

app.get("/editPhoto", photo_routes.editPhoto);
app.post("/editPhoto", photo_routes.editPhoto);

app.post("/newGenre", photo_routes.newGenre);

routes.initDB();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
