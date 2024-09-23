import axios from 'axios';

const WGER_BASE_URL : string = "https://wger.de/api/v2"

    class WgerApi {
        static async request( endpoint, data = {}, method = "get"){
            console.debug("WGER Call:", endpoint, data, method)

            const url : string = `${WGER_BASE_URL}/${endpoint}`

            const params : {} = (method === "get")
            ? data
            : {};
            try{
                const res = (await axios({url, method, data, params}));
                return res
            } catch(err){
                console.error("wger API Error:", err.response)
                let message : string = err.response.data.error.message
                throw Array.isArray(message) ? message : [message];
            }
        }

        static async getAllExercises(endpoint = 'exercisebaseinfo/'){
            if(endpoint.includes(WGER_BASE_URL)){
                endpoint = endpoint.split(`${WGER_BASE_URL}/`)[1]
            };
            
            let res : {} = await this.request(`${endpoint}`)
            return res
        }

    }


    export default WgerApi