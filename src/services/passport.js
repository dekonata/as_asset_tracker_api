// middlewares/passport.js
const bcrypt = require('bcrypt')
const passport = require('passport');
const LocalStrategy = require('passport-local');

const { getUser } = require('../models/staff.model.js')

async function validatePassword(password, hash) {
    const check = await bcrypt.compare(password, hash);
    return check
}

// 
async function verifyCallback(email, password, done) {
    const user = await getUser(email.toLowerCase());
    if(!user) { return done(null, false); }
    const verifyPassword = await validatePassword(password, user.hash);
    if(!verifyPassword) { return done(null, false); }
    return done(null, user.staff_id);
}


const localStrategy = new LocalStrategy({usernameField: 'email'}, verifyCallback);

passport.use(localStrategy);

module.exports = passport;