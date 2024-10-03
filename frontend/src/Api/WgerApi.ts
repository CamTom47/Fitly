import axios, { AxiosResponse } from 'axios';

const WGER_BASE_URL : string = "https://wger.de/api/v2"

    class WgerApi {
        static async request( endpoint: string, data: object = {}, method: string = "get"){
            console.debug("WGER Call:", endpoint, data, method)

            const url: string = `${WGER_BASE_URL}/${endpoint}`

            const params: {} = (method === "get")
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

        static async getAllExercises<Promise>(endpoint : string = 'exercisebaseinfo/'): Promise {

            // The initial request will set the next and previous calls with a end point similar to 
            // "next": "https://wger.de/api/v2/exercisebaseinfo/?limit=20&offset=20",
            // Splitting on the WGER_BASE_URL allows for the new and point to be added to the default WGER_BASE_URL

            if(endpoint.includes(WGER_BASE_URL)){
                endpoint = endpoint.split(`${WGER_BASE_URL}/`)[1]
            };
            
            let res = await this.request(endpoint)

            return res.data
        }

    }


    export default WgerApi