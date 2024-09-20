import React, {useState, useEffect, useCallback} from "react";
import { Routes, Route, useNavigate } from "react-router"

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
import Unauthorized from "../Unauthorized/Unauthorized";
import NotFound from "../NotFound/NotFound";
import "./App.css"
import { 
  selectToken,
  userCheckLoggedIn,
  selectAuthenticated,
  selectCurrentUser
} from '../../slices/usersSlice';
import { useDispatch, useSelector } from "react-redux";




function App() {
  
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectAuthenticated);

  const dispatch = useDispatch();
  
  const checkLoggedIn = useCallback(() => {
    setIsLoading(true)
    dispatch(userCheckLoggedIn());
    setIsLoading(false)
  } , [isAuthenticated]);

  useEffect(() => { 
    checkLoggedIn()
  } , [checkLoggedIn])
  
    console.debug(
      "App",
      "currentUser", currentUser,
      "token=", token
    )

  //Find current user using local storage "token"

  if(isLoading){
    return <LoadingComponent/>
  } else {

  
  
  if(!(token && isAuthenticated)){
    return (
      <div className="">
          <NavBar></NavBar>
          <Routes>
            <Route exact path="/register" element={<SignupForm/>}/>
            <Route exact path="/" element={<Homepage/>}/>
            <Route path="*" element={<Homepage/>}/>
          </Routes>
      </div>
    )
  } else{

    return (
      <div className="App">
        <NavBar></NavBar>
        <Routes>
          <Route exact path="/workouts" element={<WorkoutList/>}/>
          <Route exact path="/workouts/:workout_id" element={<WorkoutDetail/>}/>
          <Route exact path="/workouts/add" element={<NewWorkoutForm/>}/>
          <Route exact path="/register" element={<SignupForm/>}/>
          <Route exact path="/exercises" element={<ExerciseList/>}/>
          <Route exact path="/exercises/add" element={<NewExerciseForm/>}/>
          <Route exact path="/account" element={<Account/>}/>
          <Route exact path="/" element={<Homepage/>}/>
          <Route exact path="*" element={<NotFound/>}/>
        </Routes>
    </div>
  );
}
}
}

export default App;