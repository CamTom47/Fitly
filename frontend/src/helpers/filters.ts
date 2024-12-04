interface ExerciseQuery {
	equipmentId?: string;
	muscleGroup?: string;
}
interface WorkoutQuery {
	category?: number;
	favorited?: boolean;
}

const exerciseFilterMap = {
	equipmentFilter: "equipmentId",
	muscleGroupFilter: "muscleGroup",
};

const workoutFilterMap = {
	categoryFilter: "category",
	favoritedFilter: "favorited",
};

export const exerciseFilter = (currentQuery, e): {} => {
	const queryObj: ExerciseQuery = { ...currentQuery };
	if (e.target.checked) {
		if (e.target.name) queryObj[exerciseFilterMap[e.target.name]] = e.target.id;
	} else {
		if (e.target.name) queryObj[exerciseFilterMap[e.target.name]] = null;
	}
	return queryObj;
};

export const workoutFilter = (currentQuery, e): {} => {
	const queryObj: WorkoutQuery = { ...currentQuery };
	if (e.target.checked) {
		if (e.target.name) queryObj[workoutFilterMap[e.target.name]] = e.target.id;
	} else {

    let queryEntries = Object.entries(queryObj);
		let newQueryObj = {};
    console.log(e.target.name)

		for (let [k,v] of queryEntries) {
      if(k !== workoutFilterMap[e.target.name]){
        newQueryObj[k] = v
      }
		}
		return newQueryObj;
	}
	return queryObj;
};
