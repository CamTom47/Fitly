import axios from 'axios';

const WGER_BASE_URL = "https://wger.de/api/v2"

    class WgerApi {
        static async request( endpoint, data = {}, method = "get"){
            console.debug("WGER Call:", endpoint, data, method)

            const url = `${WGER_BASE_URL}/${endpoint}`

            const params = (method === "get")
            ? data
            : {};
            try{
                const res = (await axios({url, method, data, params}));
                return res
            } catch(err){
                console.error("wger API Error:", err.response)
                let message = err.response.data.error.message
                throw Array.isArray(message) ? message : [message];
            }
        }

        static async getAllExercises(endpoint = 'exercisebaseinfo/'){
            if(endpoint.includes(WGER_BASE_URL)){
                endpoint = endpoint.split(`${WGER_BASE_URL}/`)[1]
            };
            
            console.log(endpoint)
            let res = await this.request(`${endpoint}`)
            console.log(res)
            return res
        }

    }


    export default WgerApi