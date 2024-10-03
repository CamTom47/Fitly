const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const { ensureLoggedIn, ensureAdmin, ensureCorrectUserOrAdmin} = require('../middleware/auth');
const jsonschema = require('json-schema')
const userUpdateSchema = require('../schemas/user/userUpdate.json')
const { NotFoundError, BadRequestError } = require('../ExpressError');
const { userMapper } = require('../helpers/userMapper')


/**
 * GET /users/:username => { user }
 * 
 * {user: { username, first_name, last_name, email, password, is_admin}}
 * 
 * Throw NotFoundErorr if username is invalid
 */

router.get('/:username', ensureCorrectUserOrAdmin, async function(req, res, next) {
    try{
        const username = req.params.username;
        const user = await User.find(username);

        if(!user) throw new NotFoundError(`User ${username} not found `)
        return res.json({user})

    } catch(err){
        return next(err);
    }
} )

/**
 * PATCH /users/:username => {user}
 * 
 * {user: { username, first_name, last_name, email, password, is_admin}}
 * 
 * Throw BadRequestError if data is invalid
 * Throw NotFoundError if username is invalid
 */
router.patch('/:username', ensureCorrectUserOrAdmin, async function(req, res, next) {
    try{
        const username = req.params.username;
        console.log('req.body', req.body)
        const data = userMapper(req.body);
        console.log("data", data);

        const validator = jsonschema.validate(data, userUpdateSchema);

        if(!validator.valid){
            const errs = validator.errors.map( e => e.stack)
            throw new BadRequestError(errs)
        }

        const user = await User.update(username, data);

        if(!user) throw new NotFoundError(`User ${username} not found`)

        return res.json({user})

    } catch(err){
        return next(err);
    }
} )

router.delete('/:username', ensureCorrectUserOrAdmin, async function(req, res, next) {
    try{
        const username = req.params.username;
        await User.remove(username);
        return res.json({message: "deleted"})

    } catch(err){
        return next(err);
    }
})





module.exports = router;