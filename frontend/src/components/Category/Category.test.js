import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event'
import FitlyApi from '../../Api/FitlyApi';
import WgerApi from '../../Api/WgerApi';
import UserProvider from '../../../testUtils';
import Category from './Category';
 
//Mock FitlyAPI
jest.mock('../../Api/FitlyApi', () => ({
  getUser: jest.fn(() => (
    {
      id:1, username:"test", password:"testpassword" 
    }
  ))
}));

//Mock WgerApi
jest.mock('../../Api/WgerApi', () => {
});

describe('Category Functionality', () => {

    let children = (
        <Category/>
    )

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