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

const categorymap = {
    id: "id",
    userId: "user_id"
}

const categoryMapper = (data) => {
    let categoryKeyValues = Object.entries(mapper)
    let newObj = {}

    for(let [k,v] of categoryKeyValues){
        if (data[k]) newObj[v] = data[k]
    }
    return newObj
}

Module.export = {categoryMapper}