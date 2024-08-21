import { render } from '@testing-library/react';
import App from './App';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event'
import FitlyApi from '../../Api/FitlyApi';
import WgerApi from '../../Api/WgerApi';
 
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



describe('App Functionality', () => {
  
  let currentUser = FitlyApi.getUser();

  it('it renders without crashing', async () => {

    render(
      <MemoryRouter>
      <App />
    </MemoryRouter>
      );
    }); 
  });


it('matches snapshot', async () => {
  const {asFragment} = render(<MemoryRouter>
    <App/>
  </MemoryRouter>)
  expect(asFragment()).toMatchSnapshot();
})