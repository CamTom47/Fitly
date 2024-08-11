import React, {useState, useEffect} from "react";
import { Routes, Route, useNavigate } from "react-router"

import NavBar from "../NavBar/NavBar";
import WorkoutList from "../WorkoutList/WorkoutList"
import ExerciseList from "../ExerciseList/ExerciseList"
import Homepage from "../Homepage/Homepage";
import SignupForm from "../Forms/SignupForm/SignupForm";
import NewExerciseForm from "../Forms/NewExerciseForm/NewExerciseForm";

import UserContext from "../../context/UserContext";
import FitlyApi from "../../Api/FitlyApi"
import { decodeToken } from 'react-jwt'
import Account from "../Account/Account";
import NewWorkoutForm from "../Forms/NewWorkoutForm/NewWorkoutForm";
import WorkoutDetail from "../WorkoutDetail/WorkoutDetail";



function App() {
  
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken ] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  
    console.debug(
      "App",
      "currentUser", currentUser,
      "token=", token
    )

    const navigate = useNavigate();

  //Find current user using local storage "token"
  useEffect( () => {
    const getCurrentUser = async () => {
      if(token){
        try{
          let {username} = decodeToken(token);
          FitlyApi.token = token;
          let currentUser = await FitlyApi.findUser(username);
          setCurrentUser(currentUser)
        } catch(err){
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
    }
  }
  getCurrentUser()
  setIsLoading(false);
    
  }, [token])


  const login = async (formData) => {
    let token = await FitlyApi.login(formData)
    setToken(token)
    FitlyApi.token = token
    localStorage.setItem('token', token);
    return {success: true}
  }
  
  const signup = async (formData) => {
    let token = await FitlyApi.signup(formData) ;
    localStorage.setItem('token', token);
    setToken(token);
    FitlyApi.token = token;
    return {success: true};
  }

  const signout = () => {
    localStorage.removeItem('token');
    setToken("");
    setCurrentUser(null);
    FitlyApi.token = "";
    return {message: "signed out"}
  }

  const updateUser = async (formData) => {
    if(formData.password){
      let updatedUser = await FitlyApi.updateUser(currentUser.username, formData);
      setCurrentUser(updatedUser);
    } else {
      let updatedUser = await FitlyApi.updateUser(currentUser.username, formData);
      setCurrentUser(updatedUser);
    }
  }
  
  return (isLoading 
  ? 
  <p>Page is loading...</p>
  : (
    <div className="App">
      <UserContext.Provider value={{currentUser, login, signout, updateUser}}>
        <NavBar></NavBar>
        <Routes>
          <Route exact path="/" element={<Homepage/>}/>
          <Route exact path="/workouts" element={<WorkoutList/>}/>
          <Route exact path="/workouts/:workout_id" element={<WorkoutDetail/>}/>
          <Route exact path="/workouts/add" element={<NewWorkoutForm/>}/>
          <Route exact path="/register" element={<SignupForm signup={signup}/>}/>
          <Route exact path="/exercises" element={<ExerciseList/>}/>
          <Route exact path="/exercises/add" element={<NewExerciseForm/>}/>
          <Route exact path="/account" element={<Account/>}/>
        </Routes>
      </UserContext.Provider>
    </div>
  ));
}

export default App;
