const DigestStrategy = require('passport-http').DigestStrategy;

const initializePassport = (passport, getUserByName) => {
    const validate = (params, done) => {
        done(null, true);
    }
    const authenticateUser = (user, done) => {
        
        const currentUser = getUserByName(user);
        if (currentUser == null) {
            return done(null, false, { message: 'This user is not exist'});
        } else {
            return done(false, currentUser.username, currentUser.password);
        }

    }
    passport.use(new DigestStrategy({ qop: 'auth' }, authenticateUser, validate));
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

}

module.exports = initializePassport;