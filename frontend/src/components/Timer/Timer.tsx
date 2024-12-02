import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import $ from 'jquery';
import "./Timer.css";
import useToggle from "../../hooks/useToggle/useToggle";

interface TimerProps {
	restPeriod: number;
	workoutCompleted: boolean;
}

const Timer = ({ restPeriod, workoutCompleted }: TimerProps): React.JSX.Element => {
	const [mainTimer, setMainTime] = useState<number>(0);
	const [mainTimerId, setMainTimerId] = useState<any>(0);
	const [paused, togglePaused] = useToggle();
	const [resting, setResting] = useState(false);
	const [restTime, setRestTime] = useState<number>(restPeriod);
	const [RestTimerId, setRestTimerId] = useState<any>(0);

	const getRestTime = useCallback( () => { 
		setRestTime(restPeriod)
	}, [restPeriod])

	$('#NextSetButton').on('click', () => {
		(resting) ? setResting(resting => false) : setResting(resting => true)
		handleRestTimer()
	}) 

	// Logic for Rest Timer
	const startRestTimer = () => {
		let intervalId;
		intervalId = setInterval(() => {
			setRestTime((restTime) => restTime - 1);
		}, 1000);
		setRestTimerId(intervalId);
	};

	const resetRestTimer = () => {
		setRestTime(restPeriod);
	};

	const handleRestTimer = () => {
		if (resting === false) {
			
		} else {
			resetRestTimer();
		}
	};

	useEffect(() => {
		getRestTime()
		let intervalId;
		if (resting === true) {
			intervalId = setInterval(() => {
				setRestTime((restTime) => restTime - 1);
			}, 1000);

			setRestTimerId(intervalId);
		}
		return () => clearInterval(intervalId);
	}, [resting]);

	//Logic for main timer //
	
	const startMainTimer = () => {
		let intervalId;
		intervalId = setInterval(() => {
			setMainTime((mainTimer) => mainTimer + 1);
		}, 1000);
		setMainTimerId(intervalId);
		togglePaused();
	};
	
	const resetMainTimer = () => {
		setMainTime(0);
	};
	
	const pauseTimer = () => {
		clearInterval(mainTimerId);
		togglePaused();
	};

	useEffect(() => {
		let intervalId;
		if (mainTimer === 0) {
			intervalId = setInterval(() => {
				setMainTime((mainTimer) => mainTimer + 1);
			}, 1000);

			setMainTimerId(intervalId);
		}

		return () => clearInterval(intervalId);
	}, []);

	//logic for paused timer

	const seconds = String(Math.floor(mainTimer % 60)).padStart(2, "0");
	const minutes = String(Math.floor((mainTimer / 60) % 60)).padStart(2, "0");
	const hours = String(Math.floor(mainTimer / 3600)).padStart(2, "0");

	return (
		!workoutCompleted ? 
		<div className='TimerContainer'>
			<div className='counterCircle'>
				<div className='overallTimer'>
					<div className='time'>
						<p>
							{hours}:{minutes}:{seconds}
						</p>
						{resting === true && <p id='restTimer'>{restTime}</p>}
					</div>
				</div>
				{paused ? (
					<div>
						<div className='buttonContainerRight'>
							<FontAwesomeIcon className='iconButton' type='button' onClick={startMainTimer} icon={faPlay} size='xl' />
						</div>
						<div className='buttonContainerLeft'>
							<FontAwesomeIcon
								className='iconButton'
								type='button'
								onClick={resetMainTimer}
								icon={faArrowRotateLeft}
								size='xl'
							/>
						</div>
					</div>
				) : (
					<div className='buttonContainerRight'>
						<FontAwesomeIcon className='iconButton' type='button' onClick={pauseTimer} icon={faPause} size='xl' />
					</div>
				)}
			</div>
		</div>
	: 

	<div className='TimerContainer'>
			<div className='counterCircle'>
				<div className='overallTimer'>
					<div className='time'>
						<p>
							{hours}:{minutes}:{seconds}
						</p>
					</div>
				</div>

			</div>
		</div>

	);
};

export default Timer;
