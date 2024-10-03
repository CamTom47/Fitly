
import React, { useEffect } from 'react';

const Unauthorized = (): React.JSX.Element => {

  return (
    <div className='d-flex flex-column align-items-center'>
      <h1 className='pb-3'>Unauthorized</h1>
      <p>Please login or sign up.</p>
    </div>
  );
};

export default Unauthorized;