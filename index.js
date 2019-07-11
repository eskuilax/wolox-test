const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser'); 
const flash = require('connect-flash');

//initiallitiation
require('./database');

//setting
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
})); 
app.set('view engine', '.hbs');

//midlewares
app.use(session({
    secret: 'w0l0x',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

//global variables
app.use((req, res, next)=>{
    res.locals.usersesion = req.session;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/user'));
app.use(require('./routes/albums'));
app.use(require('./routes/sharedAlbums'));
app.use(require('./routes/comments'));

//server is listening
app.listen(app.get('port'), () =>{
    console.log('server on port ',  app.get('port'));
});

//static files
app.use(express.static(path.join(__dirname,'public')));