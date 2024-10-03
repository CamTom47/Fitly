const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');
const jsonschema  = require('jsonschema')

const categoryNewSchema = require('../schemas/categories/categoryNew.json')
const categoryUpdateSchema = require('../schemas/categories/categoryUpdate.json')

const { ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError } = require('../ExpressError');

const {categoryMapper} = require('../helpers/categoryMapper')


/**
 * GET /categories  => {categories}
 * 
 * Categories => { name, description}
 * 
 * Authorization required: logged in
 */

router.get('/', ensureLoggedIn,  async function(req, res, next) {
    try{

        const categories = await Category.findAll(res.locals.user.id);

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

router.get('/:category_id', ensureLoggedIn, async function(req, res, next){
try{

    let category_id = req.params.category_id;
    const category = await Category.find(category_id);

    return res.json({category});

} catch(err){
    return next(err)
}
})

/**
 * Create a new workout category
 * 
 * POST /categories => {category}
 * 
 * Authorization required: logged in
 */

router.post('/', ensureLoggedIn, async function(req, res, next) {
    try{
        
        const data = categoryMapper(req.body);
        const validator = jsonschema.validate({...data, systemDefault: false}, categoryNewSchema);
        if(!validator.valid){
            const errs = validator.errors.map( err => err.stack);
            throw new BadRequestError(errs);
        }

        let category = await Category.add(data);

        return res.status(201).json({category});

    } catch(err){
        return next(err);
    }
})

/**
 * Update and existing category
 * 
 * PATCH /categories/:category_id  => {category}
 * 
 * Authorization required: correct user or admin
 */

router.patch('/:category_id', ensureLoggedIn, async function(req, res, next) { 
    try{
        const data = categoryMapper(req.body);
        const validator = jsonschema.validate(data, categoryUpdateSchema);
        if(!validator.valid){
            const errs = validator.errors.map(err => err.stack);
            throw new BadRequestError(errs);
        }


        const category = await Category.update(req.params.category_id, data);
        return res.json({category});

    } catch(err){
        return next(err);
    }
})

router.delete('/:category_id', ensureLoggedIn, async function(req,res,next){
    try{
        const id = req.params.category_id;
        Category.remove(id);

        return res.json({message: "deleted"})

    } catch(err){
        return next(err)
    }
})

module.exports = router;