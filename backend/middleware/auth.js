const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../confing');
const { UnauthorizedError } = require('../ExpressError');


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

const authenticateJWT = ((req, res, next) => {
    try{
        const authHeader = req.headers && req.headers.authorization;

        if(authHeader){
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, {SECRET_KEY});
        }
        return next();

    } catch(err){
        return next(err);
    }
})

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

const ensureLoggedIn = (req, res, next) => {
    try{
        if(!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch(err){
        return next(err);
    }
}

/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

const ensureAdmin = (req, res, next) => {
    try{
        if(!res.locals.user.isAdmin) throw new UnauthorizedError();
        return next();
    } catch(err){
        return next(err);
    }
}


/** Middleware to user when a user must be logged in or needs to be an admin
 * 
 * If not, raises Unauthorized
 */

const ensureCorrectUserOrAdmin = ( req, res, next) => {
    try{
        if(!(user && (user.isAdmin || user.username === req.user.useraname))) {
            throw new UnauthorizedError();
        }
    } catch(err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin
}