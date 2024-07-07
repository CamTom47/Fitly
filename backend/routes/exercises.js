const express = require('express');
const router = express.Router();
const { Exercise } = require('../models/exercise')


const jsonschema = require('jsonschema')
const newExerciseSchema = require('../schemas/exercise/exerciseNew.json')
const updatedExerciseSchema = require('../schemas/exercise/exerciseUpdate.json')

const { BadRequestError } = require('../ExpressError');
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require('../middleware/auth');

/**
 * GET /exercises => {exercises}
 * 
 * Authorization reuquired: logged in 
 */

router.get('/', ensureLoggedIn, async function( req, res, next) {
    try{ 
        const exercises = await Exercise.findAll();
        return res.json({exercises})

    } catch(err){
        return next(err);
    }
})

/**
 * GET /exercises/:exercise_id => {exercise}
 * 
 * Authorization required: logged in 
 */

router.get('/:exercise_id', ensureLoggedIn, async function(req, res, next){
    try{ 
        const id = req.params;
        const exercise = await Exercise.find(id);

        return res.json({exercise})

    } catch(err){
        return next(err);
    }
})

/**
 * POST /exercises => {exercise}
 * 
 * Authorization required: logged in
 */

router.post('/', ensureLoggedIn, async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, newExerciseSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newExercise = await Exercise.add(req.body, res.locals.user.id);
        return res.status(201).json({newExercise});

    } catch(err){
        return next(err)
    }
})

/**
 * PATCH /exercises/:exercise_id => {exercise}
 * 
 * Authorization required: Correct User or Admin
 */

router.patch('/:exercise_id', ensureCorrectUserOrAdmin, async function(req, res, next) {
    try{
        const validator = jsonschema(req.body, updatedExerciseSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs);
        }

        const id = req.params;
        const updateExercise = await Exercise.update(id, req.body);

        return res.json({updateExercise});

    } catch(err){
        return next(err);
    }
})

module.exports = router;

/**
 * DELETE /circuits/:circuit_id
 * 
 * Authorization required: Correct user or admin
 */

router.delete('/:exercise_id', ensureCorrectUserOrAdmin, async function(req, res, next) {
    try{ 

        const id = req.params;
        await Exercise.delete(id);

        return res.json({message: "delete"})

    } catch(err){
        return next(err)
    }
})