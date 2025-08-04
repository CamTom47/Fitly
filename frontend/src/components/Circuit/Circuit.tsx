import React from 'react';
import UpdateCircuitForm from '../Forms/UpdateCircuitForm/UpdateCircuitForm';
import useToggle from '../../hooks/useToggle/useToggle';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { selectCircuits, deleteCircuit } from '../../slices/circuitsSlice';
import { selectExercises } from '../../slices/exercisesSlice';
import './Circuit.css';

interface Circuit {
  id: number;
  sets: number;
  reps: number;
  weight: number;
  rest_period: number;
  intensity: string;
  exerciseId?: number;
  workoutId?: number;
}

interface Exercise {
  id: number;
  name: string;
  muscle_group: number;
  equipment_id: number;
}

const Circuit = ({ circuitId }): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const circuits = useAppSelector(selectCircuits);
  const circuit = circuits.find((circuit: Circuit) => circuit.id === circuitId);
  const exercises = useAppSelector(selectExercises);
  const exercise = exercises.find(
    (exercise: Exercise) => exercise.id === circuit.exerciseId
  );
  const [showUpdateCircuitForm, setShowUpdateCircuitForm] = useToggle();

  const handleDelete = () => {
    dispatch(deleteCircuit(circuitId));
  };

  const toggleShowUpdateCircuitForm = () => {
    setShowUpdateCircuitForm();
  };

  return showUpdateCircuitForm ? (
    <UpdateCircuitForm
      key={uuid()}
      circuit={circuit}
      toggle={toggleShowUpdateCircuitForm}
    />
  ) : (
    <div className="CircuitContainer">
      <div className="InformationSection">
        <div className="InformationDiv">
          <span>Sets:</span>
          <p>{circuit.sets}</p>
        </div>
        <div className="InformationDiv">
          <span>Reps: </span>
          <p>{circuit.reps}</p>
        </div>
      </div>
      <div className="InformationSection">
        <div className="InformationDiv">
          <span>Weight (lbs): </span>
          <p>{circuit.weight}</p>
        </div>
        <div className="InformationDiv">
          <span>Rest (Seconds): </span>
          <p>{circuit.restPeriod}</p>
        </div>
      </div>
      <div className="InformationSection">
        <div className="InformationDiv">
          <span>Intensity: </span>
          <p>{circuit.intensity}</p>
        </div>
        <div className="InformationDiv">
          <span>Exercise:</span>
          <p>{exercise.name}</p>
        </div>
      </div>

      <div className="buttonDiv">
        <button className="FormButton" onClick={handleDelete}>
          Delete Circuit
        </button>
        <button className="FormButton" onClick={toggleShowUpdateCircuitForm}>
          Update Circuit
        </button>
      </div>
    </div>
  );
};

export default Circuit;
