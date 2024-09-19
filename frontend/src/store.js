import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import workoutsReducer from './slices/workoutsSlice';
import circuitsReducer from './slices/circuitsSlice';
import exercisesReducer from './slices/exercisesSlice';
import equipmentReducer from './slices/equipmentsSlice'
import categoriesReducer from './slices/categoriesSlice';
import usersReducer from './slices/usersSlice';
import muscleGroupReducer from './slices/muscleGroupsSlice';


const persistConfig = {
    key: 'root',
    storage
};

export const rootReducer = combineReducers({
        workouts: workoutsReducer,
        circuits: circuitsReducer,
        exercises: exercisesReducer,
        equipments: equipmentReducer,
        categories: categoriesReducer,
        users: usersReducer,
        muscleGroups: muscleGroupReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer
})


export const persistor = persistStore(store);



// export const store = configureStore({
//     reducer: {
//         workouts: workoutsReducer,
//         circuits: circuitsReducer,
//         exercises: exercisesReducer,
//         equipments: equipmentReducer,
//         categories: categoriesReducer,
//         users: usersReducer,
//         muscleGroups: muscleGroupReducer

//     }
// })