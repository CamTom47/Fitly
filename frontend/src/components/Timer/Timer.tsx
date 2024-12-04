//Hook Imports
import React, { useCallback, useEffect, useState, useRef, MutableRefObject} from "react";
import useToggle from "../../hooks/useToggle/useToggle";

//Functional Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";

//Component Imports
import { faPlay, faPause, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

//Styling Imports
import "./Timer.css";

interface TimerProps {
	restPeriod: number;
	workoutCompleted: boolean;
}

const Timer = ({ restPeriod, workoutCompleted }: TimerProps): React.JSX.Element => {
	const [mainTime, setMainTime] = useState<number>(0);
	const [restTime, setRestTime] = useState<number>(restPeriod);
	const [mainTimerId, setMainTimerId] = useState<any>(0);
	const [paused, togglePaused] = useToggle();
	const [resting, setResting] = useState(false);
	const [restTimerId, setRestTimerId] = useState<any>(0);

	const seconds = String(Math.floor(mainTime % 60)).padStart(2, "0");
	const minutes = String(Math.floor((mainTime / 60) % 60)).padStart(2, "0");
	const hours = String(Math.floor(mainTime / 3600)).padStart(2, "0");

	// Logic for Rest Timer
	const getRestTime = useCallback(() => {
		setRestTime(restPeriod);
	}, [restPeriod]);

	const $nextSetButton = $("#NextSetButton");

	//On #NextSetButton click toggle resting state to trigger resting dependency and start rest timer
	$nextSetButton.on("click", () => {
		if (resting) {
			setResting((resting) => false);
			setRestTime(restPeriod);			
		} else setResting((resting) => true);
	});

	useEffect(() => {
		getRestTime();
		let intervalId;
		if (resting && !paused) {
			clearInterval(restTimerId)
			intervalId = setInterval(() => {
				setRestTime((restTime) => restTime - 1);
			}, 1000);

			setRestTimerId(intervalId);
		}
		return () => clearInterval(intervalId);
	}, [resting]);

	//Logic for main timer //
	
	//Start/Unpause both timers
	const startTimers = () => {
		$nextSetButton.removeClass('disabled')
		
		let mainIntervalId =setInterval(() => {
			setMainTime((mainTime) => mainTime + 1);
		}, 1000);
		setMainTimerId(mainIntervalId);

		let restIntervalId = setInterval(() => {
			setRestTime((restTime) => restTime - 1);
		}, 1000);
		setRestTimerId(restIntervalId);
		
		togglePaused();
	};

	const pauseTimer = () => {
		togglePaused();
		clearInterval(mainTimerId);
		clearInterval(restTimerId);
		$nextSetButton.addClass('disabled')
	};

	useEffect(() => {
		let intervalId;
		if (mainTime === 0) {
			intervalId = setInterval(() => {
				setMainTime((mainTime) => mainTime + 1);
			}, 1000);
			setMainTimerId(intervalId);
		}
		return () => clearInterval(intervalId);
	}, []);

	return !workoutCompleted ? (
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
							<div className='iconButtonOuterRing' onClick={startTimers}>
								<FontAwesomeIcon className='playButton' type='button' icon={faPlay} size='xl' />
							</div>
						</div>
					</div>
				) : (
					<div className='buttonContainerRight'>
						<div className='iconButtonOuterRing' onClick={pauseTimer}>
							<FontAwesomeIcon className='pauseButton' type='button' icon={faPause} size='xl' />
						</div>
					</div>
				)}
			</div>
		</div>
	) : (
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
