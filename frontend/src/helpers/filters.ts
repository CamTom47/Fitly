interface ExerciseQuery {
    equipmentId?: string,
    muscleGroup?: string
  }
interface WorkoutQuery {
    category?: number,
    favorited?: boolean
  }

const exerciseFilterMap = {
  "equipmentFilter": "equipmentId",
  "muscleGroupFilter": "muscleGroup"
}

const workoutFilterMap = {
  "categoryFilter": "category",
  "favorited": "favorited"
}

export const exerciseFilter = (currentQuery, e): {} => {
    const queryObj: ExerciseQuery = {...currentQuery};
    if (e.target.checked) {
      if (e.target.name) queryObj[exerciseFilterMap[e.target.name]] = e.target.id;
    } else {
      if (e.target.name) queryObj[exerciseFilterMap[e.target.name]] = undefined;
    }
    return queryObj
  }

  export const workoutFilter = (currentQuery, e): {} => {
    const queryObj: WorkoutQuery = {...currentQuery};
    if (e.target.checked) {
      if (e.target.name) queryObj[workoutFilterMap[e.target.name]] = e.target.id;
    } else {
      if (e.target.name) queryObj[workoutFilterMap[e.target.name]] = undefined;
    }
    return queryObj
  }