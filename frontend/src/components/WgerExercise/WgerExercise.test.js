import { render, waitFor} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event'
import FitlyApi from '../../Api/FitlyApi';
import WgerApi from '../../Api/WgerApi';
import UserProvider from '../../../testUtils';
import WgerExercise from './WgerExercise';
 
//Mock FitlyAPI
jest.mock('../../Api/FitlyApi', () => ({
    findAllMuscleGroups: jest.fn(() => (
        [
            {id: 1, name: "muscleGroup 1"},
            {id: 2, name: "muscleGroup 2"}
        ]
    ))
}));

//Mock WgerApi
jest.mock('../../Api/WgerApi', () => {
});



describe('WgerExercise Functionality', () => {

    let muscleGroups;

    waitFor(async () => {
        muscleGroups = FitlyApi.findAllMuscleGroups();
    })

    let exercise = {
        exercises: [{
            id:1, name: "test exercise", language:1
        },
        {
            id:2, name: "test exercise 2", language:2
        }], 
        category: {
            name: "test category name"
        },
        equipment: ["test equipment"],
        images: []
    }
    
    let children = (
        <WgerExercise exercise={exercise} englishName={'test workout'} muscleGroups={muscleGroups}/>
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