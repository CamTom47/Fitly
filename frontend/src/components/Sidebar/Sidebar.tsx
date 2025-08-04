import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { persistor } from "../../store";
import "./Sidebar.css";
import "./navIcon.css";

const Sidebar = (): React.JSX.Element => {
	const dispatch = useAppDispatch();

	const handleLogOut = () => {
		localStorage.clear();
		dispatch("RESET_APP");
		persistor.purge();
	};

	const handleToggle = () => {
		const NavBarBody = document.querySelector(".SidebarBody");
		const NavIcon = document.querySelector("#NavIcon");
		NavIcon?.classList.toggle("open");
		NavBarBody?.classList.toggle("offScreen");
		NavBarBody?.classList.toggle("visible");
	};

	return (
		<div id='Sidebar'>
			<div id='NavIcon' onClick={handleToggle}>
				<span className='toggleContent' />
				<span className='toggleContent' />
				<span className='toggleContent' />
			</div>
			<div className='SidebarBody offScreen'>
				<Link className='NavBarLink' to='/dashboard' onClick={handleToggle}>
					Dashboard
				</Link>
				<Link className='NavBarLink' to='/calendar' onClick={handleToggle}>
					Calendar
				</Link>

				<Link className='NavBarLink' to='/workouts' onClick={handleToggle}>
					Workouts
				</Link>

				<Link className='NavBarLink' to='/exercises' onClick={handleToggle}>
					Exercises
				</Link>
				<Link className='NavBarLink' to='/settings' onClick={handleToggle}>
					Settings
				</Link>
				<Link className='NavBarLink' to='/account' onClick={handleToggle}>
					Account
				</Link>

				<Link className='NavBarLink' onClick={handleLogOut} to='/'>
					Sign Out
				</Link>
			</div>
		</div>
	);
};

export default Sidebar;
