import React, { useEffect } from 'react';

const Custom404 = () => {
  useEffect(() => {
    console.log('LOC', window.location.href);
  }, []);
  return <div>404 - Not Found</div>;
};

export default Custom404;
