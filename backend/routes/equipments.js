const express = require('express');
const router = express.Router();
const { Equipment } = require('../models/equipment')


const jsonschema= require('jsonschema')

const { BadRequestError } = require('../ExpressError');
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require('../middleware/auth');

/**
 * GET /equipment  => {equipment}
 * 
 * equipment => { name}
 * 
 * Authorization required: logged in
 */

router.get('/', ensureLoggedIn,  async function(req, res, next) {
    try{
        const categories = await Category.findAll();

        return res.json({categories});


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
    const id = req.params;
    const equipment = Equipment.find(id);

    return res.json({equipment});

} catch(err){
    return next(err)
}
})

module.exports = router;