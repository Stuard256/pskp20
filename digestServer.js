const app = require('express')();
const users = require('./users.json');
const passport = require('passport');
const session = require('express-session');
const initializePassport = require('./digestPassport');


initializePassport(
    passport,
    name => users.find(user => user.username === name),
    id => users.find(user => user.id === id)
)

app.use(session({
    secret: "132"
}));
app.use(passport.initialize())
app.use(passport.session())

app.get('/login', (req, res, next) => {
    if (req.headers['authorization'] && req.session.logout){
        req.session.logout = false;
        req.logout();
        delete req.headers['authorization'];
    }
    next();
})

app.get('/login', passport.authenticate('digest', { session: true }), (req, res, next) => {
    res.send(`Hello, ${req.user}`);
})

app.get('/resource', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.send('resource');
    } else {
        res.redirect('/login');
    }
})

app.get('/logout', (req, res, next) => {
    req.session.logout = true;
    res.redirect('/login');
})

app.get('*', (req, res, next) => {
    req.statusCode = 404;
    req.statusMessage = 'Cannot get resource';
    res.send(`Error ${req.statusCode}: ${req.statusMessage}`);
})

app.listen(3000);