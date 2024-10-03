/**
 * Helper function that mutates req.body object from front end and maps SQL columns to present objects
 * 
    input 
    {
     id: 1,
     userId: 2
      }

      returns 
    {
    id: 1,
    user_id: 2
    }
 */

const categoryMap = {
    id: "id",
    userId: "user_id",
    name: "name"
}
    const categoryMapper = (data) => {
        let categoryKeyValues = Object.entries(categoryMap)
        let newObj = {}
    
        for(let [k,v] of categoryKeyValues){
            if (data[k]) newObj[v] = data[k]
        }
        return newObj
    }
    
export default categoryMapper

