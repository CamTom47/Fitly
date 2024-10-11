import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { persistor } from '../../store';
import { selectCurrentUser, userLoggedOut } from '../../slices/usersSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import './navIcon.css';

const NavBar = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLogOut = () => {
    localStorage.clear();
    dispatch(userLoggedOut());
    persistor.purge();
  };

  const handleToggle = () => {
    const NavBarBody = document.querySelector('.NavBarBody');
    const NavIcon = document.querySelector('#NavIcon');
    NavIcon?.classList.toggle('open');
    NavBarBody?.classList.toggle('offScreen');
    NavBarBody?.classList.toggle('visible');
  };

  return currentUser !== null ? (
    <div className="NavBarContainer">
      <div className="NavBarHeader">
        <div id="NavIcon" onClick={handleToggle}>
          <span className="toggleContent" />
          <span className="toggleContent" />
          <span className="toggleContent" />
        </div>
        <div className="NavBarLinkContainer">
          <Link className="NavBarMainLink" to="/">
            <h4>Fitly</h4>
          </Link>
        </div>
      </div>
      <div className="NavBarBody offScreen">
        <Link className="NavBarLink" onClick={handleLogOut} to="/">
          Sign Out
        </Link>
        <Link className="NavBarLink" to="/account" onClick={handleToggle}>
          Account
        </Link>
        <Link className="NavBarLink" to="/exercises" onClick={handleToggle}>
          Exercises
        </Link>
        <Link className="NavBarLink" to="/workouts" onClick={handleToggle}>
          Workouts
        </Link>
      </div>
    </div>
  ) : (
    <div>
      <div className="NavBarContainer">
        <div className="NavBarHeader">
          <div id="NavIcon" onClick={handleToggle}>
            <span className="toggleContent" />
            <span className="toggleContent" />
            <span className="toggleContent" />
          </div>
          <div className="NavBarLinkContainer">
            <Link className="NavBarMainLink" to="/">
              <h4>Fitly</h4>
            </Link>
          </div>
        </div>
        <div className="NavBarBody offScreen">
          <Link className="NavBarLink" to="/" onClick={handleToggle}>
            Login
          </Link>
          <Link className="NavBarLink" to="/register" onClick={handleToggle}>
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
