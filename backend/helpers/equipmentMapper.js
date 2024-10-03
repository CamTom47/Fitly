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

const equipmentMap = {
    id: "id",
    userId: "user_id",
    name: "name"
}

const equipmentMapper = (data) => {
    let equipmentKeyValues = Object.entries(equipmentMap)
    let newObj = {}

    for(let [k,v] of equipmentKeyValues){
        if (data[k]) newObj[v] = data[k]
    }
    return newObj
}

module.exports = {equipmentMapper}