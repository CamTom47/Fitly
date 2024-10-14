const express = require('express');
const router = express.Router();
const { Workout } = require('../models/workout')


const jsonschema = require('jsonschema')
const newWorkoutSchema = require('../schemas/workout/workoutNew.json')
const updatedWorkoutSchema = require('../schemas/workout/workoutUpdate.json')

const { BadRequestError } = require('../ExpressError');
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require('../middleware/auth');

/**
 * GET /workouts => {workouts}
 * 
 * Authorization reuquired: logged in 
 */

router.get('/', ensureLoggedIn, async function( req, res, next) {
    try{ 
        const queryData = req.query;
        console.log(queryData)
        const workouts = await Workout.findAll(res.locals.user.id, queryData);
        return res.json({workouts})
    } catch(err){
        return next(err);
    }
})

/**
 * GET /workouts/:workout_id => {workout}
 * 
 * Authorization required: logged in 
 */

router.get('/:workout_id', ensureLoggedIn, async function(req, res, next){
    try{ 
        const workout_id = req.params.workout_id;
        const workout = await Workout.find(workout_id, res.locals.user.id);

        return res.json({workout})

    } catch(err){
        return next(err);
    }
})

/**
 * POST /workouts => {workout}
 * 
 * Authorization required: logged in
 */

router.post('/', ensureLoggedIn, async function(req, res, next){
    try{
        req.body.user_id = res.locals.user.id
        const validator = jsonschema.validate(req.body, newWorkoutSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newWorkout = await Workout.add(req.body);
        return res.status(201).json({newWorkout});

    } catch(err){
        return next(err)
    }
})

/**
 * PATCH /workouts/:workout_id => {workout}
 * 
 * Authorization required: Correct User or Admin
 */

router.patch('/:workout_id', ensureLoggedIn, async function(req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, updatedWorkoutSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs);
        }

        const id = req.params.workout_id;
        const updatedWorkout = await Workout.update(id, req.body);

        return res.json({updatedWorkout});

    } catch(err){
        return next(err);
    }
})

module.exports = router;

/**
 * DELETE /workouts/:workout_id
 * 
 * Authorization required: Correct user or admin
 */

router.delete('/:workout_id', ensureLoggedIn, async function(req, res, next) {
    try{ 
        const id = req.params.workout_id;
        await Workout.remove(id);

        return res.json({message: "delete"})

    } catch(err){
        return next(err)
    }
})


/**
 * POST /workouts/workout_id/circuits/:circuits_id
 */
router.post('/:workout_id/circuits/:circuit_id', ensureLoggedIn, async function(req, res, next){
    try{
        const workout_id = req.params.workout_id;
        const circuit_id = req.params.circuit_id;

        const workoutCircuit = await Workout.addCircuit(workout_id, circuit_id);

        return res.json({workoutCircuit});

    } catch(err){
        return next(err);
    }
})