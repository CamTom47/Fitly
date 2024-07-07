const express = require('express');
const { Category } = require('../models/category');

const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require('../middleware/auth');
const { BadRequestError } = require('../ExpressError');

/**
 * GET /categories  => {categories}
 * 
 * Categories => { name, description}
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
 * GET /categories/:category => {category}
 * 
 * category => {name, description}
 * 
 * Authorization required: logged in
 */

router.get('/:category', ensureLoggedIn, async function(req, res, next){
try{
    const name = req.params;
    const category = Category.find(name);

    return res.json({category});

} catch(err){
    return next(err)
}
})

module.exports = router;