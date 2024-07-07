const express = require('express');
const router = express.Router();
const { Circuit } = require('../models/circuit')


const jsonschema= require('jsonschema')
const newCircuitSchema = require('../schemas/ciruit/circuitNew.json');
const updatedCircuitSchema = require('../schemas/ciruit/circuitUpdate.json');

const { BadRequestError } = require('../ExpressError');
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require('../middleware/auth');

/**
 * GET /circuits => {circuits}
 * 
 * Authorization reuquired: logged in 
 */

router.get('/', ensureLoggedIn, async function( req, res, next) {
    try{ 
        const circuits = await Circuit.findAll();
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
        const id = req.params;
        const circuit = await Circuit.find(id);

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
        const validator = jsonschema.validate(req.body, newCircuitSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newCircuit = await Circuit.add(req.body);
        return res.status(201).json({newCircuit});

    } catch(err){
        return next(err)
    }
})

/**
 * PATCH /circuits/:circuit_id => {circuit}
 * 
 * Authorization required: Correct User or Admin
 */

router.patch('/:circuit_id', ensureCorrectUserOrAdmin, async function(req, res, next) {
    try{
        const validator = jsonschema(req.body, updatedCircuitSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs);
        }

        const id = req.params;
        const updatedCircuit = await Circuit.update(id, req.body);

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

router.delete('/:circuit_id', ensureCorrectUserOrAdmin, async function(req, res, next) {
    try{ 

        const id = req.params;
        await Circuit.delete(id);

        return res.json({message: "delete"})

    } catch(err){
        return next(err)
    }
})

router.post("/:circuit_id/exercises/:exercise_id", ensureCorrectUserOrAdmin, async function(req, res, next){
    try{
        const circuit_id = req.params.circuit_id
        const exercise_id = req.params.exercise_id

        const newCircuitExercise = Circuit.addCircuitExercise(circuit_id, exercise_id);

        return res.status(201).json({newCircuitExercise});

    } catch (err) {
        return next(err);
    }
})