const express = require('express');
const router = express.Router();
const { Exercise } = require('../models/exercise')


const jsonschema = require('jsonschema')
const newExerciseSchema = require('../schemas/exercise/exerciseNew.json')
const updatedExerciseSchema = require('../schemas/exercise/exerciseUpdate.json')

const { BadRequestError } = require('../ExpressError');
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require('../middleware/auth');

const { exerciseMapper } = require('../helpers/exerciseMapper')

/**
 * GET /exercises => {exercises}
 * 
 * Authorization reuquired: logged in 
 */

router.get('/', ensureLoggedIn, async function( req, res, next) {
    try{ 
        const exercises = await Exercise.findAll(res.locals.user.id);
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
        const exercise_id = req.params.exercise_id
        const exercise = await Exercise.find(res.locals.user.id, exercise_id);

        return res.json({exercise});

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
        const data = exerciseMapper(req.body)
        const validator = jsonschema.validate(data, newExerciseSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        };

        const exercise = await Exercise.add(data);
        const exerciseEquipment = await Exercise.addExerciseEquipment(exercise.id, data.equipment_id);
        exercise.equipmentId = exerciseEquipment.equipment_id
        await Exercise.addUserExercise(res.locals.user.id, exercise.id)
        return res.status(201).json({exercise});

    } catch(err){
        return next(err)
    }
})

/**
 * PATCH /exercises/:exercise_id => {exercise}
 * 
 * Authorization required: Correct User or Admin
 */

router.patch('/:exercise_id', ensureLoggedIn, async function(req, res, next) {
    try{
        const data = exerciseMapper(req.body)

        const validator = jsonschema.validate(data, updatedExerciseSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs);
        }
        
        const id = req.params.exercise_id;
        const {name, muscle_group, equipment_id} = data;
        const updatedExercise = await Exercise.update(id, {name, muscle_group}, equipment_id);

        return res.json({updatedExercise});

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

router.delete('/:exercise_id', ensureLoggedIn, async function(req, res, next) {
    try{ 

        const id = req.params.exercise_id;
        await Exercise.remove(id);

        return res.json({message: "delete"})

    } catch(err){
        return next(err)
    }
})