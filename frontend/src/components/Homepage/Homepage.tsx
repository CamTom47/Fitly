import React from 'react';
import LoginForm from '../Forms/LoginForm/LoginForm';
import { selectCurrentUser } from '../../slices/usersSlice';
import { useAppSelector } from '../../hooks/reduxHooks';
import HomepageCard from '../HomepageCard/HomepageCard';
import './Homepage.css';

const Homepage = (): React.JSX.Element => {
  const currentUser = useAppSelector(selectCurrentUser);

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
