const app = require('express')();
const users = require('./users.json');
const passport = require('passport');
const session = require('express-session');
const initializePassport = require('./basicPassport');

initializePassport(
    passport,
    name => users.find(user => user.username === name),
    id => users.find(user => user.id === id)
)

app.use(session({
    secret: "2131",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


app.get('/login', (req, res, next) => {
    if (req.session.logout && req.headers['authorization']){
        req.session.logout = false;
        req.logout();
        delete req.headers['authorization'];
    }
    next();
})
app.get('/login', passport.authenticate('basic'), (req, res) => {
    res.send(`Welcome ${req.user.username}`);
})

app.get('/resource', (req, res) => {
    req.isAuthenticated()?res.send('Smth secret'):res.redirect('/login');
})

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
})

app.get('*', (req, res) => {
    req.statusCode = 404;
    req.statusMessage = `${req.url} not found`;
    res.send(req.statusMessage);
})

app.listen(3000);