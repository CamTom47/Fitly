const express = require('express');
const router = express.Router();
const { Circuit } = require('../models/circuit')
const jsonschema = require('jsonschema')
const newCircuitSchema = require('../schemas/circuit/circuitNew.json');
const updatedCircuitSchema = require('../schemas/circuit/circuitUpdate.json');
const { BadRequestError } = require('../ExpressError');
const { ensureLoggedIn } = require('../middleware/auth');
const { circuitMapper } = require('../helpers/circuitMapper')


/**
 * GET /circuits => {circuits}
 * 
 * Authorization reuquired: logged in 
 */

router.get('/', ensureLoggedIn, async function( req, res, next) {
    try{ 
        const circuits = await Circuit.findAll(res.locals.user.id);
        return res.json({circuits})

    } catch(err){
        return next(err);
    }
})

/**
 * GET /circuits/:circuit_id => {circuit}
 * 
 * Authorization required: logged in 
 */


router.get('/:circuit_id', ensureLoggedIn, async function(req, res, next){
    try{ 
        const circuit_id = req.params.circuit_id;
        const circuit = await Circuit.find(res.locals.user.id, circuit_id);

        return res.json({circuit})

    } catch(err){
        return next(err);
    }
})

/**
 * POST /circuits => {circuit}
 * 
 * Authorization required: logged in
 */

router.post('/', ensureLoggedIn, async function(req, res, next){
    try{
        const data = circuitMapper(req.body);
        const validator = jsonschema.validate(data, newCircuitSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        
        const circuit = await Circuit.add(data);
        return res.status(201).json({circuit});

    } catch(err){
        return next(err)
    }
})

/**
 * PATCH /circuits/:circuit_id => {circuit}
 * 
 * Authorization required: Correct User or Admin
 */

router.patch('/:circuit_id', ensureLoggedIn, async function(req, res, next) {
    try{
        const data = circuitMapper(req.body)
        const validator = jsonschema.validate(data, updatedCircuitSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs);
        }

        const id = req.params.circuit_id;
        const updatedCircuit = await Circuit.update(id, data);

        return res.json({updatedCircuit});

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

router.delete('/:circuit_id', ensureLoggedIn, async function(req, res, next) {
    try{ 
        const id = req.params.circuit_id;
        await Circuit.remove(id);

        return res.json({message: "deleted"})

    } catch(err){
        return next(err)
    }
})

router.post("/:circuit_id/exercises/:exercise_id", ensureLoggedIn, async function(req, res, next){
    try{
        const circuit_id = req.params.circuit_id;
        const exercise_id = req.params.exercise_id;

        const circuitExercise = await Circuit.addCircuitExercise(circuit_id, exercise_id);

        return res.status(201).json({circuitExercise});

    } catch (err) {
        return next(err);
    }
})

router.patch("/:circuit_id/exercises/:exercise_id", ensureLoggedIn, async function(req, res, next){
    try{
        const circuit_id = req.params.circuit_id;
        const exercise_id = req.params.exercise_id;

        const circuitExercise = await Circuit.updateCircuitExercise(circuit_id, exercise_id);

        return res.status(200).json({circuitExercise});

    } catch (err) {
        return next(err);
    }
})