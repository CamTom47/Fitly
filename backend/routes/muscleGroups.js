const express = require('express');
const router = express.Router();
const { MuscleGroup } = require('../models/muscleGroup');



const { ensureLoggedIn } = require('../middleware/auth')



router.get('/', ensureLoggedIn, async (req, res, next) => {
    try{
        const muscleGroups = await MuscleGroup.findAll();
        return res.json({muscleGroups})
    } catch(err){
        return err
    }
})

router.get('/:muscleGroup_id', ensureLoggedIn, async (req, res, next) => {
    try{
        const muscleGroup_id = req.params.muscleGroup_id;
        const muscleGroup = await MuscleGroup.find(muscleGroup_id);
        return res.json({muscleGroup})
    } catch(err){
        return err
    }
})

module.exports = router;
