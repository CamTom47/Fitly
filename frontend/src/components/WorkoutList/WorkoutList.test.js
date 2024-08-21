import { render, waitFor} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event'
import FitlyApi from '../../Api/FitlyApi';
import WgerApi from '../../Api/WgerApi';
import UserProvider from '../../../testUtils';
import WorkoutList from './WorkoutList';
 
//Mock FitlyAPI
jest.mock('../../Api/FitlyApi', () => ({
    findAllWorkouts: jest.fn(() => (
        [{
         id: 1,
        user_id: 1,
        name: "test workout",
        category: 1,
        favorited: false
    },{
        id: 2,
       user_id: 2,
       name: "test workout 2",
       category: 2,
       favorited: false
   }]
    ))
}));

//Mock WgerApi
jest.mock('../../Api/WgerApi', () => {
});



describe('WorkoutList Functionality', () => {

    let workouts;

    waitFor(async () => {
        workouts = await FitlyApi.findAllWorkouts();
    })
    let children = (
        <WorkoutList workouts={workouts}/>
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