/**
 * Helper function that mutates req.body object from front end and maps SQL columns to present objects
 * 
    input 
    {
     id: 1,
     name: "test",
     muscleGroup: "arms",
     equipmentId: 3
      }

      returns 
    {
    id: 1,
    name: "test",
    muscle_group: "arms",
    equipment_id: 3
    }

 */

const exerciseMap = {
    id: "id",
    name: "name",
    muscleGroup: "muscle_group",
    equipmentId: "equipment_id"
}

const exerciseMapper = (data) => {
    const exerciseKeyValues = Object.entries(exerciseMap)
    let newObj = {}

    for(let [k,v] of exerciseKeyValues){
        if (data[k]) newObj[v] = data[k]
    }
    return newObj
}

module.exports = {exerciseMapper}