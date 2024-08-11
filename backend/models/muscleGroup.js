const db = require('../db');
const { 
    ExpressError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError
} = require('../ExpressError');


class MuscleGroup {

    /**
     * Get all muscleGroups
     * 
     * @returns { id, name }
     */

    static async findAll(){
        const result = await db.query(`
            SELECT id, name 
            FROM muscleGroups
            `);

            if(!result) throw BadRequestError('Request invalid')

            return result.rows  
    }
    
    static async find(muscleGroup_id){
        const result = await db.query(`
            SELECT id, name 
            FROM muscleGroups
            WHERE id = $1
            `, [muscleGroup_id]);

            if(!result) throw BadRequestError('Request invalid')

            return result.rows[0]
    }
}

module.exports = {MuscleGroup}