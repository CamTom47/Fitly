import React, {useCallback, useEffect} from 'react';
import LoginForm from '../Forms/LoginForm/LoginForm';
import { selectCurrentUser } from '../../slices/usersSlice';
import { findAllExercises } from "../../slices/exercisesSlice";
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import HomepageCard from '../HomepageCard/HomepageCard';
import './Homepage.css';
import { findAllEquipments } from "../../slices/equipmentsSlice";


const Homepage = (): React.JSX.Element => {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();    


  //Get Exercises at homepage if logged in. This prevents the app from crashing if the user were to go straight to a WorkoutDetail where exercise information is required.
  const getExercisesAndEquipments = useCallback( async () => {
        try{
          if (currentUser){
            dispatch(findAllExercises());
            dispatch(findAllEquipments());
          }
        }
        catch(err){
            return err
        }
	}, [currentUser])


    useEffect(() => { 
      getExercisesAndEquipments()
    }, [getExercisesAndEquipments])


  return !currentUser ? (
    <div className="HomepageContainer">
      <h1>All of your workouts, all in one place</h1>
      <p className="HomepageText">
        Create, customize, and record all of your personal workouts and exercise
      </p>
      <LoginForm />
    </div>
  ) : (
    <div className="HomepageContainer">
      <h1>All of your workouts, all in one place</h1>
      <p className="HomepageText">
        Create, customize, and record all of your personal workouts and exercise
      </p>
      <div id="cardContainer">
        <HomepageCard
          text="User Dashboard (Future Feature)"
          link="/dashboard"
        />
        <HomepageCard text="Workouts" link="/workouts" />
        <HomepageCard text="Exercises" link="/exercises" />
      </div>
    </div>
  );
};

export default Homepage;
