/**
 * Helper function that mutates req.body object from front end and maps SQL columns to present objects
 * 
    input 
    {
        id: 1
        sets: 1
        reps: 1
        weight: 1
        restPeriod: 1
        intensity: 1
        workoutId: 1
        exerciseId: 1
      }

      returns 
    {
        id: 1
        sets: 1
        reps: 1
        weight: 1
        rest_period: 1
        intensity: 1
        workout_id: 1
        exercise_id: 1
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
    let circuitKeyValues = Object.entries(circuitMap)
    let newObj = {}

    for(let [k,v] of circuitKeyValues){
        if (data[k]) newObj[v] = data[k]
    }
    return newObj
}

module.exports = {circuitMapper}