import { render, waitFor} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event'
import FitlyApi from '../../Api/FitlyApi';
import WgerApi from '../../Api/WgerApi';
import UserProvider from '../../../testUtils';
import ExerciseDetails from './ExerciseDetails';
 
//Mock FitlyAPI
jest.mock('../../Api/FitlyApi', () => ({
    findMuscleGroup: jest.fn(() => (
        {
            id:1, name: "testMuscleGroup"
        }
    ))
}));

//Mock WgerApi
jest.mock('../../Api/WgerApi', () => {
});



describe('ExerciseDetails Functionality', () => {

    let muscleGroup;

    let demoExercise = {
        id: 1,
        name: "test exercise",
        muscle_group: 1

    }

    waitFor(async () => {
        muscleGroup = await FitlyApi.findMuscleGroup();
    })
    
    let children = (
        <ExerciseDetails muscleGroup={muscleGroup} exercise={demoExercise}/>
    );
    


  it('it renders without crashing', async () => {

    render(
        <UserProvider children={children}/>
      );
    }); 
    
    
    it('matches snapshot', async () => {
        const {asFragment} = render(
    <UserProvider children={children}/>
)
     expect(asFragment()).toMatchSnapshot();
    })
});