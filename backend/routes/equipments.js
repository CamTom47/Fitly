const express = require('express');
const router = express.Router();
const { Equipment } = require('../models/equipment');
const { User } = require('../models/user');


const jsonschema= require('jsonschema')
const equipmentNewSchema = require('../schemas/equipment/equipmentNew.json');
const equipmentUpdateSchema = require('../schemas/equipment/equipmentUpdate.json');


const { BadRequestError } = require('../ExpressError');
const { ensureLoggedIn } = require('../middleware/auth');

/**
 * GET /equipment  => {equipment}
 * 
 * equipment => {name}
 * 
 * Authorization required: logged in
 */

router.get('/', ensureLoggedIn,  async function(req, res, next) {
    try{
        const equipments = await Equipment.findAll(res.locals.user.id);

        return res.json({equipments});


    } catch(err){
        return next(err);
    }
})

/**
 * GET /equipment/:equipment_id => {equipment}
 * 
 * equipment => {name}
 * 
 * Authorization required: logged in
 */

router.get('/:equipment_id', ensureLoggedIn, async function(req, res, next){
    try{

        const equipment_id = req.params.equipment_id;
        const equipment = await Equipment.find(equipment_id, res.locals.user.id);

        return res.json({equipment});

    } catch(err){
        return next(err)
    }
}
)

/**
 * Allows user to add equipment to the Fitly Application
 * 
 * POST / => {equipment}
 * 
 * equipment => { id, name }
 * 
 * Authorization: logged in
 */

router.post('/', ensureLoggedIn, async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, equipmentNewSchema);
        if (!validator.valid){
            const errs = validator.errors.map(err => err.stack);
            throw new BadRequestError(errs);
        }

        const equipment = await Equipment.add(req.body);
        return res.status(201).json({equipment});
        
    } catch(err){
        return next(err);
    }
})

/**
 * Update an existing equipment item in the application
 * 
 * PATCH /:equipment_id => {equipment}
 * 
 * equipment => {id, name}
 * 
 * Authorization required: correct user or admin
 */

router.patch('/:equipment_id', ensureLoggedIn, async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, equipmentUpdateSchema);
        if (!validator.valid){
            const errs = validator.errors.map(err => err.stack);
            throw new BadRequestError(errs);
        }

        const id = req.params.equipment_id;
        const equipment = await Equipment.update(id,req.body);
        return res.json({equipment});
        
    } catch(err){
        return next(err);
    }
})

/**
 * Remove equipment from the Fitly Application
 * 
 * DELETE /:equipment_id => {message}
 * 
 * Authorization required: correct user or admin
 */

router.delete('/:equipment_id', ensureLoggedIn, async function(req, res, next){
    try{

        const id = req.params.equipment_id;

        const result = await Equipment.remove(id);

        return res.json({message: "deleted"})

    } catch(err){
        return next(err);
    }
})


module.exports = router;