import { render, waitFor} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event'
import FitlyApi from '../../Api/FitlyApi';
import WgerApi from '../../Api/WgerApi';
import UserProvider from '../../../testUtils';
import ExerciseList from './ExerciseList';
 
//Mock FitlyAPI
jest.mock('../../Api/FitlyApi', () => ({
    findAllExercises: jest.fn(() => (
        [{
            id:1, name: "test exercise"
        },
        {
            id:2, name: "test exercise 2"
        }
    ]
    ))
}));

//Mock WgerApi
jest.mock('../../Api/WgerApi', () => {
});



describe('ExerciseList Functionality', () => {

    let exercises;

    waitFor(async () => {
        exercises = await FitlyApi.findAllExercises();
    })
    
    let children = (
        <ExerciseList exercises={exercises}/>
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