
import React from 'react';
import { useNavigate } from 'react-router';

const Unauthorized = () => {

  let navigate = useNavigate();

  setTimeout(() => { 
    navigate('/')
  }, 2000)
  return (
    <div className='d-flex flex-column align-items-center'>
      <h1 className='pb-3'>Unauthorized</h1>
      <p>Please login or sign up.</p>
    </div>
  );
};

export default Unauthorized;