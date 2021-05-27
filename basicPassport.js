const BasicStrategy = require('passport-http').BasicStrategy;

const initializePassport = (passport, getUserByName, getUserById) => {
    const authenticateUser = (name, password, done) => {
        const user = getUserByName(name);
        console.log(user);
        if (user == null) {
            return done(null, false, { message: 'This user is not exist'});
        }
        if (password == user.password){
            return done(false, user);
        } else {
            return done(null, false, { message: 'Password Incorrect'});
        }

    }
    passport.use(new BasicStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initializePassport;