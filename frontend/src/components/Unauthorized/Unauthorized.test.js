import { render, waitFor} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event'
import FitlyApi from '../../Api/FitlyApi';
import WgerApi from '../../Api/WgerApi';
import UserProvider from '../../../testUtils';
import Unauthorized from './Unauthorized';
 
//Mock FitlyAPI
jest.mock('../../Api/FitlyApi', () => ({
    findAllExercises: jest.fn(() => {

    })
}));

//Mock WgerApi
jest.mock('../../Api/WgerApi', () => {
});



describe('Unauthorized Functionality', () => {

    let children = (
        <Unauthorized/>
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