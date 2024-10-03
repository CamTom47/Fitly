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

const circuitMap = {
    id: "id",
    sets: "sets",
    reps: "reps",
    weight: "weight",
    restPeriod: "rest_period",
    intensity: "intensity",
    workoutId: "workout_id",
    exerciseId: "exercise_id",
}

const circuitMapper = (data) => {
    let circuitKeyValues = Object.entries(mapper)
    let newObj = {}

    for(let [k,v] of circuitKeyValues){
        if (data[k]) newObj[v] = data[k]
    }
    return newObj
}

Module.export = {circuitMapper}