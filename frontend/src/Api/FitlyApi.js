import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** Fitly API Class
 * 
 * Static class typing together methods used to get/send to the Fitly API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't be any API-aware stuff elsehwere in the frontend
 */

class FitlyApi {
    //the token for interaction with API will be stored here.
    static token;

    static async request( endpoint, data = {}, method = "get"){
        console.debug("API Call:", endpoint, data, method)

        const url = `${BASE_URL}/${endpoint}`;
        let headers;
        
        (FitlyApi.token !== "") ? headers = { Authorization: `Bearer ${FitlyApi.token}` } : headers = null;
        const params = (method === "get")
            ? data
            : {};

            try{
                return (await axios({url, method, data, params, headers})).data;
            } catch(err) {
                console.error("API Error:", err.response);
                console.log(headers)
                let message = err.response.data.error.message;
                throw Array.isArray(message) ? message : [message];
            }
            }


            //Individual Fitly API routes

            //Front End user methods

            /**
             * Get a user's information
             * 
             * Parameter: {data}
             * 
             * {data: {token}}
             * 
             * Returns: 
             *  {"user": {
             *      "username",
             *      "firstName",
             *      "lastName",
             *      "password"
             *      "email",
        *           "isAdmin"}}
             */

            static async findUser(username){
                let res = await this.request(`users/${username}`)
                return res.user
            }

        /**
         * Authenticate a user and login
         * 
         * @param {*} data
         * 
         * {data: {username, password}}
         * 
         * @returns {token}
         */

        static async login(data){   
            let res = await this.request('auth/token', data, 'post')
            return res.token;
        }

        /** 
         * Sign up a user and create an account
         * 
         * @param {*} data
         *
         * {data: {username, password}}
         * 
         * @returns {token}
         */

        static async signup(data){
            let res = await this.request(`auth/register`, data, 'post')
            return res.token;
        }

        static async updateUser(username, data){
            let res = await this.request(`users/${username}`, data, 'patch');
            return res.user;
        }

        //Workout Methods
        
        /**
         * Find all workouts in the database that a user has created
         * 
         * 
         */

        static async findAllWorkouts(){
            let res = await this.request(`workouts/`);
            return res.workouts;

        }
        
        
        /**
         * 
         * @param {*} data 
         * {data : {user_id}}
         * 
         * @returns {workout}
         */

        static async findWorkout(data){
            console.log(data)
            let res = await this.request(`workouts/${data.workoutId}`);
            return res.workout;
        }
        
        /**
         * 
         * @param {*} data 
         * {data: {user_id}}
         * @returns {workout}
         */

        static async createWorkout(data){
            let res = await this.request(`workouts/`, data, 'post');
            return res.newWorkout;
        }

        /**
         * 
         * @param {*} data 
         * {data: {user_id}}
         * @returns {workout}
         */

        static async updateWorkout(workout_id,data){
            let res = await this.request(`workouts/${workout_id}`, data, 'patch');
            return res.updatedWorkout;
        }
        
        /**
         * 
         * @param {*} data 
         * {data: {user_id}}
         * @returns {message}
         */

        static async deleteWorkout(workoutId){
            let res = await this.request(`workouts/${workoutId}`, {}, 'delete');
            return res.workout;
        }

        static async addWorkoutCircuit(data){
            let res = await this.request(`workouts//${data.workoutId}/circuits/${data.circuitId}`, data, 'post');
            return res.workoutCircuit;
        }

        //Exercise Methods

        /**
         * Find all Exercises created by a user
         * @param {*} data 
         * {data: {user_id}}
         * @returns {exercises}
         */

        static async findAllExercises(data){
            let res = await this.request(`exercises/`, data, 'get');
            return res.exercises
        }
        

        /**
         * Find a specfic exercise created by a user
         * @param {*} data 
         * {data {user_id}}
         * @returns {exercise}
         */

        static async findExercise(data){
            let res = await this.request(`exercises/${data.exercise_id}`, data, 'get');
            return res.exercise
        }
        
        /**
         * Creates a new exercise
         * @param {*} data 
         * {data: {user_id}}
         * @returns {exercise}
         */

        static async createExercise(data){
            let exercise = await this.request(`exercises/`, data, 'post');
            return exercise
        }
        
        /**
         * Update an existing exercise
         * @param {*} data 
         * {data: {exercise}}
         * @returns {exercise}
         */
        static async updateExercise(exerciseId, data){
            let res = await this.request(`exercises/${exerciseId}`, data, 'patch');
            return res.updatedExercise
        }
        
