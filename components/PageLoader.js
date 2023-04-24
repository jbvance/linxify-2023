import React from 'react';
import { Spinner } from 'react-bootstrap';

const PageLoader = () => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner
        animation="border"
        variant="success"
        style={{ margin: '0 auto' }}
      />
    </div>
  );
};

export default PageLoader;
