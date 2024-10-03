import axios, {Axios, AxiosHeaders, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders, RawAxiosRequestHeaders} from 'axios';

const BASE_URL : string = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** Fitly API Class
 * 
 * Static class typing together methods used to get/send to the Fitly API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't be any API-aware stuff elsehwere in the frontend
 */

class FitlyApi {
    //the token for interaction with API will be stored here.
    static token: string;

    static async request( endpoint: string, data: object = {}, method: string = "get"){
        console.debug("API Call:", endpoint, data, method)

        const url: string =  `${BASE_URL}/${endpoint}`
        const params: {} = (method === "get")
        ? data
        : {}
        const headers : {} | undefined = (FitlyApi.token !== "") ? { Authorization: `Bearer ${FitlyApi.token}` } : undefined;

            try{
                const response = (await axios({ url, params, method, data, headers})).data

                return response
            } catch(err) {
                console.error("API Error:", err.response);
                let message: string = err.response.data.error.message;
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

            static async findUser<Promise>(username: string) : Promise {
                console.log(username)
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

        static async login<Promise>(data: {}) : Promise{   
            console.log(data)
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

        static async signup<Promise>(data: {}) : Promise{
            let res = await this.request(`auth/register`, data, 'post')
            return res.token;
        }

        static async updateUser<Promise>(username: string, data : {}) : Promise{
            let res = await this.request(`users/${username}`, data, 'patch');
            return res.user;
        }

        //Workout Methods
        
        /**
         * Find all workouts in the database that a user has created
         * 
         * 
         */

        static async findAllWorkouts<Promise>(data? : {}) : Promise{
            let res = await this.request(`workouts/`, data, 'get');
            return res.workouts;

        }
        
        
        /**
         * 
         * @param {*} data 
         * {data : {user_id}}
         * 
         * @returns {workout}
         */

        static async findWorkout<Promise>(data: {workoutId: number}) : Promise{
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

        static async createWorkout<Promise>(data : {}) : Promise{
            console.log(data)
            let res = await this.request(`workouts/`, data, 'post');
            return res.newWorkout;
        }

        /**
         * 
         * @param {*} data 
         * {data: {user_id}}
         * @returns {workout}
         */

        static async updateWorkout<Promise>(workoutId: number ,data : {}) : Promise{
            let res = await this.request(`workouts/${workoutId}`, data, 'patch');
            return res.updatedWorkout;
        }
        
        /**
         * 
         * @param {*} data 
         * {data: {user_id}}
         * @returns {message}
         */

        static async deleteWorkout<Promise>(workoutId: number) : Promise{
            let res = await this.request(`workouts/${workoutId}`, {}, 'delete');
            return res.workout;
        }

        static async addWorkoutCircuit<Promise>(data : {workoutId: number | undefined, circuitId: number | undefined}) : Promise{
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

        static async findAllExercises<Promise>(data?: {}) : Promise{
            let res = await this.request(`exercises/`, data, 'get');
            return res.exercises
        }
        

        /**
         * Find a specfic exercise created by a user
         * @param {*} data 
         * {data {user_id}}
         * @returns {exercise}
         */

        static async findExercise<Promise>(data : {exerciseId : number}): Promise{
            let res = await this.request(`exercises/${data.exerciseId}`, data, 'get');
            return res.exercise
        }
        
        /**
         * Creates a new exercise
         * @param {*} data 
         * {data: {user_id}}
         * @returns {exercise}
         */

        static async createExercise<Promise>(data: {}): Promise{
            let exercise = await this.request(`exercises/`, data, 'post');
            return exercise
        }
        
        /**
         * Update an existing exercise
         * @param {*} data 
         * {data: {exercise}}
         * @returns {exercise}
         */
        static async updateExercise<Promise>(exerciseId : number, data: {}): Promise{
            let res = await this.request(`exercises/${exerciseId}`, data, 'patch');
            return res.updatedExercise
        }
        
        /**
         * Delete an existing exercise 
         * @param {*} data 
         * {data: {user_id}}
         * @returns {message}
         */

        static async deleteExercise<Promise>(data : {exerciseId: number}): Promise{
            let res = await this.request(`exercises/${data.exerciseId}`, data, 'delete');
            return res.message
        }

        //Category Methods

        /**
         * Get all default categories and categories created by the user
         * @param {*} data 
         * {data: {user_id}}
         * @returns {categories}
         */

        static async findAllCategories<Promise>(data? : {}) : Promise{
            let res = await this.request(`categories/`, data, 'get');
            return res.categories
        }

        /**
         * Get a category by category_id
         * @param {*} data 
         * {data: {user_id}}
         * @returns {category}
         */
        static async findCategory<Promise>(data : {categoryId : string}) : Promise{
            let res = await this.request(`categories/${data.categoryId}`, data, 'get');
            return res.category;
        }

        /**
         * Create a new category
         * @param {*} data 
         * {data: {user_id}}
         * @returns {category}
         */

        static async createCategory<Promise>(data : {}) : Promise{
            let res = await this.request(`categories/`, data, 'post');
            return res.category;
        }

        /**
         * Update an existing workout category
         * @param {*} data 
         * {data: {user_id}}
         * @returns {category}
         */

        static async updateCategory<Promise>(data : {categoryId : number,
                                                    name: string,
                                                    description: string
        }) : Promise{
            let res = await this.request(`categories/${data.categoryId}`, data, 'patch');
            return res.category;
        }

        /**
         * Delete an existing workout category
         * @param {*} data 
         * {data: {user_id}}
         * @returns {message}
         */
        static async deleteCategory<Promise>(data : {categoryId : number}) : Promise{
            let res = await this.request(`categories/${data.categoryId}`, data, 'delete');
            return res.category;
        }

        //Equipment Methods

        /**
         * Get all default equipments and equipment created by the user
         * @param {*} data 
         * {data: {user_id}}
         * @returns {equipments}
         */

        static async findAllEquipments<Promise>(data? : {}) : Promise{
            let res = await this.request(`equipments/`, data, 'get');
            return res.equipments
        }

        /**
         * Get a category by category_id
         * @param {*} data 
         * {data: {user_id}}
         * @returns {equipment}
         */
        static async findEquipment<Promise>(data : {equipmentId : number}) : Promise{
            let res = await this.request(`equipments/${data.equipmentId}`, data, 'get');
            return res.equipment;
        }

        /**
         * Create a new equipment
         * @param {*} data 
         * {data: {user_id}}
         * @returns {equipment}
         */

        static async createEquipment<Promise>(data : {}) : Promise{
            let res = await this.request(`equipments/`, data, 'post');
            return res.equipment;
        }

        /**
         * Update an existing workout equipment
         * @param {*} data 
         * {data: {user_id}}
         * @returns {equipment}
         */

        static async updatEquipment<Promise>(data : {equipmentId}) : Promise{
            let res = await this.request(`equipments/${data.equipmentId}`, data, 'patch');
            return res.equipment;
        }

        /**
         * Delete an existing workout equipment
         * @param {*} data 
         * {data: {user_id}}
         * @returns {message}
         */
        static async deleteEquipment<Promise>(data : {equipmentId : number}) : Promise{
            let res = await this.request(`equipments/${data.equipmentId}`, data, 'delete');
            return res.equipment;
        }

        //Circuit Methods


        static async findAllCircuits<Promise>(data? : {}) : Promise{
            let res = await this.request(`circuits/`, data, 'get');
            return res.circuits;
        }

        static async findCircuit<Promise>(data : {circuitId}) : Promise{
            let res = await this.request(`circuits/${data.circuitId}`, data, 'get');
            return res.circuit;
        }

        static async addCircuit<Promise>(data : {}) : Promise{
            let res = await this.request(`circuits/`, data, 'post');
            return res.circuit;
        }
        
        static async updateCircuit<Promise>(circuitId : number, data : {}) : Promise{
            let res = await this.request(`circuits/${circuitId}`, data, 'patch');
            return res.updatedCircuit;
        }

        static async deleteCircuit<Promise>(circuitId : number) : Promise{
            let res = await this.request(`circuits/${circuitId}`, {} , 'delete');
            return res.message;
        }

        static async addExerciseCircuit<Promise>(data : {circuitId : number | undefined, exerciseId : number | undefined}) : Promise{
            let res = await this.request(`circuits/${data.circuitId}/exercises/${data.exerciseId}`, data, 'post');
            return res.circuitExercise;
        }
        
        static async updateExerciseCircuit<Promise>(data : {circuitId: number | undefined, exerciseId: number | undefined}) : Promise{
            let res = await this.request(`circuits/${data.circuitId}/exercises/${data.exerciseId}`, data, 'patch');
            return res.circuitExercise;
        }

        static async findAllMuscleGroups<Promise>(data? : {}) : Promise{
            let res = await this.request(`muscleGroups/`, data, 'get');
            return res.muscleGroups
        }
        
        static async findMuscleGroup<Promise>(data : {muscleGroupId : number}) : Promise{
            let res = await this.request(`muscleGroups/${data.muscleGroupId}`, data, 'get');
            return res.muscleGroup
        }
    }

    FitlyApi.token = ""

export default FitlyApi;