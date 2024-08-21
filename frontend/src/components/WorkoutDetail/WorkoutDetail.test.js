import { render, waitFor} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event'
import FitlyApi from '../../Api/FitlyApi';
import WgerApi from '../../Api/WgerApi';
import UserProvider from '../../../testUtils';
import WorkoutDetail from './WorkoutDetail';
 
//Mock FitlyAPI
jest.mock('../../Api/FitlyApi', () => ({
    findWorkout: jest.fn(() => (
            {
             id: 1,
            user_id: 1,
            name: "test workout",
            category: 1,
            favorited: false
        }
        ))
}));

//Mock WgerApi
jest.mock('../../Api/WgerApi', () => {
});



describe('WorkoutDetail Functionality', () => {

    let workout;

    waitFor(async ()=> {
        workout = await FitlyApi.findWorkout();
    })

    let children = (
        <WorkoutDetail workout={workout}/>
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