        /**
         * Delete an existing exercise 
         * @param {*} data 
         * {data: {user_id}}
         * @returns {message}
         */

        static async deleteExercise(data){
            let res = await this.request(`exercises/${data.exercise_id}`, data, 'delete');
            return res.message
        }

        //Category Methods

        /**
         * Get all default categories and categories created by the user
         * @param {*} data 
         * {data: {user_id}}
         * @returns {categories}
         */

        static async findAllCategories(data){
            let res = await this.request(`categories/`, data, 'get');
            return res.categories
        }

        /**
         * Get a category by category_id
         * @param {*} data 
         * {data: {user_id}}
         * @returns {category}
         */
        static async findCategory(data){
            let res = await this.request(`categories/${data.category_id}`, data, 'get');
            return res.category;
        }

        /**
         * Create a new category
         * @param {*} data 
         * {data: {user_id}}
         * @returns {category}
         */

        static async createCategory(data){
            let res = await this.request(`categories/`, data, 'post');
            return res.category;
        }

        /**
         * Update an existing workout category
         * @param {*} data 
         * {data: {user_id}}
         * @returns {category}
         */

        static async updateCategory(data){
            let res = await this.request(`categories/:category_id`, data, 'patch');
            return res.category;
        }

        /**
         * Delete an existing workout category
         * @param {*} data 
         * {data: {user_id}}
         * @returns {message}
         */
        static async deleteCategory(data){
            let res = await this.request(`categories/:category_id`, data, 'delete');
            return res.category;
        }

        //Equipment Methods

        /**
         * Get all default equipments and equipment created by the user
         * @param {*} data 
         * {data: {user_id}}
         * @returns {equipments}
         */

        static async findAllEquipments(data){
            let res = await this.request(`equipments/`, data, 'get');
            return res.equipments
        }

        /**
         * Get a category by category_id
         * @param {*} data 
         * {data: {user_id}}
         * @returns {equipment}
         */
        static async findEquipment(data){
            let res = await this.request(`equipments/${data.equipment_id}`, data, 'get');
            return res.equipment;
        }

        /**
         * Create a new equipment
         * @param {*} data 
         * {data: {user_id}}
         * @returns {equipment}
         */

        static async createEquipment(data){
            let res = await this.request(`equipments/`, data, 'post');
            return res.equipment;
        }

        /**
         * Update an existing workout equipment
         * @param {*} data 
         * {data: {user_id}}
         * @returns {equipment}
         */

        static async updatEquipment(data){
            let res = await this.request(`equipments/:equipment_id`, data, 'patch');
            return res.equipment;
        }

        /**
         * Delete an existing workout equipment
         * @param {*} data 
         * {data: {user_id}}
         * @returns {message}
         */
        static async deleteEquipment(data){
            let res = await this.request(`equipments/:equipment_id`, data, 'delete');
            return res.equipment;
        }

        //Circuit Methods


        static async findAllCircuits(data){
            let res = await this.request(`circuits/`, data, 'get');
            return res.circuits;
        }

        static async findCircuit(data){
            let res = await this.request(`circuits/${data.circuit_id}`, data, 'get');
            return res.circuit;
        }

        static async addCircuit(data){
            let res = await this.request(`circuits/`, data, 'post');
            return res.circuit;
        }
        
        static async updateCircuit(circuitId,data){
            let res = await this.request(`circuits/${circuitId}`, data, 'patch');
            return res.updatedCircuit;
        }

        static async deleteCircuit(circuitId){
            let res = await this.request(`circuits/${circuitId}`, {} , 'delete');
            return res.message;
        }

        static async addExerciseCircuit(data){
            let res = await this.request(`circuits/${data.circuitId}/exercises/${data.exerciseId}`, data, 'post');
            return res.circuitExercise;
        }
        
        static async updateExerciseCircuit(data){
            let res = await this.request(`circuits/${data.circuitId}/exercises/${data.exerciseId}`, data, 'patch');
            return res.circuitExercise;
        }

        static async findAllMuscleGroups(data){
            let res = await this.request(`muscleGroups/`, data, 'get');
            return res.muscleGroups
        }
        
        static async findMuscleGroup(data){
            let res = await this.request(`muscleGroups/${data.muscleGroupId}`, data, 'get');
            return res.muscleGroup
        }
    }

    FitlyApi.token = ""

export default FitlyApi;