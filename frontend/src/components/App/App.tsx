import React, {useState, useEffect, useCallback} from "react";
import { Routes, Route, useNavigate } from "react-router"
import FitlyApi from "../../Api/FitlyApi";

import NavBar from "../NavBar/NavBar";
import WorkoutList from "../WorkoutList/WorkoutList"
import ExerciseList from "../ExerciseList/ExerciseList"
import Homepage from "../Homepage/Homepage";
import SignupForm from "../Forms/SignupForm/SignupForm";
import NewExerciseForm from "../Forms/NewExerciseForm/NewExerciseForm";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import Account from "../Account/Account";
import NewWorkoutForm from "../Forms/NewWorkoutForm/NewWorkoutForm";
import WorkoutDetail from "../WorkoutDetail/WorkoutDetail";
import NotFound from "../NotFound/NotFound";
import "./App.css"
import { 
  selectToken,
  selectAuthenticated,
  selectCurrentUser
} from '../../slices/usersSlice';

import { useAppSelector } from '../../hooks/reduxHooks'

function App(): React.JSX.Element {  
  const [isLoading, setIsLoading] = useState(false);
  const token = useAppSelector(selectToken);
  if(token) FitlyApi.token = token
  const isAuthenticated = useAppSelector(selectAuthenticated);
    
  if(isLoading){
    return <LoadingComponent/>
  } else { 
  
  if(!(token && isAuthenticated)){
    return (
      <div className="">
          <NavBar></NavBar>
          <Routes>
            <Route path="/register" element={<SignupForm/>}/>
            <Route path="/" element={<Homepage/>}/>
            <Route path="*" element={<Homepage/>}/>
          </Routes>
      </div>
    )
  } else{

    return (
      <div className="App">
        <NavBar></NavBar>
        <Routes>
          <Route path="/workouts" element={<WorkoutList/>}/>
          <Route path="/workouts/:workout_id" element={<WorkoutDetail/>}/>
          <Route path="/workouts/add" element={<NewWorkoutForm/>}/>
          <Route path="/register" element={<SignupForm/>}/>
          <Route path="/exercises" element={<ExerciseList/>}/>
          <Route path="/exercises/add" element={<NewExerciseForm/>}/>
          <Route path="/account" element={<Account/>}/>
          <Route path="/" element={<Homepage/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
    </div>
  );
}
}
}

export default App;